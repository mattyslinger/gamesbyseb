import type { GameState, LevelConfig } from "../engine/types";
import { createCamera } from "../engine/camera";
import { createPlayer } from "../entities/player";
import { createPlatform } from "../entities/platform";
import { createSwing } from "../entities/swing";
import { createSpawner } from "../entities/obstacle";
import { createFlag } from "../entities/flag";

export function loadLevel(cfg: LevelConfig): GameState {
  return {
    player: createPlayer(cfg.playerStart.x, cfg.playerStart.y),
    platforms: cfg.platforms.map(createPlatform),
    swings: cfg.swings.map(createSwing),
    obstacles: [],
    spawners: cfg.spawners.map(createSpawner),
    flag: createFlag(cfg.flag.x, cfg.flag.y),
    camera: createCamera(),
    shaftLeft: cfg.shaftLeft,
    shaftRight: cfg.shaftRight,
    levelHeight: cfg.height,
    time: 0,
  };
}
