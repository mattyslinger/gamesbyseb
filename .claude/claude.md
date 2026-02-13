# Multi-Game Arcade Platform

## Project Overview
A multi-game arcade platform with a homepage at `/` and individual games at `/games/<slug>`. Currently features "Parkour Legend", a 2D platformer with a custom Canvas 2D engine. The architecture is designed for easily adding new games.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Canvas 2D API, Zustand, Tailwind CSS, Radix UI, wouter (routing)
- **Backend**: Express 5, PostgreSQL (Drizzle ORM), Zod (backend is scaffolded but unused)
- **Build**: Vite 5.4, esbuild, tsx
- **Runtime**: Node.js 20, port 5000

## URL Structure
- `/` — Homepage with game cards
- `/games/parkour-legend` — Parkour Legend game

## Project Structure
```
client/src/
├── main.tsx                   # Entry point, renders <AppRouter />
├── router.tsx                 # wouter routes: / → HomePage, /games/parkour-legend → ParkourLegend
├── index.css                  # Global styles + .game-fullscreen class
├── pages/
│   └── HomePage.tsx           # Game catalog grid with clickable cards
├── games/
│   ├── registry.ts            # Game metadata array (title, description, slug, path, tags)
│   └── parkour-legend/
│       ├── ParkourLegend.tsx   # Game wrapper: HUD, overlays, back-to-home link, .game-fullscreen
│       ├── stores/
│       │   ├── useGame.tsx     # Zustand: phase (ready/playing/ended/won), level, score, lives (3)
│       │   └── useAudio.tsx    # Audio playback (hit.mp3, success.mp3), mute toggle
│       └── game/
│           ├── GameCanvas.tsx  # Core game loop (rAF, delta-time capped at 1/30s)
│           ├── engine/         # types.ts, physics.ts, renderer.ts, input.ts, camera.ts
│           ├── entities/       # player.ts, platform.ts, swing.ts, obstacle.ts, flag.ts
│           └── levels/         # levelData.ts (3 levels), levelLoader.ts
├── components/ui/             # shadcn/ui components
├── lib/                       # queryClient.ts, utils.ts
└── hooks/                     # use-is-mobile.tsx
```

## Adding a New Game
1. Create `client/src/games/<slug>/` with game component, stores, and engine
2. Add entry to `client/src/games/registry.ts` (appears on homepage automatically)
3. Add route in `client/src/router.tsx`
4. Wrap game component in `.game-fullscreen` class for fixed fullscreen layout

## Key Constants (Parkour Legend)
- Canvas: 480x640px (pixelated rendering)
- Gravity: 900 px/s², Terminal velocity: 600 px/s
- Player: 24x32px, move speed 200 px/s, jump velocity -420 px/s
- Lives: 3, Invincibility after hit: 2s
- Flag bonus: +1000 score

## Game States (Parkour Legend)
`ready` → `playing` → `ended` (lives=0) or `won` (all 3 levels complete)

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run check` - TypeScript type checking

## Architecture Notes
- **Routing**: wouter v3.3.5 — lightweight client-side router, server catch-all serves index.html for all routes
- **Per-game isolation**: Each game has its own stores, engine, and components — fully self-contained
- **Assets**: Static assets live in `client/public/` with absolute paths (work from any route)
- **CSS**: Homepage scrolls normally; games use `.game-fullscreen` (position:fixed, full viewport)
- Game engine is fully custom Canvas 2D — do NOT introduce Three.js/R3F into game code
- Three.js is installed but intentionally unused
- One-way platform collision: player only lands from above
- Moving platforms use sine-wave oscillation and carry the player
- Input system tracks both held keys and just-pressed for jump buffering

## Current Status
- Parkour Legend is fully playable with 3 complete levels
- Homepage displays game catalog with clickable cards
- Backend API routes and database are scaffolded but not implemented
- Audio starts muted by default
- No tests yet
- No high score persistence yet
