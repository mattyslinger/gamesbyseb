import type { Camera, Player } from "./types";

const LERP_SPEED = 4;          // higher = snappier tracking
const PLAYER_SCREEN_RATIO = 0.7; // keep player in lower 70 %

export function createCamera(): Camera {
  return { y: 0, targetY: 0 };
}

/**
 * Update camera to track the player vertically.
 * Camera.y is the world-y that corresponds to the TOP of the viewport.
 * We want the player to sit around 70 % from the top.
 */
export function updateCamera(cam: Camera, player: Player, canvasH: number, dt: number) {
  // desired camera top so that player center is at PLAYER_SCREEN_RATIO of screen
  const playerCenterY = player.pos.y + player.h / 2;
  cam.targetY = playerCenterY - canvasH * PLAYER_SCREEN_RATIO;

  // smooth lerp
  cam.y += (cam.targetY - cam.y) * LERP_SPEED * dt;
}

/** Convert world Y → screen Y */
export function worldToScreen(worldY: number, cam: Camera): number {
  return worldY - cam.y;
}
