import type { Flag, Player } from "../engine/types";
import { aabbOverlap } from "../engine/physics";

export const FLAG_W = 20;
export const FLAG_H = 48;

export function createFlag(x: number, y: number): Flag {
  return { x, y, w: FLAG_W, h: FLAG_H };
}

export function checkFlagReached(flag: Flag, player: Player): boolean {
  return aabbOverlap(
    { x: player.pos.x, y: player.pos.y, w: player.w, h: player.h },
    { x: flag.x, y: flag.y, w: flag.w, h: flag.h },
  );
}
