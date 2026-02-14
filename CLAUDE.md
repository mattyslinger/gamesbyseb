# Seb's Arcade — Project Guide

## About
This is **Seb's Arcade** — a personal game portfolio for Sebby (age 9). It's his CV of games that he and his dad develop together over the coming years. The homepage is styled as a fun, child-friendly retro arcade with a cartoon 80's arcade machine. As new games are built, they get added to `client/src/games/registry.ts` and automatically appear as tiles on the homepage.

## Project Overview
A multi-game arcade site built as a Vite + React SPA served by an Express backend. The first game is **Parkour Legend** — a 2D vertical-scrolling platformer where the player climbs upward through a shaft, jumping between platforms, grabbing swings, and dodging obstacles to reach a flag.

## Stack
- **Frontend**: React 18, TypeScript, Vite, Zustand (state), Wouter (routing), Canvas 2D (rendering)
- **Backend**: Express 5, TypeScript, tsx
- **Styling**: Tailwind CSS, inline styles for game UI
- **Dev**: `npm run dev` starts Express with Vite middleware (HMR)

## Project Structure
```
client/src/
  router.tsx                          — "/" → HomePage, "/games/parkour-legend" → game
  pages/
    HomePage.tsx                      — "Seb's Arcade" homepage with retro arcade styling
    not-found.tsx                     — 404 page
  games/
    registry.ts                       — Game config (title, description, tile appearance)
  games/parkour-legend/
    ParkourLegend.tsx                 — Root component: routes between menu/editor/game views
    wog-parkour.ts                    — Project-specific wog-id prefixes (PK, LM, GC, LE, ET, OV)
    game/
      GameCanvas.tsx                  — Core game loop (rAF), physics, collision, rendering
      engine/
        types.ts                      — All game types (Player, Platform, Swing, Obstacle, LevelConfig, GameState)
        input.ts, physics.ts, camera.ts, renderer.ts
      entities/
        player.ts, platform.ts, swing.ts, obstacle.ts, flag.ts
      levels/
        levelData.ts                  — Built-in campaign levels
        levelLoader.ts                — Converts LevelConfig → GameState
    stores/
      useGame.tsx                     — Game state (phase, level, score, lives, customLevel)
      useAudio.tsx                    — Audio controls
      useView.tsx                     — View routing (menu/campaign/custom-play/editor)
      useCustomLevels.tsx             — Persisted custom levels (localStorage)
    components/
      LevelMenu.tsx                   — Campaign + custom level selection screen
    editor/
      LevelEditor.tsx                 — Visual level editor with canvas + toolbar
      EditorToolbar.tsx               — Tool buttons, properties panel, save/test/back actions
      editorRenderer.ts               — Canvas rendering for editor (grid, entities, selection, ghosts)
      editorHitTest.ts                — Click-to-select entity detection
server/
  index.ts, routes.ts, vite.ts, static.ts
wog-id.ts                            — Core WallOfGreen element ID system
```

## WOG-ID System
Every UI element gets a `data-wog-id` attribute for deterministic element referencing.
- Core system: `/wog-id.ts` — `wogId("PK", 1)` → `"PK-001"`, `wog("PK", 1)` → `{ "data-wog-id": "PK-001" }`
- Parkour-specific: `client/src/games/parkour-legend/wog-parkour.ts`
- Dynamic list items use letter suffixes: `wogId("LM", 6, "a")` → `"LM-006a"`

### WOG-ID Map
**HM — HomePage** (`HomePage.tsx`)
- HM-001: Page wrapper | HM-002: Content container | HM-003: Title | HM-004: Subtitle
- HM-005: Game grid
- HM-006{a-z}: Game links | HM-007{a-z}: Game cards | HM-008{a-z}: Thumbnails | HM-009{a-z}: Info sections
- HM-010{a-z}: Game titles | HM-011{a-z}: Descriptions | HM-012{a-z}: Tag containers | HM-013{aa-zz}: Tags
- HM-014{a-z}: Thumbnail+Info wrapper
- HM-015: Arcade cabinet SVG | HM-016: Bio paragraph | HM-017: "My Games" section header | HM-018: Footer

**NF — Not Found** (`not-found.tsx`)
- NF-001: Page wrapper | NF-002: Card | NF-003: Card content | NF-004: Icon row | NF-005: Heading | NF-006: Description

**PK — ParkourLegend root** (`ParkourLegend.tsx`)
- PK-001: Menu view wrapper
- PK-002: Home link (menu)
- PK-003: Editor view wrapper
- PK-004: Home link (editor)
- PK-005: Game view wrapper
- PK-006: Home link (game)
- PK-007: HUD bar
- PK-008: Level name span
- PK-009: Score span
- PK-010: Lives span
- PK-011: Canvas wrapper
- PK-012: Mute button

**OV — Overlays** (`ParkourLegend.tsx`)
- OV-001: Ready overlay | OV-002: Ready title | OV-003: Instructions | OV-004: Start Game btn | OV-005: Back to Menu btn (ready)
- OV-006: Ended overlay | OV-007: Game Over title | OV-008: Score | OV-009: Try Again btn | OV-010: Back to Menu btn (ended)
- OV-011: Won overlay | OV-012: You Win title | OV-013: Final Score | OV-014: Play Again btn | OV-015: Back to Menu btn (won)

**LM — Level Menu** (`LevelMenu.tsx`)
- LM-001: Container | LM-002: Title | LM-003: Subtitle
- LM-004: Campaign section header | LM-005: Campaign list
- LM-006{a-z}: Campaign level rows | LM-007{a-z}: Campaign level names | LM-008{a-z}: Campaign play buttons
- LM-020: Custom section header | LM-021: Custom list | LM-022: Empty state message
- LM-023{a-z}: Custom level rows | LM-024{a-z}: Custom level names
- LM-025{a-z}: Custom play btns | LM-026{a-z}: Custom edit btns | LM-027{a-z}: Custom delete btns
- LM-030: Create Level button

**GC — Game Canvas** (`GameCanvas.tsx`)
- GC-001: Game canvas element

**LE — Level Editor** (`LevelEditor.tsx`)
- LE-001: Editor wrapper | LE-002: Canvas column | LE-003: Editor canvas

**ET — Editor Toolbar** (`EditorToolbar.tsx`)
- ET-001: Toolbar panel
- ET-002: Level section | ET-003: Name field | ET-004: Name input | ET-005: Height field | ET-006: Height input | ET-007: Grid snap label | ET-008: Grid snap checkbox
- ET-009: Tools section | ET-010: Tools grid | ET-011{a-f}: Tool buttons (select/platform/swing/spawner/player/flag)
- ET-012: Properties section | ET-013–026: Property fields/inputs (reused per selection type)
- ET-030: Actions container | ET-031: Save btn | ET-032: Test Play btn | ET-033: Back to Menu btn

## Key Patterns
- **Game loop**: `requestAnimationFrame` in `GameCanvas.tsx`, capped at 30fps delta to avoid tunnelling
- **State**: Zustand stores with `subscribeWithSelector` middleware; game state is in refs for the render loop, React state for UI
- **Custom levels**: Persisted to localStorage via Zustand `persist` middleware
- **Canvas**: 480x640 fixed resolution, scaled via CSS `aspect-ratio`
- **Coordinate system**: Y increases downward; player climbs from high Y (bottom) to low Y (top)
- **Views**: Controlled by `useView.mode`: menu → campaign/custom-play/editor

## Game Entities
- **Platforms**: static or moving (oscillate on x/y axis)
- **Swings**: pendulum physics, player grabs/releases with input
- **Spawners**: emit barrels or fireballs at intervals
- **Flag**: level goal (touching it wins/advances)
- **Player**: 24x32px, double-jump, invincibility frames on hit, 3 lives

## Commands
- `npm run dev` — Start dev server with HMR
- `npm run build` — Build for production
- `npm run check` — TypeScript type check
