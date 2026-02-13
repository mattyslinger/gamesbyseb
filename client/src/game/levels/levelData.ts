import type { LevelConfig } from "../engine/types";

const SHAFT_LEFT = 40;
const SHAFT_RIGHT = 440;
const SHAFT_W = SHAFT_RIGHT - SHAFT_LEFT;

// helper: spread platforms in a zig-zag pattern
function zigzag(
  startY: number,
  count: number,
  stepY: number,
  platW: number,
): { x: number; y: number; w: number }[] {
  const out: { x: number; y: number; w: number }[] = [];
  let left = true;
  for (let i = 0; i < count; i++) {
    const x = left
      ? SHAFT_LEFT + 10
      : SHAFT_RIGHT - platW - 10;
    out.push({ x, y: startY - i * stepY, w: platW });
    left = !left;
  }
  return out;
}

// ─── Level 1: "The Basics" ────────────────────────────────────────

const level1: LevelConfig = {
  name: "The Basics",
  height: 2000,
  shaftLeft: SHAFT_LEFT,
  shaftRight: SHAFT_RIGHT,
  playerStart: { x: SHAFT_LEFT + SHAFT_W / 2 - 12, y: 1900 },
  flag: { x: SHAFT_LEFT + SHAFT_W / 2 - 10, y: 120 },
  platforms: [
    // ground
    { x: SHAFT_LEFT, y: 1950, w: SHAFT_W, kind: "static" as const },
    // zig-zag upward
    ...zigzag(1800, 14, 120, 100).map((p) => ({
      ...p,
      kind: "static" as const,
    })),
    // landing near the flag
    { x: SHAFT_LEFT + 60, y: 180, w: 280, kind: "static" as const },
  ],
  swings: [],
  spawners: [],
};

// ─── Level 2: "Barrel Roll" ───────────────────────────────────────

const level2: LevelConfig = {
  name: "Barrel Roll",
  height: 3000,
  shaftLeft: SHAFT_LEFT,
  shaftRight: SHAFT_RIGHT,
  playerStart: { x: SHAFT_LEFT + SHAFT_W / 2 - 12, y: 2900 },
  flag: { x: SHAFT_LEFT + SHAFT_W / 2 - 10, y: 120 },
  platforms: [
    // ground
    { x: SHAFT_LEFT, y: 2950, w: SHAFT_W, kind: "static" as const },
    // lower section — static zig-zag
    ...zigzag(2750, 8, 130, 100).map((p) => ({
      ...p,
      kind: "static" as const,
    })),
    // middle section — mix of static and moving
    { x: SHAFT_LEFT + 30, y: 1680, w: 120, kind: "static" as const },
    {
      x: SHAFT_LEFT + 200,
      y: 1520,
      w: 100,
      kind: "moving" as const,
      axis: "x" as const,
      range: 140,
      speed: 2,
    },
    { x: SHAFT_RIGHT - 140, y: 1360, w: 110, kind: "static" as const },
    {
      x: SHAFT_LEFT + 60,
      y: 1200,
      w: 100,
      kind: "moving" as const,
      axis: "x" as const,
      range: 160,
      speed: 2.5,
    },
    { x: SHAFT_RIGHT - 160, y: 1040, w: 120, kind: "static" as const },
    { x: SHAFT_LEFT + 20, y: 880, w: 110, kind: "static" as const },
    {
      x: SHAFT_LEFT + 180,
      y: 720,
      w: 100,
      kind: "moving" as const,
      axis: "y" as const,
      range: 80,
      speed: 2,
    },
    { x: SHAFT_RIGHT - 130, y: 560, w: 110, kind: "static" as const },
    { x: SHAFT_LEFT + 40, y: 400, w: 100, kind: "static" as const },
    // top landing
    { x: SHAFT_LEFT + 60, y: 180, w: 280, kind: "static" as const },
  ],
  swings: [{ anchorX: SHAFT_LEFT + SHAFT_W / 2, anchorY: 650, length: 80 }],
  spawners: [
    { x: SHAFT_LEFT + 100, y: 400, kind: "barrel", interval: 3.5, velX: 60, velY: 50 },
    { x: SHAFT_RIGHT - 100, y: 1000, kind: "barrel", interval: 4, velX: -50, velY: 40 },
  ],
};

// ─── Level 3: "Inferno" ──────────────────────────────────────────

const level3: LevelConfig = {
  name: "Inferno",
  height: 4000,
  shaftLeft: SHAFT_LEFT,
  shaftRight: SHAFT_RIGHT,
  playerStart: { x: SHAFT_LEFT + SHAFT_W / 2 - 12, y: 3900 },
  flag: { x: SHAFT_LEFT + SHAFT_W / 2 - 10, y: 120 },
  platforms: [
    // ground
    { x: SHAFT_LEFT, y: 3950, w: SHAFT_W, kind: "static" as const },
    // dense zig-zag with smaller platforms
    ...zigzag(3750, 10, 120, 90).map((p) => ({
      ...p,
      kind: "static" as const,
    })),
    // mid section — more moving platforms
    {
      x: SHAFT_LEFT + 40,
      y: 2550,
      w: 90,
      kind: "moving" as const,
      axis: "x" as const,
      range: 180,
      speed: 3,
    },
    { x: SHAFT_RIGHT - 130, y: 2400, w: 100, kind: "static" as const },
    {
      x: SHAFT_LEFT + 100,
      y: 2250,
      w: 80,
      kind: "moving" as const,
      axis: "y" as const,
      range: 60,
      speed: 2.5,
    },
    { x: SHAFT_RIGHT - 140, y: 2100, w: 110, kind: "static" as const },
    { x: SHAFT_LEFT + 20, y: 1950, w: 100, kind: "static" as const },
    {
      x: SHAFT_LEFT + 180,
      y: 1800,
      w: 90,
      kind: "moving" as const,
      axis: "x" as const,
      range: 140,
      speed: 3.5,
    },
    { x: SHAFT_RIGHT - 120, y: 1650, w: 100, kind: "static" as const },
    { x: SHAFT_LEFT + 30, y: 1500, w: 100, kind: "static" as const },
    {
      x: SHAFT_LEFT + 200,
      y: 1350,
      w: 80,
      kind: "moving" as const,
      axis: "x" as const,
      range: 120,
      speed: 3,
    },
    { x: SHAFT_RIGHT - 130, y: 1200, w: 100, kind: "static" as const },
    { x: SHAFT_LEFT + 50, y: 1050, w: 90, kind: "static" as const },
    {
      x: SHAFT_LEFT + 160,
      y: 900,
      w: 90,
      kind: "moving" as const,
      axis: "y" as const,
      range: 70,
      speed: 2.5,
    },
    { x: SHAFT_RIGHT - 140, y: 750, w: 110, kind: "static" as const },
    { x: SHAFT_LEFT + 30, y: 600, w: 100, kind: "static" as const },
    { x: SHAFT_RIGHT - 120, y: 450, w: 100, kind: "static" as const },
    { x: SHAFT_LEFT + 50, y: 300, w: 100, kind: "static" as const },
    // top landing
    { x: SHAFT_LEFT + 60, y: 180, w: 280, kind: "static" as const },
  ],
  swings: [
    { anchorX: SHAFT_LEFT + SHAFT_W / 2, anchorY: 1400, length: 90, startAngle: 0.7 },
    { anchorX: SHAFT_LEFT + SHAFT_W / 2 - 40, anchorY: 800, length: 80, startAngle: -0.5 },
  ],
  spawners: [
    { x: SHAFT_LEFT + 80, y: 500, kind: "fireball", interval: 2.5, velX: 80, velY: 30 },
    { x: SHAFT_RIGHT - 80, y: 1100, kind: "barrel", interval: 2.8, velX: -60, velY: 50 },
    { x: SHAFT_LEFT + 120, y: 1800, kind: "fireball", interval: 3, velX: 70, velY: 40 },
    { x: SHAFT_RIGHT - 100, y: 2500, kind: "barrel", interval: 3.2, velX: -50, velY: 60 },
  ],
};

export const LEVELS: LevelConfig[] = [level1, level2, level3];
