import { useRef, useEffect, useCallback } from "react";
import type { GameState, Platform } from "./engine/types";
import { initInput, teardownInput, flushInput } from "./engine/input";
import { applyGravity, movePlayer, resolveOneWayPlatforms, checkFellOff } from "./engine/physics";
import { updateCamera } from "./engine/camera";
import { render } from "./engine/renderer";
import { updatePlayerInput, syncPlayerToSwing, createPlayer } from "./entities/player";
import { updatePlatforms } from "./entities/platform";
import { updateSwings } from "./entities/swing";
import {
  updateSpawners,
  updateObstacles,
  pruneObstacles,
  checkObstacleHit,
} from "./entities/obstacle";
import { checkFlagReached } from "./entities/flag";
import { LEVELS } from "./levels/levelData";
import { loadLevel } from "./levels/levelLoader";
import { useGame } from "../lib/stores/useGame";
import { useAudio } from "../lib/stores/useAudio";

const CANVAS_W = 480;
const CANVAS_H = 640;
const MAX_DT = 1 / 30; // cap delta to avoid tunnelling

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const levelRef = useRef(useGame.getState().level);

  // Load a level into the state ref
  const loadCurrentLevel = useCallback(() => {
    const lvl = useGame.getState().level;
    levelRef.current = lvl;
    const cfg = LEVELS[Math.min(lvl, LEVELS.length - 1)];
    stateRef.current = loadLevel(cfg);
    // snap camera
    if (stateRef.current) {
      stateRef.current.camera.y = cfg.playerStart.y - CANVAS_H * 0.7;
      stateRef.current.camera.targetY = stateRef.current.camera.y;
    }
  }, []);

  // Respawn player at level start
  const respawnPlayer = useCallback(() => {
    const gs = stateRef.current;
    if (!gs) return;
    const cfg = LEVELS[Math.min(levelRef.current, LEVELS.length - 1)];
    gs.player = createPlayer(cfg.playerStart.x, cfg.playerStart.y);
    gs.obstacles = [];
    // reset spawner timers
    for (const s of gs.spawners) {
      s.timer = s.interval * 0.5;
    }
  }, []);

  // Core game loop tick
  const tick = useCallback(
    (timestamp: number) => {
      rafRef.current = requestAnimationFrame(tick);

      const phase = useGame.getState().phase;
      if (phase !== "playing") {
        lastTimeRef.current = timestamp;
        // still render the scene in ready/ended state
        const gs = stateRef.current;
        const canvas = canvasRef.current;
        if (gs && canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) render(ctx, gs, CANVAS_W, CANVAS_H);
        }
        flushInput();
        return;
      }

      const gs = stateRef.current;
      if (!gs) {
        lastTimeRef.current = timestamp;
        flushInput();
        return;
      }

      let dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      if (dt > MAX_DT) dt = MAX_DT;
      gs.time += dt;

      // ── Update ──

      // Input (also handles swing grab/release)
      updatePlayerInput(gs.player, gs.swings);

      // Swings
      updateSwings(gs.swings, dt);

      // Player on swing?
      if (gs.player.onSwing) {
        syncPlayerToSwing(gs.player);
      } else {
        // Physics (only when not on swing)
        if (!gs.player.onSwing) {
          // Save positions of moving platforms before update
          const prevPositions = new Map<Platform, { x: number; y: number }>();
          for (const plat of gs.platforms) {
            if (plat.kind === "moving") {
              prevPositions.set(plat, { x: plat.x, y: plat.y });
            }
          }

          // Update all platforms
          updatePlatforms(gs.platforms, dt);

          // Carry player with moving platform
          if (gs.player.onPlatform && gs.player.onPlatform.kind === "moving") {
            const prev = prevPositions.get(gs.player.onPlatform);
            if (prev) {
              gs.player.pos.x += gs.player.onPlatform.x - prev.x;
              gs.player.pos.y += gs.player.onPlatform.y - prev.y;
            }
          }

          applyGravity(gs.player, dt);
          movePlayer(gs.player, dt, gs.shaftLeft, gs.shaftRight);
          resolveOneWayPlatforms(gs.player, gs.platforms, dt);
        }
      }

      // Obstacles
      updateSpawners(gs.spawners, gs.obstacles, dt);
      updateObstacles(gs.obstacles, dt, gs.shaftLeft, gs.shaftRight, gs.levelHeight);
      gs.obstacles = pruneObstacles(gs.obstacles);

      // ── Collision checks ──

      // Obstacle hit
      if (checkObstacleHit(gs.obstacles, gs.player, gs.time)) {
        useAudio.getState().playHit();
        const alive = useGame.getState().loseLife();
        if (alive) {
          gs.player.invincibleUntil = gs.time + 2;
          respawnPlayer();
        } else {
          gs.player.dead = true;
          useGame.getState().end();
        }
      }

      // Fell off bottom
      if (checkFellOff(gs.player, gs.levelHeight)) {
        useAudio.getState().playHit();
        const alive = useGame.getState().loseLife();
        if (alive) {
          respawnPlayer();
        } else {
          gs.player.dead = true;
          useGame.getState().end();
        }
      }

      // Flag reached
      if (checkFlagReached(gs.flag, gs.player)) {
        useAudio.getState().playSuccess();
        useGame.getState().addScore(1000);
        const nextLvl = levelRef.current + 1;
        if (nextLvl >= LEVELS.length) {
          // won the game!
          useGame.setState({ phase: "won" });
        } else {
          useGame.getState().nextLevel();
          loadCurrentLevel();
        }
      }

      // ── Render ──
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          updateCamera(gs.camera, gs.player, CANVAS_H, dt);
          render(ctx, gs, CANVAS_W, CANVAS_H);
        }
      }

      flushInput();
    },
    [loadCurrentLevel, respawnPlayer],
  );

  // Mount / unmount
  useEffect(() => {
    initInput();
    loadCurrentLevel();
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      teardownInput();
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick, loadCurrentLevel]);

  // React to store level changes (e.g. restart)
  useEffect(() => {
    const unsub = useGame.subscribe(
      (s) => s.level,
      () => {
        // only reload if level actually changed
        if (useGame.getState().level !== levelRef.current) {
          loadCurrentLevel();
        }
      },
    );
    return unsub;
  }, [loadCurrentLevel]);

  // React to restart
  useEffect(() => {
    const unsub = useGame.subscribe(
      (s) => s.phase,
      (phase) => {
        if (phase === "ready") {
          loadCurrentLevel();
        }
      },
    );
    return unsub;
  }, [loadCurrentLevel]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        display: "block",
        imageRendering: "pixelated",
        width: "100%",
        maxWidth: CANVAS_W,
        height: "auto",
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
      }}
    />
  );
}
