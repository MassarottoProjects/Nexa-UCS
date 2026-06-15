import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, loadProgress, saveProgress, loadProfile } from "@/lib/supabase";
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
  | "lesson"
  | "final-mission";

// ─── Level System ─────────────────────────────────────────────────────────────

const LEVEL_THRESHOLDS = [0, 40, 130, 250, 450];
const MAX_LEVEL = LEVEL_THRESHOLDS.length;

function calcLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function calcLevelProgress(xp: number): { level: number; xpInLevel: number; xpNeeded: number; nextThreshold: number | null; pct: number } {
  const level = calcLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level] : null;
  if (nextThreshold === null) {
    return { level, xpInLevel: xp - currentThreshold, xpNeeded: 0, nextThreshold: null, pct: 100 };
  }
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - xp;
  const span = nextThreshold - currentThreshold;
  const pct = Math.min(100, Math.round((xpInLevel / span) * 100));
  return { level, xpInLevel, xpNeeded, nextThreshold, pct };
}

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

function VictoryModal({ bonusXP, onNext, moduleId, xpGained }: { bonusXP: boolean; onNext: () => void; moduleId: string; xpGained: number }) {
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
          Módulo {moduleId} — {MODULES[moduleId]?.title} concluído!
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
            +{xpGained} XP
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

// ─── Loading Screen ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg, #08061a 0%, #0d0826 50%, #08061a 100%)" }}
    >
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(38px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; filter: blur(18px); }
          50%       { opacity: 1;   filter: blur(12px); }
        }
      `}</style>

      {/* Glow blob */}
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "rgba(124,58,237,0.18)", animation: "pulseGlow 2.4s ease-in-out infinite" }}
      />

      {/* Orbit ring */}
      <div className="relative w-24 h-24 flex items-center justify-center mb-8">
        <div
          className="absolute w-24 h-24 rounded-full"
          style={{ border: "1px solid rgba(0,229,255,0.15)" }}
        />
        <div
          className="w-3 h-3 rounded-full absolute"
          style={{
            background: "#00e5ff",
            boxShadow: "0 0 10px #00e5ff",
            animation: "orbit 1.4s linear infinite",
          }}
        />
        <img
          src={nexaPos1}
          alt="NexaBot carregando"
          style={{ width: 52, height: "auto", objectFit: "contain", position: "relative", zIndex: 1 }}
        />
      </div>

      <h2
        className="text-xl font-black text-white mb-2"
        style={{ fontFamily: "Orbitron, monospace" }}
      >
        NEXA Learning OS
      </h2>
      <p className="text-[#8882b0] text-sm">Verificando sua missão...</p>
    </div>
  );
}

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({
  onLogin,
  onRegister,
  isLoading,
  error,
}: {
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
  isLoading: boolean;
  error: string | null;
}) {
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

          <div className="flex items-center justify-between mt-4 mb-4 text-sm text-[#8882b0]">
            <button onClick={onRegister} className="hover:text-cyan-400 transition-colors">
              Crie sua conta
            </button>
          </div>

          {error && (
            <div
              className="mb-4 px-3 py-2 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          <button
            onClick={() => onLogin(email, password)}
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "17px",
              background: isLoading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: isLoading ? "none" : "0 0 28px rgba(124,58,237,0.38)",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Entrando...
              </>
            ) : "Entrar"}
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

function RegisterScreen({
  onBack,
  onDone,
  isLoading,
  error,
}: {
  onBack: () => void;
  onDone: (email: string, password: string, username: string) => void;
  isLoading: boolean;
  error: string | null;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex overflow-hidden relative" style={{ backgroundImage: `url(${spaceBgImg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full" style={{ background: "rgba(124,58,237,0.15)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full" style={{ background: "rgba(0,229,255,0.07)", filter: "blur(60px)" }} />
      </div>

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
          <p className="text-[#8882b0] text-center text-base mb-6">
            Junte-se à Nexa e comece sua jornada de aprendizado.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[#b8b4d0] text-base font-medium block mb-2">Nome de Astronauta</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Astronauta_Leo"
                className="w-full rounded-lg px-4 py-3.5 text-white text-base outline-none transition-all placeholder:text-[#3a3660]"
                style={{ background: "rgba(26,18,69,0.6)", border: "2px solid rgba(255,255,255,0.4)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
              />
            </div>
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
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-lg px-4 py-3.5 text-white text-base outline-none transition-all placeholder:text-[#3a3660]"
                style={{ background: "rgba(26,18,69,0.6)", border: "2px solid rgba(255,255,255,0.4)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(0,229,255,0.7)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)")}
              />
            </div>
          </div>

          {error && (
            <div
              className="mt-4 px-3 py-2 rounded-lg text-sm"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          <button
            onClick={() => onDone(email, password, username)}
            disabled={isLoading}
            className="w-full mt-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "17px",
              background: isLoading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: isLoading ? "none" : "0 0 28px rgba(124,58,237,0.38)",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Criando conta...
              </>
            ) : "+ Criar conta"}
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
      className="w-52 shrink-0 flex flex-col h-full relative z-10"
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

function Header({
  xp,
  level,
  username,
  onNavigate,
  onSignOut,
}: {
  xp: number;
  level: number;
  username: string;
  onNavigate: (s: Screen) => void;
  onSignOut: () => void;
}) {
  const { pct } = calcLevelProgress(xp);
  const initials = username.slice(0, 2).toUpperCase();

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
          {username}
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
          Nv.{level}
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
          {xp.toLocaleString("pt-BR")} XP
        </span>
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <IcHeart key={i} filled color="#ff4444" />
        ))}
      </div>

      {/* Avatar + sign out */}
      <button
        onClick={() => onNavigate("profile")}
        className="w-9 h-9 rounded-full font-bold text-sm text-white flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #7c3aed, #00e5ff)" }}
      >
        {initials}
      </button>
      <button
        onClick={onSignOut}
        title="Sair"
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </header>
  );
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

const JS_COURSE_MODULES = ["1.1", "1.2", "1.3", "1.4", "1.5", "1.F"];

function HomeScreen({ onNavigate, xp, completedModules }: { onNavigate: (s: Screen) => void; xp: number; completedModules: string[] }) {
  const { level, pct, xpNeeded, nextThreshold } = calcLevelProgress(xp);
  const completedCount = completedModules.filter((m) => JS_COURSE_MODULES.includes(m)).length;
  const coursePct = Math.round((completedCount / JS_COURSE_MODULES.length) * 100);

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
                Nível {level}
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
                {xp.toLocaleString("pt-BR")} XP
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
              <div className="text-[#8882b0] text-sm mb-2">JavaScript Básico — {completedCount}/{JS_COURSE_MODULES.length} módulos</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1a1440" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${coursePct}%`, background: "linear-gradient(90deg, #00e5ff, #7c3aed)" }} />
                </div>
                <span className="text-[#8882b0] text-sm">{coursePct}%</span>
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

function ProfileScreen({
  username,
  xp,
  level,
  completedModules,
}: {
  username: string;
  xp: number;
  level: number;
  completedModules: string[];
}) {
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
              {username}
            </h2>
            <span
              className="inline-block mt-1.5 px-3 py-1 rounded-md text-yellow-400 text-sm font-bold"
              style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.3)" }}
            >
              Nível {level}
            </span>
            <p className="text-[#8882b0] text-sm mt-2">Aluno · Jardelino Ramos</p>
          </div>
        </div>

        {/* Divisor vertical */}
        <div className="self-stretch w-px shrink-0 relative z-10" style={{ background: "rgba(124,58,237,0.25)" }} />

        {/* Stats em grid 2×2 */}
        <div className="flex-1 grid grid-cols-2 gap-5 relative z-10">
          {[
            { val: xp.toLocaleString("pt-BR"), label: "XP Total", color: "#00e5ff", icon: "⚡" },
            { val: `${completedModules.length}`, label: "Módulos concluídos", color: "#f97316", icon: "🔥" },
            { val: `${completedModules.length}`, label: "Badges", color: "#b040ff", icon: "🏅" },
            { val: `Nv.${level}`, label: "Nível atual", color: "#ffd700", icon: "🏆" },
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

function RoadmapScreen({ onStartLesson, completedModules, onStartFinalMission }: { onStartLesson: (id: string) => void; completedModules: string[]; onStartFinalMission: () => void }) {
  const MODULE_ORDER = ["1.1", "1.2", "1.3", "1.4", "1.5"];
  const subtitles: Record<string, string> = {
    "1.1": "(console.log)",
    "1.2": "(let, const, var)",
    "1.3": "",
    "1.4": "",
    "1.5": "(for/while)",
  };

  const missions = MODULE_ORDER.map((id) => {
    const mod = MODULES[id];
    const isDone = completedModules.includes(id);
    const idx = MODULE_ORDER.indexOf(id);
    const prevId = idx > 0 ? MODULE_ORDER[idx - 1] : null;
    const isUnlocked = idx === 0 || (prevId !== null && completedModules.includes(prevId));
    const status: "done" | "active" | "locked" = isDone ? "done" : isUnlocked ? "active" : "locked";
    return { id, title: mod.title, subtitle: subtitles[id], xp: mod.xp, status };
  });

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
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}
                >
                  Concluída ✓
                </span>
                <button
                  onClick={() => onStartLesson(m.id)}
                  className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#b040ff" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.28)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(124,58,237,0.15)")}
                >
                  Refazer
                </button>
              </div>
            )}
            {m.status === "active" && (
              <button
                onClick={() => onStartLesson(m.id)}
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

        {/* Missão Final card */}
        {(() => {
          const finalUnlocked = completedModules.includes("1.5");
          const finalDone = completedModules.includes("1.F");
          return (
            <div
              className="relative flex items-center gap-4 rounded-xl p-4 transition-all"
              style={{
                background: finalDone
                  ? "rgba(14,26,16,0.9)"
                  : finalUnlocked
                  ? "linear-gradient(135deg, rgba(40,28,8,0.95), rgba(26,18,4,0.95))"
                  : "rgba(16,9,46,0.5)",
                border: finalDone
                  ? "1px solid rgba(34,197,94,0.3)"
                  : finalUnlocked
                  ? "1px solid rgba(255,215,0,0.55)"
                  : "1px solid rgba(124,58,237,0.12)",
                boxShadow: finalUnlocked && !finalDone ? "0 0 28px rgba(255,215,0,0.12)" : "none",
                opacity: finalUnlocked ? 1 : 0.5,
              }}
            >
              {/* Gold glow layer */}
              {finalUnlocked && !finalDone && (
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.06) 0%, transparent 70%)" }}
                />
              )}

              {/* Status indicator */}
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: finalDone
                    ? "rgba(34,197,94,0.2)"
                    : finalUnlocked
                    ? "rgba(255,215,0,0.15)"
                    : "#1a1440",
                  border: finalDone
                    ? "1px solid #22c55e"
                    : finalUnlocked
                    ? "1px solid rgba(255,215,0,0.7)"
                    : "1px solid #2a2060",
                  boxShadow: finalUnlocked && !finalDone ? "0 0 14px rgba(255,215,0,0.4)" : "none",
                }}
              >
                {finalDone && <IcCheck color="#22c55e" />}
                {!finalDone && finalUnlocked && <IcTrophy active />}
                {!finalDone && !finalUnlocked && <IcLock color="#4a4670" />}
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="font-bold text-base"
                    style={{
                      fontFamily: "Rajdhani, sans-serif",
                      color: finalDone ? "#4ade80" : finalUnlocked ? "#ffd700" : "#8882b0",
                    }}
                  >
                    Missão Final — Academia JS
                  </span>
                  {finalUnlocked && !finalDone && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-black uppercase"
                      style={{ background: "rgba(255,215,0,0.15)", color: "#ffd700", border: "1px solid rgba(255,215,0,0.35)", fontFamily: "Orbitron, monospace", fontSize: "9px" }}
                    >
                      BOSS
                    </span>
                  )}
                </div>
                <div className="text-[#8882b0] text-sm">+100 XP · Badge Guardião da Academia</div>
              </div>

              {finalDone && (
                <div className="flex items-center gap-2 relative z-10">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}
                  >
                    Concluída ✓
                  </span>
                  <button
                    onClick={onStartFinalMission}
                    className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
                    style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.35)", color: "#ffd700" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,215,0,0.22)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,215,0,0.12)")}
                  >
                    Refazer
                  </button>
                </div>
              )}
              {finalUnlocked && !finalDone && (
                <button
                  onClick={onStartFinalMission}
                  className="px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap relative z-10"
                  style={{
                    fontFamily: "Rajdhani, sans-serif",
                    background: "linear-gradient(135deg, #ffd700, #ffaa00)",
                    color: "#08061a",
                    boxShadow: "0 0 20px rgba(255,215,0,0.45)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 32px rgba(255,215,0,0.65)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 20px rgba(255,215,0,0.45)")}
                >
                  INICIAR MISSÃO
                </button>
              )}
            </div>
          );
        })()}

        {/* Next module teaser */}
        <div
          className="rounded-xl p-4 text-center opacity-35"
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

// ─── Module Content Data ─────────────────────────────────────────────────────

interface ModuleData {
  title: string;
  xp: number;
  filename: string;
  explanations: { title: string; text: string }[];
  starterCode: string;
  expectedOutput: string[];
}

const MODULES: Record<string, ModuleData> = {
  "1.1": {
    title: "Seu primeiro Hello World",
    xp: 50,
    filename: "hello.js",
    explanations: [
      {
        title: "Bem-vindo ao JavaScript! 🌐",
        text: 'JavaScript é a linguagem de programação mais usada do mundo! Ela roda direto no navegador e também no servidor (Node.js). Com JS você cria sites interativos, apps, jogos e muito mais. Nesta missão você vai escrever seu primeiro programa — o clássico Hello World — e dar o primeiro passo da sua jornada como dev!',
      },
      {
        title: "console.log() — sua voz no código",
        text: 'Em JavaScript, usamos console.log() para exibir mensagens. Pense nele como o "falar" do programa. Basta escrever console.log("sua mensagem") e o texto aparece no terminal. É simples assim! 💡 Dica: você pode passar texto entre aspas simples ou duplas — ambas funcionam perfeitamente.',
      },
    ],
    starterCode: `// Módulo 1.1: Seu primeiro Hello World
// Use console.log() para exibir mensagens

console.log("Hello, World!");

console.log("Bem-vindo ao JavaScript! 🚀");

console.log("Minha jornada começa agora!");

// Você pode exibir qualquer texto:
console.log("NEXA Learning OS");
`,
    expectedOutput: [
      "$ node hello.js",
      "Hello, World!",
      "Bem-vindo ao JavaScript! 🚀",
      "Minha jornada começa agora!",
      "NEXA Learning OS",
    ],
  },

  "1.2": {
    title: "Variáveis e Tipos de Dados",
    xp: 70,
    filename: "variaveis.js",
    explanations: [
      {
        title: "O que são variáveis? 📦",
        text: 'Variáveis são como caixas com etiqueta: você guarda um valor dentro e usa o nome da etiqueta para acessar esse valor mais tarde. Em vez de repetir "Astronauta_Leo" em 50 lugares do código, você guarda uma vez e reutiliza em todo lugar. Isso é a base de qualquer programa!',
      },
      {
        title: "let, const e var — qual usar?",
        text: 'Use const para valores que nunca mudam (ex: PI = 3.14). Use let para valores que podem ser alterados depois (ex: pontuação do jogador). Evite var — ele é mais antigo e causa comportamentos inesperados. Regra de ouro: sempre comece com const e troque para let só quando precisar mudar o valor.',
      },
      {
        title: "Tipos primitivos de dados 🔢",
        text: 'JavaScript tem 3 tipos mais comuns: string (texto entre aspas: "Olá"), number (número: 42 ou 3.14) e boolean (true ou false). O operador typeof te diz o tipo de qualquer valor. Ex: typeof "Olá" retorna "string". Saber o tipo de uma variável evita muitos bugs!',
      },
    ],
    starterCode: `// Módulo 1.2: Variáveis e Tipos de Dados

// String — texto
const nome = "Astronauta_Leo";
let missaoAtual = "Hello World";

// Number — número
const nivel = 4;
let xp = 2200;

// Boolean — verdadeiro ou falso
const aprovado = true;

// Exibindo os valores e seus tipos
console.log("Nome:", nome);
console.log("Tipo de nome:", typeof nome);

console.log("Nível:", nivel);
console.log("Tipo de nivel:", typeof nivel);

console.log("Aprovado:", aprovado);
console.log("Tipo de aprovado:", typeof aprovado);

// Mudando um let
xp = xp + 70;
console.log("Novo XP:", xp);
`,
    expectedOutput: [
      "$ node variaveis.js",
      "Nome: Astronauta_Leo",
      "Tipo de nome: string",
      "Nível: 4",
      "Tipo de nivel: number",
      "Aprovado: true",
      "Tipo de aprovado: boolean",
      "Novo XP: 2270",
    ],
  },

  "1.3": {
    title: "Operadores e Expressões",
    xp: 60,
    filename: "operadores.js",
    explanations: [
      {
        title: "Operadores aritméticos ➕",
        text: 'Os operadores aritméticos fazem cálculos matemáticos: + (soma), - (subtração), * (multiplicação), / (divisão), % (resto da divisão). O % é muito útil: 10 % 3 retorna 1 porque 10 dividido por 3 sobra 1. Você usa isso para saber se um número é par (num % 2 === 0) ou ímpar!',
      },
      {
        title: "Operadores de comparação 🔍",
        text: 'Comparação retorna true ou false. Use === (igual em valor E tipo), !== (diferente), > (maior que), < (menor que), >= (maior ou igual), <= (menor ou igual). IMPORTANTE: sempre prefira === em vez de == para evitar surpresas, pois == faz conversão automática de tipos — o que pode causar bugs difíceis de achar!',
      },
      {
        title: "Operadores lógicos 🧠",
        text: 'Combinam condições: && (E — ambas precisam ser verdadeiras), || (OU — basta uma ser verdadeira), ! (NÃO — inverte o valor). Ex: idade >= 16 && temCarteira === true verifica se pode dirigir. Ex: chovendo || frio será true se qualquer um for verdadeiro. São a base do raciocínio lógico em código!',
      },
    ],
    starterCode: `// Módulo 1.3: Operadores e Expressões

// Aritméticos
const nota1 = 8.5;
const nota2 = 7.0;
const media = (nota1 + nota2) / 2;
console.log("Média:", media);

const resto = 17 % 5;
console.log("17 % 5 =", resto);

// Comparação
const passou = media >= 7.0;
console.log("Passou?", passou);
console.log("Notas iguais?", nota1 === nota2);

// Lógicos
const temFrequencia = true;
const aprovado = passou && temFrequencia;
console.log("Aprovado com frequência?", aprovado);

const precisaRecuperar = !aprovado || media < 5.0;
console.log("Precisa de recuperação?", precisaRecuperar);
`,
    expectedOutput: [
      "$ node operadores.js",
      "Média: 7.75",
      "17 % 5 = 2",
      "Passou? true",
      "Notas iguais? false",
      "Aprovado com frequência? true",
      "Precisa de recuperação? false",
    ],
  },

  "1.4": {
    title: "Condicionais (if/else)",
    xp: 80,
    filename: "condicionais.js",
    explanations: [
      {
        title: "Tomando decisões no código 🤔",
        text: 'Programas precisam tomar decisões, assim como você: "Se estiver chovendo, pegue o guarda-chuva". O if é exatamente isso — ele executa um bloco de código apenas SE uma condição for verdadeira. Sem condicionais, seu programa faria sempre a mesma coisa, não importa a situação. Com eles, seu código ganha inteligência!',
      },
      {
        title: "if / else if / else — o trio decisivo",
        text: 'A estrutura completa: if (condição1) { ... } else if (condição2) { ... } else { ... }. O JS verifica de cima para baixo e executa o primeiro bloco cujo condição seja true. O else é o "caso nenhum dos anteriores". Você pode encadear quantos else if precisar, mas muitos deles é sinal de que pode haver uma solução mais elegante!',
      },
      {
        title: "Operador ternário — if em uma linha ⚡",
        text: 'Para casos simples, use o ternário: condição ? valorSeVerdadeiro : valorSeFalso. Ex: const status = nota >= 7 ? "Aprovado" : "Reprovado". É muito usado para definir valores de variáveis ou renderizar elementos em React. Mas cuidado: não aninhe ternários — o código fica ilegível. Prefira o if/else para lógicas complexas.',
      },
    ],
    starterCode: `// Módulo 1.4: Condicionais (if/else)

// Sistema de classificação de notas
function classificarNota(nota) {
  if (nota >= 9.0) {
    return "A — Excelente! 🏆";
  } else if (nota >= 7.5) {
    return "B — Muito bom! ⭐";
  } else if (nota >= 6.0) {
    return "C — Bom, mas pode melhorar 📚";
  } else if (nota >= 5.0) {
    return "D — Recuperação necessária ⚠️";
  } else {
    return "F — Reprovado 💀";
  }
}

const minhaNote = 8.2;
console.log("Nota:", minhaNote);
console.log("Classificação:", classificarNota(minhaNote));

// Operador ternário
const status = minhaNote >= 7.0 ? "✅ Aprovado" : "❌ Reprovado";
console.log("Status:", status);

// Verificação de par/ímpar
const numero = 42;
const paridade = numero % 2 === 0 ? "par" : "ímpar";
console.log(numero, "é", paridade);
`,
    expectedOutput: [
      "$ node condicionais.js",
      "Nota: 8.2",
      "Classificação: B — Muito bom! ⭐",
      "Status: ✅ Aprovado",
      "42 é par",
    ],
  },

  "1.5": {
    title: "Laços de Repetição",
    xp: 90,
    filename: "loops.js",
    explanations: [
      {
        title: "Por que loops existem? 🔁",
        text: 'Imagina imprimir os números de 1 a 100 com console.log um por um — seriam 100 linhas iguais! Loops resolvem isso: permitem repetir um bloco de código quantas vezes precisar. São essenciais para percorrer listas de alunos, calcular médias de turmas inteiras, ou processar qualquer quantidade de dados automaticamente.',
      },
      {
        title: "for — quando sabemos o número de repetições",
        text: 'Estrutura: for (início; condição; incremento) { ... }. Ex: for (let i = 1; i <= 5; i++) — começa em 1, vai até 5, somando 1 a cada vez. O i++ é abreviação de i = i + 1. O for é ideal quando você sabe exatamente quantas vezes vai repetir. Muito usado para percorrer arrays com for (let i = 0; i < array.length; i++).',
      },
      {
        title: "while — quando repetimos até uma condição mudar",
        text: 'Estrutura: while (condição) { ... }. Ele repete enquanto a condição for true. Cuidado: se a condição nunca mudar, você cria um loop infinito que trava o programa! SEMPRE certifique que algo dentro do while vai eventualmente tornar a condição false. Use while quando não souber de antemão quantas repetições serão necessárias.',
      },
    ],
    starterCode: `// Módulo 1.5: Laços de Repetição

// FOR — contando de 1 a 5
console.log("--- Contando com for ---");
for (let i = 1; i <= 5; i++) {
  console.log("Contagem:", i);
}

// FOR — tabuada do 3
console.log("--- Tabuada do 3 ---");
for (let i = 1; i <= 5; i++) {
  console.log("3 x " + i + " = " + (3 * i));
}

// WHILE — decolagem
console.log("--- Decolagem ---");
let contador = 5;
while (contador > 0) {
  console.log("T-" + contador + "...");
  contador--;
}
console.log("🚀 Decolagem!");
`,
    expectedOutput: [
      "$ node loops.js",
      "--- Contando com for ---",
      "Contagem: 1",
      "Contagem: 2",
      "Contagem: 3",
      "Contagem: 4",
      "Contagem: 5",
      "--- Tabuada do 3 ---",
      "3 x 1 = 3",
      "3 x 2 = 6",
      "3 x 3 = 9",
      "3 x 4 = 12",
      "3 x 5 = 15",
      "--- Decolagem ---",
      "T-5...",
      "T-4...",
      "T-3...",
      "T-2...",
      "T-1...",
      "🚀 Decolagem!",
    ],
  },
};

function LessonScreen({ onComplete, onBack, moduleId }: { onComplete: () => void; onBack: () => void; moduleId: string }) {
  const mod = MODULES[moduleId] ?? MODULES["1.1"];
  const [step, setStep] = useState(0);
  const [showButterfly, setShowButterfly] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [bonusXP, setBonusXP] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [code, setCode] = useState(mod.starterCode);

  // Reset when moduleId changes
  useEffect(() => {
    const m = MODULES[moduleId] ?? MODULES["1.1"];
    setCode(m.starterCode);
    setStep(0);
    setShowButterfly(false);
    setShowQuiz(false);
    setShowVictory(false);
    setBonusXP(false);
    setIsCompiling(false);
    setConsoleLines([]);
  }, [moduleId]);

  const handleAdvance = useCallback(() => {
    if (step < mod.explanations.length - 1) {
      setStep((s) => s + 1);
    } else {
      setShowButterfly(true);
    }
  }, [step, mod.explanations.length]);

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
    setConsoleLines([mod.expectedOutput[0], "Executando..."]);
    setTimeout(() => {
      setIsCompiling(false);
      setConsoleLines(mod.expectedOutput);
      setTimeout(() => setShowVictory(true), 700);
    }, 2000);
  }, [mod.expectedOutput]);

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
            Módulo {moduleId} — {mod.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IcBolt color="#ffd700" size={15} />
          <span className="text-yellow-400 text-sm font-bold">+{mod.xp} XP</span>
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
                  Passo {step + 1}/{mod.explanations.length}
                </span>
              </div>
              <h3
                className="text-white font-black text-lg mb-3"
                style={{ fontFamily: "Rajdhani, sans-serif" }}
              >
                {mod.explanations[step].title}
              </h3>
              <p className="text-[#b8b4d0] text-base leading-relaxed">{mod.explanations[step].text}</p>
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
            {mod.explanations.map((_, i) => (
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
            {step < mod.explanations.length - 1 ? "Avançar Explicação →" : "Finalizar Explicação ✓"}
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
              {mod.filename}
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
                      color: i === 0
                        ? "#8882b0"
                        : line === "Executando..."
                        ? "#6a6890"
                        : line.startsWith("---")
                        ? "#b040ff"
                        : "#00e5ff",
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
      {showVictory && <VictoryModal bonusXP={bonusXP} onNext={onComplete} moduleId={moduleId} xpGained={mod.xp + (bonusXP ? 10 : 0)} />}
    </div>
  );
}

// ─── Final Victory Modal ─────────────────────────────────────────────────────

const FINAL_CONFETTI = Array.from({ length: 36 }, (_, i) => ({
  left: `${((i * 2.78 + 5) % 96) + 2}%`,
  top: `${((i * 5.83 + 8) % 90) + 2}%`,
  color:
    i % 4 === 0 ? "#ffd700"
    : i % 4 === 1 ? "#ffa500"
    : i % 4 === 2 ? "#00e5ff"
    : "#b040ff",
  w: 5 + (i % 6) * 2,
  h: 5 + (i % 4) * 2,
  rot: (i * 23) % 180,
}));

function FinalVictoryModal({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(8,6,26,0.9)", backdropFilter: "blur(12px)" }}
    >
      {/* Dense golden particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FINAL_CONFETTI.map((p, i) => (
          <div
            key={i}
            className="absolute opacity-80"
            style={{
              left: p.left,
              top: p.top,
              width: p.w,
              height: p.h,
              background: p.color,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              transform: `rotate(${p.rot}deg)`,
              boxShadow: `0 0 ${p.w * 1.5}px ${p.color}88`,
            }}
          />
        ))}
      </div>

      <div
        className="relative rounded-3xl p-8 max-w-lg w-full mx-4 text-center"
        style={{
          background: "linear-gradient(160deg, #16093a 0%, #0e071f 100%)",
          border: "1px solid rgba(255,215,0,0.5)",
          boxShadow: "0 0 80px rgba(255,215,0,0.22), 0 0 40px rgba(124,58,237,0.18), inset 0 1px 0 rgba(255,215,0,0.15)",
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.12) 0%, transparent 65%)" }}
        />

        {/* NexaBot */}
        <div className="flex justify-center mb-5 relative z-10">
          <img src={nexaComemora} alt="NexaBot comemorando" style={{ width: 130, height: "auto", objectFit: "contain", filter: "drop-shadow(0 0 18px rgba(255,215,0,0.4))" }} />
        </div>

        {/* Title */}
        <h2
          className="text-4xl font-black mb-2 relative z-10"
          style={{
            fontFamily: "Orbitron, monospace",
            background: "linear-gradient(135deg, #ffd700, #ffaa00, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 12px rgba(255,215,0,0.5))",
          }}
        >
          Missão Concluída!
        </h2>
        <p className="text-[#b8b4d0] text-sm leading-relaxed mb-6 relative z-10 max-w-sm mx-auto">
          Você dominou os conceitos fundamentais de JavaScript e está pronto para avançar para o próximo módulo.
        </p>

        {/* Rewards */}
        <div className="grid grid-cols-3 gap-3 mb-5 relative z-10">
          {/* XP */}
          <div
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.3)" }}
          >
            <span className="text-2xl font-black text-yellow-400" style={{ fontFamily: "Orbitron, monospace" }}>+100</span>
            <span className="text-yellow-400 text-xs font-bold">XP</span>
          </div>
          {/* Level */}
          <div
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.3)" }}
          >
            <span className="text-2xl font-black text-cyan-400" style={{ fontFamily: "Orbitron, monospace" }}>+1</span>
            <span className="text-cyan-400 text-xs font-bold text-center leading-tight">Nível de Herói</span>
          </div>
          {/* Badge */}
          <div
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{ background: "rgba(176,64,255,0.08)", border: "1px solid rgba(176,64,255,0.3)" }}
          >
            <IcShield color="#b040ff" size={24} />
            <span className="text-purple-400 text-xs font-bold text-center leading-tight">Guardião da Academia</span>
          </div>
        </div>

        {/* Badge full */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-6 relative z-10"
          style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.25)" }}
        >
          <IcGraduate color="#ffd700" size={24} />
          <div className="text-left">
            <div className="text-yellow-400 font-bold text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
              Badge: Guardião da Academia 🛡️
            </div>
            <div className="text-[#8882b0] text-xs">Selo UCS — Módulo 1 JavaScript completo</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onContinue}
          className="relative z-10 w-full py-4 rounded-2xl font-black text-lg text-[#08061a] transition-all"
          style={{
            fontFamily: "Orbitron, monospace",
            background: "linear-gradient(135deg, #ffd700, #ffaa00, #ffd700)",
            backgroundSize: "200% 200%",
            boxShadow: "0 0 40px rgba(255,215,0,0.55), 0 4px 20px rgba(255,160,0,0.3)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 60px rgba(255,215,0,0.75), 0 4px 24px rgba(255,160,0,0.4)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 40px rgba(255,215,0,0.55), 0 4px 20px rgba(255,160,0,0.3)")}
        >
          Continuar Jornada 🚀
        </button>
      </div>
    </div>
  );
}

// ─── Final Mission Screen ─────────────────────────────────────────────────────

interface FinalStage {
  label: string;
  emoji: string;
  filename: string;
  description: string;
  hint: string;
  starterCode: string;
  expectedOutput: string[];
  objectives: string[];
}

const FINAL_STAGES: FinalStage[] = [
  {
    label: "Variáveis",
    emoji: "📦",
    filename: "etapa-1.js",
    description: "Antes de verificar as notas, precisamos declarar nossas variáveis de trabalho e entender o que temos disponível.",
    hint: "Use console.log('nome:', variavel) para exibir o nome e o valor juntos na mesma linha.",
    starterCode: `const notaMinima = 7;
const notas = [8, 5, 10, 7, 6];

// Etapa 1: use console.log para exibir as variáveis abaixo
`,
    expectedOutput: [
      "$ node etapa-1.js",
      "notaMinima: 7",
      "notas: [8,5,10,7,6]",
      "Total de alunos: 5",
    ],
    objectives: [
      "Declare a variável notaMinima com valor 7",
      "Declare o array notas com as 5 notas",
      "Exiba notaMinima com console.log",
      "Exiba o array notas com console.log",
      "Exiba o total de alunos (notas.length)",
    ],
  },
  {
    label: "Condicionais",
    emoji: "🔀",
    filename: "etapa-2.js",
    description: "Ótimo! Agora use if/else para verificar individualmente se cada nota atingiu a nota mínima de aprovação.",
    hint: "Use if (nota >= notaMinima) { console.log('Aprovado') } else { console.log('Reprovado') } para cada aluno.",
    starterCode: `const notaMinima = 7;
const notas = [8, 5, 10, 7, 6];

// Etapa 2: verifique individualmente com if/else
// Exemplo: const nota1 = notas[0];
//          if (nota1 >= notaMinima) { ... }

`,
    expectedOutput: [
      "$ node etapa-2.js",
      "Aluno 1 (nota 8): Aprovado",
      "Aluno 2 (nota 5): Reprovado",
      "Aluno 3 (nota 10): Aprovado",
    ],
    objectives: [
      "Acesse notas[0], notas[1] e notas[2] individualmente",
      "Use if/else para comparar cada nota com notaMinima",
      "Exiba 'Aprovado' ou 'Reprovado' para cada aluno",
    ],
  },
  {
    label: "Loop",
    emoji: "🔁",
    filename: "etapa-3.js",
    description: "Quase lá! Agora use um laço for para processar todos os 5 alunos automaticamente e contar os aprovados.",
    hint: "Combine um FOR com um IF dentro: for(let i=0; i<notas.length; i++) { if(notas[i] >= notaMinima) { aprovados++; } }",
    starterCode: `const notaMinima = 7;
const notas = [8, 5, 10, 7, 6];
let aprovados = 0;

// Etapa 3: use um for para percorrer todas as notas
`,
    expectedOutput: [
      "$ node etapa-3.js",
      "Aluno 1: Aprovado",
      "Aluno 2: Reprovado",
      "Aluno 3: Aprovado",
      "Aluno 4: Aprovado",
      "Aluno 5: Reprovado",
      "",
      "Total de aprovados: 3",
    ],
    objectives: [
      "Use um laço for para percorrer todas as notas",
      "Verifique aprovação de cada aluno com if/else",
      "Exiba o resultado de cada aluno numerado",
      "Conte os aprovados com uma variável contador",
      "Exiba o total de aprovados ao final",
    ],
  },
];

function FinalMissionScreen({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [stagesDone, setStagesDone] = useState<number[]>([]);
  const [code, setCode] = useState(FINAL_STAGES[0].starterCode);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);

  const stage = FINAL_STAGES[currentStage];
  const isStageDone = stagesDone.includes(currentStage);
  const lineCount = code.split("\n").length;

  useEffect(() => {
    setCode(FINAL_STAGES[currentStage].starterCode);
    setConsoleLines([]);
    setShowHint(false);
    setCompletedObjectives([]);
  }, [currentStage]);

  const handleRun = useCallback(() => {
    if (isRunning || isStageDone) return;
    setIsRunning(true);
    setConsoleLines([`$ node ${stage.filename}`, "Executando..."]);
    setCompletedObjectives([]);

    setTimeout(() => {
      setConsoleLines(stage.expectedOutput);
      setCompletedObjectives(stage.objectives.map((_, i) => i));
      setIsRunning(false);
      setStagesDone((prev) => prev.includes(currentStage) ? prev : [...prev, currentStage]);

      if (currentStage === FINAL_STAGES.length - 1) {
        setTimeout(() => setShowVictory(true), 1200);
      }
    }, 1800);
  }, [isRunning, isStageDone, stage, currentStage]);

  const handleNextStage = useCallback(() => {
    if (currentStage < FINAL_STAGES.length - 1) {
      setCurrentStage((s) => s + 1);
    }
  }, [currentStage]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 pb-3 mb-3 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,215,0,0.2)" }}
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
        <div className="flex-1 flex items-center justify-center gap-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,160,0,0.15))",
              border: "1px solid rgba(255,215,0,0.5)",
              color: "#ffd700",
              fontFamily: "Orbitron, monospace",
            }}
          >
            MISSÃO FINAL
          </span>
          <span className="text-white font-bold text-base" style={{ fontFamily: "Rajdhani, sans-serif" }}>
            Academia JS — Verificação de Aprovações
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IcBolt color="#ffd700" size={15} />
          <span className="text-yellow-400 text-sm font-bold">+100 XP</span>
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="flex items-center gap-2 mb-3 shrink-0">
        {FINAL_STAGES.map((s, i) => {
          const done = stagesDone.includes(i);
          const active = i === currentStage;
          const locked = i > 0 && !stagesDone.includes(i - 1) && !done;
          return (
            <div key={i} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => !locked && setCurrentStage(i)}
                disabled={locked}
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all w-full"
                style={{
                  background: done ? "rgba(34,197,94,0.12)" : active ? "rgba(0,229,255,0.1)" : "rgba(16,9,46,0.6)",
                  border: done ? "1px solid rgba(34,197,94,0.4)" : active ? "1px solid rgba(0,229,255,0.5)" : "1px solid rgba(42,32,96,0.6)",
                  cursor: locked ? "not-allowed" : "pointer",
                  opacity: locked ? 0.45 : 1,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: done ? "rgba(34,197,94,0.2)" : active ? "rgba(0,229,255,0.15)" : "#1a1440",
                    border: done ? "1px solid #22c55e" : active ? "1px solid #00e5ff" : "1px solid #2a2060",
                    boxShadow: active ? "0 0 10px rgba(0,229,255,0.4)" : "none",
                  }}
                >
                  {done ? <IcCheck color="#22c55e" /> : locked ? <IcLock color="#4a4670" /> : <span className="text-cyan-400 text-[10px] font-black">{i + 1}</span>}
                </div>
                <div className="text-left min-w-0">
                  <div className="text-xs font-black leading-none" style={{ fontFamily: "Rajdhani, sans-serif", color: done ? "#4ade80" : active ? "#00e5ff" : "#4a4670" }}>
                    {s.emoji} {s.label}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: done ? "#4ade80" : active ? "#8882b0" : "#3a3660" }}>
                    {done ? "Concluída" : active ? "Em andamento" : "Bloqueada"}
                  </div>
                </div>
              </button>
              {i < FINAL_STAGES.length - 1 && (
                <div className="w-4 h-px shrink-0" style={{ background: stagesDone.includes(i) ? "#22c55e" : "rgba(42,32,96,0.8)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Split Screen */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">

        {/* LEFT — Instructions panel */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* NexaBot + Description bubble */}
          <div className="flex items-start gap-3 shrink-0">
            <div className="shrink-0">
              <img src={isStageDone && currentStage === FINAL_STAGES.length - 1 ? nexaComemora : nexaLuta} alt="NexaBot" style={{ width: 64, height: "auto", objectFit: "contain" }} />
            </div>
            <div
              className="flex-1 rounded-2xl rounded-tl-none p-4"
              style={{ background: "rgba(16,9,46,0.85)", border: `1px solid ${isStageDone ? "rgba(34,197,94,0.25)" : "rgba(255,215,0,0.2)"}` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: isStageDone ? "#22c55e" : "#ffd700" }} />
                <span className="text-xs font-bold" style={{ color: isStageDone ? "#4ade80" : "#ffd700" }}>
                  {isStageDone ? "Etapa concluída! 🎉" : `Etapa ${currentStage + 1} — ${stage.label}`}
                </span>
              </div>
              <p className="text-[#b8b4d0] text-sm leading-relaxed">{stage.description}</p>
            </div>
          </div>

          {/* Objectives */}
          <div
            className="flex-1 rounded-2xl p-4 overflow-y-auto min-h-0"
            style={{ background: "rgba(16,9,46,0.85)", border: "1px solid rgba(124,58,237,0.25)", scrollbarWidth: "none" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <IcBolt color="#ffd700" size={14} />
              <span className="text-white font-black text-sm" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                O que você precisa fazer
              </span>
            </div>
            <div className="space-y-2.5">
              {stage.objectives.map((obj, i) => {
                const done = completedObjectives.includes(i);
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: done ? "rgba(34,197,94,0.2)" : "rgba(42,32,96,0.8)",
                        border: done ? "1px solid #22c55e" : "1px solid rgba(124,58,237,0.3)",
                        boxShadow: done ? "0 0 10px rgba(34,197,94,0.3)" : "none",
                      }}
                    >
                      {done
                        ? <IcCheck color="#22c55e" />
                        : <span className="text-[#4a4670] text-xs font-bold">{i + 1}</span>
                      }
                    </div>
                    <span
                      className="text-sm leading-snug transition-colors"
                      style={{ color: done ? "#4ade80" : "#b8b4d0" }}
                    >
                      {obj}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hint */}
            {showHint && (
              <div
                className="mt-4 p-3 rounded-xl"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.4)" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-purple-400 text-xs font-bold">💡 Dica do NexaBot</span>
                </div>
                <p className="text-[#b8b4d0] text-xs leading-relaxed">{stage.hint}</p>
              </div>
            )}
          </div>

          {/* Bottom buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowHint((h) => !h)}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
              style={{
                fontFamily: "Rajdhani, sans-serif",
                background: showHint ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.45)",
                color: "#b040ff",
              }}
            >
              {showHint ? "Ocultar Dica" : "💡 Dica"}
            </button>
            {isStageDone && currentStage < FINAL_STAGES.length - 1 && (
              <button
                onClick={handleNextStage}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  background: "linear-gradient(135deg, rgba(0,229,255,0.18), rgba(124,58,237,0.18))",
                  border: "1px solid rgba(0,229,255,0.5)",
                  color: "#00e5ff",
                  boxShadow: "0 0 16px rgba(0,229,255,0.2)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 24px rgba(0,229,255,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 16px rgba(0,229,255,0.2)")}
              >
                Próxima Etapa →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT — Code editor + Console */}
        <div
          className="flex flex-col rounded-2xl overflow-hidden min-h-0"
          style={{ border: `1px solid ${isStageDone ? "rgba(34,197,94,0.35)" : "rgba(42,32,96,0.8)"}`, background: "#0d0b1f" }}
        >
          {/* Tab bar */}
          <div
            className="flex items-center gap-2 px-3 py-2 shrink-0"
            style={{ background: "#100d28", borderBottom: "1px solid rgba(42,32,96,0.8)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-md text-xs"
              style={{ background: "#0d0b1f", border: `1px solid ${isStageDone ? "rgba(34,197,94,0.4)" : "rgba(255,215,0,0.3)"}`, color: isStageDone ? "#4ade80" : "#ffd700", fontFamily: "JetBrains Mono, monospace" }}
            >
              <IcCode color={isStageDone ? "#4ade80" : "#ffd700"} size={13} />
              {stage.filename}
            </div>
            {isStageDone && (
              <span
                className="ml-auto px-2 py-0.5 rounded text-xs font-bold"
                style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}
              >
                ✓ Etapa {currentStage + 1} concluída
              </span>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 relative overflow-hidden">
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
                caretColor: "#ffd700",
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
                CONSOLE
              </span>
              <button
                onClick={handleRun}
                disabled={isRunning || isStageDone}
                className="px-5 py-2 rounded-lg text-sm font-black transition-all"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  background: isStageDone
                    ? "rgba(34,197,94,0.2)"
                    : isRunning
                    ? "rgba(42,32,96,0.5)"
                    : "linear-gradient(135deg, #ffd700, #ffaa00)",
                  color: isStageDone ? "#4ade80" : isRunning ? "#8882b0" : "#08061a",
                  cursor: isRunning || isStageDone ? "not-allowed" : "pointer",
                  boxShadow: isStageDone || isRunning ? "none" : "0 0 18px rgba(255,215,0,0.4)",
                }}
              >
                {isStageDone ? "✓ Etapa concluída" : isRunning ? "Executando..." : "▶ Executar Código"}
              </button>
            </div>
            <div
              className="h-36 overflow-y-auto p-3"
              style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "13px", scrollbarWidth: "none" }}
            >
              {consoleLines.length === 0 ? (
                <span style={{ color: "#3a3660" }}>$ aguardando execução...</span>
              ) : (
                consoleLines.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      color: i === 0
                        ? "#8882b0"
                        : line === "Executando..."
                        ? "#6a6890"
                        : line === ""
                        ? "#6a6890"
                        : line.startsWith("Total")
                        ? "#ffd700"
                        : line.includes("Aprovado")
                        ? "#4ade80"
                        : line.includes("Reprovado")
                        ? "#f87171"
                        : "#00e5ff",
                    }}
                  >
                    {line === "" ? " " : line}
                  </div>
                ))
              )}
              {isRunning && (
                <span className="animate-pulse" style={{ color: "#ffd700" }}>█</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showVictory && <FinalVictoryModal onContinue={onComplete} />}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

function MainLayout({
  active,
  xp,
  level,
  username,
  onNavigate,
  onSignOut,
  children,
}: {
  active: Screen;
  xp: number;
  level: number;
  username: string;
  onNavigate: (s: Screen) => void;
  onSignOut: () => void;
  children: React.ReactNode;
}) {

  return (
    <div className="relative h-screen flex overflow-hidden" style={{ backgroundImage: `url(${spaceBgImg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(6,4,18,0.72)" }} />
      <Sidebar active={active} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Header xp={xp} level={level} username={username} onNavigate={onNavigate} onSignOut={onSignOut} />
        <main className="flex-1 overflow-hidden p-5">{children}</main>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

// ─── Router (defined inline to avoid circular imports) ───────────────────────
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
} from "react-router";
import { createContext, useContext } from "react";

// App Context — shared state across all routes
type AppContextType = {
  xp: number;
  level: number;
  username: string;
  completedModules: string[];
  authReady: boolean;
  handleLessonComplete: (moduleId: string) => void;
  handleFinalMissionComplete: () => void;
  handleSignOut: () => Promise<void>;
};

const AppContext = createContext<AppContextType>({
  xp: 0, level: 1, username: "Astronauta", completedModules: [],
  authReady: false,
  handleLessonComplete: () => {}, handleFinalMissionComplete: () => {},
  handleSignOut: async () => {},
});

const useAppContext = () => useContext(AppContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [xp, setXP] = useState(0);
  const [username, setUsername] = useState("Astronauta");
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const tokenRef = useRef<string | null>(null);
  const nav = useNavigate();
  const level = calcLevel(xp);

  const fetchData = useCallback(async (token: string) => {
    try {
      const [prog, prof] = await Promise.all([loadProgress(token), loadProfile(token)]);
      setXP(prog.xp ?? 0);
      setCompletedModules(prog.completed_modules ?? []);
      setUsername(prof.username ?? "Astronauta");
    } catch (_) {}
  }, []);

  const persist = useCallback(async (newXP: number, newCompleted: string[], modId: string) => {
    if (!tokenRef.current) return;
    try {
      await saveProgress(tokenRef.current, {
        xp: newXP, level: calcLevel(newXP),
        completed_modules: newCompleted, current_module_id: modId,
      });
    } catch (_) {}
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        tokenRef.current = session.access_token;
        fetchData(session.access_token).then(() => {
          setAuthReady(true);
          nav("/home", { replace: true });
        });
      } else {
        setAuthReady(true);
        nav("/login", { replace: true });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        tokenRef.current = null;
        setXP(0); setCompletedModules([]); setUsername("Astronauta");
        nav("/login", { replace: true });
      } else {
        tokenRef.current = session.access_token;
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchData, nav]);

  const handleLessonComplete = useCallback((moduleId: string) => {
    const gained = MODULES[moduleId]?.xp ?? 50;
    setXP((prev) => {
      const next = prev + gained;
      setCompletedModules((pc) => {
        const nc = pc.includes(moduleId) ? pc : [...pc, moduleId];
        persist(next, nc, moduleId);
        return nc;
      });
      return next;
    });
  }, [persist]);

  const handleFinalMissionComplete = useCallback(() => {
    setXP((prev) => {
      const next = prev + 100;
      setCompletedModules((pc) => {
        const nc = pc.includes("1.F") ? pc : [...pc, "1.F"];
        persist(next, nc, "1.F");
        return nc;
      });
      return next;
    });
  }, [persist]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AppContext.Provider value={{ xp, level, username, completedModules, authReady, handleLessonComplete, handleFinalMissionComplete, handleSignOut }}>
      {children}
    </AppContext.Provider>
  );
}

function AppLayout() {
  const { xp, level, username, handleSignOut, authReady } = useAppContext();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const active = (pathname.replace("/", "").split("/")[0] || "home") as Screen;
  if (!authReady) return <LoadingScreen />;
  return (
    <MainLayout xp={xp} level={level} username={username} active={active} onNavigate={(s) => nav(`/${s}`)} onSignOut={handleSignOut}>
      <Outlet />
    </MainLayout>
  );
}

function LoginRoute() {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <LoginScreen
      isLoading={isLoading} error={error}
      onLogin={async (email, password) => {
        setError(null); setIsLoading(true);
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); } setIsLoading(false);
      }}
      onRegister={() => { setError(null); nav("/register"); }}
    />
  );
}

function RegisterRoute() {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <RegisterScreen
      isLoading={isLoading} error={error}
      onBack={() => { setError(null); nav("/login"); }}
      onDone={async (email, password, uname) => {
        setError(null); setIsLoading(true);
        const { data, error: err } = await supabase.auth.signUp({ email, password, options: { data: { username: uname || "Astronauta" } } });
        if (err) { setError(err.message); setIsLoading(false); return; }
        if (data.user && !data.session) { setError("Conta criada! Verifique seu e-mail para confirmar."); setIsLoading(false); return; }
        if (data.session) {
          try { await saveProgress(data.session.access_token, { xp: 0, level: 1, completed_modules: [], current_module_id: "1.1" }); } catch (_) {}
        }
        setIsLoading(false);
      }}
    />
  );
}

function HomeRoute() {
  const { xp, completedModules } = useAppContext();
  const nav = useNavigate();
  return <HomeScreen onNavigate={(s) => nav(`/${s}`)} xp={xp} completedModules={completedModules} />;
}
function ProfileRoute() {
  const { xp, level, username, completedModules } = useAppContext();
  return <ProfileScreen xp={xp} level={level} username={username} completedModules={completedModules} />;
}
function RoadmapRoute() {
  const { completedModules } = useAppContext();
  const nav = useNavigate();
  return <RoadmapScreen completedModules={completedModules} onStartLesson={(id) => nav(`/lesson/${id}`)} onStartFinalMission={() => nav("/final-mission")} />;
}
function LessonRoute() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { handleLessonComplete } = useAppContext();
  const nav = useNavigate();
  return <LessonScreen moduleId={moduleId ?? "1.1"} onComplete={() => { handleLessonComplete(moduleId ?? "1.1"); nav("/roadmap"); }} onBack={() => nav("/roadmap")} />;
}
function FinalMissionRoute() {
  const { handleFinalMissionComplete } = useAppContext();
  const nav = useNavigate();
  return <FinalMissionScreen onComplete={() => { handleFinalMissionComplete(); nav("/roadmap"); }} onBack={() => nav("/roadmap")} />;
}

function Root() {
  return <AuthProvider><Outlet /></AuthProvider>;
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "login", Component: LoginRoute },
      { path: "register", Component: RegisterRoute },
      {
        Component: AppLayout,
        children: [
          { path: "home", Component: HomeRoute },
          { path: "profile", Component: ProfileRoute },
          { path: "roadmap", element: <RoadmapRoute /> },
          { path: "courses", element: <CoursesScreen /> },
          { path: "certificates", element: <CertificatesScreen /> },
          { path: "ranking", element: <RankingScreen /> },
          { path: "lesson/:moduleId", Component: LessonRoute },
          { path: "final-mission", Component: FinalMissionRoute },
        ],
      },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
]);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return <RouterProvider router={router} />;
}

