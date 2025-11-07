import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../types';

/**
 * Theme Decorations System
 * 
 * Z-Index Strategy:
 * - Background decorations: z-0 to z-10 (below content)
 * - Main content: z-auto (default stacking)
 * - UI overlays: z-40+
 * - Modals/Dialogs: z-50+
 * 
 * All decorations use pointer-events-none to prevent interaction blocking
 */

// Halloween Decorations
function HalloweenDecorations() {
  return (
    <>
      {/* Background gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-purple-900/20" />
      </div>

      {/* Floating pumpkins - top left */}
      <div 
        className="fixed top-10 left-10 pointer-events-none animate-bounce"
        style={{ 
          zIndex: 1,
          animationDuration: '3s',
          animationDelay: '0s'
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="25" fill="#ff6b35" opacity="0.6" />
          <path d="M20 25 Q15 30 20 35 Q25 40 30 35 Q35 40 40 35 Q45 30 40 25 Q35 20 30 25 Q25 20 20 25Z" fill="#ff9800" opacity="0.8" />
          <circle cx="23" cy="28" r="3" fill="#1a0f00" />
          <circle cx="37" cy="28" r="3" fill="#1a0f00" />
          <path d="M25 35 Q30 38 35 35" stroke="#1a0f00" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Bats - top right */}
      <div 
        className="fixed top-20 right-20 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <svg width="40" height="30" viewBox="0 0 40 30" className="animate-pulse">
          <path d="M5 15 Q0 10 5 5 L10 10 L15 5 Q18 8 20 10 Q22 8 25 5 L30 10 L35 5 Q40 10 35 15 Q30 18 25 15 L20 12 L15 15 Q10 18 5 15Z" fill="#2d1400" opacity="0.5" />
        </svg>
      </div>

      {/* Spider web - bottom left corner */}
      <div 
        className="fixed bottom-0 left-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <path d="M0 0 L100 100 M0 50 L100 100 M0 100 L100 100 M50 0 L100 100 M100 0 L100 100" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
          <path d="M20 20 Q60 40 100 100 M40 10 Q70 50 100 100 M60 5 Q80 60 100 100" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
        </svg>
      </div>

      {/* Glowing particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-orange-400 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>
    </>
  );
}

// Christmas Decorations
function ChristmasDecorations() {
  return (
    <>
      {/* Snow gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent" />
      </div>

      {/* Snowflakes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-60"
            style={{
              top: `${-10 + Math.random() * 10}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${12 + Math.random() * 12}px`,
              animation: `snowfall ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Christmas ornaments - top corners */}
      <div 
        className="fixed top-8 left-8 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="30" r="18" fill="#dc2626" opacity="0.7" />
          <circle cx="25" cy="30" r="18" fill="url(#ornamentGradient)" opacity="0.5" />
          <rect x="22" y="8" width="6" height="8" fill="#eab308" opacity="0.8" />
          <defs>
            <linearGradient id="ornamentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div 
        className="fixed top-8 right-8 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="30" r="18" fill="#15803d" opacity="0.7" />
          <circle cx="25" cy="30" r="18" fill="url(#ornamentGradient2)" opacity="0.5" />
          <rect x="22" y="8" width="6" height="8" fill="#eab308" opacity="0.8" />
          <defs>
            <linearGradient id="ornamentGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Christmas lights border */}
      <div className="fixed top-0 left-0 right-0 h-12 pointer-events-none flex justify-around items-center" style={{ zIndex: 2 }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: ['#dc2626', '#15803d', '#eab308', '#3b82f6'][i % 4],
              opacity: 0.6,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s',
            }}
          />
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// Diwali Decorations
function DiwaliDecorations() {
  return (
    <>
      {/* Golden gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-yellow-400/30 via-transparent to-purple-900/20" />
      </div>

      {/* Diya lamps - corners */}
      <div 
        className="fixed bottom-8 left-8 pointer-events-none animate-pulse"
        style={{ zIndex: 2, animationDuration: '2s' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          {/* Diya base */}
          <ellipse cx="30" cy="45" rx="25" ry="8" fill="#ffd700" opacity="0.8" />
          <path d="M10 45 Q15 35 30 35 Q45 35 50 45 Z" fill="#ff6b35" opacity="0.9" />
          {/* Flame */}
          <ellipse cx="30" cy="25" rx="8" ry="15" fill="#ff6b35" opacity="0.7" />
          <ellipse cx="30" cy="25" rx="5" ry="10" fill="#ffd700" opacity="0.9" />
          {/* Glow */}
          <circle cx="30" cy="25" r="20" fill="#ffd700" opacity="0.1" />
        </svg>
      </div>

      <div 
        className="fixed bottom-8 right-8 pointer-events-none animate-pulse"
        style={{ zIndex: 2, animationDuration: '2.3s' }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <ellipse cx="30" cy="45" rx="25" ry="8" fill="#ffd700" opacity="0.8" />
          <path d="M10 45 Q15 35 30 35 Q45 35 50 45 Z" fill="#ff6b35" opacity="0.9" />
          <ellipse cx="30" cy="25" rx="8" ry="15" fill="#ff6b35" opacity="0.7" />
          <ellipse cx="30" cy="25" rx="5" ry="10" fill="#ffd700" opacity="0.9" />
          <circle cx="30" cy="25" r="20" fill="#ffd700" opacity="0.1" />
        </svg>
      </div>

      {/* Rangoli pattern - center bottom */}
      <div 
        className="fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <svg width="300" height="150" viewBox="0 0 300 150">
          <circle cx="150" cy="150" r="80" fill="none" stroke="#ffd700" strokeWidth="2" />
          <circle cx="150" cy="150" r="60" fill="none" stroke="#ff6b35" strokeWidth="2" />
          <circle cx="150" cy="150" r="40" fill="none" stroke="#ffd700" strokeWidth="2" />
          <path d="M150 70 L170 110 L150 100 L130 110 Z" fill="#ff6b35" opacity="0.6" />
          <path d="M150 70 L170 110 L150 100 L130 110 Z" fill="#ffd700" opacity="0.4" transform="rotate(90 150 150)" />
          <path d="M150 70 L170 110 L150 100 L130 110 Z" fill="#ff6b35" opacity="0.6" transform="rotate(180 150 150)" />
          <path d="M150 70 L170 110 L150 100 L130 110 Z" fill="#ffd700" opacity="0.4" transform="rotate(270 150 150)" />
        </svg>
      </div>

      {/* Floating sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.4,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M10 0 L11 9 L20 10 L11 11 L10 20 L9 11 L0 10 L9 9 Z" fill="#ffd700" />
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}

// Winter Decorations
function WinterDecorations() {
  return (
    <>
      {/* Icy gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-15"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-200/20 via-blue-100/10 to-transparent" />
      </div>

      {/* Gentle snowfall */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cyan-400 opacity-40"
            style={{
              top: `${-10 + Math.random() * 10}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${8 + Math.random() * 8}px`,
              animation: `gentleSnow ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Ice crystals - corners */}
      <div 
        className="fixed top-12 left-12 pointer-events-none opacity-30"
        style={{ zIndex: 1 }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <path d="M40 5 L40 75 M5 40 L75 40 M15 15 L65 65 M65 15 L15 65" stroke="#0284c7" strokeWidth="2" />
          <circle cx="40" cy="40" r="8" fill="#7dd3fc" opacity="0.6" />
          <circle cx="40" cy="5" r="5" fill="#7dd3fc" />
          <circle cx="40" cy="75" r="5" fill="#7dd3fc" />
          <circle cx="5" cy="40" r="5" fill="#7dd3fc" />
          <circle cx="75" cy="40" r="5" fill="#7dd3fc" />
        </svg>
      </div>

      <div 
        className="fixed bottom-12 right-12 pointer-events-none opacity-30"
        style={{ zIndex: 1 }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80">
          <path d="M40 5 L40 75 M5 40 L75 40 M15 15 L65 65 M65 15 L15 65" stroke="#0284c7" strokeWidth="2" />
          <circle cx="40" cy="40" r="8" fill="#7dd3fc" opacity="0.6" />
          <circle cx="40" cy="5" r="5" fill="#7dd3fc" />
          <circle cx="40" cy="75" r="5" fill="#7dd3fc" />
          <circle cx="5" cy="40" r="5" fill="#7dd3fc" />
          <circle cx="75" cy="40" r="5" fill="#7dd3fc" />
        </svg>
      </div>

      <style>{`
        @keyframes gentleSnow {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(100vh) translateX(20px); }
        }
      `}</style>
    </>
  );
}

// Spring Decorations
function SpringDecorations() {
  return (
    <>
      {/* Soft gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-transparent to-yellow-100/20" />
      </div>

      {/* Cherry blossoms */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${-5 + Math.random() * 10}%`,
              left: `${Math.random() * 100}%`,
              animation: `petalFall ${6 + Math.random() * 8}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" fill="#ec4899" opacity="0.6" />
              <ellipse cx="12" cy="6" rx="4" ry="6" fill="#ec4899" opacity="0.5" />
              <ellipse cx="18" cy="12" rx="6" ry="4" fill="#ec4899" opacity="0.5" transform="rotate(0 12 12)" />
              <ellipse cx="12" cy="18" rx="4" ry="6" fill="#ec4899" opacity="0.5" />
              <ellipse cx="6" cy="12" rx="6" ry="4" fill="#ec4899" opacity="0.5" />
              <ellipse cx="15" cy="9" rx="4" ry="5" fill="#fbbf24" opacity="0.4" transform="rotate(45 12 12)" />
            </svg>
          </div>
        ))}
      </div>

      {/* Butterflies */}
      <div 
        className="fixed top-1/4 right-16 pointer-events-none animate-bounce"
        style={{ zIndex: 2, animationDuration: '4s' }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <ellipse cx="15" cy="20" rx="8" ry="12" fill="#ec4899" opacity="0.6" />
          <ellipse cx="25" cy="20" rx="8" ry="12" fill="#ec4899" opacity="0.6" />
          <circle cx="20" cy="20" r="4" fill="#831843" opacity="0.8" />
          <path d="M20 18 L20 22" stroke="#831843" strokeWidth="2" />
        </svg>
      </div>

      <div 
        className="fixed top-1/3 left-20 pointer-events-none animate-bounce"
        style={{ zIndex: 2, animationDuration: '5s', animationDelay: '1s' }}
      >
        <svg width="35" height="35" viewBox="0 0 40 40">
          <ellipse cx="15" cy="20" rx="8" ry="12" fill="#fbbf24" opacity="0.6" />
          <ellipse cx="25" cy="20" rx="8" ry="12" fill="#fbbf24" opacity="0.6" />
          <circle cx="20" cy="20" r="4" fill="#ca8a04" opacity="0.8" />
          <path d="M20 18 L20 22" stroke="#ca8a04" strokeWidth="2" />
        </svg>
      </div>

      <style>{`
        @keyframes petalFall {
          0% { 
            transform: translateY(0) rotate(0deg) translateX(0); 
            opacity: 0.6;
          }
          50% { opacity: 0.8; }
          100% { 
            transform: translateY(100vh) rotate(360deg) translateX(30px); 
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// Cosmic Decorations
function CosmicDecorations() {
  return (
    <>
      {/* Space gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-cyan-500/10" />
      </div>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Planets */}
      <div 
        className="fixed top-20 right-24 pointer-events-none opacity-40"
        style={{ zIndex: 1 }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="25" fill="url(#planetGradient)" opacity="0.8" />
          <ellipse cx="30" cy="30" rx="35" ry="8" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.6" />
          <defs>
            <radialGradient id="planetGradient">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#2d1b69" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Nebula clouds */}
      <div 
        className="fixed bottom-0 left-0 pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      >
        <svg width="400" height="300" viewBox="0 0 400 300">
          <ellipse cx="200" cy="200" rx="150" ry="100" fill="#7c3aed" opacity="0.3" />
          <ellipse cx="250" cy="180" rx="120" ry="80" fill="#06b6d4" opacity="0.2" />
          <ellipse cx="150" cy="220" rx="100" ry="70" fill="#a855f7" opacity="0.25" />
        </svg>
      </div>
    </>
  );
}

// Ocean Decorations
function OceanDecorations() {
  return (
    <>
      {/* Water gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-10"
        style={{ zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-blue-900/20" />
      </div>

      {/* Bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-cyan-400/30 bg-cyan-200/10"
            style={{
              bottom: `${-10}%`,
              left: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              animation: `bubbleRise ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Waves at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 pointer-events-none opacity-10"
        style={{ zIndex: 0 }}
      >
        <svg width="100%" height="100" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0 50 Q300 20 600 50 T1200 50 L1200 100 L0 100 Z" fill="#0ea5e9" opacity="0.4" />
          <path d="M0 60 Q300 30 600 60 T1200 60 L1200 100 L0 100 Z" fill="#06b6d4" opacity="0.3" />
        </svg>
      </div>

      <style>{`
        @keyframes bubbleRise {
          0% { 
            transform: translateY(0) translateX(0); 
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-100vh) translateX(50px); 
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

// Main Theme Decorations Component
export function ThemeDecorations() {
  const { theme } = useTheme();

  // Render decorations based on theme
  const renderDecorations = () => {
    switch (theme) {
      case 'halloween':
        return <HalloweenDecorations />;
      case 'christmas':
        return <ChristmasDecorations />;
      case 'diwali':
        return <DiwaliDecorations />;
      case 'winter':
        return <WinterDecorations />;
      case 'spring':
        return <SpringDecorations />;
      case 'cosmic':
        return <CosmicDecorations />;
      case 'ocean':
        return <OceanDecorations />;
      default:
        return null; // No decorations for other themes
    }
  };

  return (
    <div 
      className="theme-decorations-container"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {renderDecorations()}
    </div>
  );
}
