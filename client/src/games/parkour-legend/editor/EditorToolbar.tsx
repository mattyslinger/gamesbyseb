import type { LevelConfig, PlatformConfig, SwingConfig, SpawnerConfig } from "../game/engine/types";
import type { EditorSelection } from "./editorRenderer";
import { wogId } from "../wog-parkour";

export type EditorTool =
  | "select"
  | "platform"
  | "swing"
  | "spawner"
  | "playerStart"
  | "flag";

interface EditorToolbarProps {
  config: LevelConfig;
  tool: EditorTool;
  setTool: (t: EditorTool) => void;
  selection: EditorSelection | null;
  gridSnap: boolean;
  setGridSnap: (v: boolean) => void;
  onUpdateConfig: (cfg: LevelConfig) => void;
  onSave: () => void;
  onTestPlay: () => void;
  onBack: () => void;
}

const tools: { id: EditorTool; label: string }[] = [
  { id: "select", label: "Select" },
  { id: "platform", label: "Platform" },
  { id: "swing", label: "Swing" },
  { id: "spawner", label: "Spawner" },
  { id: "playerStart", label: "Player" },
  { id: "flag", label: "Flag" },
];

export default function EditorToolbar({
  config,
  tool,
  setTool,
  selection,
  gridSnap,
  setGridSnap,
  onUpdateConfig,
  onSave,
  onTestPlay,
  onBack,
}: EditorToolbarProps) {
  return (
    <div data-wog-id={wogId("ET", 1)} style={panelStyle}>
      {/* Level settings */}
      <Section title="Level" wogId={wogId("ET", 2)}>
        <Field label="Name" wogId={wogId("ET", 3)}>
          <input
            data-wog-id={wogId("ET", 4)}
            type="text"
            value={config.name}
            onChange={(e) =>
              onUpdateConfig({ ...config, name: e.target.value })
            }
            style={inputStyle}
          />
        </Field>
        <Field label="Height" wogId={wogId("ET", 5)}>
          <input
            data-wog-id={wogId("ET", 6)}
            type="number"
            value={config.height}
            min={1000}
            max={6000}
            step={100}
            onChange={(e) =>
              onUpdateConfig({
                ...config,
                height: Math.max(1000, Math.min(6000, Number(e.target.value))),
              })
            }
            style={{ ...inputStyle, width: 70 }}
          />
        </Field>
        <label data-wog-id={wogId("ET", 7)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#ccc" }}>
          <input
            data-wog-id={wogId("ET", 8)}
            type="checkbox"
            checked={gridSnap}
            onChange={(e) => setGridSnap(e.target.checked)}
          />
          Grid snap (10px)
        </label>
      </Section>

      {/* Tools */}
      <Section title="Tools" wogId={wogId("ET", 9)}>
        <div data-wog-id={wogId("ET", 10)} style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tools.map((t, i) => (
            <button
              key={t.id}
              data-wog-id={wogId("ET", 11, String.fromCharCode(97 + i))}
              onClick={() => setTool(t.id)}
              style={{
                ...toolBtnStyle,
                background: tool === t.id ? "#e04040" : "rgba(255,255,255,0.1)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Properties panel */}
      {selection && (
        <Section title="Properties" wogId={wogId("ET", 12)}>
          <PropertiesPanel
            config={config}
            selection={selection}
            onUpdateConfig={onUpdateConfig}
          />
        </Section>
      )}

      {/* Actions */}
      <div data-wog-id={wogId("ET", 30)} style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: "auto" }}>
        <button data-wog-id={wogId("ET", 31)} onClick={onSave} style={actionBtnStyle}>
          Save
        </button>
        <button data-wog-id={wogId("ET", 32)} onClick={onTestPlay} style={{ ...actionBtnStyle, background: "#44aa44" }}>
          Test Play
        </button>
        <button data-wog-id={wogId("ET", 33)} onClick={onBack} style={{ ...actionBtnStyle, background: "#666" }}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

function PropertiesPanel({
  config,
  selection,
  onUpdateConfig,
}: {
  config: LevelConfig;
  selection: EditorSelection;
  onUpdateConfig: (cfg: LevelConfig) => void;
}) {
  if (selection.type === "platform") {
    const p = config.platforms[selection.index];
    if (!p) return null;
    const update = (patch: Partial<PlatformConfig>) => {
      const platforms = [...config.platforms];
      platforms[selection.index] = { ...p, ...patch };
      onUpdateConfig({ ...config, platforms });
    };
    return (
      <>
        <Field label="X" wogId={wogId("ET", 13)}>
          <NumInput wogId={wogId("ET", 14)} value={p.x} onChange={(v) => update({ x: v })} />
        </Field>
        <Field label="Y" wogId={wogId("ET", 15)}>
          <NumInput wogId={wogId("ET", 16)} value={p.y} onChange={(v) => update({ y: v })} />
        </Field>
        <Field label="Width" wogId={wogId("ET", 17)}>
          <NumInput wogId={wogId("ET", 18)} value={p.w} onChange={(v) => update({ w: Math.max(20, v) })} />
        </Field>
        <Field label="Kind" wogId={wogId("ET", 19)}>
          <select
            data-wog-id={wogId("ET", 20)}
            value={p.kind}
            onChange={(e) => {
              const kind = e.target.value as "static" | "moving";
              if (kind === "moving") {
                update({ kind, axis: p.axis ?? "x", range: p.range ?? 100, speed: p.speed ?? 2 });
              } else {
                update({ kind });
              }
            }}
            style={inputStyle}
          >
            <option value="static">Static</option>
            <option value="moving">Moving</option>
          </select>
        </Field>
        {p.kind === "moving" && (
          <>
            <Field label="Axis" wogId={wogId("ET", 21)}>
              <select
                data-wog-id={wogId("ET", 22)}
                value={p.axis ?? "x"}
                onChange={(e) => update({ axis: e.target.value as "x" | "y" })}
                style={inputStyle}
              >
                <option value="x">X</option>
                <option value="y">Y</option>
              </select>
            </Field>
            <Field label="Range" wogId={wogId("ET", 23)}>
              <NumInput wogId={wogId("ET", 24)} value={p.range ?? 100} onChange={(v) => update({ range: v })} />
            </Field>
            <Field label="Speed" wogId={wogId("ET", 25)}>
              <NumInput wogId={wogId("ET", 26)} value={p.speed ?? 2} onChange={(v) => update({ speed: v })} step={0.5} />
            </Field>
          </>
        )}
      </>
    );
  }

  if (selection.type === "swing") {
    const s = config.swings[selection.index];
    if (!s) return null;
    const update = (patch: Partial<SwingConfig>) => {
      const swings = [...config.swings];
      swings[selection.index] = { ...s, ...patch };
      onUpdateConfig({ ...config, swings });
    };
    return (
      <>
        <Field label="AnchorX" wogId={wogId("ET", 13)}>
          <NumInput wogId={wogId("ET", 14)} value={s.anchorX} onChange={(v) => update({ anchorX: v })} />
        </Field>
        <Field label="AnchorY" wogId={wogId("ET", 15)}>
          <NumInput wogId={wogId("ET", 16)} value={s.anchorY} onChange={(v) => update({ anchorY: v })} />
        </Field>
        <Field label="Length" wogId={wogId("ET", 17)}>
          <NumInput wogId={wogId("ET", 18)} value={s.length} onChange={(v) => update({ length: Math.max(20, v) })} />
        </Field>
        <Field label="Start Angle" wogId={wogId("ET", 19)}>
          <NumInput
            wogId={wogId("ET", 20)}
            value={s.startAngle ?? 0}
            onChange={(v) => update({ startAngle: v })}
            step={0.1}
          />
        </Field>
      </>
    );
  }

  if (selection.type === "spawner") {
    const s = config.spawners[selection.index];
    if (!s) return null;
    const update = (patch: Partial<SpawnerConfig>) => {
      const spawners = [...config.spawners];
      spawners[selection.index] = { ...s, ...patch };
      onUpdateConfig({ ...config, spawners });
    };
    return (
      <>
        <Field label="X" wogId={wogId("ET", 13)}>
          <NumInput wogId={wogId("ET", 14)} value={s.x} onChange={(v) => update({ x: v })} />
        </Field>
        <Field label="Y" wogId={wogId("ET", 15)}>
          <NumInput wogId={wogId("ET", 16)} value={s.y} onChange={(v) => update({ y: v })} />
        </Field>
        <Field label="Kind" wogId={wogId("ET", 17)}>
          <select
            data-wog-id={wogId("ET", 18)}
            value={s.kind}
            onChange={(e) => update({ kind: e.target.value as "barrel" | "fireball" })}
            style={inputStyle}
          >
            <option value="barrel">Barrel</option>
            <option value="fireball">Fireball</option>
          </select>
        </Field>
        <Field label="Interval" wogId={wogId("ET", 19)}>
          <NumInput wogId={wogId("ET", 20)} value={s.interval} onChange={(v) => update({ interval: Math.max(0.5, v) })} step={0.5} />
        </Field>
        <Field label="VelX" wogId={wogId("ET", 21)}>
          <NumInput wogId={wogId("ET", 22)} value={s.velX} onChange={(v) => update({ velX: v })} />
        </Field>
        <Field label="VelY" wogId={wogId("ET", 23)}>
          <NumInput wogId={wogId("ET", 24)} value={s.velY} onChange={(v) => update({ velY: v })} />
        </Field>
      </>
    );
  }

  if (selection.type === "playerStart") {
    const ps = config.playerStart;
    return (
      <>
        <Field label="X" wogId={wogId("ET", 13)}>
          <NumInput
            wogId={wogId("ET", 14)}
            value={ps.x}
            onChange={(v) => onUpdateConfig({ ...config, playerStart: { ...ps, x: v } })}
          />
        </Field>
        <Field label="Y" wogId={wogId("ET", 15)}>
          <NumInput
            wogId={wogId("ET", 16)}
            value={ps.y}
            onChange={(v) => onUpdateConfig({ ...config, playerStart: { ...ps, y: v } })}
          />
        </Field>
      </>
    );
  }

  if (selection.type === "flag") {
    const f = config.flag;
    return (
      <>
        <Field label="X" wogId={wogId("ET", 13)}>
          <NumInput
            wogId={wogId("ET", 14)}
            value={f.x}
            onChange={(v) => onUpdateConfig({ ...config, flag: { ...f, x: v } })}
          />
        </Field>
        <Field label="Y" wogId={wogId("ET", 15)}>
          <NumInput
            wogId={wogId("ET", 16)}
            value={f.y}
            onChange={(v) => onUpdateConfig({ ...config, flag: { ...f, y: v } })}
          />
        </Field>
      </>
    );
  }

  return null;
}

// ── Shared UI components ──

function Section({ title, children, wogId: id }: { title: string; children: React.ReactNode; wogId: string }) {
  return (
    <div data-wog-id={id} style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "#aaa",
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );
}

function Field({ label, children, wogId: id }: { label: string; children: React.ReactNode; wogId: string }) {
  return (
    <div data-wog-id={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontSize: 12, color: "#ccc", minWidth: 50 }}>{label}</span>
      {children}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  step = 1,
  wogId: id,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  wogId: string;
}) {
  return (
    <input
      data-wog-id={id}
      type="number"
      value={value}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ ...inputStyle, width: 70 }}
    />
  );
}

// ── Styles ──

const panelStyle: React.CSSProperties = {
  width: 200,
  padding: 12,
  background: "rgba(0,0,0,0.85)",
  borderLeft: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  fontFamily: "Inter, sans-serif",
  color: "#fff",
};

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: 4,
  padding: "3px 6px",
  color: "#fff",
  fontSize: 12,
  flex: 1,
};

const toolBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  fontSize: 11,
  fontWeight: 600,
  border: "none",
  borderRadius: 4,
  color: "#fff",
  cursor: "pointer",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 600,
  border: "none",
  borderRadius: 6,
  background: "#e04040",
  color: "#fff",
  cursor: "pointer",
};
