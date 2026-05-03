#!/usr/bin/env node
/**
 * upload-audio.js
 * ---------------
 * อ่านไฟล์เสียงจาก local folder → map เลขลำดับกับ wordId → upload Supabase bucket → อัปเดต DB
 *
 * วิธีใช้:
 *   1. ดาวน์โหลดไฟล์เสียงจาก Google Drive มาไว้ใน folder เดียว
 *   2. ตั้งค่า .env.local ให้มี EXPO_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY
 *   3. รัน: node scripts/upload-audio.js --dir ./audio-files
 *
 * ชื่อไฟล์ที่รองรับ: 001.m4a, 002.mp3, 003.m4a (รองรับทั้ง .m4a และ .mp3)
 *
 * หมายเหตุ: ต้องใช้ SERVICE_ROLE_KEY (ไม่ใช่ anon key) เพื่อ upload storage และ update DB
 */

const fs   = require('fs');
const path = require('path');

// ── ① โหลด env ──────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌  ไม่พบ .env.local — กรุณาสร้างไฟล์ก่อน');
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
}

// ── ② อ่าน CSV mapping: no → wordId ─────────────────────────────────────────
function loadWordMap() {
  const csvPath = path.join(__dirname, '..', 'supabase', 'seeds', 'recording_sheet.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌  ไม่พบ recording_sheet.csv');
    process.exit(1);
  }

  const lines = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '').split('\n');
  const map   = {};                         // { '001': { wordId, char, pengim } }

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 12) continue;
    const no      = cols[0].trim();
    const char    = cols[2].trim();
    const pengim  = cols[3].trim();
    const wordId  = cols[11].trim();
    if (no && wordId) map[no] = { wordId, char, pengim };
  }

  return map;
}

// ── ③ parse CLI args ─────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  let dir    = null;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && args[i + 1]) dir = args[++i];
    if (args[i] === '--dry-run') dryRun = true;
  }

  if (!dir) {
    console.error('❌  กรุณาระบุ folder: node scripts/upload-audio.js --dir ./audio-files');
    process.exit(1);
  }

  return { dir: path.resolve(dir), dryRun };
}

// ── ④ mime type ──────────────────────────────────────────────────────────────
function getMime(ext) {
  return ext === '.mp3' ? 'audio/mpeg' : 'audio/mp4';   // .m4a → audio/mp4
}

// ── ⑤ main ───────────────────────────────────────────────────────────────────
async function main() {
  loadEnv();

  const { createClient } = require('@supabase/supabase-js');

  const SUPABASE_URL          = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error(
      '❌  ขาด env variable:\n' +
      '   EXPO_PUBLIC_SUPABASE_URL\n' +
      '   SUPABASE_SERVICE_ROLE_KEY\n' +
      '   กรุณาเพิ่มใน .env.local'
    );
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const wordMap  = loadWordMap();
  const { dir, dryRun } = parseArgs();

  if (!fs.existsSync(dir)) {
    console.error(`❌  ไม่พบ folder: ${dir}`);
    process.exit(1);
  }

  // อ่านไฟล์เสียงทั้งหมดใน folder
  const AUDIO_EXTS = ['.m4a', '.mp3'];
  const files = fs.readdirSync(dir)
    .filter(f => AUDIO_EXTS.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log('⚠️   ไม่พบไฟล์เสียงใน folder นี้');
    process.exit(0);
  }

  console.log(`\n📁  folder : ${dir}`);
  console.log(`🎵  พบไฟล์ : ${files.length} ไฟล์`);
  if (dryRun) console.log('🔍  dry-run mode — ไม่ได้ upload จริง\n');
  console.log('─'.repeat(60));

  let success = 0;
  let skipped = 0;
  let failed  = 0;

  for (const filename of files) {
    const ext    = path.extname(filename).toLowerCase();
    const no     = path.basename(filename, ext).padStart(3, '0');  // "1" → "001"
    const entry  = wordMap[no];

    if (!entry) {
      console.log(`⚠️   ${filename}  → ไม่พบ no "${no}" ใน CSV — ข้าม`);
      skipped++;
      continue;
    }

    const { wordId, char, pengim } = entry;
    const bucketPath = `${wordId}${ext}`;                          // <uuid>.m4a
    const filePath   = path.join(dir, filename);
    const mime       = getMime(ext);

    console.log(`\n[${no}] ${char} (${pengim})`);
    console.log(`     ${filename} → ${bucketPath}`);

    if (dryRun) {
      console.log(`     ✅  dry-run: จะ upload ได้`);
      success++;
      continue;
    }

    try {
      // ① upload ไปยัง storage bucket
      const fileBuffer = fs.readFileSync(filePath);
      const { error: uploadErr } = await supabase.storage
        .from('audio')
        .upload(bucketPath, fileBuffer, {
          contentType : mime,
          upsert      : true,           // ถ้ามีอยู่แล้วให้ทับ
        });

      if (uploadErr) throw new Error(`storage: ${uploadErr.message}`);

      // ② ดึง public/signed URL — ใช้ path ใน bucket เป็น reference
      //    (app ดึง signed URL แบบ on-demand อยู่แล้วผ่าน getAudioUrl)
      //    เก็บแค่ path ไว้ใน teochew_audio แทน full signed URL
      const audioRef = bucketPath;

      // ③ อัปเดต words table
      const { error: dbErr } = await supabase
        .from('words')
        .update({ teochew_audio: audioRef })
        .eq('id', wordId);

      if (dbErr) throw new Error(`db: ${dbErr.message}`);

      console.log(`     ✅  สำเร็จ`);
      success++;
    } catch (err) {
      console.log(`     ❌  ผิดพลาด: ${err.message}`);
      failed++;
    }
  }

  // ── สรุปผล ──────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log('📊  สรุป:');
  console.log(`    ✅  สำเร็จ  : ${success} ไฟล์`);
  console.log(`    ⚠️   ข้าม    : ${skipped} ไฟล์`);
  console.log(`    ❌  ผิดพลาด : ${failed} ไฟล์`);
  console.log('─'.repeat(60) + '\n');

  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('❌  unexpected error:', err);
  process.exit(1);
});
