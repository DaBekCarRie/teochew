# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (prompts for iOS/Android/Web)
npm start

# Run on specific platform
npm run ios
npm run android

# Always clear Metro cache when changing babel/metro config or after installing packages
npx expo start --clear

# Type check
node node_modules/typescript/lib/tsc.js --noEmit
# Note: npx tsc may fail due to a broken .bin/tsc symlink — use the path above directly

# Lint
npx eslint src --ext .ts,.tsx

# Install packages — always use --legacy-peer-deps
npm install <package> --legacy-peer-deps
# For Expo-managed packages (respects SDK version pins):
npx expo install <package>
```

## Architecture

**Entry point:** `expo-router/entry` (set in `package.json` `main`) → Expo Router reads `src/app/` as the file-based route root (configured via `expo-router.root: "src/app"` in `app.json`).

**Routing (`src/app/`):** File-based with Expo Router v6.

- `_layout.tsx` — Root Stack (headerShown: false), imports `global.css` for NativeWind
- `(tabs)/_layout.tsx` — Tab Navigator with 5 tabs: Dictionary, Learn, Translate, Voice, Culture
- Each tab has its own `_layout.tsx` (Stack) and `index.tsx` placeholder screen

**Source layout (`src/`):**

- `app/` — Expo Router screens and layouts
- `components/` — Shared UI components
- `hooks/` — Custom React hooks
- `stores/` — Zustand state (not yet wired)
- `services/` — Supabase and API calls
- `utils/` — Helper functions
- `types/` — TypeScript type definitions

**Styling:** NativeWind v4 (Tailwind for React Native). Use `className` props on RN components. Tailwind config scans `src/**` and `app/**`.

**Backend:** Supabase. Credentials are in `.env.local` (gitignored) as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Access via `process.env.EXPO_PUBLIC_SUPABASE_URL`. Only `EXPO_PUBLIC_` prefixed vars are bundled into the app.

**New Architecture:** Enabled (`newArchEnabled: true` in `app.json`). React Native 0.81.5, React 19, Expo SDK 54.

## Key Config Files

| File                  | Purpose                                                                              |
| --------------------- | ------------------------------------------------------------------------------------ |
| `babel.config.js`     | NativeWind babel preset + `react-native-worklets/plugin` (required by Reanimated v4) |
| `metro.config.js`     | Wrapped with `withNativeWind` pointing to `global.css`                               |
| `tailwind.config.js`  | NativeWind preset, content paths for `src/**`                                        |
| `nativewind-env.d.ts` | TypeScript types for NativeWind `className` prop                                     |
| `global.css`          | Tailwind directives — imported once in root `_layout.tsx`                            |

## Gotchas

- **Package installation:** The project was bootstrapped by copying from a temp dir, so some transitive deps needed manual installation. When adding new packages, prefer `npx expo install` first; fall back to `npm install --legacy-peer-deps` if peer conflicts arise.
- **Reanimated v4:** Uses `react-native-worklets` as a separate package (not bundled with reanimated). The babel plugin is `react-native-worklets/plugin`, not the old `react-native-reanimated/plugin`.
- **Metro cache:** Run `npx expo start --clear` after any changes to `babel.config.js`, `metro.config.js`, or after installing native packages.
- **`npx tsc`:** Broken symlink in `.bin/tsc` — run TypeScript directly via `node node_modules/typescript/lib/tsc.js --noEmit`.
