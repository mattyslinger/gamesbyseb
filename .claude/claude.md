# 2D Platformer Game

## Project Overview
A 2D platformer game with a custom Canvas 2D engine (not WebGL/Three.js). Features physics-based platforming, double-jump, pendulum swings, moving platforms, obstacles, and a 3-level progression system. The game is fully playable.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Canvas 2D API, Zustand, Tailwind CSS, Radix UI
- **Backend**: Express 5, PostgreSQL (Drizzle ORM), Zod (backend is scaffolded but unused)
- **Build**: Vite 5.4, esbuild, tsx
- **Runtime**: Node.js 20, port 5000

## Project Structure
```
client/src/
├── App.tsx                    # Main UI: HUD (level/score/lives), overlays (ready/gameover/won), mute button
├── game/
│   ├── GameCanvas.tsx         # Core game loop (rAF, delta-time capped at 1/30s)
│   ├── engine/
│   │   ├── types.ts           # All entity types (Player, Platform, Swing, Obstacle, Flag, Level, etc.)
│   │   ├── physics.ts         # Gravity (900px/s²), AABB collision, circle-vs-AABB, terminal velocity (600px/s)
│   │   ├── renderer.ts        # Canvas 2D drawing for all entities + HUD
│   │   ├── input.ts           # Keyboard: Arrow/WASD, space to jump, prevents page scroll
│   │   └── camera.ts          # Vertical tracking with smooth lerp, player at 70% screen height
│   ├── entities/
│   │   ├── player.ts          # Movement (200px/s), jump (-420px/s), double-jump, swing grab, invincibility (2s)
│   │   ├── platform.ts        # Static + moving (sine-wave oscillation), one-way collision, carries player
│   │   ├── swing.ts           # Pendulum physics (angle-based, gravity-driven, 0.995 damping)
│   │   ├── obstacle.ts        # Barrels (gravity-affected, bounce) and fireballs (direct velocity), circle collision
│   │   └── flag.ts            # Goal marker, AABB collision, +1000 score
│   └── levels/
│       ├── levelData.ts       # 3 levels: "The Basics" (2000px), "Barrel Roll" (3000px), "Inferno" (4000px)
│       └── levelLoader.ts     # Level initialization from data
├── lib/stores/
│   ├── useGame.tsx            # Zustand: phase (ready/playing/ended/won), level, score, lives (3)
│   └── useAudio.tsx           # Audio playback (hit.mp3 @ 0.3 vol, success.mp3 @ 1.0 vol), mute toggle
```

## Key Constants
- Canvas: 480x640px (pixelated rendering)
- Gravity: 900 px/s², Terminal velocity: 600 px/s
- Player: 24x32px, move speed 200 px/s, jump velocity -420 px/s
- Lives: 3, Invincibility after hit: 2s
- Flag bonus: +1000 score

## Game States
`ready` → `playing` → `ended` (lives=0) or `won` (all 3 levels complete)

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run check` - TypeScript type checking

## Architecture Notes
- Game engine is fully custom Canvas 2D — do NOT introduce Three.js/R3F into the game code
- Three.js is installed but intentionally unused (was the original approach, switched to 2D)
- One-way platform collision: player only lands from above
- Moving platforms use sine-wave oscillation and carry the player
- Obstacles are pruned when they fall below the level
- Input system tracks both held keys and just-pressed for jump buffering

## Current Status
- Game is fully playable with 3 complete levels
- Backend API routes and database are scaffolded but not implemented
- Audio starts muted by default
- No tests yet
- No high score persistence yet
