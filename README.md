<div align="center">

  <a href="https://github.com/Imisi-Hub/flow_mobile_app">
    <img src="./assets/logo.png" alt="Flow Logo" width="120" style="border-radius: 24px;" />
  </a>
  <h1>FLOW</h1>
  <p><strong>Your Tactile Sanctuary for Deep Work</strong></p>
  <p>A state-of-the-art, cross-platform mobile productivity application built with React Native & Expo. Designed with warm organic aesthetics, zero-knowledge hardware encryption, offline-first SQLite synchronization, and domain-partitioned priority tracking.</p>

  <p>
    <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-SDK%2057-000000.svg?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57" /></a>
    <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.86.3-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React Native" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Strict%20Mode-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://sqlite.org"><img src="https://img.shields.io/badge/SQLite-WAL%20Engine-003B57.svg?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" /></a>
    <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/TanStack%20Query-v5-FF4154.svg?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-C0603C.svg?style=for-the-badge" alt="License MIT" /></a>
  </p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-architecture--system-design">Architecture</a> •
    <a href="#-design-system--the-tactile-sanctuary">Design System</a> •
    <a href="#-database--row-level-security">Database</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-security--privacy">Security</a> •
    <a href="#-project-structure">Structure</a>
  </p>

  ---
</div>

<br />

## 📖 Overview

Modern productivity applications are often cold, demanding, and cluttered with hyper-aggressive notifications. **Flow** re-imagines digital productivity through **The Tactile Sanctuary** paradigm: a serene, organic environment inspired by natural textures—terracotta, cream linen, sage green, and warm walnut.

Flow combines cognitive science with modern mobile engineering:
* **Domain Isolation**: Separate your mental load across *Work*, *Personal*, and *Family* spheres.
* **Eisenhower Prioritization**: Distill chaos into clear, actionable Q1–Q4 quadrants.
* **Offline Sovereignty**: Seamless operation without network connectivity backed by local SQLite WAL transactions and TanStack Query persistence.
* **Hardware Security**: AES-256-GCM encryption with device-level keys secured in iOS SecureStore & Android KeyStore, protected by Face ID & Touch ID biometrics.

---

## ✨ Key Features

| Feature | Description | Engine / Stack |
| :--- | :--- | :--- |
| **Eisenhower Priority Matrix** | Four-quadrant task classification (Q1 Do Now, Q2 Schedule, Q3 Delegate, Q4 Eliminate) with custom drag reordering and domain filtering. | `react-native-gesture-handler`, `reanimated` |
| **Focus Session Engine** | Deep work Pomodoro timer supporting custom focus durations, distraction logging, ambient focus timers, and automatic streak updates. | `react-native-reanimated` v4 |
| **Zero-Knowledge Vault** | Client-side encrypted notes and task attachments. Keys are generated on-device and never transmitted to remote servers. | `expo-crypto`, `expo-secure-store`, `expo-local-authentication` |
| **Offline-First Synchronization** | Immediate local read/write access via SQLite WAL mode, dirty-flag transaction queues, and network state detection. | `expo-sqlite`, `TanStack Query v5`, `@react-native-community/netinfo` |
| **Habit & Streak Tracker** | Multi-vector consistency tracking across four daily dimensions: Focus sessions, Tasks completed, Health syncing, and App engagement. | `Supabase Postgres`, `PL/pgSQL Triggers` |
| **Health Garden (Roadmap)** | Native HealthKit & Google Fit sync for holistic mindfulness, energy tracking, and physical recovery correlation. | `react-native-health` (planned) |
| **Daily Spark** | Morning focus ritual & micro-momentum prompts designed to minimize decision fatigue at the start of each day. | Custom design system components |

---

## 🏗 Architecture & System Design

Flow is architected around the **Local-First / Remote-Sync** pattern. The application maintains full operational autonomy on the client device, using local SQLite storage as the single source of immediate truth, while background sync workers propagate state changes to Supabase Postgres.

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT APPLICATION                               │
│                                                                                 │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌────────────────────┐  │
│  │    UI Components      │  │    Expo Router v57     │  │ Reanimated v4      │  │
│  │ (Tactile Sanctuary)   │  │  (File-Based Routing)  │  │ (Gesture Handler)  │  │
│  └───────────┬───────────┘  └───────────┬────────────┘  └─────────┬──────────┘  │
│              └──────────────────────────┼─────────────────────────┘             │
│                                         ▼                                       │
│                         ┌───────────────────────────────┐                       │
│                         │     TanStack Query Client     │                       │
│                         │ (Cache, staleTime, gcTime)    │                       │
│                         └───────────────┬───────────────┘                       │
│                                         │                                       │
│             ┌───────────────────────────┴──────────────────────────┐            │
│             ▼                                                      ▼            │
│  ┌───────────────────────┐                            ┌──────────────────────┐  │
│  │   Local SQLite DB     │                            │ NetInfo Network Sync │  │
│  │ (WAL Mode, Dirty-Log) │                            │    Bridge Listener   │  │
│  └───────────────────────┘                            └──────────┬───────────┘  │
└──────────────────────────────────────────────────────────────────┼──────────────┘
                                                                   │
                                                               HTTPS / WSS
                                                                   │
┌──────────────────────────────────────────────────────────────────▼──────────────┐
│                                 REMOTE BACKEND                                  │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                              Supabase Engine                              │  │
│  │  ┌───────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │  │
│  │  │ PostgreSQL 15 Database │  │ Row Level Sec.   │  │ PL/pgSQL         │  │  │
│  │  │  (Tasks, Focus, Vault)│  │ (auth.uid Isol.) │  │ Triggers & Seeds │  │  │
│  │  └───────────────────────┘  └──────────────────┘  └──────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Layers

1. **Presentation Layer (`/app` & `/src/components`)**:
   Built on `expo-router` using file-based navigation, layout stacks, and modal screens. UI renders are powered by pre-compiled design tokens.

2. **State & Offline Layer (`/src/lib/sqlite.ts` & `app/_layout.tsx`)**:
   Uses `expo-sqlite` configured with Write-Ahead Logging (`PRAGMA journal_mode = WAL`). Local mutations set `is_dirty = 1`. `TanStack Query v5` listens to `@react-native-community/netinfo` events to automatically flush dirty queues upon network re-establishment.

3. **Security Layer (`/src/lib/secureStore.ts`)**:
   Protects local encryption keys using hardware enclave storage (`expo-secure-store`). Sensitive biometric triggers use `expo-local-authentication`.

4. **Persistence & Data Modeling (`/supabase/schema.sql`)**:
   Supabase PostgreSQL equipped with strict Row Level Security (RLS) policies (`auth.uid() = user_id`) and automated trigger functions (`seed_default_domains`).

---

## 🎨 Design System: "The Tactile Sanctuary"

Flow avoids standard generic flat colors in favor of a warm, material-inspired color system designed to minimize cognitive fatigue during long deep-work sessions.

### Color Palette

| Token Key | Hex Value | Visual Swatch | Semantic Purpose |
| :--- | :--- | :---: | :--- |
| `Colors.primary` | `#C0603C` | 🧱 | **Terracotta** — Primary brand, action buttons, Q1 Urgent tasks |
| `Colors.background` | `#FAF6F0` | 📜 | **Cream Linen** — Main app backdrop, warm off-white canvas |
| `Colors.surface` | `#FFFFFF` | ⚪ | **Pure Linen** — Elevated card surfaces |
| `Colors.sage` | `#7A9E7E` | 🌿 | **Sage Green** — Personal category, Q2 Important focus tasks |
| `Colors.domainFamily` | `#C49A6C` | 🍯 | **Warm Amber** — Family domain, Q3 Delegate quadrant |
| `Colors.textPrimary` | `#2C1E14` | 🪵 | **Deep Walnut** — High-contrast primary headings |
| `Colors.textSecondary` | `#7A5C45` | 🤎 | **Muted Earth** — Body text & secondary elements |
| `Colors.border` | `#E8DDD0` | 🌾 | **Soft Oat** — Soft divider lines and card borders |

### Typography Hierarchy

Flow uses a dual font system loaded via `@expo-google-fonts`:
* **Headings**: **Lexend** (Bold, SemiBold, Medium, Regular) — A variable sans-serif font scientifically crafted to reduce visual noise and improve reading speed.
* **Body & UI**: **Plus Jakarta Sans** (Bold, SemiBold, Medium, Regular) — A clean, geometric, warm modern font.

```typescript
// Example Typography Usage from src/constants/theme.ts
import { TextStyles } from '@/src/constants/theme';

<Text style={TextStyles.h1}>Tactile Focus</Text>
<Text style={TextStyles.body}>Sanctuary for deep work sessions.</Text>
```

### Motion & Tactile Elevation

* **Card Elevation**: Soft, diffuse shadows (`shadowOpacity: 0.04` – `0.12`, `shadowRadius: 4` – `32`) to simulate physical layered card stock.
* **Border Radii**: Smooth organic curves (`Radius.xl = 24px`, `Radius.xxl = 32px`).
* **Animations**: 60 FPS spring physics backed by `react-native-reanimated` v4.

---

## 🗄 Database & Row Level Security

The Supabase schema enforces zero-trust security where users can only access their own data via PostgreSQL Row Level Security (RLS).

### Schema ERD Overview

```
 ┌──────────────────────┐        ┌──────────────────────┐
 │     auth.users       │        │    public.domains    │
 │──────────────────────│        │──────────────────────│
 │ id (UUID, PK)        │──┐     │ id (UUID, PK)        │
 └──────────────────────┘  │     │ user_id (UUID, FK)   │
                           ├────>│ name (TEXT)          │
                           │     │ color (TEXT)         │
                           │     └──────────────────────┘
                           │
                           │     ┌──────────────────────┐
                           │     │     public.tasks     │
                           │     │──────────────────────│
                           │     │ id (UUID, PK)        │
                           ├────>│ user_id (UUID, FK)   │
                           │     │ domain_id (UUID, FK) │
                           │     │ title (TEXT)         │
                           │     │ quadrant (Q1-Q4)     │
                           │     │ encrypted_content    │
                           │     └──────────────────────┘
                           │
                           │     ┌──────────────────────┐
                           │     │public.focus_sessions │
                           │     │──────────────────────│
                           │     │ id (UUID, PK)        │
                           └────>│ user_id (UUID, FK)   │
                                 │ duration (INTEGER)   │
                                 │ interrupted (BOOL)   │
                                 └──────────────────────┘
```

### Automated User Provisioning

When a new user registers through Supabase Auth, an automated PostgreSQL trigger (`on_auth_user_created`) instantly executes to seed standard domain buckets and streak entries:

```sql
CREATE OR REPLACE FUNCTION public.seed_default_domains()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.domains (user_id, name, color, icon, is_default, sort_order)
  VALUES
    (NEW.id, 'Work',     '#C0603C', 'briefcase', TRUE, 0),
    (NEW.id, 'Personal', '#7A9E7E', 'person',    TRUE, 1),
    (NEW.id, 'Family',   '#C49A6C', 'people',    TRUE, 2);

  INSERT INTO public.streaks (user_id, type)
  VALUES
    (NEW.id, 'focus'), (NEW.id, 'tasks'), (NEW.id, 'health'), (NEW.id, 'login');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔒 Security & Privacy Architecture

Flow places data privacy at the core of its architecture:

1. **Hardware Enclave Encryption**:
   Vault key material is securely generated using cryptographically strong random bytes (`expo-crypto`) and persisted in iOS Keychain or Android KeyStore via `expo-secure-store`.
2. **AES-256-GCM Payload Protection**:
   Task notes and vault items are encrypted prior to database persistence. The server stores only ciphertext (`encrypted_content`) and initialization vectors (`encryption_iv`).
3. **Biometric Guard**:
   Accessing encrypted features requires biometric authentication (`expo-local-authentication`) utilizing native Face ID, Touch ID, or Android Biometric Prompt.
4. **Environment Security**:
   Public environment variables use the `EXPO_PUBLIC_` prefix. Sensitive deployment credentials (Apple Team IDs, keystore passwords) are maintained out of source control.

---

## 🚀 Quick Start

### Prerequisites

Ensure your environment meets the following requirements:
* **Node.js**: `^18.0.0` or `>=20.0.0`
* **npm**: `>=9.0.0` (or `pnpm` / `bun`)
* **Expo CLI**: Installed globally (`npm i -g expo-cli`) or executed via `npx`
* **iOS Development**: macOS with Xcode 15+ and iOS Simulator
* **Android Development**: Android Studio with Android Virtual Device (AVD)
* **Supabase Account**: CLI installed (`brew install supabase/tap/supabase`)

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/Imisi-Hub/flow_mobile_app.git
cd flow_mobile_app

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Copy the template configuration file to create `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

```ini
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 3. Initialize Database Schema

Apply the Supabase migrations using the SQL Editor in your Supabase Dashboard or via the CLI:

```bash
# Link project and push database schema
supabase link --project-ref your-project-ref
supabase db push
```

### 4. Launch Development Server

```bash
# Start Expo development server in Custom Dev Client mode
npm start
```

* Press `i` to launch in iOS Simulator.
* Press `a` to launch in Android Emulator.
* Press `w` to open web preview.

---

## 💻 Developer CLI Reference

| Command | Purpose |
| :--- | :--- |
| `npm start` | Launches Expo Metro bundler with dev client flags (`expo start --dev-client`) |
| `npm run ios` | Compiles native iOS app and executes on simulator (`expo run:ios`) |
| `npm run android` | Compiles native Android app and executes on emulator (`expo run:android`) |
| `npm run web` | Bundles static web distribution using Metro (`expo start --web`) |
| `npm run typecheck` | Executes strict TypeScript type validation (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint and Expo code style validation (`expo lint`) |

---

## 📂 Project Topology

```
flow_mobile_app/
├── app/                           # Expo Router Screens (File-Based Routing)
│   ├── _layout.tsx                # Root Provider Stack (QueryClient, Fonts, SQLite Init)
│   ├── (auth)/                    # Authentication Screens
│   │   ├── _layout.tsx            # Auth Stack Navigator
│   │   ├── sign-in.tsx            # Warm Auth Sign-In Form
│   │   └── sign-up.tsx            # New Account Registration
│   ├── (tabs)/                    # Main Bottom Tab Navigator
│   │   ├── _layout.tsx            # Custom Tab Bar Styling & Icons
│   │   ├── dashboard.tsx          # Eisenhower Matrix & Daily Overview
│   │   ├── focus.tsx              # Deep Work Timer & Session Controls
│   │   ├── insights.tsx           # Productivity Analytics & Streaks
│   │   └── projects.tsx           # Domain Projects & Categories
│   └── settings.tsx               # Settings & Biometrics Modal
├── src/                           # Main Application Source Code
│   ├── components/                # Reusable UI Design System Components
│   │   └── index.ts               # Barrel Export
│   ├── constants/                 # Design System & Configuration
│   │   └── theme.ts               # Color Tokens, Typography, Spacing, Shadows, Radius
│   ├── features/                  # Feature Modules
│   │   ├── daily-spark/           # Morning Focus & Ritual Prompts
│   │   ├── focus/                 # Timer Logic & Sound Engine Specs
│   │   ├── health-garden/         # HealthKit / Google Fit Integrations
│   │   ├── matrix/                # Eisenhower Drag & Drop Quadrant Logic
│   │   ├── projects/              # Project Partitioning & Domain Logic
│   │   └── vault/                 # Hardware Encrypted Vault Storage
│   ├── hooks/                     # Custom Shared React Hooks
│   │   └── index.ts               # Barrel Export
│   ├── lib/                       # Low-Level Core Libraries
│   │   ├── secureStore.ts         # Encrypted SecureStore Wrapper (Vault Keys)
│   │   ├── sqlite.ts              # Local SQLite WAL Cache & Dirty-Tracking DB
│   │   └── supabase.ts            # Supabase JS Client & Auth Helper Setup
│   └── types/                     # Shared TypeScript Interfaces & Enums
│       └── index.ts               # Database & UI Types
├── supabase/                      # Database Infrastructure
│   └── schema.sql                 # Production PostgreSQL Schema, RLS & Triggers
├── assets/                        # App Icons, Splash Screens & Fonts
├── app.config.ts                  # Expo Dynamic Configuration & Plugin Manifest
├── babel.config.js                # Babel Configuration with Reanimated Plugin
├── tsconfig.json                  # TypeScript Compiler Settings (@/* Path Aliases)
├── .env.example                   # Environment Variable Template
└── LICENSE                        # MIT License File
```

---

## 🔀 Branching Strategy & Git Workflow

Flow follows a structured Git branching strategy to guarantee production stability:

```
 main (Production Releases)
   ▲
   │ [PR with QA Approval]
  qa (Staging / Release Candidate)
   ▲
   │ [PR with Code Review]
 dev (Active Development Branch)
   ▲
   ├── feature/eisenhower-matrix-drag
   ├── feature/vault-biometrics
   └── fix/sqlite-sync-reconnect
```

* **`main`**: Production-ready code. Direct pushes are protected and disabled.
* **`qa`**: Staging builds for testflight and internal distribution.
* **`dev`**: Main integration branch for active development.
* **`feature/*`**: Feature branches cut directly from `dev`.

---

## 📦 Build & EAS Deployment

Flow is pre-configured for **Expo Application Services (EAS Build)**:

```bash
# Install EAS CLI
npm install -g eas-cli

# Initialize EAS project configuration
eas init

# Build for iOS (Simulator or Internal Distribution)
eas build --platform ios --profile preview

# Build for Android (APK or App Bundle)
eas build --platform android --profile preview
```

> **Note**: Update `app.config.ts` with your unique `projectId` under the `extra.eas` block prior to triggering remote cloud builds.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for complete details.

---

<div align="center">
  <p>Crafted with care by <strong>Imisi Hub</strong>.</p>
  <p><em>“Simplicity is about subtracting the obvious and adding the meaningful.”</em></p>
</div>
