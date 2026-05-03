-- Allow both mp3 and m4a in the audio bucket
update storage.buckets
set allowed_mime_types = array['audio/mpeg', 'audio/mp4']
where id = 'audio';
