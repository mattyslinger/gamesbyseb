import type { Obstacle, ObstacleSpawner, Player, SpawnerConfig } from "../engine/types";
import { circleAABBOverlap } from "../engine/physics";

export function createSpawner(cfg: SpawnerConfig): ObstacleSpawner {
  return {
    x: cfg.x,
    y: cfg.y,
    kind: cfg.kind,
    interval: cfg.interval,
    timer: cfg.interval * 0.5,   // first spawn after half interval
    velX: cfg.velX,
    velY: cfg.velY,
  };
}

export function updateSpawners(spawners: ObstacleSpawner[], obstacles: Obstacle[], dt: number) {
  for (const s of spawners) {
    s.timer -= dt;
    if (s.timer <= 0) {
      s.timer = s.interval;
      obstacles.push({
        pos: { x: s.x, y: s.y },
        vel: { x: s.velX, y: s.velY },
        radius: s.kind === "barrel" ? 14 : 10,
        kind: s.kind,
        alive: true,
      });
    }
  }
}

export function updateObstacles(
  obstacles: Obstacle[],
  dt: number,
  shaftLeft: number,
  shaftRight: number,
  levelHeight: number,
) {
  for (const o of obstacles) {
    if (!o.alive) continue;
    // gravity for barrels
    if (o.kind === "barrel") {
      o.vel.y += 400 * dt;
    }
    o.pos.x += o.vel.x * dt;
    o.pos.y += o.vel.y * dt;

    // bounce off shaft walls
    if (o.pos.x - o.radius < shaftLeft) {
      o.pos.x = shaftLeft + o.radius;
      o.vel.x = Math.abs(o.vel.x);
    }
    if (o.pos.x + o.radius > shaftRight) {
      o.pos.x = shaftRight - o.radius;
      o.vel.x = -Math.abs(o.vel.x);
    }

    // kill if below level
    if (o.pos.y > levelHeight + 200) {
      o.alive = false;
    }
  }
}

/** Remove dead obstacles from the array */
export function pruneObstacles(obstacles: Obstacle[]): Obstacle[] {
  return obstacles.filter((o) => o.alive);
}

/** Check obstacle-player collision; returns true if hit */
export function checkObstacleHit(obstacles: Obstacle[], player: Player, now: number): boolean {
  if (player.invincibleUntil > now) return false;

  for (const o of obstacles) {
    if (!o.alive) continue;
    if (
      circleAABBOverlap(o.pos.x, o.pos.y, o.radius, {
        x: player.pos.x,
        y: player.pos.y,
        w: player.w,
        h: player.h,
      })
    ) {
      return true;
    }
  }
  return false;
}
