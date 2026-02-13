import type { Player, Swing } from "../engine/types";
import { leftHeld, rightHeld, jumpPressed } from "../engine/input";

export const PLAYER_W = 24;
export const PLAYER_H = 32;
const MOVE_SPEED = 200;     // px/s
const JUMP_VEL = -420;      // px/s (negative = up)
const MAX_JUMPS = 2;        // 1 = ground jump, 2 = double-jump

export function createPlayer(x: number, y: number): Player {
  return {
    pos: { x, y },
    vel: { x: 0, y: 0 },
    w: PLAYER_W,
    h: PLAYER_H,
    onGround: false,
    onPlatform: null,
    onSwing: null,
    facingRight: true,
    invincibleUntil: 0,
    dead: false,
    jumpsLeft: MAX_JUMPS,
  };
}

/**
 * Handle all player input: movement, jump/double-jump, swing grab & release.
 * Pass in the current swings array so we can check for grab in the same
 * jump-press check (avoiding double-consumption of the input).
 */
export function updatePlayerInput(player: Player, swings: Swing[]) {
  if (player.dead) return;

  // If on a swing, only listen for jump (release)
  if (player.onSwing) {
    if (jumpPressed()) {
      releaseSwing(player);
    }
    return;
  }

  // Horizontal
  player.vel.x = 0;
  if (leftHeld()) {
    player.vel.x = -MOVE_SPEED;
    player.facingRight = false;
  }
  if (rightHeld()) {
    player.vel.x = MOVE_SPEED;
    player.facingRight = true;
  }

  // Jump / double-jump / swing grab
  if (jumpPressed()) {
    if (player.jumpsLeft > 0) {
      player.vel.y = JUMP_VEL;
      player.jumpsLeft--;
      player.onGround = false;
      player.onPlatform = null;
    } else {
      // No jumps left — try to grab a nearby swing
      tryGrabSwing(player, swings);
    }
  }
}

/** Called when player lands on a platform — reset jump count */
export function resetJumps(player: Player) {
  player.jumpsLeft = MAX_JUMPS;
}

/** Attempt to grab a swing if the player is near its bob */
function tryGrabSwing(player: Player, swings: Swing[]) {
  for (const swing of swings) {
    const bobX = swing.anchorX + Math.sin(swing.angle) * swing.length;
    const bobY = swing.anchorY + Math.cos(swing.angle) * swing.length;
    const px = player.pos.x + player.w / 2;
    const py = player.pos.y + player.h / 2;
    const dist = Math.hypot(px - bobX, py - bobY);
    if (dist < swing.bobRadius + 30) {
      player.onSwing = swing;
      player.vel.x = 0;
      player.vel.y = 0;
      return;
    }
  }
}

/** While attached, sync player position to the swing bob */
export function syncPlayerToSwing(player: Player) {
  const swing = player.onSwing;
  if (!swing) return;

  const bobX = swing.anchorX + Math.sin(swing.angle) * swing.length;
  const bobY = swing.anchorY + Math.cos(swing.angle) * swing.length;
  player.pos.x = bobX - player.w / 2;
  player.pos.y = bobY;
}

function releaseSwing(player: Player) {
  const swing = player.onSwing;
  if (!swing) return;

  // launch with tangential velocity from the pendulum
  const speed = swing.angularVel * swing.length;
  player.vel.x = Math.cos(swing.angle) * speed;
  player.vel.y = -Math.abs(Math.sin(swing.angle) * speed) - 200; // always some upward boost
  player.onSwing = null;
  player.jumpsLeft = 1; // allow one more jump after releasing a swing
}
