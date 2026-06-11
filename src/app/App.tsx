import { useState, useEffect, useCallback } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import robotLoginImg from "@/imports/image.png";
import robotRegisterImg from "@/imports/image-1.png";
import loginBgImg from "@/imports/image-5.png";
import loginCardBgImg from "@/imports/image-6.png";
import spaceBgImg from "@/imports/image-7.png";
import nexaPos1 from "@/imports/pos_1.PNG";
import nexaPos2 from "@/imports/pos_2.PNG";
import nexaLuta from "@/imports/luta.PNG";
import nexaEstudo from "@/imports/estudo.PNG";
import nexaComemora from "@/imports/comemora__o.PNG";
import nexaBotLogin from "@/imports/image-8.png";

type Screen =
  | "login"
  | "register"
  | "home"
  | "profile"
  | "roadmap"
  | "courses"
  | "certificates"
  | "ranking"
  | "lesson";

// ─── Inline SVG Icons ───────────────────────────────────────────────────────

function IcHome({ active }: { active?: boolean }) {
  const c = active ? "#00e5ff" : "#8882b0";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IcUser({ active }: { active?: boolean }) {
  const c = active ? "#00e5ff" : "#8882b0";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IcMap({ active }: { active?: boolean }) {
  const c = active ? "#00e5ff" : "#8882b0";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function IcBook({ active }: { active?: boolean }) {
  const c = active ? "#00e5ff" : "#8882b0";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IcAward({ active }: { active?: boolean }) {
  const c = active ? "#00e5ff" : "#8882b0";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function IcTrophy({ active }: { active?: boolean }) {
  const c = active ? "#00e5ff" : "#8882b0";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 17 16 21" />
      <line x1="12" y1="17" x2="12" y2="11" />
      <path d="M5 11V7a7 7 0 0 1 14 0v4" />
      <rect x="3" y="11" width="18" height="2" rx="1" />
    </svg>
  );
}

function IcSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8882b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IcHeart({ filled = true, color = "#ff4444" }: { filled?: boolean; color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IcLock({ color = "#4a4670" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IcCheck({ color = "#22c55e" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IcBolt({ color = "#ffd700", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IcFire({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="fg" x1="12" y1="22" x2="12" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff4500" />
          <stop offset="50%" stopColor="#ff9000" />
          <stop offset="100%" stopColor="#ffdd00" />
        </linearGradient>
      </defs>
      <path d="M12 22C8 22 5 19 5 15C5 13 6 11 7 9C8 7 8 5 8 5C9 7 10 8 11 8C11 6 12 4 14 2C14 4 16 7 16 10C17 9 17 8 17 7C18 9 19 11 19 15C19 19 16 22 12 22Z" fill="url(#fg)" />
    </svg>
  );
}

function IcStar({ filled = true, size = 13 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ffd700" : "none"} stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IcArrow({ dir = "right", color = "#8882b0", size = 14 }: { dir?: "right" | "left" | "up" | "down"; color?: string; size?: number }) {
  const deg = { right: 0, down: 90, left: 180, up: -90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${deg}deg)` }}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IcCode({ color = "#00e5ff", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IcShield({ color = "#ffd700", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="0.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IcGraduate({ color = "#ffd700", size = 22 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IcClose({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#8882b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── NexaBot SVG Mascot ─────────────────────────────────────────────────────

function NexaBot({ size = 80, celebrate = false }: { size?: number; celebrate?: boolean }) {
  const uid = celebrate ? "bot-cel" : "bot-std";
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a1a5e" />
          <stop offset="100%" stopColor="#1a0f38" />
        </linearGradient>
        <linearGradient id={`head-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a1f72" />
          <stop offset="100%" stopColor="#1e0f48" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <line x1="50" y1="5" x2="50" y2="19" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" filter={`url(#glow-${uid})`} />
      <circle cx="50" cy="5" r="4" fill="#b040ff" filter={`url(#glow-${uid})`} />

      {/* Crown when celebrating */}
      {celebrate && (
        <>
          <polygon points="36,14 41,6 50,12 59,6 64,14 50,18" fill="#ffd700" stroke="#ff8c00" strokeWidth="0.8" filter={`url(#glow-${uid})`} />
          <circle cx="41" cy="6" r="2" fill="#ff8c00" />
          <circle cx="50" cy="11" r="2.5" fill="#ffd700" />
          <circle cx="59" cy="6" r="2" fill="#ff8c00" />
        </>
      )}

      {/* Head */}
      <rect x="18" y={celebrate ? 19 : 18} width="64" height="46" rx="13" fill={`url(#head-${uid})`} stroke="#7c3aed" strokeWidth="1.8" />

      {/* Visor */}
      <rect x="23" y={celebrate ? 26 : 25} width="54" height="28" rx="8" fill="#0a0820" stroke="#00e5ff" strokeWidth="1.5" filter={`url(#glow-${uid})`} opacity="0.95" />

      {/* Eyes */}
      <circle cx="38" cy={celebrate ? 40 : 39} r="7" fill="#00e5ff" opacity="0.12" />
      <circle cx="38" cy={celebrate ? 40 : 39} r="5.5" fill="#00e5ff" opacity="0.35" />
      <circle cx="38" cy={celebrate ? 40 : 39} r="3.8" fill="#00e5ff" filter={`url(#glow-${uid})`} />
      <circle cx="38" cy={celebrate ? 40 : 39} r="2.2" fill="white" />
      <circle cx="62" cy={celebrate ? 40 : 39} r="7" fill="#00e5ff" opacity="0.12" />
      <circle cx="62" cy={celebrate ? 40 : 39} r="5.5" fill="#00e5ff" opacity="0.35" />
      <circle cx="62" cy={celebrate ? 40 : 39} r="3.8" fill="#00e5ff" filter={`url(#glow-${uid})`} />
      <circle cx="62" cy={celebrate ? 40 : 39} r="2.2" fill="white" />

      {/* Cheeks */}
      <ellipse cx="26" cy={celebrate ? 47 : 46} rx="5" ry="3.5" fill="#ff80ff" opacity="0.28" />
      <ellipse cx="74" cy={celebrate ? 47 : 46} rx="5" ry="3.5" fill="#ff80ff" opacity="0.28" />

      {/* Smile */}
      <path
        d={celebrate
          ? "M 35 52 Q 50 64 65 52"
          : "M 35 51 Q 50 59 65 51"}
        stroke="#00e5ff" strokeWidth="2" fill="none" strokeLinecap="round" filter={`url(#glow-${uid})`}
      />

      {/* Body */}
      <rect x="22" y={celebrate ? 67 : 66} width="56" height="38" rx="11" fill={`url(#body-${uid})`} stroke="#7c3aed" strokeWidth="1.8" />

      {/* Chest screen */}
      <rect x="30" y={celebrate ? 74 : 73} width="40" height="22" rx="5" fill="#0a0820" stroke="#00e5ff" strokeWidth="1" opacity="0.9" />
      <text
        x="50" y={celebrate ? 89 : 88}
        textAnchor="middle" fill="#00e5ff"
        fontSize="9" fontFamily="Orbitron, monospace" fontWeight="700"
        filter={`url(#glow-${uid})`}
      >NEXA</text>

      {/* Left arm */}
      <rect x="5" y={celebrate ? 71 : 70} width="16" height="9" rx="4.5" fill={`url(#body-${uid})`} stroke="#7c3aed" strokeWidth="1.5" />
      {/* Right arm */}
      <rect x="79" y={celebrate ? 71 : 70} width="16" height="9" rx="4.5" fill={`url(#body-${uid})`} stroke="#7c3aed" strokeWidth="1.5" />

      {/* Left leg */}
      <rect x="30" y={celebrate ? 105 : 104} width="14" height="16" rx="5" fill={`url(#body-${uid})`} stroke="#7c3aed" strokeWidth="1.5" />
      {/* Right leg */}
      <rect x="56" y={celebrate ? 105 : 104} width="14" height="16" rx="5" fill={`url(#body-${uid})`} stroke="#7c3aed" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Butterfly Effect ────────────────────────────────────────────────────────

function ButterflyEffect({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3300);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes bfFly {
          0%   { left: -130px; top: 55%; }
          18%  { top: 28%; }
          40%  { top: 58%; }
          62%  { top: 22%; }
          82%  { top: 48%; }
          100% { left: calc(100vw + 130px); top: 38%; }
        }
        @keyframes wingL {
          0%, 100% { transform: rotateY(0deg); }
          50%       { transform: rotateY(55deg); }
        }
        @keyframes wingR {
          0%, 100% { transform: rotateY(0deg); }
          50%       { transform: rotateY(-55deg); }
        }
        .bf-wrap {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          animation: bfFly 3.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .bf-wl { animation: wingL 0.18s ease-in-out infinite; transform-origin: right center; }
        .bf-wr { animation: wingR 0.18s ease-in-out infinite; transform-origin: left center; }
      `}</style>
      <div className="bf-wrap">
        <svg width="96" height="72" viewBox="0 0 96 72" fill="none">
          <defs>
            <filter id="bf-glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g className="bf-wl">
            <ellipse cx="22" cy="27" rx="22" ry="17" fill="rgba(0,229,255,0.68)" filter="url(#bf-glow)" />
            <ellipse cx="17" cy="48" rx="13" ry="9" fill="rgba(0,180,255,0.55)" filter="url(#bf-glow)" />
          </g>
          <g className="bf-wr">
            <ellipse cx="74" cy="27" rx="22" ry="17" fill="rgba(176,64,255,0.68)" filter="url(#bf-glow)" />
            <ellipse cx="79" cy="48" rx="13" ry="9" fill="rgba(130,0,255,0.55)" filter="url(#bf-glow)" />
          </g>
          <ellipse cx="48" cy="36" rx="3.5" ry="14" fill="rgba(0,229,255,0.92)" filter="url(#bf-glow)" />
          <line x1="48" y1="23" x2="38" y2="12" stroke="rgba(0,229,255,0.75)" strokeWidth="1.8" />
          <circle cx="37" cy="11" r="2.8" fill="rgba(0,229,255,0.85)" />
          <line x1="48" y1="23" x2="58" y2="12" stroke="rgba(176,64,255,0.75)" strokeWidth="1.8" />
          <circle cx="59" cy="11" r="2.8" fill="rgba(176,64,255,0.85)" />
        </svg>
      </div>
    </>
  );
}

// ─── Quiz Modal ──────────────────────────────────────────────────────────────

function QuizModal({ onAnswer }: { onAnswer: (sawIt: boolean) => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div
        className="bg-[#100c2e] border border-cyan-500/40 rounded-2xl p-8 max-w-sm w-full mx-4"
        style={{ boxShadow: "0 0 50px rgba(0,229,255,0.18)" }}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🦋</div>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Teste de Atenção!
          </h3>
          <p className="text-[#8882b0] text-sm leading-relaxed">
            Uma borboleta neon cruzou a tela agora mesmo.<br />Você conseguiu vê-la?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onAnswer(true)}
            className="flex-1 py-3 rounded-xl bg-cyan-500/15 border border-cyan-500/50 text-cyan-400 font-bold hover:bg-cyan-500/25 transition-all"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            ✓ Sim, vi!
          </button>
          <button
            onClick={() => onAnswer(false)}
            className="flex-1 py-3 rounded-xl bg-purple-500/15 border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/25 transition-all"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            ✗ Não vi
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Victory Modal ───────────────────────────────────────────────────────────

const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  left: `${((i * 4.54 + 7) % 98) + 1}%`,
  top: `${((i * 7.17 + 3) % 88) + 1}%`,
  color: i % 3 === 0 ? "#ffd700" : i % 3 === 1 ? "#00e5ff" : "#b040ff",
  w: 4 + (i % 5) * 2,
  h: 4 + (i % 3) * 2,
}));

function VictoryModal({ bonusXP, onNext }: { bonusXP: boolean; onNext: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center" style={{ background: "rgba(8,6,26,0.85)", backdropFilter: "blur(10px)" }}>
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-sm opacity-70"
            style={{ left: p.left, top: p.top, width: p.w, height: p.h, background: p.color }}
          />
        ))}
      </div>

      <div
        className="relative bg-[#10092e] rounded-3xl p-8 max-w-md w-full mx-4 text-center"
        style={{ border: "1px solid rgba(255,215,0,0.35)", boxShadow: "0 0 70px rgba(255,215,0,0.18), 0 0 30px rgba(124,58,237,0.2)" }}
      >
        {/* Robot */}
        <div className="flex justify-center mb-4">
          <img src={nexaComemora} alt="NexaBot comemorando" style={{ width: 120, height: "auto", objectFit: "contain" }} />
        </div>

        <h2
          className="text-3xl font-black text-white mb-1"
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          Missão Cumprida!
        </h2>
        <p className="text-[#8882b0] text-sm mb-6">
          Módulo 1.1 — Hello World concluído!
        </p>

        {/* XP Gain */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: "rgba(8,6,26,0.8)", border: "1px solid rgba(255,215,0,0.25)" }}
        >
          <div
            className="text-5xl font-black text-yellow-400 mb-1.5"
            style={{ fontFamily: "Orbitron, monospace" }}
          >
            +50 XP
          </div>
          {bonusXP && (
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-semibold">
              <span>🦋</span>
              <span>+10 XP Bônus Borboleta</span>
            </div>
          )}
        </div>

        {/* UCS Seal */}
        <div
          className="flex items-center justify-center gap-3 p-3 rounded-xl mb-6"
          style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)" }}
        >
          <IcShield color="#ffd700" size={20} />
          <div className="text-left">
            <div className="text-yellow-400 font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Selo UCS — JavaScript Basic
            </div>
            <div className="text-[#8882b0] text-xs">Universidade de Caxias do Sul</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onNext}
          className="w-full py-4 rounded-2xl font-black text-lg text-[#08061a] transition-all"
          style={{
            fontFamily: "Orbitron, monospace",
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            boxShadow: "0 0 35px rgba(255,215,0,0.45)",
          }}
        >
          PRÓXIMA MISSÃO 🚀
        </button>
      </div>
    </div>
  );
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="min-h-screen w-full flex overflow-hidden relative"
      style={{
        backgroundImage: `url(${spaceBgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Glow blobs — mesmo padrão da tela de cadastro */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full" style={{ background: "rgba(124,58,237,0.15)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full" style={{ background: "rgba(0,229,255,0.07)", filter: "blur(60px)" }} />
      </div>

      {/* Centralizado — mesmo padrão da tela de cadastro */}
      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <div
          className="w-full max-w-md rounded-2xl p-10 relative overflow-hidden"
          style={{
            background: `linear-gradient(rgba(16,9,46,0.7), rgba(16,9,46,0.7)), url(${nexaBotLogin})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid rgba(124,58,237,0.3)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 60px rgba(124,58,237,0.12)",
          }}
        >
          {/* Ícone de cadeado */}
          <div className="flex justify-center mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.4)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b040ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Bem-vindo de volta! 👋
          </h1>
          <p className="text-[#8882b0] text-center text-base mb-8">Faça login para continuar sua jornada.</p>

          <div className="space-y-5">
            <div>
              <label className="text-[#b8b4d0] text-base font-medium block mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg px-4 py-3.5 text-white text-base outline-none transition-all placeholder:text-[#3a3660]"
                style={{ background: "rgba(26,18,69,0.6)", border: "2px solid rgba(255,255,255,0.4)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
              />
            </div>
            <div>
              <label className="text-[#b8b4d0] text-base font-medium block mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3.5 text-white text-base outline-none transition-all placeholder:text-[#3a3660]"
                style={{ background: "rgba(26,18,69,0.6)", border: "2px solid rgba(255,255,255,0.4)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 mb-7 text-sm text-[#8882b0]">
            <button onClick={onRegister} className="hover:text-cyan-400 transition-colors">
              Crie sua conta
            </button>
            <button className="hover:text-cyan-400 transition-colors">Esqueceu sua senha?</button>
          </div>

          <button
            onClick={onLogin}
            className="w-full py-4 rounded-xl font-bold text-white transition-all"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "17px",
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 0 28px rgba(124,58,237,0.38)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 40px rgba(124,58,237,0.55)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 28px rgba(124,58,237,0.38)")}
          >
            Entrar
          </button>
          <button
            onClick={onRegister}
            className="w-full mt-3 text-[#8882b0] text-sm hover:text-cyan-400 transition-colors"
          >
            Não tem conta? Cadastre-se agora
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Register Screen ─────────────────────────────────────────────────────────

function RegisterScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  return (
    <div className="min-h-screen w-full flex overflow-hidden relative" style={{ backgroundImage: `url(${spaceBgImg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full" style={{ background: "rgba(124,58,237,0.15)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full" style={{ background: "rgba(0,229,255,0.07)", filter: "blur(60px)" }} />
      </div>

      {/* Right — Form (centered, no illustration) */}
      <div className="flex-1 flex items-center justify-center px-8 relative z-10">
        <div
          className="w-full max-w-md rounded-2xl p-10 relative overflow-hidden"
          style={{
            background: `linear-gradient(rgba(16,9,46,0.7), rgba(16,9,46,0.7)), url(${nexaBotLogin})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "1px solid rgba(124,58,237,0.3)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 60px rgba(124,58,237,0.12)",
          }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.4)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b040ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Crie sua conta! 🚀
          </h1>
          <p className="text-[#8882b0] text-center text-base mb-8">
            Junte-se à Nexa e comece sua jornada de aprendizado.
          </p>

          <div className="space-y-5">
            {[
              { label: "Nome", type: "text", placeholder: "Digite seu nome..." },
              { label: "E-mail", type: "email", placeholder: "Digite seu Email..." },
              { label: "Senha", type: "password", placeholder: "Digite sua senha..." },
            ].map(({ label, type, placeholder }) => (
              <div key={label}>
                <label className="text-[#b8b4d0] text-base font-medium block mb-2">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full rounded-lg px-4 py-3.5 text-white text-base outline-none transition-all placeholder:text-[#3a3660]"
                  style={{ background: "rgba(26,18,69,0.6)", border: "2px solid rgba(255,255,255,0.4)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
                />
              </div>
            ))}
          </div>

          <button
            onClick={onDone}
            className="w-full mt-7 py-4 rounded-xl font-bold text-white transition-all"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "17px",
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 0 28px rgba(124,58,237,0.38)",
            }}
          >
            + Criar conta
          </button>
          <button
            onClick={onBack}
            className="w-full mt-3 text-[#8882b0] text-sm hover:text-cyan-400 transition-colors"
          >
            Já tenho conta — Fazer login
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Screen; label: string; Icon: React.FC<{ active?: boolean }> }[] = [
  { id: "home", label: "Início", Icon: IcHome },
  { id: "profile", label: "Perfil", Icon: IcUser },
  { id: "roadmap", label: "Roadmap", Icon: IcMap },
  { id: "courses", label: "Cursos", Icon: IcBook },
  { id: "certificates", label: "Certificados", Icon: IcAward },
  { id: "ranking", label: "Ranking", Icon: IcTrophy },
];

function Sidebar({ active, onNavigate }: { active: Screen; onNavigate: (s: Screen) => void }) {
  return (
    <aside
      className="w-52 shrink-0 flex flex-col h-full"
      style={{ background: "#0c0825", borderRight: "1px solid rgba(124,58,237,0.2)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(124,58,237,0.12)" }}>
        <span
          className="text-3xl font-black text-white tracking-widest"
          style={{ fontFamily: "Orbitron, monospace" }}
        >
          NEXA
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id || (id === "roadmap" && active === "lesson");
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all"
              style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "16px",
                background: isActive ? "rgba(0,229,255,0.08)" : "transparent",
                border: isActive ? "1px solid rgba(0,229,255,0.25)" : "1px solid transparent",
                color: isActive ? "#00e5ff" : "#8882b0",
                boxShadow: isActive ? "0 0 18px rgba(0,229,255,0.07)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#e8e6ff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#8882b0";
                }
              }}
            >
              <Icon active={isActive} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom Robot */}
      <div className="p-4 flex justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => onNavigate("home")}>
        <img src={nexaPos1} alt="NexaBot" style={{ width: 120, height: "auto", objectFit: "contain" }} />
      </div>
    </aside>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header({ xp, onNavigate }: { xp: number; onNavigate: (s: Screen) => void }) {
  const maxXP = 3000;
  const pct = Math.min(100, Math.round((xp / maxXP) * 100));

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 shrink-0"
      style={{
        background: "rgba(12,8,37,0.85)",
        borderBottom: "1px solid rgba(124,58,237,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex-1 min-w-0">
        <span className="text-white font-semibold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          Astronauta_Leo
        </span>
        <span className="text-[#8882b0] text-sm ml-2 hidden md:inline">— Vamos começar sua jornada!</span>
      </div>

      {/* Search */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.18)" }}
      >
        <IcSearch />
        <input
          className="bg-transparent text-[#8882b0] text-sm outline-none placeholder:text-[#3a3660] w-36"
          placeholder="Buscar conteúdos..."
        />
      </div>

      {/* Level + XP */}
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 text-sm font-bold" style={{ fontFamily: "Orbitron, monospace" }}>
          Nv.4
        </span>
        <div
          className="w-24 h-2.5 rounded-full overflow-hidden"
          style={{ background: "#1a1440", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #00e5ff, #7c3aed)" }}
          />
        </div>
        <span className="text-[#8882b0] text-sm hidden lg:inline">
          {xp.toLocaleString("pt-BR")}/{maxXP.toLocaleString("pt-BR")}
        </span>
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <IcHeart key={i} filled color="#ff4444" />
        ))}
      </div>

      {/* Avatar */}
      <button
        onClick={() => onNavigate("profile")}
        className="w-9 h-9 rounded-full font-bold text-sm text-white flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #7c3aed, #00e5ff)" }}
      >
        AL
      </button>
    </header>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

function HomeScreen({ onNavigate, xp }: { onNavigate: (s: Screen) => void; xp: number }) {
  const maxXP = 3000;
  const pct = Math.min(100, Math.round((xp / maxXP) * 100));

  const challenges = [
    { label: "Complete 2 exercícios", progress: 1, total: 2, xp: 20, color: "#ef4444" },
    { label: "Estude por 30 minutos", progress: 30, total: 30, xp: 30, color: "#22c55e" },
    { label: "Responda um quiz", progress: 0, total: 1, xp: 15, color: "#fbbf24" },
  ];

  const ranking = [
    { rank: 1, name: "João Pedro", xp: 1250, avatar: "JP" },
    { rank: 2, name: "Maria Clara", xp: 1100, avatar: "MC" },
    { rank: 3, name: "Você", xp: xp, avatar: "AL", isUser: true },
    { rank: 4, name: "Lucas Lima", xp: 870, avatar: "LL" },
    { rank: 5, name: "Ana Beatriz", xp: 760, avatar: "AB" },
  ];

  const weekDays = ["S", "T", "Q", "Q", "S", "S", "D"];
  const completedDays = [0, 1, 2, 3, 4, 5];

  return (
    <div className="flex gap-5 h-full overflow-hidden">
      {/* Main */}
      <div className="flex-1 min-w-0 overflow-y-auto space-y-5 pr-1" style={{ scrollbarWidth: "none" }}>
        {/* Progress Hero */}
        <div
          className="rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(26,15,64,0.95), rgba(14,9,40,0.95))",
            border: "1px solid rgba(124,58,237,0.35)",
            boxShadow: "0 0 35px rgba(124,58,237,0.1)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top left, rgba(124,58,237,0.12), transparent 60%)" }} />
          <div className="flex-1 relative z-10">
            <div className="text-xs text-[#8882b0] font-bold uppercase tracking-widest mb-2">SEU PROGRESSO</div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-4xl font-black text-white" style={{ fontFamily: "Orbitron, monospace" }}>
                Nível 4
              </span>
              <IcBolt color="#ffd700" size={20} />
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-3 rounded-full overflow-hidden"
                style={{ background: "#1a1440", border: "1px solid rgba(124,58,237,0.25)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #00e5ff, #7c3aed)",
                    boxShadow: "0 0 12px rgba(0,229,255,0.5)",
                  }}
                />
              </div>
              <span className="text-cyan-400 text-sm font-bold">
                {xp.toLocaleString("pt-BR")} / 3.000 XP
              </span>
            </div>
          </div>
          <div className="w-24 opacity-95 shrink-0 relative z-10">
            <img src={nexaPos1} alt="NexaBot" style={{ width: 96, height: "auto", objectFit: "contain" }} />
          </div>
        </div>

        {/* Continue Journey */}
        <div>
          <h2 className="text-white font-bold text-lg mb-3" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Continue sua jornada
          </h2>
          <div
            className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all"
            style={{ background: "rgba(16,9,46,0.8)", border: "1px solid rgba(124,58,237,0.22)" }}
            onClick={() => onNavigate("lesson")}
          >
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0" style={{ background: "linear-gradient(135deg, #f7df1e22, #f7df1e44)", border: "1px solid #f7df1e55" }}>
              <span style={{ color: "#f7df1e", fontSize: "22px", fontWeight: 700 }}>JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-base mb-0.5" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                JavaScript Básico
              </div>
              <div className="text-[#8882b0] text-sm mb-2">Módulo 1.1 — Seu primeiro Hello World</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1440" }}>
                  <div className="h-full rounded-full" style={{ width: "42%", background: "linear-gradient(90deg, #00e5ff, #7c3aed)" }} />
                </div>
                <span className="text-[#8882b0] text-sm">42%</span>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate("lesson"); }}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all whitespace-nowrap"
              style={{ fontFamily: "Rajdhani, sans-serif", background: "#7c3aed" }}
            >
              Continuar ›
            </button>
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="text-white font-bold text-lg mb-3" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Acesso rápido
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🎓", title: "Certificados", desc: "Veja suas conquistas e baixe certificados", target: "certificates" as Screen },
              { icon: "💻", title: "Portfólio", desc: "Construa e mostre seus projetos", target: "courses" as Screen },
              { icon: "⚡", title: "Roadmap", desc: "Veja seu caminho de aprendizado", target: "roadmap" as Screen, gold: true },
            ].map(({ icon, title, desc, target, gold }) => (
              <button
                key={title}
                onClick={() => onNavigate(target)}
                className="rounded-2xl p-5 text-left transition-all hover:scale-[1.02]"
                style={{
                  background: gold ? "rgba(255,215,0,0.07)" : "rgba(16,9,46,0.8)",
                  border: gold ? "1px solid rgba(255,215,0,0.28)" : "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-bold text-base mb-1" style={{ fontFamily: "Rajdhani, sans-serif", color: gold ? "#fbbf24" : "#ffffff" }}>{title}</div>
                <div className="text-[#8882b0] text-sm leading-tight">{desc}</div>
                <div className="mt-2 text-sm" style={{ color: gold ? "#fbbf24" : "#00e5ff" }}>→</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-96 shrink-0 space-y-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Streak */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(16,9,46,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="flex items-center gap-2 mb-1">
            <IcFire size={18} />
            <span className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>Sequência</span>
          </div>
          <div className="text-4xl font-black text-orange-400 mb-0.5" style={{ fontFamily: "Orbitron, monospace" }}>7 dias</div>
          <div className="text-[#8882b0] text-sm mb-3">Você está arrasando! 🔥</div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    background: completedDays.includes(i) ? "#f97316" : "#1a1440",
                    color: completedDays.includes(i) ? "white" : "#3a3660",
                  }}
                >
                  {completedDays.includes(i) ? "✓" : ""}
                </div>
                <span className="text-[#8882b0] text-[9px]">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(16,9,46,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>🎯 Desafios diários</span>
            <span className="text-[#8882b0] text-sm">12h 20m</span>
          </div>
          <div className="space-y-3">
            {challenges.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#b8b4d0] text-sm">{c.label}</span>
                  <span className="text-yellow-400 text-sm font-bold">+{c.xp} XP</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1440" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.progress / c.total) * 100}%`, background: c.color }}
                  />
                </div>
                <div className="text-[#4a4670] text-[10px]">{c.progress}/{c.total}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Ranking */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(16,9,46,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>🏆 Ranking</span>
            <button onClick={() => onNavigate("ranking")} className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">Ver todos</button>
          </div>
          <div className="space-y-2">
            {ranking.map((r) => (
              <div
                key={r.rank}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all"
                style={{
                  background: r.isUser ? "rgba(0,229,255,0.08)" : "transparent",
                  border: r.isUser ? "1px solid rgba(0,229,255,0.2)" : "1px solid transparent",
                }}
              >
                <span className="text-[#4a4670] text-xs w-4 font-mono text-center">{r.rank}.</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{
                    background: r.isUser ? "linear-gradient(135deg, #00e5ff, #7c3aed)" : "#1a1440",
                    color: r.isUser ? "white" : "#8882b0",
                  }}
                >
                  {r.avatar}
                </div>
                <span
                  className="flex-1 text-xs"
                  style={{ fontFamily: "Rajdhani, sans-serif", color: r.isUser ? "#00e5ff" : "#b8b4d0", fontWeight: r.isUser ? 700 : 500 }}
                >
                  {r.name}
                </span>
                <span className="text-[#8882b0] text-xs">{r.xp.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen() {
  const badges = [
    { icon: "👋", label: "Hello World", desc: "Primeiro programa executado", from: "rgba(34,197,94,0.18)", border: "rgba(34,197,94,0.4)" },
    { icon: "🔀", label: "if/else Mestre", desc: "Dominou estruturas condicionais", from: "rgba(0,229,255,0.15)", border: "rgba(0,229,255,0.4)" },
    { icon: "🔄", label: "Loop Infinito", desc: "Concluiu módulo de repetição", from: "rgba(124,58,237,0.18)", border: "rgba(124,58,237,0.4)" },
  ];

  const lockedBadges = [
    { label: "Operadores" }, { label: "Métodos" }, { label: "Classes OOP" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      {/* Profile Card */}
      <div
        className="rounded-2xl p-8 flex items-center gap-8 relative overflow-hidden"
        style={{
          background: "rgba(16,9,46,0.8)",
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 0 40px rgba(124,58,237,0.08)",
        }}
      >
        {/* Glow de fundo */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top left, rgba(124,58,237,0.1), transparent 60%)" }} />

        {/* Avatar + identidade */}
        <div className="flex flex-col items-center gap-3 shrink-0 relative z-10" style={{ minWidth: 140 }}>
          <div className="relative">
            <img src={nexaPos2} alt="NexaBot meditando" style={{ width: 120, height: "auto", objectFit: "contain" }} />
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full"
              style={{ background: "#22c55e", border: "2px solid #10092e" }}
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-white leading-tight" style={{ fontFamily: "Orbitron, monospace" }}>
              Astronauta_Leo
            </h2>
            <span
              className="inline-block mt-1.5 px-3 py-1 rounded-md text-yellow-400 text-sm font-bold"
              style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)" }}
            >
              Nível 4
            </span>
            <p className="text-[#8882b0] text-sm mt-2">Aluno · Jardelino Ramos</p>
          </div>
        </div>

        {/* Divisor vertical */}
        <div className="self-stretch w-px shrink-0 relative z-10" style={{ background: "rgba(124,58,237,0.25)" }} />

        {/* Stats em grid 2×2 */}
        <div className="flex-1 grid grid-cols-2 gap-5 relative z-10">
          {[
            { val: "2.200", label: "XP Total", color: "#00e5ff", icon: "⚡" },
            { val: "7 dias", label: "Sequência", color: "#f97316", icon: "🔥" },
            { val: "3", label: "Badges", color: "#b040ff", icon: "🏅" },
            { val: "3°", label: "Ranking", color: "#ffd700", icon: "🏆" },
          ].map(({ val, label, color, icon }) => (
            <div
              key={label}
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.15)" }}
            >
              <span className="text-2xl">{icon}</span>
              <div>
                <div className="font-black text-xl leading-tight" style={{ fontFamily: "Orbitron, monospace", color }}>{val}</div>
                <div className="text-[#8882b0] text-sm mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="text-white font-bold text-xl mb-4" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          🏅 Inventário de Badges
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl p-5 text-center transition-all hover:scale-105 cursor-pointer"
              style={{ background: b.from, border: `1px solid ${b.border}` }}
            >
              <div className="text-4xl mb-2">{b.icon}</div>
              <div className="text-white font-bold text-base mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>{b.label}</div>
              <div className="text-[#8882b0] text-sm">{b.desc}</div>
            </div>
          ))}
          {lockedBadges.map((b) => (
            <div
              key={b.label}
              className="rounded-2xl p-5 text-center opacity-35"
              style={{ background: "rgba(26,20,64,0.5)", border: "1px solid rgba(42,32,96,0.8)" }}
            >
              <div className="flex justify-center mb-2">
                <IcLock color="#4a4670" />
              </div>
              <div className="text-[#8882b0] font-bold text-sm">{b.label}</div>
              <div className="text-[#3a3660] text-sm mt-1">Bloqueado</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap Screen ───────────────────────────────────────────────────────────

function RoadmapScreen({ onStartLesson }: { onStartLesson: () => void }) {
  const missions = [
    { id: "1.1", title: "Seu primeiro Hello World", subtitle: "(console.log)", xp: 50, status: "active" as const },
    { id: "1.2", title: "Variáveis e Tipos de Dados", subtitle: "(let, const, var)", xp: 70, status: "locked" as const },
    { id: "1.3", title: "Operadores e Expressões", subtitle: "", xp: 60, status: "locked" as const },
    { id: "1.4", title: "Condicionais (if/else)", subtitle: "", xp: 80, status: "locked" as const },
    { id: "1.5", title: "Laços de Repetição", subtitle: "(for/while)", xp: 90, status: "locked" as const },
  ];

  return (
    <div className="max-w-2xl mx-auto overflow-y-auto h-full" style={{ scrollbarWidth: "none" }}>
      {/* NexaBot speech */}
      <div className="flex items-start gap-3 mb-6">
        <div className="shrink-0">
          <img src={nexaLuta} alt="NexaBot em modo ofensivo" style={{ width: 70, height: "auto", objectFit: "contain" }} />
        </div>
        <div
          className="flex-1 rounded-2xl rounded-tl-none p-5"
          style={{ background: "rgba(16,9,46,0.85)", border: "1px solid rgba(124,58,237,0.25)" }}
        >
          <p className="text-[#b8b4d0] text-base leading-relaxed">
            Sua trilha de JavaScript está pronta! Escolha sua missão,{" "}
            <span className="text-cyan-400 font-bold">Astronauta_Leo</span>.
          </p>
        </div>
      </div>

      {/* Module Banner */}
      <div
        className="rounded-2xl p-4 mb-6 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(0,229,255,0.12))",
          border: "1px solid rgba(0,229,255,0.3)",
          boxShadow: "0 0 30px rgba(0,229,255,0.08)",
        }}
      >
        <div className="text-sm text-[#8882b0] font-bold uppercase tracking-widest mb-1">MÓDULO ATUAL</div>
        <div className="text-white font-black text-2xl" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          Fundamentos de JavaScript
        </div>
      </div>

      {/* Missions */}
      <div className="relative space-y-3">
        <div
          className="absolute left-[27px] top-4 bottom-16 w-px"
          style={{ background: "linear-gradient(to bottom, rgba(124,58,237,0.5), transparent)" }}
        />
        {missions.map((m) => (
          <div
            key={m.id}
            className="relative flex items-center gap-4 rounded-xl p-4 transition-all"
            style={{
              background:
                m.status === "done"
                  ? "rgba(14,26,16,0.9)"
                  : m.status === "active"
                  ? "linear-gradient(135deg, rgba(26,15,64,0.95), rgba(14,9,40,0.95))"
                  : "rgba(16,9,46,0.5)",
              border:
                m.status === "done"
                  ? "1px solid rgba(34,197,94,0.3)"
                  : m.status === "active"
                  ? "1px solid rgba(0,229,255,0.45)"
                  : "1px solid rgba(124,58,237,0.12)",
              boxShadow: m.status === "active" ? "0 0 24px rgba(0,229,255,0.1)" : "none",
              opacity: m.status === "locked" ? 0.55 : 1,
            }}
          >
            {/* Status indicator */}
            <div
              className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                background:
                  m.status === "done"
                    ? "rgba(34,197,94,0.2)"
                    : m.status === "active"
                    ? "rgba(0,229,255,0.15)"
                    : "#1a1440",
                border:
                  m.status === "done"
                    ? "1px solid #22c55e"
                    : m.status === "active"
                    ? "1px solid #00e5ff"
                    : "1px solid #2a2060",
                boxShadow: m.status === "active" ? "0 0 12px rgba(0,229,255,0.35)" : "none",
              }}
            >
              {m.status === "done" && <IcCheck color="#22c55e" />}
              {m.status === "active" && (
                <span className="text-cyan-400 text-[10px] font-bold">{m.id}</span>
              )}
              {m.status === "locked" && <IcLock color="#4a4670" />}
            </div>

            <div className="flex-1 min-w-0">
              <div
                className="font-bold text-base"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  color:
                    m.status === "done" ? "#4ade80" : m.status === "active" ? "white" : "#8882b0",
                }}
              >
                Módulo {m.id}: {m.title} {m.subtitle}
              </div>
              <div className="text-[#8882b0] text-sm mt-0.5">+{m.xp} XP</div>
            </div>

            {m.status === "done" && (
              <span
                className="px-2.5 py-1 rounded-lg text-xs font-bold"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}
              >
                Concluída ✓
              </span>
            )}
            {m.status === "active" && (
              <button
                onClick={onStartLesson}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-black transition-all whitespace-nowrap"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  background: "linear-gradient(135deg, #00e5ff, #7c3aed)",
                  boxShadow: "0 0 18px rgba(0,229,255,0.35)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 28px rgba(0,229,255,0.55)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 18px rgba(0,229,255,0.35)")}
              >
                INICIAR MISSÃO
              </button>
            )}
          </div>
        ))}

        {/* Next module */}
        <div
          className="rounded-xl p-4 text-center opacity-40"
          style={{ border: "1px solid rgba(42,32,96,0.8)", background: "rgba(16,9,46,0.3)" }}
        >
          <div className="text-[#4a4670] text-xs font-bold uppercase tracking-widest">PRÓXIMO MÓDULO</div>
          <div className="text-[#8882b0] font-bold mt-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            DOM & EVENTOS
          </div>
          <div className="flex justify-center mt-2">
            <IcLock color="#4a4670" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Courses Screen ───────────────────────────────────────────────────────────

function CoursesScreen() {
  const [activeTab, setActiveTab] = useState("Todos");
  const tabs = ["Todos", "JavaScript", "Front-End", "Back-End", "UI/UX"];

  const courses = [
    { title: "Lógica de Programação: Algoritmos do Zero", desc: "Aprenda a pensar como um dev: variáveis, condicionais e loops de forma visual e prática.", icon: "⚙️", stars: 2, action: "INICIAR MISSÃO" },
    { title: "Front-End do Futuro: React & Tailwind", desc: "Construa interfaces modernas usando os frameworks mais usados do mercado.", icon: "⚛️", stars: 1, action: "CONTINUAR MISSÃO" },
    { title: "Criação de UIs Animadas (UI/UX)", desc: "Design de interfaces com animações e microinterações em CSS e JS.", icon: "🎨", stars: 3, action: "INICIAR MISSÃO" },
    { title: "JavaScript Assíncrono: Promises & Async", desc: "Domine fetch, async/await e consumo de APIs REST no mundo real.", icon: "🔄", stars: 3, action: "CONTINUAR MISSÃO" },
  ];

  return (
    <div className="space-y-5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          Cursos Disponíveis
        </h1>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(16,9,46,0.6)", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <IcSearch />
          <input
            className="bg-transparent text-[#8882b0] text-xs outline-none placeholder:text-[#3a3660] w-28"
            placeholder="Buscar conteúdos..."
          />
        </div>
      </div>

      <h2 className="text-white font-bold text-lg" style={{ fontFamily: "Rajdhani, sans-serif" }}>
        Catálogo de Cursos
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-4 py-2 rounded-lg text-base font-semibold transition-all"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              background: activeTab === t ? "rgba(255,255,255,0.1)" : "transparent",
              border: activeTab === t ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
              color: activeTab === t ? "white" : "#8882b0",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Featured */}
      <div
        className="rounded-2xl p-6 flex gap-5"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.55), rgba(26,15,64,0.9))",
          border: "1px solid rgba(124,58,237,0.45)",
          boxShadow: "0 0 35px rgba(124,58,237,0.15)",
        }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 text-xs text-[#8882b0]">
            <span>8 Módulos</span>
            <span>·</span>
            <span>+3.500 XP</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-yellow-400">
              <IcShield color="#ffd700" size={12} /> Selo UCS
            </span>
          </div>
          <h3 className="text-3xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            JavaScript Avançado:<br />ES6+, Modules & APIs
          </h3>
          <div className="h-1.5 w-full rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "15%", background: "linear-gradient(90deg, #00e5ff, #7c3aed)" }} />
          </div>
          <button
            className="mt-4 px-6 py-3.5 rounded-xl font-black text-base text-[#08061a] transition-all"
            style={{ background: "linear-gradient(135deg, #00e5ff, #06b6d4)", boxShadow: "0 0 22px rgba(0,229,255,0.4)" }}
          >
            INICIAR MISSÃO
          </button>
        </div>
        <div className="flex items-center justify-center w-28 shrink-0">
          <img src={nexaEstudo} alt="NexaBot estudando" style={{ width: 110, height: "auto", objectFit: "contain" }} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {courses.map((c, i) => (
          <div
            key={i}
            className="rounded-xl p-4 transition-all"
            style={{ background: "rgba(16,9,46,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "rgba(124,58,237,0.2)" }}>
                {c.icon}
              </div>
              <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                {c.title}
              </div>
            </div>
            <p className="text-[#8882b0] text-sm mb-3 leading-relaxed">{c.desc}</p>
            <div className="flex items-center justify-between">
              <button
                className="px-3.5 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: c.action === "INICIAR MISSÃO" ? "#7c3aed" : "rgba(0,229,255,0.12)",
                  border: c.action === "INICIAR MISSÃO" ? "none" : "1px solid rgba(0,229,255,0.3)",
                  color: c.action === "INICIAR MISSÃO" ? "white" : "#00e5ff",
                }}
              >
                {c.action}
              </button>
              <div className="flex gap-0.5">
                {Array.from({ length: c.stars }, (_, j) => (
                  <IcStar key={j} size={12} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Certificates Screen ──────────────────────────────────────────────────────

function CertificatesScreen() {
  const certs = [
    { title: "JavaScript Basic", subtitle: "Fundamentos de JavaScript", date: "Maio 2025", locked: false },
    { title: "Lógica de Programação", subtitle: "Algoritmos e Fluxogramas", date: "Abril 2025", locked: false },
    { title: "JavaScript Intermediário", subtitle: "ES6+, Promises & APIs", date: "—", locked: true },
    { title: "Front-End Basic", subtitle: "HTML, CSS & JavaScript", date: "—", locked: true },
  ];

  return (
    <div className="space-y-5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div>
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          Meus Certificados
        </h1>
        <p className="text-[#8882b0] text-base">Diplomas com validação acadêmica da Universidade de Caxias do Sul.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {certs.map((c, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 relative overflow-hidden transition-all"
            style={{
              background: c.locked
                ? "rgba(16,9,46,0.4)"
                : "linear-gradient(135deg, rgba(26,16,64,0.95), rgba(14,9,40,0.95))",
              border: c.locked
                ? "1px solid rgba(42,32,96,0.5)"
                : "1px solid rgba(255,215,0,0.3)",
              boxShadow: c.locked ? "none" : "0 0 25px rgba(255,215,0,0.07)",
              opacity: c.locked ? 0.55 : 1,
            }}
          >
            {!c.locked && (
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-bl-full pointer-events-none"
                style={{ background: "rgba(255,215,0,0.04)" }}
              />
            )}
            <div className="flex items-start justify-between mb-3">
              <IcGraduate color={c.locked ? "#4a4670" : "#ffd700"} size={24} />
              {c.locked ? (
                <IcLock color="#4a4670" />
              ) : (
                <span className="text-xs text-yellow-400 font-bold">UCS</span>
              )}
            </div>
            <div
              className="font-black text-xl mb-0.5"
              style={{ fontFamily: "Rajdhani, sans-serif", color: c.locked ? "#4a4670" : "white" }}
            >
              {c.title}
            </div>
            <div className="text-sm mb-4" style={{ color: c.locked ? "#2a2060" : "#8882b0" }}>
              {c.subtitle}
            </div>
            {!c.locked && (
              <>
                <div className="text-yellow-400/60 text-xs mb-3">{c.date}</div>
                <div
                  className="flex items-center gap-2 p-2 rounded-lg mb-3"
                  style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)" }}
                >
                  <IcShield color="#ffd700" size={14} />
                  <span className="text-yellow-400 text-xs font-semibold">Certificado UCS Validado</span>
                </div>
                <button
                  className="w-full py-2.5 rounded-xl text-yellow-400 text-sm font-bold transition-all"
                  style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,215,0,0.18)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,215,0,0.1)")}
                >
                  Baixar Certificado ↓
                </button>
              </>
            )}
            {c.locked && (
              <div className="text-xs" style={{ color: "#2a2060" }}>
                Complete o módulo para desbloquear
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Ranking Screen ───────────────────────────────────────────────────────────

function RankingScreen() {
  const players = [
    { rank: 1, name: "João Pedro", xp: 1250, streak: 14, avatar: "JP", medal: "🥇" },
    { rank: 2, name: "Maria Clara", xp: 1100, streak: 10, avatar: "MC", medal: "🥈" },
    { rank: 3, name: "Lucas Lima", xp: 870, streak: 7, avatar: "LL", medal: "🥉" },
    { rank: 4, name: "Ana Beatriz", xp: 760, streak: 5, avatar: "AB", medal: "" },
    { rank: 5, name: "Astronauta_Leo", xp: 680, streak: 7, avatar: "AL", medal: "", isUser: true },
    { rank: 6, name: "Pedro Santos", xp: 590, streak: 3, avatar: "PS", medal: "" },
    { rank: 7, name: "Julia Moura", xp: 480, streak: 2, avatar: "JM", medal: "" },
    { rank: 8, name: "Rafael Neto", xp: 320, streak: 1, avatar: "RN", medal: "" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: "Rajdhani, sans-serif" }}>
          🏆 Ranking da Turma
        </h1>
        <span className="text-[#8882b0] text-sm">Semana atual · JavaScript 2025</span>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-4 h-36">
        {[players[1], players[0], players[2]].map((p, i) => (
          <div key={p.rank} className="flex flex-col items-center gap-1">
            <div className="text-2xl mb-1">{p.medal}</div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: i === 1 ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "#1a1440",
                color: i === 1 ? "#08061a" : "#8882b0",
                border: i === 1 ? "none" : "1px solid rgba(124,58,237,0.4)",
                boxShadow: i === 1 ? "0 0 20px rgba(255,215,0,0.5)" : "none",
              }}
            >
              {p.avatar}
            </div>
            <div
              className="w-16 rounded-t-lg flex items-end justify-center pb-2"
              style={{
                height: i === 1 ? "72px" : "52px",
                background: i === 1 ? "rgba(255,215,0,0.15)" : "rgba(26,20,64,0.8)",
                border: i === 1 ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <span className="text-xs font-bold" style={{ color: i === 1 ? "#fbbf24" : "#8882b0" }}>
                #{p.rank}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(16,9,46,0.8)", border: "1px solid rgba(124,58,237,0.2)" }}
      >
        {players.map((p) => (
          <div
            key={p.rank}
            className="flex items-center gap-3 px-4 py-3.5 transition-all"
            style={{
              borderBottom: "1px solid rgba(124,58,237,0.1)",
              background: p.isUser ? "rgba(0,229,255,0.08)" : "transparent",
              borderLeft: p.isUser ? "3px solid #00e5ff" : "3px solid transparent",
            }}
          >
            <span
              className="w-5 text-base font-bold text-center"
              style={{ color: p.rank <= 3 ? "#ffd700" : "#4a4670" }}
            >
              {p.rank}
            </span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: p.isUser ? "linear-gradient(135deg, #00e5ff, #7c3aed)" : "#1a1440",
                color: p.isUser ? "white" : "#8882b0",
                boxShadow: p.isUser ? "0 0 12px rgba(0,229,255,0.3)" : "none",
              }}
            >
              {p.avatar}
            </div>
            <div className="flex-1">
              <span
                className="font-semibold text-base"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  color: p.isUser ? "#00e5ff" : "white",
                  fontWeight: p.isUser ? 700 : 500,
                }}
              >
                {p.name}
                {p.isUser && <span className="text-sm text-[#8882b0] ml-1">(você)</span>}
              </span>
            </div>
            <div className="flex items-center gap-1 text-orange-400 text-sm">
              🔥 {p.streak}
            </div>
            <div
              className="font-bold text-base"
              style={{ fontFamily: "Orbitron, monospace", color: p.isUser ? "#00e5ff" : "#b8b4d0" }}
            >
              {p.xp.toLocaleString("pt-BR")} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Lesson Screen ────────────────────────────────────────────────────────────

const EXPLANATIONS = [
  {
    title: "Bem-vindo ao JavaScript! 🌐",
    text: 'JavaScript é a linguagem de programação mais usada do mundo! Ela roda direto no navegador e também no servidor (Node.js). Com JS você cria sites interativos, apps, jogos e muito mais. Nesta missão você vai escrever seu primeiro programa — o clássico Hello World — e dar o primeiro passo da sua jornada como dev!',
  },
  {
    title: "console.log() — sua voz no código",
    text: 'Em JavaScript, usamos console.log() para exibir mensagens. Pense nele como o "falar" do programa. Basta escrever console.log("sua mensagem") e o texto aparece no terminal. É simples assim! 💡 Dica: você pode passar texto entre aspas simples ou duplas — ambas funcionam perfeitamente.',
  },
];

const JAVA_CODE = `// Módulo 1.1: Seu primeiro Hello World
// Use console.log() para exibir mensagens

console.log("Hello, World!");

console.log("Bem-vindo ao JavaScript! 🚀");

console.log("Minha jornada começa agora!");

// Você pode exibir qualquer texto:
console.log("NEXA Learning OS");
`;

function LessonScreen({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [showButterfly, setShowButterfly] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [bonusXP, setBonusXP] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [code, setCode] = useState(JAVA_CODE);

  const handleAdvance = useCallback(() => {
    if (step < EXPLANATIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setShowButterfly(true);
    }
  }, [step]);

  const handleButterflyDone = useCallback(() => {
    setShowButterfly(false);
    setShowQuiz(true);
  }, []);

  const handleQuizAnswer = useCallback((sawIt: boolean) => {
    setShowQuiz(false);
    setBonusXP(sawIt);
  }, []);

  const handleCompile = useCallback(() => {
    setIsCompiling(true);
    setConsoleLines(["$ node main.js", "Executando..."]);
    setTimeout(() => {
      setIsCompiling(false);
      setConsoleLines([
        "$ node main.js",
        "Hello, World!",
        "Bem-vindo ao JavaScript! 🚀",
        "Minha jornada começa agora!",
        "NEXA Learning OS",
      ]);
      setTimeout(() => setShowVictory(true), 700);
    }, 2000);
  }, []);

  const lineCount = code.split("\n").length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Lesson Header */}
      <div
        className="flex items-center gap-3 pb-3 mb-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.2)" }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm transition-colors"
          style={{ color: "#8882b0" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#8882b0")}
        >
          <IcArrow dir="left" color="#8882b0" size={13} />
          Roadmap
        </button>
        <div className="flex-1 text-center">
          <span className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Módulo 1.1 — Seu primeiro Hello World
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IcBolt color="#ffd700" size={15} />
          <span className="text-yellow-400 text-sm font-bold">+50 XP</span>
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* LEFT — Explanation */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex items-start gap-3 flex-1 min-h-0 overflow-hidden">
            <div className="shrink-0">
              <img src={nexaEstudo} alt="NexaBot estudando" style={{ width: 72, height: "auto", objectFit: "contain" }} />
            </div>
            <div
              className="flex-1 rounded-2xl rounded-tl-none p-5 overflow-y-auto"
              style={{
                background: "rgba(16,9,46,0.85)",
                border: "1px solid rgba(124,58,237,0.3)",
                boxShadow: "0 0 25px rgba(124,58,237,0.08)",
                scrollbarWidth: "none",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 text-xs font-bold">NexaBot</span>
                <span className="text-[#4a4670] text-xs">
                  Passo {step + 1}/{EXPLANATIONS.length}
                </span>
              </div>
              <h3
                className="text-white font-black text-lg mb-3"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                {EXPLANATIONS[step].title}
              </h3>
              <p className="text-[#b8b4d0] text-base leading-relaxed">{EXPLANATIONS[step].text}</p>
              {bonusXP && (
                <div
                  className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)" }}
                >
                  <span className="text-cyan-400 text-xs font-bold">🦋 +10 XP Bônus Borboleta desbloqueado!</span>
                </div>
              )}
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2 justify-center shrink-0">
            {EXPLANATIONS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === step ? "28px" : "10px",
                  background: i <= step ? "#00e5ff" : "#2a2060",
                }}
              />
            ))}
          </div>

          <button
            onClick={handleAdvance}
            className="w-full py-3.5 rounded-xl font-bold text-base text-white transition-all shrink-0"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 0 22px rgba(124,58,237,0.25)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 35px rgba(124,58,237,0.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 22px rgba(124,58,237,0.25)")}
          >
            {step < EXPLANATIONS.length - 1 ? "Avançar Explicação →" : "Finalizar Explicação ✓"}
          </button>
        </div>

        {/* RIGHT — Code Editor */}
        <div
          className="flex flex-col rounded-2xl overflow-hidden min-h-0"
          style={{ border: "1px solid rgba(42,32,96,0.8)", background: "#0d0b1f" }}
        >
          {/* Tab bar */}
          <div
            className="flex items-center gap-2 px-3 py-2 shrink-0"
            style={{ background: "#100d28", borderBottom: "1px solid rgba(42,32,96,0.8)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-md text-xs"
              style={{ background: "#0d0b1f", border: "1px solid rgba(42,32,96,0.8)", color: "#00e5ff", fontFamily: "JetBrains Mono, monospace" }}
            >
              <IcCode color="#00e5ff" size={13} />
              main.js
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 relative overflow-hidden">
            {/* Line numbers */}
            <div
              className="absolute left-0 top-0 bottom-0 select-none pointer-events-none z-10 flex flex-col pt-3"
              style={{ width: "36px", background: "#0d0b1f", borderRight: "1px solid rgba(42,32,96,0.5)" }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-end pr-2"
                  style={{ height: "22px", color: "#3a3660", fontSize: "12px", fontFamily: "JetBrains Mono, monospace" }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="absolute right-0 top-0 bottom-0 bg-transparent resize-none outline-none p-3"
              style={{
                left: "36px",
                color: "#e8e6ff",
                fontFamily: "JetBrains Mono, Consolas, monospace",
                fontSize: "13px",
                lineHeight: "22px",
                caretColor: "#00e5ff",
                scrollbarWidth: "none",
              }}
            />
          </div>

          {/* Console */}
          <div
            className="shrink-0"
            style={{ borderTop: "1px solid rgba(42,32,96,0.8)", background: "#080618" }}
          >
            <div
              className="flex items-center justify-between px-3 py-2"
              style={{ borderBottom: "1px solid rgba(26,24,64,0.8)" }}
            >
              <span className="text-[#4a4670] text-xs" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                TERMINAL
              </span>
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="px-5 py-2 rounded-lg text-sm font-black transition-all"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  background: isCompiling
                    ? "rgba(42,32,96,0.5)"
                    : "linear-gradient(135deg, #00e5ff, #7c3aed)",
                  color: isCompiling ? "#8882b0" : "#08061a",
                  cursor: isCompiling ? "not-allowed" : "pointer",
                  boxShadow: isCompiling ? "none" : "0 0 16px rgba(0,229,255,0.35)",
                }}
              >
                {isCompiling ? "Compilando..." : "Compilar e Executar 🚀"}
              </button>
            </div>
            <div
              className="h-28 overflow-y-auto p-3"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", scrollbarWidth: "none" }}
            >
              {consoleLines.length === 0 ? (
                <span style={{ color: "#3a3660" }}>$ pronto para compilar...</span>
              ) : (
                consoleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      color: line.startsWith("✓")
                        ? "#4ade80"
                        : line.startsWith("Hello") || line.startsWith("Bem-vindo") || line.startsWith("Minha") || line.startsWith("NEXA")
                        ? "#00e5ff"
                        : line.startsWith("$ node")
                        ? "#8882b0"
                        : "#6a6890",
                    }}
                  >
                    {line || " "}
                  </div>
                ))
              )}
              {isCompiling && (
                <span className="animate-pulse" style={{ color: "#fbbf24" }}>
                  █
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showButterfly && <ButterflyEffect onDone={handleButterflyDone} />}
      {showQuiz && <QuizModal onAnswer={handleQuizAnswer} />}
      {showVictory && <VictoryModal bonusXP={bonusXP} onNext={onComplete} />}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

function MainLayout({
  active,
  xp,
  onNavigate,
  children,
}: {
  active: Screen;
  xp: number;
  onNavigate: (s: Screen) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundImage: `url(${spaceBgImg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header xp={xp} onNavigate={onNavigate} />
        <main className="flex-1 overflow-hidden p-5">{children}</main>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [xp, setXP] = useState(2200);

  const navigate = useCallback((s: Screen) => setScreen(s), []);

  const handleLessonComplete = useCallback(() => {
    setXP((prev) => prev + 80);
    setScreen("home");
  }, []);

  if (screen === "login") {
    return (
      <LoginScreen onLogin={() => navigate("home")} onRegister={() => navigate("register")} />
    );
  }
  if (screen === "register") {
    return <RegisterScreen onBack={() => navigate("login")} onDone={() => navigate("home")} />;
  }

  return (
    <MainLayout active={screen} xp={xp} onNavigate={navigate}>
      {screen === "home" && <HomeScreen onNavigate={navigate} xp={xp} />}
      {screen === "profile" && <ProfileScreen />}
      {screen === "roadmap" && <RoadmapScreen onStartLesson={() => navigate("lesson")} />}
      {screen === "courses" && <CoursesScreen />}
      {screen === "certificates" && <CertificatesScreen />}
      {screen === "ranking" && <RankingScreen />}
      {screen === "lesson" && (
        <LessonScreen onComplete={handleLessonComplete} onBack={() => navigate("roadmap")} />
      )}
    </MainLayout>
  );
}

