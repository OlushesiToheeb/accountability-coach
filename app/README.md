# app — React Native + Expo

The mobile client (iOS + Android). Six surfaces at MVP (docs/04 §9): Today, Chat, Progress,
Goal/Habit editor, Style & contract, Onboarding.

## Run

```bash
npm install
npx expo start          # scan the QR with Expo Go, or press i / a for a simulator
```

The app pings the backend's `/health` on the Today screen to prove wiring — start `../backend`
first (or set `expo.extra.apiUrl` in `app.json` to a deployed URL).

## Notes

- Versions are pinned to Expo SDK 51 as a coherent starting set; run `npx expo install --fix`
  to align, or bump the SDK when you're ready.
- Voice = OS dictation only in v1 (docs/04 §8) — no custom audio pipeline.

## Structure (grows with Phase 1)

```
index.ts                 registers the root component
App.tsx                  root — renders the current screen
src/screens/
└── TodayScreen.tsx      the home surface (placeholder; wires app ↔ API)
   ── (next) Onboarding, CheckIn, Chat, Progress, Style
```
