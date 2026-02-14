import { LEVELS } from "../game/levels/levelData";
import { useCustomLevels } from "../stores/useCustomLevels";
import { useView } from "../stores/useView";
import { useGame } from "../stores/useGame";
import { wogId } from "../wog-parkour";

export default function LevelMenu() {
  const customLevels = useCustomLevels((s) => s.levels);
  const removeLevel = useCustomLevels((s) => s.remove);

  const startCampaign = (levelIndex: number) => {
    useGame.setState({ phase: "ready", level: levelIndex, score: 0, lives: 3, customLevel: null });
    useView.setState({ mode: "campaign" });
  };

  const playCustom = (id: string) => {
    const lvl = useCustomLevels.getState().get(id);
    if (!lvl) return;
    useGame.getState().setCustomLevel(lvl.config);
    useGame.setState({ phase: "ready", level: 0, score: 0, lives: 3 });
    useView.setState({ mode: "custom-play" });
  };

  const editCustom = (id: string) => {
    useView.getState().openEditor(id);
  };

  const deleteCustom = (id: string) => {
    removeLevel(id);
  };

  const createNew = () => {
    useView.getState().openEditor();
  };

  return (
    <div data-wog-id={wogId("LM", 1)} style={containerStyle}>
      <h1 data-wog-id={wogId("LM", 2)} style={{ fontSize: 36, margin: 0, color: "#e04040", fontFamily: "Inter, sans-serif" }}>
        Parkour Legend
      </h1>
      <p data-wog-id={wogId("LM", 3)} style={{ opacity: 0.6, marginTop: 4, fontSize: 14, fontFamily: "Inter, sans-serif" }}>
        Select a level to play or create your own
      </p>

      {/* Campaign levels */}
      <SectionHeader wogId={wogId("LM", 4)}>Campaign</SectionHeader>
      <div data-wog-id={wogId("LM", 5)} style={listStyle}>
        {LEVELS.map((lvl, i) => (
          <div key={i} data-wog-id={wogId("LM", 6, String.fromCharCode(97 + i))} style={levelRowStyle}>
            <div>
              <div data-wog-id={wogId("LM", 7, String.fromCharCode(97 + i))} style={{ fontWeight: 600, fontSize: 14 }}>
                Level {i + 1}: {lvl.name}
              </div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>
                Height: {lvl.height} | {lvl.platforms.length} platforms
              </div>
            </div>
            <button data-wog-id={wogId("LM", 8, String.fromCharCode(97 + i))} onClick={() => startCampaign(i)} style={playBtnStyle}>
              Play
            </button>
          </div>
        ))}
      </div>

      {/* Custom levels */}
      <SectionHeader wogId={wogId("LM", 20)}>Your Levels</SectionHeader>
      <div data-wog-id={wogId("LM", 21)} style={listStyle}>
        {customLevels.length === 0 && (
          <div data-wog-id={wogId("LM", 22)} style={{ fontSize: 13, opacity: 0.4, padding: "8px 0" }}>
            No custom levels yet. Create one below!
          </div>
        )}
        {customLevels.map((lvl, i) => (
          <div key={lvl.id} data-wog-id={wogId("LM", 23, String.fromCharCode(97 + i))} style={levelRowStyle}>
            <div style={{ flex: 1 }}>
              <div data-wog-id={wogId("LM", 24, String.fromCharCode(97 + i))} style={{ fontWeight: 600, fontSize: 14 }}>
                {lvl.config.name}
              </div>
              <div style={{ fontSize: 11, opacity: 0.5 }}>
                Height: {lvl.config.height} | {lvl.config.platforms.length} platforms
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button data-wog-id={wogId("LM", 25, String.fromCharCode(97 + i))} onClick={() => playCustom(lvl.id)} style={playBtnStyle}>
                Play
              </button>
              <button data-wog-id={wogId("LM", 26, String.fromCharCode(97 + i))} onClick={() => editCustom(lvl.id)} style={editBtnStyle}>
                Edit
              </button>
              <button data-wog-id={wogId("LM", 27, String.fromCharCode(97 + i))} onClick={() => deleteCustom(lvl.id)} style={deleteBtnStyle}>
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create button */}
      <button data-wog-id={wogId("LM", 30)} onClick={createNew} style={createBtnStyle}>
        + Create Level
      </button>
    </div>
  );
}

function SectionHeader({ children, wogId: id }: { children: React.ReactNode; wogId: string }) {
  return (
    <div
      data-wog-id={id}
      style={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: "#888",
        marginTop: 24,
        marginBottom: 8,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {children}
    </div>
  );
}

// ── Styles ──

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 480,
  padding: "32px 16px",
  fontFamily: "Inter, sans-serif",
  color: "#fff",
};

const listStyle: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const levelRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 14px",
  background: "rgba(255,255,255,0.06)",
  borderRadius: 8,
};

const playBtnStyle: React.CSSProperties = {
  padding: "6px 16px",
  fontSize: 12,
  fontWeight: 600,
  border: "none",
  borderRadius: 6,
  background: "#e04040",
  color: "#fff",
  cursor: "pointer",
};

const editBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 600,
  border: "none",
  borderRadius: 6,
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  cursor: "pointer",
};

const deleteBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 600,
  border: "none",
  borderRadius: 6,
  background: "rgba(255,80,80,0.2)",
  color: "#ff6666",
  cursor: "pointer",
};

const createBtnStyle: React.CSSProperties = {
  marginTop: 20,
  padding: "12px 32px",
  fontSize: 15,
  fontWeight: 600,
  border: "2px dashed rgba(255,255,255,0.3)",
  borderRadius: 8,
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
};
