'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  UserCheck,
  Building2,
  GraduationCap,
  History,
  QrCode,
  ArrowRight,
  Info,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useStore, UserRole } from '@/lib/store';
import { ZeycbLogo } from '@/components/ZeycbLogo';

export default function LoginPage() {
  const router = useRouter();
  const { activeRole, setActiveRole, resetDemoData, institution } = useStore();

  const demoAudiences: Array<{
    id: string;
    role: UserRole;
    personaTitle: string;
    personaName: string;
    audienceLabel: string;
    badge: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    coreJob: string;
    permissions: string[];
    withheldInfo: string;
    destinationRoute: string;
    buttonLabel: string;
    isPrimary?: boolean;
  }> = [
    {
      id: 'student',
      role: 'Student (Credential Holder)',
      personaTitle: 'Credential Holder & Consent Custodian',
      personaName: 'Priya Sharma (Roll: 2022-CSE-084)',
      audienceLabel: 'Student Audience',
      badge: 'Personal Record Scope',
      icon: GraduationCap,
      iconBg: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-700',
      coreJob:
        'Review personal institutional provenance, inspect conflicting ingestion feeds, and manage selective privacy passes before third-party sharing.',
      permissions: [
        'Inspect personal academic provenance & source confidence scores',
        'Audit conflicting SIS vs ABC ingestion feeds (2004 vs 2003 DOB)',
        'Configure selective disclosure field toggles for employer passes',
      ],
      withheldInfo:
        'Cannot access other students; cannot alter official academic grades or ledger entries.',
      destinationRoute: '/students/stu-001',
      buttonLabel: 'Enter as Student (Priya Sharma)',
    },
    {
      id: 'registrar',
      role: 'Registrar Office (Staff #RO-402)',
      personaTitle: 'Institutional Authority & Custodian',
      personaName: 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)',
      audienceLabel: 'Registrar Office',
      badge: 'Full Institutional Authority',
      icon: Building2,
      iconBg: 'bg-cobalt-50 border-cobalt-200',
      iconColor: 'text-cobalt-700',
      coreJob:
        'Cross-examine multi-source intake discrepancies, record explicit human-in-the-loop resolutions with physical evidence references, issue and revoke Proof Passes.',
      permissions: [
        'Full institutional cohort readiness inspection',
        'Resolve intake discrepancies using physical ledger evidence references',
        'Issue time-limited Proof Passes with simulated verification digests',
        'Execute immediate revocation of active passes with reason tracking',
      ],
      withheldInfo:
        'All unmasking attempts require recorded justification and produce chronological audit trails.',
      destinationRoute: '/dashboard',
      buttonLabel: 'Enter as Registrar (Dr. Sen)',
      isPrimary: true,
    },
    {
      id: 'dept-head',
      role: 'Department Academic Head',
      personaTitle: 'Departmental Academic Evaluation',
      personaName: 'Prof. Rajesh Verma (Head, Computer Science & Engineering)',
      audienceLabel: 'Department Academic Head',
      badge: 'Department Scoped (CSE)',
      icon: UserCheck,
      iconBg: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-700',
      coreJob:
        'Monitor departmental cohort graduation readiness, verify credit accumulation against curriculum requirements, and review course-level blockers.',
      permissions: [
        'Review Computer Science & Engineering cohort readiness index',
        'Inspect departmental course credit progress and curriculum match',
        'Examine pending source discrepancies for departmental students',
      ],
      withheldInfo:
        'Strictly departmental scope. CANNOT issue or revoke Proof Passes (Registrar authority required).',
      destinationRoute: '/dashboard',
      buttonLabel: 'Enter as Academic Head (Prof. Verma)',
    },
    {
      id: 'auditor',
      role: 'Auditor / Compliance Inspector',
      personaTitle: 'Regulatory Oversight & Audit Log Review',
      personaName: 'Higher-Ed Compliance Division (AICTE / State Inspectorate)',
      audienceLabel: 'Auditor & Compliance Inspector',
      badge: 'Strictly Read-Only',
      icon: History,
      iconBg: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-800',
      coreJob:
        'Inspect chronological institutional event logs, verify unmask justification validity, examine source confidence levels, and review event history.',
      permissions: [
        'Full read-only chronological audit log replay',
        'Inspect staff unmask attempt logs with client IP & justification',
        'Verify resolution evidence references (e.g. CBSE ledger #82190)',
        'Export audit log reports for accreditation compliance',
      ],
      withheldInfo:
        'Strictly read-only. Cannot resolve discrepancies, alter records, or generate proof passes.',
      destinationRoute: '/audit',
      buttonLabel: 'Enter as Compliance Auditor',
    },
    {
      id: 'verifier',
      role: 'External Verifier',
      personaTitle: 'Zero-PII Credential Authenticator',
      personaName: 'TCS Talent Gateway / Campus Background Screening',
      audienceLabel: 'External Verifier & Employer',
      badge: 'Restricted Proof View',
      icon: QrCode,
      iconBg: 'bg-slate-100 border-slate-300',
      iconColor: 'text-slate-800',
      coreJob:
        'Authenticate student-authorized academic credentials via time-limited Proof Pass token with zero unneeded PII exposed (DOB, full APAAR, and address withheld).',
      permissions: [
        'Inspect verified degree status, program, and institutional accreditation',
        'Verify simulated cryptographic digest & issuing institutional certificate',
        'Verify validity window and real-time revocation standing',
      ],
      withheldInfo:
        'Zero access to internal SIS, database, or withheld private attributes (DOB, Aadhaar, Home Address).',
      destinationRoute: '/verify/proof-nitas-9a4f2e',
      buttonLabel: 'Enter as Verifier (Demo Proof Pass)',
    },
  ];

  const handleSelectRole = (role: UserRole, targetRoute: string) => {
    setActiveRole(role);
    router.push(targetRoute);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fade-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Registry</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>AICTE Permanent ID: {institution.aictePermanentId}</span>
          <span>•</span>
          <span className="text-slate-700 font-bold">NITAS Campus Portal</span>
        </div>
      </div>

      {/* Editorial Title */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <KeyRound className="w-3.5 h-3.5 text-cobalt-600" />
          <span>Institutional Portal & Evaluation Entrance</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 font-serif">
          Sign In to Zeycb Platform
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
          This system models institutional credential reconciliation for AICTE institutions.
          Below you can inspect the platform from an institutional staff perspective or test the simulated role pathways for all five audience groups.
        </p>
      </div>

      {/* Honest Prototype Notice Callout */}
      <div className="p-4 sm:p-5 rounded-xl bg-canvas border border-slate-200/90 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              No Connected Auth Provider • Simulated Research Demo
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              There is no live SSO provider (SAML, OAuth, APAAR, or DigiLocker API) connected to this prototype. We do not collect passwords, emails, or personal identification. Role entry is purely simulated using synthetic evaluation datasets.
            </p>
          </div>
        </div>

        <button
          id="btn-login-reset-seeded-demo"
          onClick={() => {
            resetDemoData();
            alert('Simulation state reset to default baseline.');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-xs shrink-0 self-start md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Seeded Demo Data</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. INSTITUTIONAL STAFF SIGN-IN PATHWAY                                    */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-cobalt-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Pathway A
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Institutional Staff Sign-In (AICTE / Campus Nodal SSO)
              </h2>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-slate-600 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 self-start sm:self-auto">
            Primary Officer Gateway
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              In production, institutional officers (Deputy Registrars, Academic Verification Officers, and AICTE Nodal In-Charge) authenticate through their campus SAML identity provider.
            </p>
            <p className="text-slate-500">
              For this evaluation prototype, real authentication is disabled. Clicking the button below simulates an authenticated institutional session as <strong>Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)</strong> with authority to reconcile intake conflicts and issue Proof Passes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="text-[11px] font-semibold text-slate-700">
              Simulated Staff Credentials:
            </div>
            <div className="text-xs font-mono text-slate-800 space-y-0.5">
              <div>Officer: Dr. Anirudh Sen</div>
              <div>Staff ID: NITAS-RO-402</div>
              <div>Scope: Institutional Ledger Authority</div>
            </div>

            <button
              onClick={() => handleSelectRole('Registrar Office (Staff #RO-402)', '/dashboard')}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Launch Staff Session (Registrar)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXPLORE THE RESEARCH DEMO: FIVE SIMULATED AUDIENCES                    */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Pathway B
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-bold text-cobalt-700 uppercase tracking-wider">
              Research Prototype Evaluation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
            Explore the Research Demo (Five Simulated Audiences)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Select any persona below to immediately inspect the system through their exact vantage point, data scope, and withheld privacy boundaries.
          </p>
        </div>

        {/* Five Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {demoAudiences.map((audience) => {
            const Icon = audience.icon;
            const isCurrentActive = activeRole === audience.role;

            return (
              <div
                key={audience.id}
                className={`rounded-xl bg-white border p-6 flex flex-col justify-between transition-all hover:shadow-card hover:-translate-y-0.5 ${
                  audience.isPrimary
                    ? 'border-cobalt-300 ring-1 ring-cobalt-200/60 shadow-subtle'
                    : 'border-slate-200 shadow-subtle'
                } ${isCurrentActive ? 'bg-cobalt-50/20' : ''}`}
              >
                <div className="space-y-4">
                  {/* Header: Audience badge & Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${audience.iconBg}`}>
                      <Icon className={`w-5 h-5 ${audience.iconColor}`} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {audience.badge}
                    </span>
                  </div>

                  {/* Persona Names */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {audience.audienceLabel}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5 font-serif">
                      {audience.personaTitle}
                    </h3>
                    <div className="text-xs font-medium text-cobalt-700 mt-0.5 font-sans">
                      {audience.personaName}
                    </div>
                  </div>

                  {/* Plain Job Explanation */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {audience.coreJob}
                  </p>

                  {/* Concise Permissions */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                      Permissions & Scope:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {audience.permissions.map((perm, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{perm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Withheld or Restricted Boundaries */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{audience.withheldInfo}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleSelectRole(audience.role, audience.destinationRoute)}
                    className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                      audience.isPrimary
                        ? 'bg-cobalt-600 hover:bg-cobalt-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{audience.buttonLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
