'use client';

import React from 'react';

interface ZeycbLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

export function ZeycbLogo({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  className = '',
  theme = 'auto',
}: ZeycbLogoProps) {
  // Dimensions
  const iconSizes = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Geometric 'Z' composed of linked provenance paths and consent nodes */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-lg p-1.5 flex items-center justify-center transition-transform hover:scale-105 ${
          theme === 'light'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-slate-950 text-white shadow-sm ring-1 ring-slate-800'
        }`}
        aria-label="Zeycb Logo Icon"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background grid hairline */}
          <line x1="6" y1="8" x2="30" y2="8" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="6" y1="28" x2="30" y2="28" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

          {/* Top horizontal provenance track */}
          <path
            d="M 8 10 L 28 10"
            stroke="#93C5FD"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Diagonal consent bridging link */}
          <path
            d="M 28 10 L 8 26"
            stroke="#60A5FA"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Bottom horizontal verified ledger track */}
          <path
            d="M 8 26 L 28 26"
            stroke="#2563EB"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Node 1: Ingestion Source (Top-left) */}
          <circle cx="8" cy="10" r="3" fill="#FAF9F5" stroke="#1D4ED8" strokeWidth="1.75" />
          <circle cx="8" cy="10" r="1.2" fill="#2563EB" />

          {/* Node 2: Reconciliation Pivot (Top-right) */}
          <circle cx="28" cy="10" r="3.25" fill="#FAF9F5" stroke="#3B82F6" strokeWidth="1.75" />
          <circle cx="28" cy="10" r="1.4" fill="#60A5FA" />

          {/* Node 3: Consent Gateway (Bottom-left) */}
          <circle cx="8" cy="26" r="3.25" fill="#FAF9F5" stroke="#2563EB" strokeWidth="1.75" />
          <circle cx="8" cy="26" r="1.4" fill="#3B82F6" />

          {/* Node 4: Verified Proof Terminal (Bottom-right) */}
          <circle cx="28" cy="26" r="3" fill="#FAF9F5" stroke="#1E40AF" strokeWidth="1.75" />
          <circle cx="28" cy="26" r="1.2" fill="#1D4ED8" />

          {/* Center Cryptographic Verification Node */}
          <circle cx="18" cy="18" r="2" fill="#60A5FA" />
          <circle cx="18" cy="18" r="4" stroke="#93C5FD" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
        </svg>
      </div>

      {/* Wordmark and Optional Subtitle */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight font-sans ${textSizes[size]} ${
                theme === 'light' ? 'text-white' : 'text-slate-900'
              }`}
            >
              ZEYCB
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              SIH26263
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5">
              AICTE Provenance & Proof Pass Registry
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ZeycbLogo;
