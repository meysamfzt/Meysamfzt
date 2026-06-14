# Anima — Meditation & Breathwork

A premium offline-first React Native (Expo Router) bilingual (EN/FA) meditation & breathwork
app with high-end glassmorphism, dynamic ambient gradient backdrops, an organic Pulsing
Breath Sphere and an Archetype Mentor system for each of the 11 meditation branches.

## Stack
- Expo Router (file-based)
- expo-blur, expo-linear-gradient, expo-haptics
- react-native-reanimated (breath sphere + onboarding orbs)
- @expo/vector-icons (Feather)
- Local state persisted via @/src/utils/storage (AsyncStorage)

## Features
- Onboarding: welcome + "Recommended" baseline session + personalize step (goals + experience)
- Bilingual: EN / FA toggle (RTL-aware)
- Bottom tab nav with frosted floating pill (Breath / Meditate / Self)
- Breathwork: 3 tiers × 2 streams (Activity / Goal), 14 starter sessions across rhythms
  (4-2-4, 4-7-8, Box, Coherent, Wim Hof, Pranayama 8-16-8, Ultra-slow box, etc.)
- Prerequisite intercept screen with long-press haptic confirmation
- Breath Player: organic pulsing sphere (inhale / hold / exhale / hold_empty), per-phase
  timing, breath cycle counter, pause/resume, completion logging
- Meditation: 11 branches with custom color schemes, gradients, mentors, and progressive
  levels (Wealth → Golden / Capitalist / Lord; Sleep → Alpha / Theta / Delta / Lucid; Shifting
  → 7 levels; etc.)
- Archetype Mentors (Zeus, Marcus Aurelius, Hypnos, Robert Monroe, Archangel Michael,
  The Architect, Quan Yin, Milton Erickson, Morpheus, Tesla, Buddha) — bilingual quotes
  shown on the first session entry of each branch
- Meditation Player: timer, ambient gradient backdrop per branch, affirmation ticker
- Audio Control Matrix (Vocal Guide, Ambient Soundscape, Affirmations toggles +
  Custom Audio uploaders + interval count selector) — fully wired to local state
- Profile: stats (sessions, minutes practiced, day streak), language toggle, audio
  defaults, recent history, clear history

## NOTE — Mocked
Audio playback is currently **MOCKED**. The audio matrix toggles drive UI/state correctly
and persist, but no actual sound files are bundled yet. (User requested static placeholder
audio with full audio integration to come later.)

## Routes
- `/` — entry redirect based on onboarding state
- `/onboarding` — welcome + assessment
- `/(tabs)/breathwork` — breathwork catalog
- `/(tabs)/meditation` — 11-branch grid
- `/(tabs)/profile` — stats + settings + history
- `/breath/intercept?sessionId=...` — breathwork prereq + audio matrix
- `/breath/player?sessionId=...` — breath sphere player
- `/meditation/[branch]` — branch detail (levels + mentor preview)
- `/meditation/[branch]/[level]` — topics list
- `/meditation/[branch]/[level]/[topic]` — sessions list
- `/meditation/play?branch=..&level=..&topic=..&session=..` — intercept + meditation player
  + mentor greeting (first session)
