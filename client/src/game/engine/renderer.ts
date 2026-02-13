import type { GameState, Camera, Platform, Swing, Obstacle, Flag, Player } from "./types";
import { worldToScreen } from "./camera";

// ── Colours ──

const COL_BG_TOP = "#0d0d1a";
const COL_BG_BOT = "#1a1a2e";
const COL_WALL = "#3a2a1a";
const COL_BRICK = "#4a3a2a";
const COL_PLATFORM = "#8B5E3C";
const COL_PLATFORM_TOP = "#A97B50";
const COL_PLAYER_BODY = "#e04040";
const COL_PLAYER_HAT = "#c02020";
const COL_PLAYER_FACE = "#ffe0b2";
const COL_BARREL = "#8B4513";
const COL_BARREL_BAND = "#5c2d0e";
const COL_FIREBALL_CORE = "#ff6600";
const COL_FIREBALL_GLOW = "#ffaa00";
const COL_FLAG_POLE = "#888";
const COL_FLAG_PENNANT = "#00cc44";
const COL_SWING_ROPE = "#ccc";
const COL_SWING_BOB = "#ddd";

// ── Main draw ──

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  canvasW: number,
  canvasH: number,
) {
  const { camera } = state;
  ctx.clearRect(0, 0, canvasW, canvasH);

  drawBackground(ctx, canvasW, canvasH, camera, state.levelHeight);
  drawWalls(ctx, state.shaftLeft, state.shaftRight, canvasW, canvasH, camera, state.levelHeight);

  for (const p of state.platforms) drawPlatform(ctx, p, camera);
  for (const s of state.swings) drawSwing(ctx, s, camera);
  for (const o of state.obstacles) drawObstacle(ctx, o, camera);
  drawFlag(ctx, state.flag, camera, state.time);
  drawPlayer(ctx, state.player, camera, state.time);
}

// ── Background ──

function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cam: Camera,
  levelH: number,
) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, COL_BG_TOP);
  grad.addColorStop(1, COL_BG_BOT);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ── Brick walls ──

function drawWalls(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  canvasW: number,
  canvasH: number,
  cam: Camera,
  levelH: number,
) {
  // left wall
  ctx.fillStyle = COL_WALL;
  ctx.fillRect(0, 0, left, canvasH);
  // right wall
  ctx.fillRect(right, 0, canvasW - right, canvasH);

  // brick pattern
  ctx.strokeStyle = COL_BRICK;
  ctx.lineWidth = 0.5;
  const brickH = 16;
  const brickW = 24;
  const offsetY = (cam.y % brickH + brickH) % brickH;

  for (let row = -1; row < canvasH / brickH + 1; row++) {
    const y = row * brickH - offsetY;
    // horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(left, y);
    ctx.moveTo(right, y);
    ctx.lineTo(canvasW, y);
    ctx.stroke();

    // vertical lines (offset every other row)
    const vOff = row % 2 === 0 ? 0 : brickW / 2;
    for (let col = 0; col < left / brickW + 1; col++) {
      const x = col * brickW + vOff;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + brickH);
      ctx.stroke();
    }
    for (let col = 0; col < (canvasW - right) / brickW + 1; col++) {
      const x = right + col * brickW + vOff;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + brickH);
      ctx.stroke();
    }
  }
}

// ── Platform ──

function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, cam: Camera) {
  const sy = worldToScreen(p.y, cam);
  ctx.fillStyle = COL_PLATFORM;
  ctx.fillRect(p.x, sy, p.w, p.h);
  // highlight top edge
  ctx.fillStyle = COL_PLATFORM_TOP;
  ctx.fillRect(p.x, sy, p.w, 3);
}

// ── Swing ──

function drawSwing(ctx: CanvasRenderingContext2D, s: Swing, cam: Camera) {
  const ax = s.anchorX;
  const ay = worldToScreen(s.anchorY, cam);
  const bx = s.anchorX + Math.sin(s.angle) * s.length;
  const by = worldToScreen(s.anchorY + Math.cos(s.angle) * s.length, cam);

  // rope
  ctx.strokeStyle = COL_SWING_ROPE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  // anchor dot
  ctx.fillStyle = "#666";
  ctx.beginPath();
  ctx.arc(ax, ay, 4, 0, Math.PI * 2);
  ctx.fill();

  // bob
  ctx.fillStyle = COL_SWING_BOB;
  ctx.beginPath();
  ctx.arc(bx, by, s.bobRadius, 0, Math.PI * 2);
  ctx.fill();
}

// ── Obstacle ──

function drawObstacle(ctx: CanvasRenderingContext2D, o: Obstacle, cam: Camera) {
  if (!o.alive) return;
  const sx = o.pos.x;
  const sy = worldToScreen(o.pos.y, cam);

  if (o.kind === "barrel") {
    // brown circle with cross bands
    ctx.fillStyle = COL_BARREL;
    ctx.beginPath();
    ctx.arc(sx, sy, o.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COL_BARREL_BAND;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - o.radius, sy);
    ctx.lineTo(sx + o.radius, sy);
    ctx.moveTo(sx, sy - o.radius);
    ctx.lineTo(sx, sy + o.radius);
    ctx.stroke();
  } else {
    // fireball — glowing orange
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, o.radius * 1.5);
    glow.addColorStop(0, COL_FIREBALL_CORE);
    glow.addColorStop(0.6, COL_FIREBALL_GLOW);
    glow.addColorStop(1, "rgba(255,100,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, o.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    // core
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(sx, sy, o.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Flag ──

function drawFlag(ctx: CanvasRenderingContext2D, f: Flag, cam: Camera, time: number) {
  const sx = f.x;
  const sy = worldToScreen(f.y, cam);

  // pole
  ctx.fillStyle = COL_FLAG_POLE;
  ctx.fillRect(sx + 2, sy, 4, f.h);

  // pennant (slight wave)
  const wave = Math.sin(time * 4) * 3;
  ctx.fillStyle = COL_FLAG_PENNANT;
  ctx.beginPath();
  ctx.moveTo(sx + 6, sy + 4);
  ctx.lineTo(sx + 6 + 18 + wave, sy + 12);
  ctx.lineTo(sx + 6, sy + 20);
  ctx.closePath();
  ctx.fill();
}

// ── Player ──

function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, cam: Camera, time: number) {
  if (p.dead) return;

  const sx = p.pos.x;
  const sy = worldToScreen(p.pos.y, cam);

  // blink when invincible
  if (p.invincibleUntil > time && Math.floor(time * 10) % 2 === 0) return;

  // body
  ctx.fillStyle = COL_PLAYER_BODY;
  ctx.fillRect(sx, sy + 8, p.w, p.h - 8);

  // face
  ctx.fillStyle = COL_PLAYER_FACE;
  ctx.fillRect(sx + 4, sy + 10, p.w - 8, 10);

  // eyes
  ctx.fillStyle = "#333";
  const eyeOffset = p.facingRight ? 4 : -4;
  ctx.fillRect(sx + 8 + eyeOffset, sy + 13, 2, 3);
  ctx.fillRect(sx + 14 + eyeOffset, sy + 13, 2, 3);

  // hat
  ctx.fillStyle = COL_PLAYER_HAT;
  ctx.fillRect(sx + 2, sy + 2, p.w - 4, 8);
  // hat brim
  ctx.fillRect(sx - 2, sy + 8, p.w + 4, 3);
}
