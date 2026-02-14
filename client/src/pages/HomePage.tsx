import { Link } from "wouter";
import { GAMES } from "../games/registry";
import { wogId } from "../lib/wog-id";

/* Inline SVG background with playful shapes — clouds, circles, waves, splashes */
const bgSvg = `url("data:image/svg+xml,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='960' height='720' viewBox='0 0 960 720'>
  <circle cx='120' cy='80' r='140' fill='rgba(255,107,107,0.18)'/>
  <circle cx='860' cy='160' r='180' fill='rgba(78,205,196,0.15)'/>
  <circle cx='480' cy='650' r='200' fill='rgba(255,195,0,0.12)'/>
  <circle cx='50' cy='520' r='100' fill='rgba(155,89,182,0.14)'/>
  <circle cx='900' cy='580' r='120' fill='rgba(46,204,113,0.13)'/>
  <circle cx='200' cy='200' r='8' fill='rgba(255,107,107,0.5)'/>
  <circle cx='350' cy='100' r='6' fill='rgba(78,205,196,0.5)'/>
  <circle cx='700' cy='300' r='10' fill='rgba(255,195,0,0.5)'/>
  <circle cx='600' cy='80' r='7' fill='rgba(155,89,182,0.5)'/>
  <circle cx='150' cy='400' r='9' fill='rgba(46,204,113,0.5)'/>
  <circle cx='800' cy='450' r='6' fill='rgba(255,107,107,0.4)'/>
  <circle cx='500' cy='350' r='5' fill='rgba(78,205,196,0.45)'/>
  <circle cx='300' cy='550' r='8' fill='rgba(255,195,0,0.4)'/>
  <circle cx='750' cy='600' r='7' fill='rgba(155,89,182,0.4)'/>
  <circle cx='420' cy='480' r='6' fill='rgba(46,204,113,0.45)'/>
  <g fill='rgba(255,255,255,0.06)'><ellipse cx='250' cy='120' rx='90' ry='35'/><ellipse cx='210' cy='110' rx='50' ry='30'/><ellipse cx='300' cy='115' rx='55' ry='28'/></g>
  <g fill='rgba(255,255,255,0.05)'><ellipse cx='720' cy='80' rx='80' ry='30'/><ellipse cx='680' cy='72' rx='45' ry='25'/><ellipse cx='770' cy='75' rx='50' ry='24'/></g>
  <path d='M0 580 Q120 540 240 580 T480 580 T720 580 T960 580' fill='none' stroke='rgba(78,205,196,0.15)' stroke-width='3'/>
  <path d='M0 610 Q120 570 240 610 T480 610 T720 610 T960 610' fill='none' stroke='rgba(255,107,107,0.12)' stroke-width='2.5'/>
  <path d='M0 640 Q120 605 240 640 T480 640 T720 640 T960 640' fill='none' stroke='rgba(255,195,0,0.1)' stroke-width='2'/>
  <line x1='0' y1='300' x2='200' y2='0' stroke='rgba(155,89,182,0.07)' stroke-width='2'/>
  <line x1='760' y1='720' x2='960' y2='400' stroke='rgba(46,204,113,0.07)' stroke-width='2'/>
  <g transform='translate(820,320)' fill='rgba(255,195,0,0.2)'><polygon points='0,-18 5,-6 18,-6 8,3 12,16 0,8 -12,16 -8,3 -18,-6 -5,-6'/></g>
  <g transform='translate(140,300)' fill='rgba(255,107,107,0.18)'><polygon points='0,-14 4,-5 14,-5 6,2 9,12 0,6 -9,12 -6,2 -14,-5 -4,-5'/></g>
  <g transform='translate(600,500)' fill='rgba(78,205,196,0.18)'><polygon points='0,-16 5,-5 16,-5 7,3 10,14 0,7 -10,14 -7,3 -16,-5 -5,-5'/></g>
  <circle cx='680' cy='500' r='40' fill='none' stroke='rgba(255,107,107,0.12)' stroke-width='2'/>
  <circle cx='300' cy='650' r='30' fill='none' stroke='rgba(78,205,196,0.12)' stroke-width='2'/>
</svg>
`)}")`;

/* Cartoon 80's arcade cabinet as inline SVG */
function ArcadeCabinet() {
  return (
    <svg
      data-wog-id={wogId("HM", 15)}
      width="160"
      height="220"
      viewBox="0 0 160 220"
      style={{ display: "block", margin: "0 auto 16px" }}
    >
      {/* Cabinet body */}
      <rect x="20" y="10" width="120" height="200" rx="8" fill="#2d1b69" stroke="#9b59b6" strokeWidth="3"/>
      {/* Top marquee */}
      <rect x="30" y="16" width="100" height="28" rx="4" fill="linear-gradient(#ff6b6b,#ffc300)"/>
      <defs>
        <linearGradient id="marquee-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6b6b"/>
          <stop offset="50%" stopColor="#ffc300"/>
          <stop offset="100%" stopColor="#4ecdc4"/>
        </linearGradient>
        <linearGradient id="screen-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1628"/>
          <stop offset="100%" stopColor="#0f3460"/>
        </linearGradient>
      </defs>
      <rect x="30" y="16" width="100" height="28" rx="4" fill="url(#marquee-grad)"/>
      {/* Marquee text */}
      <text x="80" y="35" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1a0a2e" fontFamily="sans-serif">SEB'S ARCADE</text>
      {/* Screen bezel */}
      <rect x="32" y="50" width="96" height="72" rx="4" fill="#111"/>
      {/* Screen */}
      <rect x="36" y="54" width="88" height="64" rx="2" fill="url(#screen-grad)"/>
      {/* Pixel art on screen — little character */}
      <rect x="56" y="96" width="6" height="6" fill="#4ecdc4"/>
      <rect x="62" y="96" width="6" height="6" fill="#4ecdc4"/>
      <rect x="56" y="90" width="6" height="6" fill="#4ecdc4"/>
      <rect x="62" y="90" width="6" height="6" fill="#4ecdc4"/>
      <rect x="50" y="96" width="6" height="6" fill="#ff6b6b"/>
      <rect x="68" y="96" width="6" height="6" fill="#ff6b6b"/>
      <rect x="56" y="84" width="6" height="6" fill="#ffc300"/>
      <rect x="62" y="84" width="6" height="6" fill="#ffc300"/>
      <rect x="56" y="102" width="6" height="6" fill="#4ecdc4"/>
      <rect x="62" y="102" width="6" height="6" fill="#4ecdc4"/>
      {/* Platforms on screen */}
      <rect x="40" y="108" width="30" height="4" rx="1" fill="#2ecc71"/>
      <rect x="78" y="100" width="25" height="4" rx="1" fill="#2ecc71"/>
      <rect x="95" y="86" width="20" height="4" rx="1" fill="#2ecc71"/>
      {/* Stars on screen */}
      <circle cx="45" cy="62" r="1.5" fill="#ffc300" opacity="0.8"/>
      <circle cx="100" cy="70" r="1" fill="#ff6b6b" opacity="0.7"/>
      <circle cx="72" cy="58" r="1.2" fill="#4ecdc4" opacity="0.8"/>
      {/* Control panel */}
      <rect x="30" y="128" width="100" height="40" rx="4" fill="#1a1a4e"/>
      {/* Joystick base */}
      <circle cx="55" cy="148" r="10" fill="#222"/>
      <circle cx="55" cy="148" r="7" fill="#333"/>
      {/* Joystick stick */}
      <rect x="53" y="134" width="4" height="14" rx="2" fill="#e04040"/>
      <circle cx="55" cy="133" r="4" fill="#ff6b6b"/>
      {/* Buttons */}
      <circle cx="90" cy="142" r="6" fill="#ff6b6b"/>
      <circle cx="106" cy="142" r="6" fill="#ffc300"/>
      <circle cx="98" cy="154" r="6" fill="#4ecdc4"/>
      {/* Coin slot area */}
      <rect x="60" y="175" width="40" height="14" rx="3" fill="#1a1a2e"/>
      <rect x="72" y="179" width="16" height="6" rx="2" fill="#333" stroke="#555" strokeWidth="1"/>
      {/* Cabinet legs */}
      <rect x="28" y="205" width="12" height="12" rx="2" fill="#1a0a2e"/>
      <rect x="120" y="205" width="12" height="12" rx="2" fill="#1a0a2e"/>
      {/* Glow effect around screen */}
      <rect x="36" y="54" width="88" height="64" rx="2" fill="none" stroke="#4ecdc4" strokeWidth="1" opacity="0.3"/>
    </svg>
  );
}

export default function HomePage() {
  return (
    <div
      data-wog-id={wogId("HM", 1)}
      style={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg,
            #1a0a2e 0%,
            #16213e 20%,
            #0f3460 40%,
            #1a1a4e 60%,
            #2d1b69 80%,
            #1a0a2e 100%
          )`,
        backgroundAttachment: "fixed",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        padding: "48px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative SVG background layer */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: bgSvg,
          backgroundSize: "cover",
          backgroundPosition: "center",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Animated floating blobs */}
      <style>{`
        @keyframes float1 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }
        @keyframes float2 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(20px) scale(0.95); } }
        @keyframes float3 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(25px); } }
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; text-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b, 0 0 40px #ff6b6b, 0 0 80px #ff6b6b; }
          20%, 24%, 55% { opacity: 0.85; text-shadow: none; }
        }
      `}</style>

      <div style={{
        position: "fixed", top: -60, left: -40, width: 280, height: 280,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 70%)",
        animation: "float1 8s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: 40, right: -60, width: 320, height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(78,205,196,0.18) 0%, transparent 70%)",
        animation: "float2 10s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", top: "40%", left: "50%", width: 400, height: 400,
        marginLeft: -200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,195,0,0.08) 0%, transparent 70%)",
        animation: "float3 12s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: -80, left: 60, width: 250, height: 250,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(155,89,182,0.18) 0%, transparent 70%)",
        animation: "float1 9s ease-in-out infinite 2s",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: 20, right: 40, width: 200, height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(46,204,113,0.15) 0%, transparent 70%)",
        animation: "float2 7s ease-in-out infinite 1s",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        position: "fixed", top: 120, right: 120, width: 80, height: 80,
        border: "3px solid rgba(255,195,0,0.15)",
        borderRadius: "50%",
        animation: "spin-slow 20s linear infinite",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: 160, left: 100, width: 50, height: 50,
        border: "2px solid rgba(78,205,196,0.12)",
        borderRadius: "50%",
        animation: "spin-slow 15s linear infinite reverse",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Main content */}
      <div data-wog-id={wogId("HM", 2)} style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Arcade cabinet hero */}
        <ArcadeCabinet />

        {/* Title */}
        <h1
          data-wog-id={wogId("HM", 3)}
          style={{
            fontSize: 56,
            fontWeight: 900,
            marginBottom: 4,
            textAlign: "center",
            background: "linear-gradient(135deg, #ff6b6b, #ffc300, #4ecdc4, #9b59b6, #ff6b6b)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: -1,
            textTransform: "uppercase",
          }}
        >
          Seb's Arcade
        </h1>

        {/* Tagline */}
        <p
          data-wog-id={wogId("HM", 4)}
          style={{
            textAlign: "center",
            opacity: 0.8,
            marginBottom: 12,
            fontSize: 18,
            fontWeight: 500,
          }}
        >
          Welcome to my arcade!
        </p>

        {/* Bio */}
        <p
          data-wog-id={wogId("HM", 16)}
          style={{
            textAlign: "center",
            opacity: 0.55,
            marginBottom: 48,
            fontSize: 14,
            lineHeight: 1.6,
            maxWidth: 520,
            margin: "0 auto 48px",
          }}
        >
          Hi, I'm Sebby and I'm 9 years old. This is my collection of games that
          me and my dad are building together. We'll keep adding new ones as we
          make them — come back and check for more!
        </p>

        {/* Section header */}
        <div
          data-wog-id={wogId("HM", 17)}
          style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#4ecdc4",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          My Games
        </div>

        {/* Game grid */}
        <div
          data-wog-id={wogId("HM", 5)}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {GAMES.map((game, i) => (
            <Link
              key={game.slug}
              data-wog-id={wogId("HM", 6, String.fromCharCode(97 + i))}
              href={game.path}
              style={{ textDecoration: "none" }}
            >
              <div
                data-wog-id={wogId("HM", 7, String.fromCharCode(97 + i))}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                  e.currentTarget.style.boxShadow = game.tile.hoverGlow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div data-wog-id={wogId("HM", 14, String.fromCharCode(97 + i))}>
                  {/* Thumbnail */}
                  <div
                    data-wog-id={wogId("HM", 8, String.fromCharCode(97 + i))}
                    style={{
                      width: "100%",
                      height: 180,
                      background: game.tile.gradient,
                      backgroundSize: "200% 200%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 64,
                    }}
                  >
                    {game.tile.emoji}
                  </div>

                  {/* Info */}
                  <div data-wog-id={wogId("HM", 9, String.fromCharCode(97 + i))} style={{ padding: "16px 20px" }}>
                    <h2
                      data-wog-id={wogId("HM", 10, String.fromCharCode(97 + i))}
                      style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#fff" }}
                    >
                      {game.title}
                    </h2>
                    <p
                      data-wog-id={wogId("HM", 11, String.fromCharCode(97 + i))}
                      style={{
                        fontSize: 14,
                        opacity: 0.65,
                        margin: "8px 0 12px",
                        lineHeight: 1.5,
                        color: "#fff",
                      }}
                    >
                      {game.description}
                    </p>
                    <div data-wog-id={wogId("HM", 12, String.fromCharCode(97 + i))} style={{ display: "flex", gap: 8 }}>
                      {game.tags.map((tag, ti) => (
                        <span
                          key={tag}
                          data-wog-id={wogId("HM", 13, String.fromCharCode(97 + i) + String.fromCharCode(97 + ti))}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 12px",
                            borderRadius: 999,
                            background: game.tile.tagBackground,
                            color: game.tile.tagColor,
                            border: `1px solid ${game.tile.tagBorder}`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p
          data-wog-id={wogId("HM", 18)}
          style={{
            textAlign: "center",
            opacity: 0.3,
            marginTop: 64,
            fontSize: 12,
          }}
        >
          Built with fun by Sebby & Dad
        </p>
      </div>
    </div>
  );
}
