'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  Database,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Lock,
  EyeOff,
  Building2,
  GraduationCap,
  History,
  QrCode,
  Sparkles,
  ExternalLink,
  GitCompare,
  KeyRound,
  FileText,
  Ban,
  Fingerprint,
  LogIn,
} from 'lucide-react';
import { ZeycbLogo } from '@/components/ZeycbLogo';
import { ZeycbAtlasHero } from '@/components/ZeycbAtlasHero';
import { TrustTraceSuite } from '@/components/TrustTraceSuite';

export default function LandingPage() {
  const fiveAudiences = [
    {
      roleTitle: 'Students',
      persona: 'Priya Sharma (B.Tech CSE, Sem 6)',
      icon: GraduationCap,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      jobSummary:
        'Review institutional provenance, inspect conflicting intake feeds, and choose what fields third parties can verify.',
      actionDetail:
        'Students view what the university has on file, confirm how discrepancies were resolved, and configure selective disclosure Proof Passes for prospective employers.',
      route: '/students/stu-001',
      buttonText: 'Student Record View',
    },
    {
      roleTitle: 'Registrar Office',
      persona: 'Dr. Anirudh Sen (Deputy Registrar, #RO-402)',
      icon: Building2,
      iconColor: 'text-cobalt-700 bg-cobalt-50 border-cobalt-200',
      jobSummary:
        'Cross-examine multi-source intake discrepancies, link physical ledger evidence, and issue/revoke Proof Passes.',
      actionDetail:
        'Institutional ledger authority. When external feeds disagree on names or birth years, registrars inspect physical files and establish authoritative legal identity.',
      route: '/dashboard',
      buttonText: 'Institutional Registry',
      highlight: true,
    },
    {
      roleTitle: 'Department Heads',
      persona: 'Prof. Rajesh Verma (Head, Computer Science)',
      icon: UserCheck,
      iconColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      jobSummary:
        'Monitor department-scoped cohort graduation readiness and curriculum credit completion blockers.',
      actionDetail:
        'Department heads review course variances and graduation credit tallies for their department cohort. Strictly prohibited from issuing or revoking registrar passes.',
      route: '/dashboard',
      buttonText: 'Department Scope',
    },
    {
      roleTitle: 'Compliance Auditors',
      persona: 'State Higher-Ed Compliance Division',
      icon: History,
      iconColor: 'text-amber-800 bg-amber-50 border-amber-200',
      jobSummary:
        'Inspect chronological institutional event logs, verify unmask justification validity, and review audit trail.',
      actionDetail:
        'Independent oversight. Auditors inspect who accessed records, when staff unmasked identifiers, and review physical evidence references in read-only mode.',
      route: '/audit',
      buttonText: 'Audit Event Stream',
    },
    {
      roleTitle: 'Employers & Verifiers',
      persona: 'TCS Talent Gateway / Screening Agencies',
      icon: QrCode,
      iconColor: 'text-slate-800 bg-slate-100 border-slate-300',
      jobSummary:
        'Authenticate student-authorized academic credentials via Proof Pass tokens with zero unneeded PII exposed.',
      actionDetail:
        'Recruiters verify degree standing, CGPA, and AICTE accreditation without collecting, handling, or storing sensitive birth dates, Aadhaar, or national ID numbers.',
      route: '/verify/proof-nitas-9a4f2e',
      buttonText: 'Live Proof Verifier',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-4">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: 2-COLUMN DESKTOP (PROMINENT ATLAS ABOVE THE FOLD)        */}
      {/* ========================================================================= */}
      <section id="overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Context Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Zeycb Institutional Registry</span>
            <span>•</span>
            <span className="font-mono text-slate-600">AICTE ID: 1-94827104</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[10px]">
              SIH26263 Research Demo
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
            <span>Synthetic Evaluation Dataset</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Human-in-the-Loop Governance</span>
          </div>
        </div>

        {/* 2-Column Hero Grid (Prominent Atlas visible without scrolling on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-1">
          {/* Left Column: Editorial Headline & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              <Shield className="w-3.5 h-3.5 text-cobalt-600" />
              <span>Provable Academic Provenance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-slate-950 font-serif leading-[1.15]">
              Student credentials with documented record history and student-controlled privacy.
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              Built for AICTE institutions. When admission SIS, state repositories, and board databases disagree, Zeycb quarantines the conflict, halts automated pass issuance, and requires explicit human staff review before students share selective Proof Passes with external verifiers.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <LogIn className="w-4 h-4 text-cobalt-300" />
                <span>Sign in to Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Launch Registry</span>
              </Link>

              <Link
                href="/trust-trace"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Trust Trace Lab →</span>
              </Link>
            </div>

            {/* Three Pillar Cards */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 border-t border-slate-200/80 text-xs text-slate-600">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
                  <Ban className="w-3 h-3 text-amber-700" />
                  <span>Never Auto-Resolves</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Discrepancies mandate physical ledger confirmation.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
                  <EyeOff className="w-3 h-3 text-rose-600" />
                  <span>Withheld by Default</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  DOB & national APAAR ID redacted from employer passes.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Audit Trail</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Sequential event log with staff justifications.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Atlas (7 cols, prominent above fold) */}
          <div className="lg:col-span-7">
            <ZeycbAtlasHero />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FIVE AUDIENCES & THEIR ACTUAL JOBS                                     */}
      {/* ========================================================================= */}
      <section id="audiences" className="bg-canvas border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cobalt-700">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Multi-Stakeholder Governance Model</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif">
              Five Audiences. Five Distinct Responsibilities.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zeycb does not use generic permissions. Each stakeholder operates within strict institutional boundaries to safeguard student privacy and establish trustworthy academic provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiveAudiences.map((aud, idx) => {
              const Icon = aud.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-xl bg-white border p-6 flex flex-col justify-between space-y-4 shadow-subtle hover:shadow-card transition-all ${
                    aud.highlight ? 'border-cobalt-300 ring-1 ring-cobalt-200/60' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${aud.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        Persona #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-serif">
                        {aud.roleTitle}
                      </h3>
                      <div className="text-xs text-cobalt-700 font-medium">
                        {aud.persona}
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {aud.jobSummary}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                      {aud.actionDetail}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-between text-xs font-semibold text-slate-800 hover:text-cobalt-700 p-1 transition-colors"
                    >
                      <span>Sign in as this persona</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Sixth card: Honest Boundaries */}
            <div className="rounded-xl bg-slate-900 text-white border border-slate-950 p-6 flex flex-col justify-between space-y-4 shadow-card">
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 text-cobalt-300 flex items-center justify-center border border-slate-700">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif">
                    Honest Research Scope
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Zero False Security Claims
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Zeycb uses synthetic student cohorts. No live APAAR, ABC, DigiLocker, or Aadhaar servers are contacted. All digital digests are simulated for hackathon evaluation.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cobalt-600 hover:bg-cobalt-700 text-white text-xs font-semibold transition-colors"
                >
                  <span>Enter via Role Chooser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FLAGSHIP TRUST TRACE + THREE SUPPORTING DIFFERENTIATORS                */}
      {/* ========================================================================= */}
      <section id="trust-trace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <TrustTraceSuite />
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS: INSTITUTIONAL PROTOCOL LIFECYCLE                         */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cobalt-700">
            <Database className="w-3.5 h-3.5" />
            <span>Institutional Lifecycle Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif">
            How Zeycb Reconciles & Protects Academic Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            From initial university enrolment to external recruitment verification, every touchpoint maintains provenance while withholding citizen private identifiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs font-mono">
              01
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-serif">
              Multi-Source Ingestion
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Records are pulled from Admission SIS, JoSAA allotments, Examination Cell rosters, and National Academic Depository feeds.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs font-mono">
              02
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-serif">
              Quarantine & Hold
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When string distance or date variance is detected, automated credential passes are quarantined. The system never guesses or auto-merges identity data.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center text-xs font-mono">
              03
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-serif">
              Human Staff Sign-Off
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Registrar staff reviews scanned physical Class X certificates or Gazette notifications, attributes the authoritative value, and records the resolution.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs font-mono">
              04
            </div>
            <h3 className="font-bold text-sm text-slate-900 font-serif">
              Selective Proof Passes
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students authorize time-limited Proof Passes for prospective employers. Academic qualifications are proven while birth dates and national IDs stay protected.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CALL TO ACTION & JUDGES QUICK ACCESS                                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 space-y-6 shadow-card border border-slate-800">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cobalt-300">
              <span>NITAS Northern Regional Deployment • Prototype Demo</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight font-serif">
              Ready to evaluate the credential provenance suite?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Choose an audience persona or launch the institutional registry to explore the mismatch workbench, student self-service records, and selective proof pass generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-cobalt-600 hover:bg-cobalt-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Evaluation Demo</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>Institutional Overview</span>
            </Link>

            <Link
              href="/verify/proof-nitas-9a4f2e"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Direct Verifier View</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
