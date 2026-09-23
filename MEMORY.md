# Flow Mobile App — Persistent AI Memory & Knowledge Base
> **CRITICAL DIRECTIVE FOR AI AGENTS (Antigravity, Cursor, Windsurf, Claude Code, Copilot, etc.)**:
> 1. **MANDATORY FIRST STEP**: You MUST read this file in its entirety before analyzing, planning, or writing any code in this repository.
> 2. **AUTO-UPDATE PROTOCOL**: Whenever you complete a feature, fix a bug, change configuration, or trigger a build, **YOU MUST AUTOMATICALLY UPDATE THIS FILE** before ending your turn.
>    - Update the **"Recent Changes & Changelog"** table with the timestamp, summary, and files touched.
>    - Update the **"Current Project State"** section if status, build links, or architecture changed.
>    - Record any newly discovered gotchas or quirks under **"Troubleshooting & Known Gotchas"**.
> 3. **NEVER DELETE OR REGRESS KNOWN FIXES**: Pay strict attention to the **"Protected Fixes & Non-Negotiable Rules"** section.

---

## 📌 1. Project Identity & Architecture

| Property | Value |
| :--- | :--- |
| **Application Name** | **Flow** |
| **Concept / Tagline** | *The Tactile Sanctuary for Deep Work* |
| **Repository** | `Imisi-Hub/flow_mobile_app` |
| **Package / Bundle ID** | `com.imisihub.flow` |
| **Expo Account / Owner** | `ebendttl` |
| **Expo Slug** | `flow` |
| **Core Framework** | React Native `0.86.3` with Expo SDK `57` (`~57.0.31`) |
| **Routing** | Expo Router `~57.0.29` (File-based navigation) |
| **Language** | TypeScript `~6.0.3` (Strict mode) |
| **Local Storage / DB** | SQLite (`expo-sqlite` `~57.0.4`) with WAL mode |
| **State & Cache** | TanStack Query v5 (`@tanstack/react-query` `^5.102.8`) |
| **Animations & Gestures**| `react-native-reanimated` `4.5.1`, `react-native-gesture-handler` `~2.32.0` |
| **Backend / Auth** | Supabase (`@supabase/supabase-js` `^2.109.0`) |

---

## 🗂️ 2. App Structure & Route Hierarchy

```
app/
├── _layout.tsx           # Root Stack layout (Font loading, SQLite init, QueryClient, SafeAreaProvider)
├── index.tsx             # ROOT ENTRY POINT: Redirects flow:/// directly to /(tabs)/dashboard
├── settings.tsx          # Settings screen (Modal presentation from root stack)
├── (auth)/               # Authentication route group
│   ├── _layout.tsx       # Auth stack layout
│   ├── sign-in.tsx       # Sign in screen (Supabase email/password)
│   └── sign-up.tsx       # Sign up screen
└── (tabs)/               # Main bottom-tab navigation group
    ├── _layout.tsx       # Tab bar configuration & custom SVG-style tab icons
    ├── dashboard.tsx     # Primary dashboard (Tasks, Timeline strip, Eisenhower priorities)
    ├── projects.tsx      # Projects management view
    ├── insights.tsx      # Analytics & Health Garden data visualization
    └── focus.tsx         # Focus hero Pomodoro timer with Reanimated ring
```

---

## 🛡️ 3. Protected Fixes & Non-Negotiable Rules (DO NOT BREAK)

These are battle-tested fixes resolved during EAS build and launch debugging. **Any regression will break builds or cause 404 crashes:**

### 1. `app/index.tsx` Must Always Exist
* **Why**: Expo Router defaults to root route `/` (`flow:///`) on app startup. Without `app/index.tsx`, the app crashes into an **"Unmatched Route: Page could not be found (flow:///)"** error screen.
* **Current Implementation**: Contains `<Redirect href="/(tabs)/dashboard" />` to immediately guide the user into the active dashboard.

### 2. Package Dependency Overrides in `package.json`
* **Why**: `expo-router@57.0.29` bundles its own internal `react-native-screens@4.27.0`. If the root `package.json` specifies a conflicting version (e.g. `~4.26.0`), `expo-doctor` fails with duplicate native module errors.
* **Rule**: Keep `"react-native-screens": "4.27.0"` pinned in both `dependencies` and the `overrides` block of `package.json`.

### 3. `.npmrc` Must Include `legacy-peer-deps=true`
* **Why**: Prevents npm v10+ ERESOLVE dependency tree clashes during EAS cloud build container initialization.

### 4. `newArchEnabled` Forbidden in `app.json` / `app.config.js`
* **Why**: `newArchEnabled` is a Gradle/Android property, not an Expo config property. Putting it inside `app.json` causes `npx expo-doctor` and EAS build pre-validation to fail.

### 5. `assets/notification-icon.png` Must Exist
* **Why**: Configured in `app.config.js` under Android notification plugins. If deleted or missing, Android prebuild crashes with `ENOENT: no such file or directory, open './assets/notification-icon.png'`.

---

## 🚀 4. Build, Distribution & Testing Runbook

### Android Standalone Distribution (Current Working Build)
* **Latest Verified APK Build ID**: `99f65feb-c285-4de5-a95b-4dde11fdef5d`
* **Permanent EAS Build Web Page**:  
  👉 `https://expo.dev/accounts/ebendttl/projects/flow/builds/99f65feb-c285-4de5-a95b-4dde11fdef5d`
* **Direct APK Download URL**:  
  👉 `https://expo.dev/artifacts/eas/rQq-yACN0pZbVpp90CEAZK_GBqBQ_KaxS3Y7UT5KzD4.apk`
* **How Client Installs on Android**:
  The client opens the build link in any mobile browser (Chrome/Samsung), taps **Download**, and taps the downloaded APK to install. **No Expo Go or EAS app is needed on Android.**

### Triggering a New Android Preview Build
Always ensure changes are committed to Git before triggering EAS:
```bash
git add -A && git commit -m "your message"
npx eas-cli build -p android --profile preview
```

### iOS Testing Protocol (No Apple Developer Account Needed)
Because Apple strictly blocks downloading standalone `.apk` or unsigned `.ipa` files from web links:
* **Workflow**: Client installs the free **Expo Go** app from the iOS App Store.
* **How to run the session**:
  1. Developer starts the cloud tunnel on workstation:
     ```bash
     npx expo start --tunnel
     ```
  2. Developer provides the live `exp://...` link or QR code to the client.
  3. Client opens it inside Expo Go. Works seamlessly across different cities/states via ngrok cloud tunneling.

---

## 🩺 5. Troubleshooting & Known Gotchas

| Issue / Symptom | Root Cause | Resolution |
| :--- | :--- | :--- |
| **Unmatched Route: `flow:///`** | Missing `app/index.tsx` entry file. | Ensure `app/index.tsx` redirects to `/(tabs)/dashboard`. |
| **Tapping "Sitemap" does nothing** | In production/preview builds, developer sitemap modal is disabled by Expo. | Normal behavior in standalone APK. Fix the routing via `app/index.tsx`. |
| **`expo doctor` fails on duplicate screens** | `expo-router` internal node_modules has a different screens version. | Match `package.json` dependency and `overrides` to `react-native-screens@4.27.0`. |
| **Prebuild fails on notification icon** | Missing `./assets/notification-icon.png`. | Ensure notification icon file is in `assets/`. |
| **EAS fails on npm install** | Peer dependency conflicts in Expo 57 / React 19 tree. | Maintain `.npmrc` with `legacy-peer-deps=true`. |

---

## 📝 6. Recent Changes & Changelog

| **2026-09-20** | Flow Scaffold | `build(eas): configure EAS build profiles and npm legacy peer deps` — Configured eas.json and `.npmrc` for EAS cloud container builds. | `.npmrc`, `eas.json` |
| **2026-09-21** | Flow Scaffold | `fix(deps): deduplicate react-native-screens to 4.27.0 via overrides` — Resolved dual screens version between root and expo-router. | `package.json`, `package-lock.json` |
| **2026-09-22** | Flow Scaffold | `fix(android): sanitize app config and resolve notification icon asset` — Removed invalid newArchEnabled and resolved missing notification icon. | `app.json`, `app.config.js`, `assets/notification-icon.png` |
| **2026-09-23** | Flow Scaffold | `feat(routing): add index redirect to dashboard and establish agent memory` — Added `app/index.tsx` root redirect, registered `index` in stack, and established `MEMORY.md` + `AGENTS.md`. | `app/index.tsx`, `app/_layout.tsx`, `MEMORY.md`, `AGENTS.md` |

---

## 🔄 7. Protocol for Auto-Updating this Memory File

**Every AI Agent reading this prompt MUST adhere to the following workflow on every turn:**
1. **At Session Start**: Read `MEMORY.md` to recall build links, gotchas, and architectural decisions.
2. **During the Session**: Cross-verify any new configuration or dependencies against the *Protected Fixes* in Section 3.
3. **Before Concluding the Turn**:
   - Add a new row to the table in **Section 6 (Recent Changes & Changelog)**.
   - If any new builds, routes, or dependencies were created, update Sections 1, 2, or 4 accordingly.
   - If any errors were encountered and resolved, document them in Section 5.
