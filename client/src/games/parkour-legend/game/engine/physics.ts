import type { Player, Platform, AABB } from "./types";
import { resetJumps } from "../entities/player";

export const GRAVITY = 900;          // px/s²
export const TERMINAL_VEL = 600;     // px/s

/** Apply gravity to player velocity */
export function applyGravity(player: Player, dt: number) {
  player.vel.y += GRAVITY * dt;
  if (player.vel.y > TERMINAL_VEL) player.vel.y = TERMINAL_VEL;
}

/** Move player by velocity × dt, then clamp to shaft walls */
export function movePlayer(player: Player, dt: number, shaftLeft: number, shaftRight: number) {
  player.pos.x += player.vel.x * dt;
  player.pos.y += player.vel.y * dt;

  // Clamp inside shaft
  if (player.pos.x < shaftLeft) {
    player.pos.x = shaftLeft;
    player.vel.x = 0;
  }
  if (player.pos.x + player.w > shaftRight) {
    player.pos.x = shaftRight - player.w;
    player.vel.x = 0;
  }
}

/** AABB overlap test */
export function aabbOverlap(a: AABB, b: AABB): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/**
 * One-way platform resolution.
 * Player only lands if:
 *   - falling (vel.y >= 0)
 *   - player bottom was above (or at) platform top last frame
 *   - player bottom is now below platform top
 */
export function resolveOneWayPlatforms(player: Player, platforms: Platform[], dt: number) {
  player.onGround = false;
  player.onPlatform = null;

  const feet = player.pos.y + player.h;
  const prevFeet = feet - player.vel.y * dt;

  for (const plat of platforms) {
    // Horizontal overlap check
    if (player.pos.x + player.w <= plat.x || player.pos.x >= plat.x + plat.w) continue;

    // One-way: only resolve when falling onto top surface
    if (player.vel.y >= 0 && prevFeet <= plat.y + 2 && feet >= plat.y) {
      player.pos.y = plat.y - player.h;
      player.vel.y = 0;
      player.onGround = true;
      player.onPlatform = plat;
      resetJumps(player);
      break;
    }
  }
}

/** Check if player fell below the level */
export function checkFellOff(player: Player, levelHeight: number): boolean {
  return player.pos.y > levelHeight + 100;
}

/** Circle-vs-AABB overlap for obstacle collision */
export function circleAABBOverlap(cx: number, cy: number, r: number, box: AABB): boolean {
  const closestX = Math.max(box.x, Math.min(cx, box.x + box.w));
  const closestY = Math.max(box.y, Math.min(cy, box.y + box.h));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < r * r;
}
