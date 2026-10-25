'use client';

import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface SimulatedBadgeProps {
  compact?: boolean;
}

export function SimulatedBadge({ compact = false }: SimulatedBadgeProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Simulated Environment
      </span>
    );
  }

  if (isDismissed) return null;

  return (
    <div className="bg-slate-100/90 border-b border-slate-200 text-xs py-1.5 px-4 text-slate-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <p className="leading-snug">
            <strong className="text-slate-800 font-semibold">SIH26263 Research Prototype:</strong>{' '}
            All student profiles, APAAR IDs, and institutional feeds are fictional synthetic test data.{' '}
            <span className="text-slate-500">
              No live government APIs (Aadhaar, ABC, DigiLocker, AICTE) are queried.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden md:inline text-[11px] text-slate-400">
            NITAS Scope (Fictional)
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
