import type { LevelConfig } from "../game/engine/types";
import type { EditorEntityType } from "./editorHitTest";

export interface EditorSelection {
  type: EditorEntityType;
  index: number;
}

export interface GhostPreview {
  tool: string;
  x: number;
  y: number;
}

// ── Colours ──

const COL_BG_TOP = "#0d0d1a";
const COL_BG_BOT = "#1a1a2e";
const COL_WALL = "#3a2a1a";
const COL_BRICK = "#4a3a2a";
const COL_GRID = "rgba(255,255,255,0.08)";
const COL_GRID_LABEL = "rgba(255,255,255,0.3)";
const COL_BOUNDS = "rgba(255,200,0,0.4)";
const COL_PLATFORM_STATIC = "#8B5E3C";
const COL_PLATFORM_MOVING = "#4488cc";
const COL_PLATFORM_TOP = "#A97B50";
const COL_PLATFORM_MOVING_TOP = "#66aaee";
const COL_SWING_ROPE = "#ccc";
const COL_SWING_ANCHOR = "#666";
const COL_SWING_BOB = "#ddd";
const COL_BARREL = "#8B4513";
const COL_FIREBALL = "#ff6600";
const COL_PLAYER = "#e04040";
const COL_FLAG_POLE = "#888";
const COL_FLAG_PENNANT = "#00cc44";
const COL_SELECTION = "#ffdd00";
const COL_GHOST = "rgba(255,255,255,0.3)";

const PLATFORM_H = 12;

export function renderEditor(
  ctx: CanvasRenderingContext2D,
  config: LevelConfig,
  canvasW: number,
  canvasH: number,
  scrollY: number,
  selection: EditorSelection | null,
  ghost: GhostPreview | null,
) {
  ctx.clearRect(0, 0, canvasW, canvasH);

  // 1. Background gradient + walls + bricks
  drawBackground(ctx, canvasW, canvasH);
  drawWalls(ctx, config.shaftLeft, config.shaftRight, canvasW, canvasH, scrollY);

  // 2. Grid lines
  drawGrid(ctx, config, canvasW, canvasH, scrollY);

  // 3. Level bounds
  drawBounds(ctx, config, canvasW, canvasH, scrollY);

  // 4. Platforms
  for (let i = 0; i < config.platforms.length; i++) {
    const p = config.platforms[i];
    const selected =
      selection?.type === "platform" && selection.index === i;
    drawPlatform(ctx, p, scrollY, selected);
  }

  // 5. Swings
  for (let i = 0; i < config.swings.length; i++) {
    const s = config.swings[i];
    const selected = selection?.type === "swing" && selection.index === i;
    drawSwing(ctx, s, scrollY, selected);
  }

  // 6. Spawners
  for (let i = 0; i < config.spawners.length; i++) {
    const s = config.spawners[i];
    const selected =
      selection?.type === "spawner" && selection.index === i;
    drawSpawner(ctx, s, scrollY, selected);
  }

  // 7. Player start
  drawPlayerStart(
    ctx,
    config.playerStart,
    scrollY,
    selection?.type === "playerStart",
  );

  // 8. Flag
  drawFlag(
    ctx,
    config.flag,
    scrollY,
    selection?.type === "flag",
  );

  // 9. Ghost preview
  if (ghost) {
    drawGhost(ctx, ghost, scrollY);
  }
}

function worldToScreen(worldY: number, scrollY: number): number {
  return worldY - scrollY;
}

// ── Background ──

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, COL_BG_TOP);
  grad.addColorStop(1, COL_BG_BOT);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

// ── Walls ──

function drawWalls(
  ctx: CanvasRenderingContext2D,
  left: number,
  right: number,
  canvasW: number,
  canvasH: number,
  scrollY: number,
) {
  ctx.fillStyle = COL_WALL;
  ctx.fillRect(0, 0, left, canvasH);
  ctx.fillRect(right, 0, canvasW - right, canvasH);

  ctx.strokeStyle = COL_BRICK;
  ctx.lineWidth = 0.5;
  const brickH = 16;
  const brickW = 24;
  const offsetY = ((scrollY % brickH) + brickH) % brickH;

  for (let row = -1; row < canvasH / brickH + 1; row++) {
    const y = row * brickH - offsetY;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(left, y);
    ctx.moveTo(right, y);
    ctx.lineTo(canvasW, y);
    ctx.stroke();

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

// ── Grid ──

function drawGrid(
  ctx: CanvasRenderingContext2D,
  config: LevelConfig,
  canvasW: number,
  canvasH: number,
  scrollY: number,
) {
  const step = 100;
  const startY = Math.floor(scrollY / step) * step;
  const endY = scrollY + canvasH;

  ctx.strokeStyle = COL_GRID;
  ctx.lineWidth = 1;
  ctx.font = "10px monospace";
  ctx.fillStyle = COL_GRID_LABEL;

  for (let wy = startY; wy <= endY; wy += step) {
    const sy = worldToScreen(wy, scrollY);
    ctx.beginPath();
    ctx.moveTo(config.shaftLeft, sy);
    ctx.lineTo(config.shaftRight, sy);
    ctx.stroke();
    ctx.fillText(`${wy}`, config.shaftLeft + 4, sy - 2);
  }
}

// ── Bounds ──

function drawBounds(
  ctx: CanvasRenderingContext2D,
  config: LevelConfig,
  _canvasW: number,
  canvasH: number,
  scrollY: number,
) {
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = COL_BOUNDS;
  ctx.lineWidth = 2;

  // Top bound (y=0)
  const topSy = worldToScreen(0, scrollY);
  if (topSy >= -10 && topSy <= canvasH + 10) {
    ctx.beginPath();
    ctx.moveTo(config.shaftLeft, topSy);
    ctx.lineTo(config.shaftRight, topSy);
    ctx.stroke();
  }

  // Bottom bound (y=height)
  const botSy = worldToScreen(config.height, scrollY);
  if (botSy >= -10 && botSy <= canvasH + 10) {
    ctx.beginPath();
    ctx.moveTo(config.shaftLeft, botSy);
    ctx.lineTo(config.shaftRight, botSy);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

// ── Platform ──

function drawPlatform(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number; w: number; kind: string; axis?: string; range?: number },
  scrollY: number,
  selected: boolean,
) {
  const sy = worldToScreen(p.y, scrollY);
  const isMoving = p.kind === "moving";

  ctx.fillStyle = isMoving ? COL_PLATFORM_MOVING : COL_PLATFORM_STATIC;
  ctx.fillRect(p.x, sy, p.w, PLATFORM_H);
  ctx.fillStyle = isMoving ? COL_PLATFORM_MOVING_TOP : COL_PLATFORM_TOP;
  ctx.fillRect(p.x, sy, p.w, 3);

  // Moving platform range arrow
  if (isMoving && p.range) {
    ctx.strokeStyle = COL_PLATFORM_MOVING;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    const cx = p.x + p.w / 2;
    const cy = sy + PLATFORM_H / 2;
    if (p.axis === "x") {
      ctx.beginPath();
      ctx.moveTo(cx - p.range / 2, cy);
      ctx.lineTo(cx + p.range / 2, cy);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx, cy - p.range / 2);
      ctx.lineTo(cx, cy + p.range / 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);
  }

  if (selected) drawSelectionRect(ctx, p.x, sy, p.w, PLATFORM_H);
}

// ── Swing ──

function drawSwing(
  ctx: CanvasRenderingContext2D,
  s: { anchorX: number; anchorY: number; length: number },
  scrollY: number,
  selected: boolean,
) {
  const ax = s.anchorX;
  const ay = worldToScreen(s.anchorY, scrollY);
  const bx = ax;
  const by = ay + s.length;

  // Rope
  ctx.strokeStyle = COL_SWING_ROPE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  // Anchor
  ctx.fillStyle = COL_SWING_ANCHOR;
  ctx.beginPath();
  ctx.arc(ax, ay, 5, 0, Math.PI * 2);
  ctx.fill();

  // Bob
  ctx.fillStyle = COL_SWING_BOB;
  ctx.beginPath();
  ctx.arc(bx, by, 8, 0, Math.PI * 2);
  ctx.fill();

  if (selected) {
    drawSelectionRect(ctx, ax - 10, ay - 5, 20, s.length + 18);
  }
}

// ── Spawner ──

function drawSpawner(
  ctx: CanvasRenderingContext2D,
  s: { x: number; y: number; kind: string; velX: number; velY: number },
  scrollY: number,
  selected: boolean,
) {
  const sx = s.x;
  const sy = worldToScreen(s.y, scrollY);
  const r = 14;

  if (s.kind === "barrel") {
    ctx.fillStyle = COL_BARREL;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5c2d0e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - r, sy);
    ctx.lineTo(sx + r, sy);
    ctx.moveTo(sx, sy - r);
    ctx.lineTo(sx, sy + r);
    ctx.stroke();
  } else {
    ctx.fillStyle = COL_FIREBALL;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffaa00";
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Velocity arrow
  if (s.velX !== 0 || s.velY !== 0) {
    const len = Math.min(Math.sqrt(s.velX * s.velX + s.velY * s.velY) * 0.5, 40);
    const angle = Math.atan2(s.velY, s.velX);
    const ex = sx + Math.cos(angle) * len;
    const ey = sy + Math.sin(angle) * len;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    // Arrowhead
    const aLen = 6;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(
      ex - Math.cos(angle - 0.4) * aLen,
      ey - Math.sin(angle - 0.4) * aLen,
    );
    ctx.moveTo(ex, ey);
    ctx.lineTo(
      ex - Math.cos(angle + 0.4) * aLen,
      ey - Math.sin(angle + 0.4) * aLen,
    );
    ctx.stroke();
  }

  if (selected) drawSelectionRect(ctx, sx - r - 2, sy - r - 2, r * 2 + 4, r * 2 + 4);
}

// ── Player start ──

function drawPlayerStart(
  ctx: CanvasRenderingContext2D,
  ps: { x: number; y: number },
  scrollY: number,
  selected: boolean,
) {
  const sx = ps.x;
  const sy = worldToScreen(ps.y, scrollY);
  const w = 24;
  const h = 32;

  ctx.strokeStyle = COL_PLAYER;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 3]);
  ctx.strokeRect(sx, sy, w, h);
  ctx.setLineDash([]);

  // Label
  ctx.fillStyle = COL_PLAYER;
  ctx.font = "bold 9px monospace";
  ctx.fillText("START", sx, sy - 4);

  if (selected) drawSelectionRect(ctx, sx, sy, w, h);
}

// ── Flag ──

function drawFlag(
  ctx: CanvasRenderingContext2D,
  f: { x: number; y: number },
  scrollY: number,
  selected: boolean,
) {
  const sx = f.x;
  const sy = worldToScreen(f.y, scrollY);
  const w = 28;
  const h = 40;

  // Pole
  ctx.fillStyle = COL_FLAG_POLE;
  ctx.fillRect(sx + 2, sy, 4, h);

  // Pennant
  ctx.fillStyle = COL_FLAG_PENNANT;
  ctx.beginPath();
  ctx.moveTo(sx + 6, sy + 4);
  ctx.lineTo(sx + 24, sy + 12);
  ctx.lineTo(sx + 6, sy + 20);
  ctx.closePath();
  ctx.fill();

  // Label
  ctx.fillStyle = COL_FLAG_PENNANT;
  ctx.font = "bold 9px monospace";
  ctx.fillText("FLAG", sx, sy - 4);

  if (selected) drawSelectionRect(ctx, sx, sy, w, h);
}

// ── Ghost preview ──

function drawGhost(
  ctx: CanvasRenderingContext2D,
  ghost: GhostPreview,
  scrollY: number,
) {
  const sy = worldToScreen(ghost.y, scrollY);
  ctx.globalAlpha = 0.4;

  switch (ghost.tool) {
    case "platform":
      ctx.fillStyle = COL_PLATFORM_STATIC;
      ctx.fillRect(ghost.x - 50, sy, 100, PLATFORM_H);
      break;
    case "swing":
      ctx.strokeStyle = COL_SWING_ROPE;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ghost.x, sy);
      ctx.lineTo(ghost.x, sy + 80);
      ctx.stroke();
      ctx.fillStyle = COL_SWING_ANCHOR;
      ctx.beginPath();
      ctx.arc(ghost.x, sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = COL_SWING_BOB;
      ctx.beginPath();
      ctx.arc(ghost.x, sy + 80, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "spawner":
      ctx.fillStyle = COL_BARREL;
      ctx.beginPath();
      ctx.arc(ghost.x, sy, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "playerStart":
      ctx.strokeStyle = COL_PLAYER;
      ctx.lineWidth = 2;
      ctx.strokeRect(ghost.x - 12, sy - 16, 24, 32);
      break;
    case "flag":
      ctx.fillStyle = COL_FLAG_POLE;
      ctx.fillRect(ghost.x + 2, sy, 4, 40);
      ctx.fillStyle = COL_FLAG_PENNANT;
      ctx.beginPath();
      ctx.moveTo(ghost.x + 6, sy + 4);
      ctx.lineTo(ghost.x + 24, sy + 12);
      ctx.lineTo(ghost.x + 6, sy + 20);
      ctx.closePath();
      ctx.fill();
      break;
  }

  ctx.globalAlpha = 1;
}

// ── Selection highlight ──

function drawSelectionRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.strokeStyle = COL_SELECTION;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  ctx.strokeRect(x - 3, y - 3, w + 6, h + 6);
  ctx.setLineDash([]);
}
