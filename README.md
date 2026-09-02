# Flow

> **Your tactile sanctuary for deep work.** A cross-platform mobile productivity app for iOS and Android.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 57 (managed workflow + custom dev client) |
| Routing | Expo Router (file-based) |
| Language | TypeScript |
| Backend | Supabase (Auth, Postgres, RLS) |
| Local Cache | expo-sqlite (WAL mode, dirty-tracking) |
| State | TanStack Query v5 (offline-first, NetInfo bridge) |
| Animations | react-native-reanimated v4 |
| Gestures | react-native-gesture-handler |
| Fonts | Lexend (headings) + Plus Jakarta Sans (body) |
| Security | expo-secure-store (vault keys), expo-local-authentication (biometrics) |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/Imisi-Hub/flow_mobile_app.git
cd flow_mobile_app
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase URL and anon key

# 3. Start the dev server
npm start             # launches Expo dev server (custom dev client)
# Then: open the Flow dev client on your device/simulator
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> **Never commit `.env`.** It is in `.gitignore`.

## Project Structure

```
flow_mobile_app/
├── app/                     # Expo Router screens (file-based routing)
│   ├── _layout.tsx          # Root stack + QueryClient + font loading
│   ├── (auth)/              # Sign-in / Sign-up screens
│   ├── (tabs)/              # Bottom tab navigator (Dashboard, Projects, Insights, Focus)
│   └── settings.tsx         # Settings modal
├── src/
│   ├── components/          # Shared UI components
│   ├── constants/theme.ts   # Design tokens (colors, typography, spacing, shadows)
│   ├── features/            # Feature-specific code (matrix, projects, focus, etc.)
│   ├── hooks/               # Shared custom hooks
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client + auth helpers
│   │   ├── sqlite.ts        # Local SQLite cache (expo-sqlite)
│   │   └── secureStore.ts   # Encrypted key storage wrapper
│   └── types/               # Shared TypeScript types
├── supabase/
│   └── schema.sql           # Database schema (review before applying)
├── app.config.ts            # Expo config (bundle IDs, plugins, env vars)
├── babel.config.js          # Babel + reanimated plugin
├── tsconfig.json            # TypeScript (strict mode, @/* path alias)
└── .env.example             # Environment variable template
```

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — never push directly |
| `qa` | Staging / QA testing |
| `dev` | Active development (this is the default working branch) |

Feature work is done in `feature/*` branches cut from `dev`.

## Database

The Supabase schema lives at `supabase/schema.sql`. Apply it via the Supabase dashboard SQL editor or CLI:

```bash
supabase db push  # requires Supabase CLI + linked project
```

## Planned Native Integrations (future passes)

- **HealthKit (iOS)** / **Google Fit (Android)** — via `react-native-health` and related packages. Not yet installed; requires custom native config. See `/src/features/health-garden/README.md`.
- **Biometric auth** — `expo-local-authentication` is installed; UI integration in `feature/auth-layer`.
- **EAS Build** — run `eas init` and update `app.config.ts` with real project ID before first build.

## Scripts

```bash
npm start          # Start Expo dev server (custom dev client mode)
npm run typecheck  # TypeScript compile check (no emit)
npm run lint       # Expo lint
npm run ios        # Build + run on iOS simulator (requires macOS + Xcode)
npm run android    # Build + run on Android emulator
```
