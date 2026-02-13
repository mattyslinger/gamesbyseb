import "@fontsource/inter";
import GameCanvas from "./game/GameCanvas";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import { useEffect, useRef } from "react";
import { LEVELS } from "./game/levels/levelData";

function App() {
  const phase = useGame((s) => s.phase);
  const level = useGame((s) => s.level);
  const score = useGame((s) => s.score);
  const lives = useGame((s) => s.lives);
  const start = useGame((s) => s.start);
  const restart = useGame((s) => s.restart);
  const isMuted = useAudio((s) => s.isMuted);
  const toggleMute = useAudio((s) => s.toggleMute);

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

  const levelName = LEVELS[Math.min(level, LEVELS.length - 1)]?.name ?? "";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0d0d1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
      }}
    >
      {/* HUD bar */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        <span>LVL {level + 1}: {levelName}</span>
        <span>SCORE {score}</span>
        <span>{"♥".repeat(lives)}{"♡".repeat(Math.max(0, 3 - lives))}</span>
      </div>

      {/* Canvas wrapper */}
      <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
        <GameCanvas />

        {/* Overlays */}
        {phase === "ready" && (
          <Overlay>
            <h1 style={{ fontSize: 32, margin: 0 }}>Platform Climber</h1>
            <p style={{ opacity: 0.7, marginTop: 8 }}>
              Arrow keys / WASD to move — Space to jump
            </p>
            <button onClick={start} style={btnStyle}>
              Start Game
            </button>
          </Overlay>
        )}

        {phase === "ended" && (
          <Overlay>
            <h1 style={{ fontSize: 28, margin: 0, color: "#ff4444" }}>Game Over</h1>
            <p style={{ opacity: 0.8 }}>Score: {score}</p>
            <button onClick={restart} style={btnStyle}>
              Try Again
            </button>
          </Overlay>
        )}

        {phase === "won" && (
          <Overlay>
            <h1 style={{ fontSize: 28, margin: 0, color: "#44ff88" }}>You Win!</h1>
            <p style={{ opacity: 0.8 }}>Final Score: {score}</p>
            <button onClick={restart} style={btnStyle}>
              Play Again
            </button>
          </Overlay>
        )}
      </div>

      {/* Mute button */}
      <button
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
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div
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

export default App;
