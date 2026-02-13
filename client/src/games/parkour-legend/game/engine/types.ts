// ── Core geometry ──

export interface Vec2 {
  x: number;
  y: number;
}

export interface AABB {
  x: number;      // left
  y: number;      // top
  w: number;      // width
  h: number;      // height
}

// ── Player ──

export interface Player {
  pos: Vec2;       // top-left corner
  vel: Vec2;
  w: number;
  h: number;
  onGround: boolean;
  onPlatform: Platform | null;
  onSwing: Swing | null;       // currently grabbed swing
  facingRight: boolean;
  invincibleUntil: number;     // timestamp, 0 = not invincible
  dead: boolean;
  jumpsLeft: number;           // 2 = can double-jump (resets on landing)
}

// ── Platforms ──

export type PlatformKind = "static" | "moving";

export interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: PlatformKind;
  // moving-platform fields
  axis?: "x" | "y";
  range?: number;       // total pixels of travel
  speed?: number;       // px/s
  originX?: number;     // starting x
  originY?: number;     // starting y
  phase?: number;       // current oscillation phase (radians)
}

// ── Swings ──

export interface Swing {
  anchorX: number;       // ceiling attach point
  anchorY: number;
  length: number;        // rope length in px
  angle: number;         // current angle (radians, 0 = straight down)
  angularVel: number;    // rad/s
  damping: number;       // friction coefficient
  bobRadius: number;     // radius of the grab-able bob
}

// ── Obstacles ──

export type ObstacleKind = "barrel" | "fireball";

export interface Obstacle {
  pos: Vec2;
  vel: Vec2;
  radius: number;
  kind: ObstacleKind;
  alive: boolean;
}

export interface ObstacleSpawner {
  x: number;
  y: number;
  kind: ObstacleKind;
  interval: number;      // seconds between spawns
  timer: number;         // seconds until next spawn
  velX: number;
  velY: number;
}

// ── Flag ──

export interface Flag {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ── Camera ──

export interface Camera {
  y: number;             // world-y offset (positive = scrolled up)
  targetY: number;
}

// ── Level config (static data) ──

export interface LevelConfig {
  name: string;
  height: number;               // total shaft height in px
  shaftLeft: number;            // left wall x
  shaftRight: number;           // right wall x
  platforms: PlatformConfig[];
  swings: SwingConfig[];
  spawners: SpawnerConfig[];
  flag: { x: number; y: number };
  playerStart: { x: number; y: number };
}

export interface PlatformConfig {
  x: number;
  y: number;
  w: number;
  kind: PlatformKind;
  axis?: "x" | "y";
  range?: number;
  speed?: number;
}

export interface SwingConfig {
  anchorX: number;
  anchorY: number;
  length: number;
  startAngle?: number;
}

export interface SpawnerConfig {
  x: number;
  y: number;
  kind: ObstacleKind;
  interval: number;
  velX: number;
  velY: number;
}

// ── Live game state (held in a ref) ──

export interface GameState {
  player: Player;
  platforms: Platform[];
  swings: Swing[];
  obstacles: Obstacle[];
  spawners: ObstacleSpawner[];
  flag: Flag;
  camera: Camera;
  shaftLeft: number;
  shaftRight: number;
  levelHeight: number;
  time: number;          // elapsed seconds
}
