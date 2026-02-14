import "@fontsource/inter";
import GameCanvas from "./game/GameCanvas";
import { useGame } from "./stores/useGame";
import { useAudio } from "./stores/useAudio";
import { useView } from "./stores/useView";
import { useEffect, useRef } from "react";
import { LEVELS } from "./game/levels/levelData";
import { Link } from "wouter";
import LevelMenu from "./components/LevelMenu";
import LevelEditor from "./editor/LevelEditor";
import { wogId } from "./wog-parkour";

function ParkourLegend() {
  const mode = useView((s) => s.mode);
  const phase = useGame((s) => s.phase);
  const level = useGame((s) => s.level);
  const score = useGame((s) => s.score);
  const lives = useGame((s) => s.lives);
  const customLevel = useGame((s) => s.customLevel);
  const start = useGame((s) => s.start);
  const restart = useGame((s) => s.restart);
  const isMuted = useAudio((s) => s.isMuted);
  const toggleMute = useAudio((s) => s.toggleMute);

  const isCustomPlay = mode === "custom-play";

  // Initialise audio elements once
  const audioInit = useRef(false);
  useEffect(() => {
    if (audioInit.current) return;
    audioInit.current = true;
    const hit = new Audio("/sounds/hit.mp3");
    const success = new Audio("/sounds/success.mp3");
    hit.preload = "auto";
    success.preload = "auto";
    useAudio.getState().setHitSound(hit);
    useAudio.getState().setSuccessSound(success);
  }, []);

  const backToMenu = () => {
    useGame.setState({ phase: "ready", level: 0, score: 0, lives: 3, customLevel: null });
    useView.getState().backToMenu();
  };

  const levelName = customLevel
    ? customLevel.name
    : (LEVELS[Math.min(level, LEVELS.length - 1)]?.name ?? "");

  // ── Menu view ──
  if (mode === "menu") {
    return (
      <div data-wog-id={wogId("PK", 1)} className="game-fullscreen">
        <Link
          data-wog-id={wogId("PK", 2)}
          href="/"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            color: "#fff",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            opacity: 0.7,
            zIndex: 20,
            fontFamily: "Inter, sans-serif",
          }}
        >
          &larr; Home
        </Link>
        <LevelMenu />
        <MuteButton isMuted={isMuted} toggleMute={toggleMute} />
      </div>
    );
  }

  // ── Editor view ──
  if (mode === "editor") {
    return (
      <div data-wog-id={wogId("PK", 3)} className="game-fullscreen">
        <Link
          data-wog-id={wogId("PK", 4)}
          href="/"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            color: "#fff",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            opacity: 0.7,
            zIndex: 20,
            fontFamily: "Inter, sans-serif",
          }}
        >
          &larr; Home
        </Link>
        <LevelEditor />
      </div>
    );
  }

  // ── Game view (campaign or custom-play) ──
  return (
    <div data-wog-id={wogId("PK", 5)} className="game-fullscreen">
      {/* Back link */}
      <Link
        data-wog-id={wogId("PK", 6)}
        href="/"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          color: "#fff",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 600,
          opacity: 0.7,
          zIndex: 20,
          fontFamily: "Inter, sans-serif",
        }}
      >
        &larr; Home
      </Link>

      {/* HUD bar */}
      <div
        data-wog-id={wogId("PK", 7)}
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
          fontFamily: "Inter, sans-serif",
          color: "#fff",
        }}
      >
        <span data-wog-id={wogId("PK", 8)}>{isCustomPlay ? levelName : `LVL ${level + 1}: ${levelName}`}</span>
        <span data-wog-id={wogId("PK", 9)}>SCORE {score}</span>
        <span data-wog-id={wogId("PK", 10)}>{"♥".repeat(lives)}{"♡".repeat(Math.max(0, 3 - lives))}</span>
      </div>

      {/* Canvas wrapper */}
      <div data-wog-id={wogId("PK", 11)} style={{ position: "relative", width: "100%", maxWidth: 480 }}>
        <GameCanvas />

        {/* Overlays */}
        {phase === "ready" && (
          <Overlay wogId={wogId("OV", 1)}>
            <h1 data-wog-id={wogId("OV", 2)} style={{ fontSize: 32, margin: 0 }}>
              {isCustomPlay ? levelName : "Parkour Legend"}
            </h1>
            <p data-wog-id={wogId("OV", 3)} style={{ opacity: 0.7, marginTop: 8 }}>
              Arrow keys / WASD to move — Space to jump
            </p>
            <button data-wog-id={wogId("OV", 4)} onClick={start} style={btnStyle}>
              Start Game
            </button>
            {isCustomPlay && (
              <button data-wog-id={wogId("OV", 5)} onClick={backToMenu} style={{ ...btnStyle, background: "#666", marginTop: 4 }}>
                Back to Menu
              </button>
            )}
          </Overlay>
        )}

        {phase === "ended" && (
          <Overlay wogId={wogId("OV", 6)}>
            <h1 data-wog-id={wogId("OV", 7)} style={{ fontSize: 28, margin: 0, color: "#ff4444" }}>Game Over</h1>
            <p data-wog-id={wogId("OV", 8)} style={{ opacity: 0.8 }}>Score: {score}</p>
            <button data-wog-id={wogId("OV", 9)} onClick={restart} style={btnStyle}>
              Try Again
            </button>
            <button data-wog-id={wogId("OV", 10)} onClick={backToMenu} style={{ ...btnStyle, background: "#666", marginTop: 4 }}>
              Back to Menu
            </button>
          </Overlay>
        )}

        {phase === "won" && (
          <Overlay wogId={wogId("OV", 11)}>
            <h1 data-wog-id={wogId("OV", 12)} style={{ fontSize: 28, margin: 0, color: "#44ff88" }}>You Win!</h1>
            <p data-wog-id={wogId("OV", 13)} style={{ opacity: 0.8 }}>Final Score: {score}</p>
            {!isCustomPlay && (
              <button data-wog-id={wogId("OV", 14)} onClick={restart} style={btnStyle}>
                Play Again
              </button>
            )}
            <button data-wog-id={wogId("OV", 15)} onClick={backToMenu} style={{ ...btnStyle, background: isCustomPlay ? "#e04040" : "#666", marginTop: 4 }}>
              Back to Menu
            </button>
          </Overlay>
        )}
      </div>

      {/* Mute button */}
      <MuteButton isMuted={isMuted} toggleMute={toggleMute} />
    </div>
  );
}

function Overlay({ children, wogId: id }: { children: React.ReactNode; wogId: string }) {
  return (
    <div
      data-wog-id={id}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}

function MuteButton({ isMuted, toggleMute }: { isMuted: boolean; toggleMute: () => void }) {
  return (
    <button
      data-wog-id={wogId("PK", 12)}
      onClick={toggleMute}
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        background: "rgba(255,255,255,0.1)",
        border: "none",
        color: "#fff",
        fontSize: 20,
        cursor: "pointer",
        borderRadius: 8,
        padding: "6px 10px",
      }}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}

const btnStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "10px 32px",
  fontSize: 16,
  fontWeight: 600,
  border: "none",
  borderRadius: 8,
  background: "#e04040",
  color: "#fff",
  cursor: "pointer",
};

export default ParkourLegend;
