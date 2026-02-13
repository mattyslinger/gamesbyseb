import type { Swing, SwingConfig } from "../engine/types";

const GRAVITY = 900;

export function createSwing(cfg: SwingConfig): Swing {
  return {
    anchorX: cfg.anchorX,
    anchorY: cfg.anchorY,
    length: cfg.length,
    angle: cfg.startAngle ?? 0.6,   // start offset so it's already swinging
    angularVel: 0,
    damping: 0.995,
    bobRadius: 10,
  };
}

/** Simple pendulum: θ'' = -(g/L)sin(θ) */
export function updateSwings(swings: Swing[], dt: number) {
  for (const s of swings) {
    const angularAccel = -(GRAVITY / s.length) * Math.sin(s.angle);
    s.angularVel += angularAccel * dt;
    s.angularVel *= s.damping;
    s.angle += s.angularVel * dt;
  }
}
