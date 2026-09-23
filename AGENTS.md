# AI Agent Operating Guidelines & Memory Rules

This repository contains critical mobile application configuration and architectural decisions that must not be regressed or hallucinated.

---

## ⚡ MANDATORY INSTRUCTIONS FOR ALL AI AGENTS

1. **READ BEFORE ACTING**:
   Before planning, modifying, or executing commands in this project, you **MUST** read [MEMORY.md](file:///home/ebendttl/portfolio-projects/flow_mobile_app/MEMORY.md). It contains:
   - Verified build links and IDs.
   - Non-negotiable dependency overrides (e.g. `react-native-screens`).
   - Root routing requirements (`app/index.tsx`).
   - Build environment configurations (`.npmrc`, `app.config.js`).

2. **AUTO-UPDATE PROTOCOL**:
   At the end of **every** turn where you make changes to this codebase (code, dependencies, build, or documentation):
   - You **MUST** open [MEMORY.md](file:///home/ebendttl/portfolio-projects/flow_mobile_app/MEMORY.md).
   - Append a new row in **Section 6: Recent Changes & Changelog**.
   - If any routes, build URLs, or gotchas were added or changed, update the corresponding sections.

3. **NON-NEGOTIABLE SAFEGUARDS**:
   - Never delete `app/index.tsx` (causes 404 Unmatched Route).
   - Never remove `.npmrc` (`legacy-peer-deps=true`).
   - Never add `newArchEnabled` inside `app.json` (causes `expo-doctor` to fail).
   - Always commit Git changes before invoking EAS builds.
