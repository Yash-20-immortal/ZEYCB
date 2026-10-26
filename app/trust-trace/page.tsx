'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  GitCompare,
  EyeOff,
  Radar,
  History,
  Building2,
} from 'lucide-react';
import { TrustTraceSuite } from '@/components/TrustTraceSuite';
import { ZeycbAtlasHero } from '@/components/ZeycbAtlasHero';

export default function TrustTracePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cobalt-700 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cobalt-600 animate-pulse" />
            <span>SIH26263 Flagship Architecture & Differentiators</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif">
            Trust Trace & Governance Lab
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Every academic attribute carries verifiable institutional provenance. When multi-source feeds conflict, the system halts automated pass issuance until authorized staff signs off with physical documentary evidence.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold transition-colors shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Registry Dashboard</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Demo Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Atlas Hero 3D Component */}
      <ZeycbAtlasHero />

      {/* Flagship + Three Differentiators Suite */}
      <TrustTraceSuite />
    </div>
  );
}
