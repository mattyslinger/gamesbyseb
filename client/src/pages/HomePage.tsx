import { Link } from "wouter";
import { GAMES } from "../games/registry";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d1a",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Game Arcade
        </h1>
        <p
          style={{
            textAlign: "center",
            opacity: 0.6,
            marginBottom: 48,
            fontSize: 16,
          }}
        >
          Pick a game and start playing
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {GAMES.map((game) => (
            <Link key={game.slug} href={game.path} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#1a1a2e",
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    background: "linear-gradient(135deg, #2a1a3e 0%, #1a2a4e 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 48,
                  }}
                >
                  🏃
                </div>

                {/* Info */}
                <div style={{ padding: "16px 20px" }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#fff" }}>
                    {game.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      opacity: 0.6,
                      margin: "8px 0 12px",
                      lineHeight: 1.5,
                      color: "#fff",
                    }}
                  >
                    {game.description}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 999,
                          background: "rgba(224,64,64,0.15)",
                          color: "#e04040",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
