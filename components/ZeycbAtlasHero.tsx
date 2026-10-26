'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Database,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Play,
  RotateCcw,
  Pause,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Compass,
} from 'lucide-react';

interface AtlasNode {
  id: string;
  stageNumber: number;
  label: string;
  sublabel: string;
  actor: string;
  timestampSimulated: string;
  icon: React.ElementType;
  statusBadge: string;
  statusColor: string;
  summary: string;
  provenanceSource: string;
  confidenceScore: number;
  payloadSnapshot: Record<string, string>;
  withheldAttributes: string[];
  governanceRule: string;
}

export function ZeycbAtlasHero() {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsReducedMotion(true);
        setIsPlaying(false);
        setIs3DMode(false);
      }
      const listener = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
        if (e.matches) {
          setIsPlaying(false);
          setIs3DMode(false);
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const atlasStages: AtlasNode[] = [
    {
      id: 'stage-1',
      stageNumber: 1,
      label: 'SIS Baseline',
      sublabel: 'NITAS Admission ERP',
      actor: 'NITAS Admissions Committee (#ADM-109)',
      timestampSimulated: '12-Aug-2022 • JoSAA Round 3 Allotment',
      icon: Database,
      statusBadge: 'Canonical Baseline',
      statusColor: 'bg-slate-100 text-slate-800 border-slate-300',
      summary:
        'Priya Sharma is matriculated into B.Tech Computer Science & Engineering based on JoSAA allotment and physical document verification.',
      provenanceSource: 'NITAS Admission Registry (Physical Ledger #CS-22-084)',
      confidenceScore: 96,
      payloadSnapshot: {
        'Student Roll Number': '2022-CSE-084',
        'Full Legal Name': 'Priya Sharma',
        'Date of Birth': '15-Aug-2004',
        'Degree Program': 'B.Tech (Computer Science & Engineering)',
        'Class X Certificate': 'CBSE/DEL/2020/82190 (Physical file copy)',
      },
      withheldAttributes: [
        'Synthetic APAAR Identifier (Masked: AP-SYN-••••-0001)',
        'Full Residential Address & State of Domicile (Fictional)',
        'Parent / Guardian Contact Coordinates (Synthetic)',
      ],
      governanceRule:
        'Initial admission record serves as institutional reference baseline, subject to statutory multi-feed corroboration.',
    },
    {
      id: 'stage-2',
      stageNumber: 2,
      label: 'Conflict Held',
      sublabel: 'ABC & DigiLocker Feed',
      actor: 'Zeycb Ingest Daemon (Batch Sync Job #7482)',
      timestampSimulated: '14-Oct-2024 • Automated Ingest Feed',
      icon: AlertTriangle,
      statusBadge: 'Quarantine Held',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      summary:
        'Automated sync with simulated Academic Bank of Credits detects two discrepancies: middle name insertion ("Kumari") and 1-year birth date variance (2003 vs 2004). Issuance is quarantined.',
      provenanceSource: 'National Academic Depository / ABC Ingest Feed (Simulated)',
      confidenceScore: 88,
      payloadSnapshot: {
        'Incoming Name String': 'Priya Kumari Sharma (+Kumari variance)',
        'Incoming Birth Date': '15-Aug-2003 (Conflict: 1-year earlier than ERP)',
        'Ingest Confidence Score': '88% (Heuristic flag: Name string distance > 0.15)',
        'Issuance Status': 'HOLD: Credential proof generation blocked',
      },
      withheldAttributes: [
        'State DigiLocker Ingest API Session Tokens',
        'Unmasked APAAR Enrolment Seed Reference',
      ],
      governanceRule:
        'NEVER AUTO-RESOLVE: The system strictly refuses to automatically merge or guess identity attributes when conflicting external feeds arrive.',
    },
    {
      id: 'stage-3',
      stageNumber: 3,
      label: 'Human Review',
      sublabel: 'Registrar Workbench',
      actor: 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)',
      timestampSimulated: '15-Oct-2024 • Physical Evidence Audit',
      icon: UserCheck,
      statusBadge: 'Staff Sign-Off',
      statusColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      summary:
        'Deputy Registrar retrieves scanned CBSE Class X matriculation certificate #82190 from institutional archive, confirms 15-Aug-2004 and "Priya Sharma", rejecting draft ABC string.',
      provenanceSource: 'Institutional Ledger Verification (CBSE/DEL/2020/82190)',
      confidenceScore: 100,
      payloadSnapshot: {
        'Authoritative Name Set': 'Priya Sharma (Rejected draft middle name)',
        'Authoritative DOB Set': '15-Aug-2004 (Corroborated by CBSE Ledger)',
        'Evidence Document Ref': 'Physical Ledger CS-22-084 / CBSE-82190',
        'Resolution Justification': 'Class X Certificate corroborates 2004; ABC middle name unverified pre-enrollment variance.',
      },
      withheldAttributes: [
        'Staff Private Authentication Credentials',
        'Physical Registrar Key Identifiers',
      ],
      governanceRule:
        'Institutional audit logging: every identity decision creates an auditable record linking the staff ID, timestamp, and documentary evidence.',
    },
    {
      id: 'stage-4',
      stageNumber: 4,
      label: 'Record Ready',
      sublabel: '98% Cohort Readiness',
      actor: 'Controller of Examinations & Academic Dean',
      timestampSimulated: '18-Jan-2025 • Semester 5 Transcript Audit',
      icon: CheckCircle2,
      statusBadge: 'Verified & Ready',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      summary:
        'Student profile readiness jumps to 98%. Completed credits (118/160) and CGPA (8.72) are reconciled against examination cell transcripts and assigned an institutional simulated digest.',
      provenanceSource: 'NITAS Institutional Record Registry (Digest #0x94b3..e1a)',
      confidenceScore: 100,
      payloadSnapshot: {
        'Reconciled Status': 'Verified (Ready for Credential Issuance)',
        'Cumulative GPA': '8.72 / 10.0 (COE Official Ledger)',
        'Earned Credits': '118 / 160 Credits completed on track for 2026',
        'Simulated Digest': '0x7e4b91ac...90f2 (Simulated SHA-256 Digest)',
      },
      withheldAttributes: [
        'Synthetic APAAR Identifier (Masked: AP-SYN-••••-0001)',
        'Class Rank & Internal Examination Marking Breakdowns',
        'Category / Socioeconomic Reservation Classification',
      ],
      governanceRule:
        'Verified status allows the credential to be used in student-authorized selective disclosure passes without exposing underlying raw SIS records.',
    },
    {
      id: 'stage-5',
      stageNumber: 5,
      label: 'Consent Pass',
      sublabel: 'Selective Disclosure',
      actor: 'Priya Sharma (Student / Credential Owner)',
      timestampSimulated: '22-Jan-2025 • Consent Granted for TCS Recruitment',
      icon: ShieldCheck,
      statusBadge: 'Selective Pass',
      statusColor: 'bg-cobalt-100 text-cobalt-900 border-cobalt-300',
      summary:
        'Student creates a time-limited Proof Pass for campus recruitment. 5 academic attributes are shared; 7 sensitive personal fields (including DOB and full APAAR) are withheld by default.',
      provenanceSource: 'Zeycb Student Consent Module (Pass #proof-nitas-9a4f2e)',
      confidenceScore: 100,
      payloadSnapshot: {
        'Purpose of Release': 'TCS Campus Recruitment Technical Evaluation',
        'Validity Window': '72 Hours (Expires 25-Jan-2025 18:00 UTC)',
        'Disclosed Attributes (5)': 'Name, Program, Department, Term, CGPA',
        'Revocation Standing': 'Active (1-click immediate student or registrar revocation)',
      },
      withheldAttributes: [
        'EXPLICITLY WITHHELD: Date of Birth & Age (Privacy by Design)',
        'EXPLICITLY WITHHELD: Synthetic APAAR ID (Masked: AP-SYN-••••-0001)',
        'EXPLICITLY WITHHELD: Synthetic Aadhaar Reference (Masked: ••••-••••-SYN01)',
        'EXPLICITLY WITHHELD: Personal Residential Address & Mobile Phone (Synthetic)',
      ],
      governanceRule:
        'Data minimization by design: employers verify academic eligibility without possessing lifelong personal identity documents.',
    },
    {
      id: 'stage-6',
      stageNumber: 6,
      label: 'Verifier View',
      sublabel: 'Zero-PII Screening',
      actor: 'TCS Talent Gateway (External Evaluator)',
      timestampSimulated: '22-Jan-2025 14:10 • Verification Token Inspected',
      icon: Building2,
      statusBadge: 'Simulated Verifier',
      statusColor: 'bg-slate-900 text-white border-slate-950',
      summary:
        'Employer scans QR code or clicks proof link. The institutional accreditation and academic credentials verify in a simulated evaluation view. Zero unneeded identity documents are collected or retained.',
      provenanceSource: 'NITAS Verification Gateway (Token: proof-nitas-9a4f2e)',
      confidenceScore: 100,
      payloadSnapshot: {
        'Verification Result': 'VERIFIED AGAINST RECORD (NITAS AICTE #1-94827104)',
        'Candidate Name': 'Priya Sharma',
        'Degree Program': 'B.Tech Computer Science & Engineering (Sem 6)',
        'Verified CGPA': '8.72 / 10.0 (COE Transcript Verified)',
        'Private PII Transmitted': 'NONE (0 bytes of National ID or DOB released)',
      },
      withheldAttributes: [
        'Candidate Birth Date (Verifier sees degree standing, not age)',
        'Candidate National ID (Verifier cannot harvest or leak APAAR)',
        'Candidate Address (Verifier receives zero domicile data)',
      ],
      governanceRule:
        'Employer verifies institutional accreditation and student achievement in a simulated view without liability of storing sensitive citizen identities.',
    },
  ];

  // Automated Replay controller
  useEffect(() => {
    if (isPlaying && !isReducedMotion) {
      timerRef.current = setInterval(() => {
        setActiveNodeIndex((prev) => (prev + 1) % atlasStages.length);
      }, 3400);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isReducedMotion, atlasStages.length]);

  const handleReplay = () => {
    setActiveNodeIndex(0);
    setIsPlaying(true);
  };

  const currentNode = atlasStages[activeNodeIndex];

  return (
    <div
      id="atlas"
      aria-label="Zeycb Atlas: Dimensional Record Provenance Map"
      className="rounded-2xl bg-white border border-slate-200/90 shadow-card p-4 sm:p-5 lg:p-6 space-y-4 overflow-hidden relative"
    >
      {/* Visual Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cobalt-600 animate-pulse shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-sans">
                Zeycb Trust Trace Atlas
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Priya Sharma (2022-CSE-084)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Six-stage dimensional record lifecycle with verified evidence and selective disclosure.
            </p>
          </div>
        </div>

        {/* Play, Pause, Replay, and 3D Perspective Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* 3D Perspective Toggle Button */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border transition-all ${
              is3DMode
                ? 'bg-slate-900 text-white border-slate-950 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle between 3D Isometric View and Flat Planar View"
          >
            <Compass className="w-3 h-3 text-cobalt-300" />
            <span>{is3DMode ? '3D Isometric' : 'Planar 2D'}</span>
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
            aria-label={isPlaying ? 'Pause auto-play' : 'Play journey'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-amber-700" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-700" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Reset / Replay Button */}
          <button
            onClick={handleReplay}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Replay journey from Stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIMENSIONAL ISOMETRIC RECORD MAP                                          */}
      {/* ========================================================================= */}
      <div className="relative pt-2 pb-4">
        {/* Editorial Coordinate Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:28px_28px] rounded-xl" />

        {/* Dimensional Perspective Stage */}
        <div
          className={`relative transition-all duration-700 ease-out py-3 ${
            is3DMode && !isReducedMotion
              ? '[perspective:1000px] [transform-style:preserve-3d]'
              : ''
          }`}
        >
          {/* Animated SVG Connector Pipeline Path */}
          <div className="hidden lg:block absolute inset-x-8 top-12 h-14 pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="provenancePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>

              {/* Static hairline path track */}
              <line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Animated flowing energy pulse dash line */}
              <line
                x1="4%"
                y1="50%"
                x2="96%"
                y2="50%"
                stroke="url(#provenancePathGrad)"
                strokeWidth="2.5"
                strokeDasharray="8 8"
                className={isPlaying && !isReducedMotion ? 'animate-pulse' : ''}
              />
            </svg>
          </div>

          {/* Six Dimensional Record Stage Tiles */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 relative z-10 transition-transform duration-700 ${
              is3DMode && !isReducedMotion
                ? '[transform:rotateX(14deg)_rotateZ(-2deg)_rotateY(2deg)]'
                : ''
            }`}
          >
            {atlasStages.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isActive = activeNodeIndex === idx;
              const isPast = activeNodeIndex > idx;

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setActiveNodeIndex(idx);
                    setIsPlaying(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' && idx < atlasStages.length - 1) {
                      setActiveNodeIndex(idx + 1);
                    } else if (e.key === 'ArrowLeft' && idx > 0) {
                      setActiveNodeIndex(idx - 1);
                    }
                  }}
                  className={`text-left p-3 rounded-xl border relative transition-all duration-300 flex flex-col justify-between group outline-none focus-visible:ring-2 focus-visible:ring-cobalt-500 ${
                    isActive
                      ? 'bg-white border-cobalt-600 shadow-[0_16px_32px_-8px_rgba(37,99,235,0.22),0_6px_12px_rgba(15,23,42,0.08)] ring-2 ring-cobalt-200/80 -translate-y-2 border-b-4 border-b-cobalt-700'
                      : isPast
                      ? 'bg-slate-50/95 border-slate-200/90 shadow-[0_8px_16px_-4px_rgba(15,23,42,0.08)] opacity-95 hover:border-slate-400 hover:-translate-y-1 border-b-2 border-b-slate-300'
                      : 'bg-white/95 border-slate-200/80 shadow-[0_6px_14px_-3px_rgba(15,23,42,0.06)] hover:border-slate-300 hover:-translate-y-1 border-b-2 border-b-slate-200'
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Stage ${stage.stageNumber}: ${stage.label}`}
                >
                  {/* Top node pin and icon */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center transition-colors shadow-2xs ${
                        isActive
                          ? 'bg-cobalt-600 text-white ring-2 ring-cobalt-100'
                          : isPast
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      0{stage.stageNumber}
                    </span>

                    <StageIcon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive
                          ? 'text-cobalt-600'
                          : isPast
                          ? 'text-slate-700'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                  </div>

                  {/* Stage titles */}
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {stage.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      {stage.sublabel}
                    </div>
                  </div>

                  {/* Node Status Pill */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100">
                    <span
                      className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded leading-none border truncate max-w-full ${stage.statusColor}`}
                    >
                      {stage.statusBadge}
                    </span>
                  </div>

                  {/* Active Credential Packet Marker */}
                  {isActive && (
                    <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded-full bg-slate-900 text-white text-[8px] font-mono font-bold flex items-center gap-1 shadow-sm ring-2 ring-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>TOKEN ACTIVE</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE DETAILS INSPECTOR DRAWER                                            */}
      {/* ========================================================================= */}
      <div className="rounded-xl bg-slate-50/90 border border-slate-200/90 p-4 sm:p-5 space-y-4 animate-fade-in">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-white">
                STAGE {currentNode.stageNumber} OF 6
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${currentNode.statusColor}`}>
                {currentNode.statusBadge}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 font-serif pt-1">
              {currentNode.label} — {currentNode.sublabel}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Actor: {currentNode.actor} • {currentNode.timestampSimulated}
            </p>
          </div>

          <div className="text-right sm:self-center shrink-0">
            <div className="text-xs font-semibold text-slate-900">
              Provenance Score: {currentNode.confidenceScore}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate max-w-xs">
              Ref: {currentNode.provenanceSource}
            </div>
          </div>
        </div>

        {/* Stage Summary Description */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {currentNode.summary}
        </p>

        {/* Two-Column Deep-Dive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Left: Real Synthetic Payload Snapshot */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 text-cobalt-600" />
              <span>Real Synthetic Payload Snapshot</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {Object.entries(currentNode.payloadSnapshot).map(([key, val]) => (
                <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-0.5 border-b border-slate-50 gap-0.5">
                  <span className="text-slate-500 font-sans text-xs">{key}:</span>
                  <span className="text-slate-900 font-semibold text-right break-words">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Protected Privacy Attributes & Rule */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 uppercase tracking-wider">
                <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Protected / Withheld Privacy Attributes</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600">
                {currentNode.withheldAttributes.map((attr, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <Lock className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-tight text-[11px]">{attr}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Governance Principle */}
            <div className="pt-2 border-t border-slate-100 p-2 rounded bg-slate-50 text-[10px] text-slate-700 leading-relaxed flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cobalt-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Governance Principle:</strong>{' '}
                {currentNode.governanceRule}
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              if (activeNodeIndex > 0) setActiveNodeIndex(activeNodeIndex - 1);
            }}
            disabled={activeNodeIndex === 0}
            className="px-3 py-1 rounded text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            ← Previous Stage
          </button>

          <div className="text-[11px] text-slate-400 font-mono">
            {activeNodeIndex + 1} / {atlasStages.length}
          </div>

          {activeNodeIndex < atlasStages.length - 1 ? (
            <button
              onClick={() => setActiveNodeIndex(activeNodeIndex + 1)}
              className="px-3.5 py-1 rounded text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              Next Stage →
            </button>
          ) : (
            <Link
              href="/verify/proof-nitas-9a4f2e"
              className="px-3.5 py-1 rounded text-xs font-semibold bg-cobalt-600 hover:bg-cobalt-700 text-white inline-flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Inspect Verifier Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZeycbAtlasHero;
