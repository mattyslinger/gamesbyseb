import type { LevelConfig } from "../game/engine/types";

export type EditorEntityType =
  | "platform"
  | "swing"
  | "spawner"
  | "playerStart"
  | "flag";

export interface HitResult {
  type: EditorEntityType;
  index: number; // index in the config array, or 0 for playerStart/flag
}

const PLATFORM_H = 12;
const SWING_BOB_RADIUS = 8;
const SPAWNER_RADIUS = 14;
const PLAYER_W = 24;
const PLAYER_H = 32;
const FLAG_W = 28;
const FLAG_H = 40;
const HIT_MARGIN = 6;

export function hitTest(
  worldX: number,
  worldY: number,
  config: LevelConfig,
): HitResult | null {
  // Check flag
  const f = config.flag;
  if (
    worldX >= f.x - HIT_MARGIN &&
    worldX <= f.x + FLAG_W + HIT_MARGIN &&
    worldY >= f.y - HIT_MARGIN &&
    worldY <= f.y + FLAG_H + HIT_MARGIN
  ) {
    return { type: "flag", index: 0 };
  }

  // Check player start
  const ps = config.playerStart;
  if (
    worldX >= ps.x - HIT_MARGIN &&
    worldX <= ps.x + PLAYER_W + HIT_MARGIN &&
    worldY >= ps.y - HIT_MARGIN &&
    worldY <= ps.y + PLAYER_H + HIT_MARGIN
  ) {
    return { type: "playerStart", index: 0 };
  }

  // Check spawners (circle hit test)
  for (let i = config.spawners.length - 1; i >= 0; i--) {
    const s = config.spawners[i];
    const dx = worldX - s.x;
    const dy = worldY - s.y;
    if (dx * dx + dy * dy <= (SPAWNER_RADIUS + HIT_MARGIN) ** 2) {
      return { type: "spawner", index: i };
    }
  }

  // Check swings (hit the anchor point)
  for (let i = config.swings.length - 1; i >= 0; i--) {
    const s = config.swings[i];
    const dx = worldX - s.anchorX;
    const dy = worldY - s.anchorY;
    if (dx * dx + dy * dy <= (SWING_BOB_RADIUS + HIT_MARGIN + 8) ** 2) {
      return { type: "swing", index: i };
    }
  }

  // Check platforms (top-to-bottom, last drawn = first checked)
  for (let i = config.platforms.length - 1; i >= 0; i--) {
    const p = config.platforms[i];
    if (
      worldX >= p.x - HIT_MARGIN &&
      worldX <= p.x + p.w + HIT_MARGIN &&
      worldY >= p.y - HIT_MARGIN &&
      worldY <= p.y + PLATFORM_H + HIT_MARGIN
    ) {
      return { type: "platform", index: i };
    }
  }

  return null;
}
