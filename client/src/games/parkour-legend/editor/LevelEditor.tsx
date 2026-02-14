import { useRef, useEffect, useCallback, useState } from "react";
import type { LevelConfig } from "../game/engine/types";
import { renderEditor, type EditorSelection, type GhostPreview } from "./editorRenderer";
import { hitTest } from "./editorHitTest";
import EditorToolbar, { type EditorTool } from "./EditorToolbar";
import { useCustomLevels } from "../stores/useCustomLevels";
import { useView } from "../stores/useView";
import { useGame } from "../stores/useGame";
import { wogId } from "../wog-parkour";

const CANVAS_W = 480;
const CANVAS_H = 640;
const SNAP = 10;

const DEFAULT_CONFIG: LevelConfig = {
  name: "My Level",
  height: 2000,
  shaftLeft: 40,
  shaftRight: 440,
  playerStart: { x: 228, y: 1900 },
  flag: { x: 210, y: 120 },
  platforms: [
    { x: 40, y: 1950, w: 400, kind: "static" },
    { x: 100, y: 180, w: 280, kind: "static" },
  ],
  swings: [],
  spawners: [],
};

export default function LevelEditor() {
  const editingId = useView((s) => s.editingLevelId);
  const customLevels = useCustomLevels();

  // Load existing level or create default
  const [config, setConfig] = useState<LevelConfig>(() => {
    if (editingId) {
      const existing = customLevels.get(editingId);
      if (existing) return structuredClone(existing.config);
    }
    return structuredClone(DEFAULT_CONFIG);
  });

  const [levelId, setLevelId] = useState<string | null>(editingId);
  const [tool, setTool] = useState<EditorTool>("select");
  const [selection, setSelection] = useState<EditorSelection | null>(null);
  const [gridSnap, setGridSnap] = useState(true);
  const [scrollY, setScrollY] = useState(() => config.playerStart.y - CANVAS_H * 0.7);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<{
    type: string;
    index: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const ghostRef = useRef<GhostPreview | null>(null);

  const snap = useCallback(
    (v: number) => (gridSnap ? Math.round(v / SNAP) * SNAP : v),
    [gridSnap],
  );

  // Render loop
  useEffect(() => {
    let raf = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          renderEditor(ctx, config, CANVAS_W, CANVAS_H, scrollY, selection, ghostRef.current);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [config, scrollY, selection]);

  // World coords from mouse event
  const toWorld = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { wx: 0, wy: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;
      const wx = (e.clientX - rect.left) * scaleX;
      const wy = (e.clientY - rect.top) * scaleY + scrollY;
      return { wx, wy };
    },
    [scrollY],
  );

  // ── Mouse handlers ──

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { wx, wy } = toWorld(e);
      const snappedX = snap(wx);
      const snappedY = snap(wy);

      if (tool !== "select") {
        // Place entity
        const newConfig = { ...config };

        switch (tool) {
          case "platform": {
            const platforms = [...config.platforms];
            platforms.push({
              x: snap(wx - 50),
              y: snappedY,
              w: 100,
              kind: "static",
            });
            newConfig.platforms = platforms;
            setConfig(newConfig);
            setSelection({ type: "platform", index: platforms.length - 1 });
            setTool("select");
            break;
          }
          case "swing": {
            const swings = [...config.swings];
            swings.push({
              anchorX: snappedX,
              anchorY: snappedY,
              length: 80,
            });
            newConfig.swings = swings;
            setConfig(newConfig);
            setSelection({ type: "swing", index: swings.length - 1 });
            setTool("select");
            break;
          }
          case "spawner": {
            const spawners = [...config.spawners];
            spawners.push({
              x: snappedX,
              y: snappedY,
              kind: "barrel",
              interval: 3,
              velX: 60,
              velY: 50,
            });
            newConfig.spawners = spawners;
            setConfig(newConfig);
            setSelection({ type: "spawner", index: spawners.length - 1 });
            setTool("select");
            break;
          }
          case "playerStart": {
            setConfig({
              ...config,
              playerStart: { x: snap(wx - 12), y: snap(wy - 16) },
            });
            setSelection({ type: "playerStart", index: 0 });
            setTool("select");
            break;
          }
          case "flag": {
            setConfig({
              ...config,
              flag: { x: snappedX, y: snappedY },
            });
            setSelection({ type: "flag", index: 0 });
            setTool("select");
            break;
          }
        }
        ghostRef.current = null;
        return;
      }

      // Select tool — hit test
      const hit = hitTest(wx, wy, config);
      if (hit) {
        setSelection(hit);

        // Compute drag offset
        let entityX = 0;
        let entityY = 0;
        if (hit.type === "platform") {
          const p = config.platforms[hit.index];
          entityX = p.x;
          entityY = p.y;
        } else if (hit.type === "swing") {
          const s = config.swings[hit.index];
          entityX = s.anchorX;
          entityY = s.anchorY;
        } else if (hit.type === "spawner") {
          const s = config.spawners[hit.index];
          entityX = s.x;
          entityY = s.y;
        } else if (hit.type === "playerStart") {
          entityX = config.playerStart.x;
          entityY = config.playerStart.y;
        } else if (hit.type === "flag") {
          entityX = config.flag.x;
          entityY = config.flag.y;
        }

        dragging.current = {
          type: hit.type,
          index: hit.index,
          offsetX: wx - entityX,
          offsetY: wy - entityY,
        };
      } else {
        setSelection(null);
        dragging.current = null;
      }
    },
    [tool, config, toWorld, snap],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { wx, wy } = toWorld(e);

      // Ghost preview for placement tools
      if (tool !== "select") {
        ghostRef.current = { tool, x: snap(wx), y: snap(wy) };
      } else {
        ghostRef.current = null;
      }

      // Dragging
      if (dragging.current && tool === "select") {
        const d = dragging.current;
        const newX = snap(wx - d.offsetX);
        const newY = snap(wy - d.offsetY);
        const newConfig = { ...config };

        if (d.type === "platform") {
          const platforms = [...config.platforms];
          platforms[d.index] = { ...platforms[d.index], x: newX, y: newY };
          newConfig.platforms = platforms;
        } else if (d.type === "swing") {
          const swings = [...config.swings];
          swings[d.index] = { ...swings[d.index], anchorX: newX, anchorY: newY };
          newConfig.swings = swings;
        } else if (d.type === "spawner") {
          const spawners = [...config.spawners];
          spawners[d.index] = { ...spawners[d.index], x: newX, y: newY };
          newConfig.spawners = spawners;
        } else if (d.type === "playerStart") {
          newConfig.playerStart = { x: newX, y: newY };
        } else if (d.type === "flag") {
          newConfig.flag = { x: newX, y: newY };
        }

        setConfig(newConfig);
      }
    },
    [tool, config, toWorld, snap],
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  // Wheel scroll
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      setScrollY((prev) => {
        const next = prev + e.deltaY;
        return Math.max(-200, Math.min(config.height - CANVAS_H + 200, next));
      });
    },
    [config.height],
  );

  // Keyboard: delete selected entity
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selection) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete playerStart or flag, they're required
        if (selection.type === "playerStart" || selection.type === "flag") return;

        const newConfig = { ...config };
        if (selection.type === "platform") {
          newConfig.platforms = config.platforms.filter((_, i) => i !== selection.index);
        } else if (selection.type === "swing") {
          newConfig.swings = config.swings.filter((_, i) => i !== selection.index);
        } else if (selection.type === "spawner") {
          newConfig.spawners = config.spawners.filter((_, i) => i !== selection.index);
        }
        setConfig(newConfig);
        setSelection(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selection, config]);

  // ── Actions ──

  const handleSave = useCallback(() => {
    const id = customLevels.save(config, levelId ?? undefined);
    setLevelId(id);
  }, [config, levelId, customLevels]);

  const handleTestPlay = useCallback(() => {
    // Save first
    const id = customLevels.save(config, levelId ?? undefined);
    setLevelId(id);
    // Set custom level and start game
    useGame.getState().setCustomLevel(config);
    useGame.setState({ phase: "ready", level: 0, score: 0, lives: 3 });
    useView.setState({ mode: "custom-play" });
  }, [config, levelId, customLevels]);

  const handleBack = useCallback(() => {
    useView.getState().backToMenu();
  }, []);

  return (
    <div data-wog-id={wogId("LE", 1)} style={{ display: "flex", height: "100%", width: "100%", maxWidth: 680 }}>
      <div data-wog-id={wogId("LE", 2)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <canvas
          data-wog-id={wogId("LE", 3)}
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
            cursor: tool === "select" ? "default" : "crosshair",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
      <EditorToolbar
        config={config}
        tool={tool}
        setTool={setTool}
        selection={selection}
        gridSnap={gridSnap}
        setGridSnap={setGridSnap}
        onUpdateConfig={setConfig}
        onSave={handleSave}
        onTestPlay={handleTestPlay}
        onBack={handleBack}
      />
    </div>
  );
}
