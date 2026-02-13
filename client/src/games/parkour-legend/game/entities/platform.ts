import type { Platform, PlatformConfig } from "../engine/types";

export const PLATFORM_H = 12;

export function createPlatform(cfg: PlatformConfig): Platform {
  return {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: PLATFORM_H,
    kind: cfg.kind,
    axis: cfg.axis,
    range: cfg.range,
    speed: cfg.speed,
    originX: cfg.x,
    originY: cfg.y,
    phase: 0,
  };
}

export function updatePlatforms(platforms: Platform[], dt: number) {
  for (const p of platforms) {
    if (p.kind !== "moving" || !p.axis || !p.range || !p.speed) continue;
    p.phase = (p.phase ?? 0) + p.speed * dt;
    const offset = Math.sin(p.phase) * (p.range / 2);
    if (p.axis === "x") {
      p.x = (p.originX ?? p.x) + offset;
    } else {
      p.y = (p.originY ?? p.y) + offset;
    }
  }
}
