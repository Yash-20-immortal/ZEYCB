'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  GitCompare,
  Eye,
  EyeOff,
  History,
  Radar,
  Lock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  FileText,
  ChevronRight,
  ArrowRight,
  Sparkles,
  QrCode,
  Building2,
  GraduationCap,
  Ban,
  Clock,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export function TrustTraceSuite() {
  const { students, proofPasses, auditEvents, activeRole } = useStore();
  const [activeTab, setActiveTab] = useState<'flagship' | 'privacy' | 'radar' | 'audit'>('flagship');

  // Synthetic student Priya Sharma
  const priya = students.find((s) => s.id === 'stu-001') || students[0];
  const activePass = proofPasses.find((p) => p.studentId === priya.id) || proofPasses[0];

  // Flagship Field Selector
  const [selectedField, setSelectedField] = useState<'name' | 'dob' | 'program' | 'credits' | 'apaar'>('dob');

  // Privacy Preview State (Toggles to compare held vs disclosed)
  const [privacyToggles, setPrivacyToggles] = useState({
    fullName: true,
    program: true,
    department: true,
    currentSemester: true,
    cgpa: true,
    creditsCompleted: true,
    degreeEligibility: true,
    // Always withheld:
    dateOfBirth: false,
    apaarId: false,
    homeAddress: false,
    parentContact: false,
  });

  // Audit Replay step index
  const [auditStep, setAuditStep] = useState(0);

  // Field details for Trust Trace Flagship
  const fieldData = {
    dob: {
      name: 'Date of Birth (DOB)',
      canonicalValue: '15-Aug-2004',
      sources: [
        {
          name: 'NITAS Admission ERP (Class X Matriculation Copy)',
          type: 'INSTITUTE_SIS',
          value: '15-Aug-2004',
          confidence: 98,
          recordRef: 'DOC-10TH-CBSE-82190',
          matchStatus: 'DISCREPANCY_FLAGGED',
        },
        {
          name: 'Academic Bank of Credits / DigiLocker Mock Feed',
          type: 'ABC_PORTAL_SIMULATED',
          value: '15-Aug-2003',
          confidence: 88,
          recordRef: 'DL-MOCK-DL72819',
          matchStatus: 'CONFLICTING_FEED',
        },
      ],
      mismatchDescription:
        '1-year conflict detected between Admission ERP (2004) and external state DigiLocker feed (2003). Automated credential issuance quarantined.',
      resolution: {
        method: 'Physical Evidence Cross-Examination (Non-Automated)',
        resolvedBy: 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)',
        evidenceDoc: 'Physical CBSE Certificate CBSE/DEL/2020/82190 (Physical Ledger CS-22-084)',
        authoritativeValue: '15-Aug-2004 (Firmly Established)',
        timestamp: '15-Oct-2024 11:20:00 IST',
      },
      disclosureStatus: 'WITHHELD BY DEFAULT',
      disclosureReason:
        'Privacy by Design / Data Minimization: Verified internally to confirm student eligibility, but strictly REDACTED from external employer Proof Passes.',
      isDisclosed: false,
    },
    name: {
      name: 'Candidate Legal Name',
      canonicalValue: 'Priya Sharma',
      sources: [
        {
          name: 'Institute JoSAA Admission Master Ledger',
          type: 'INSTITUTE_SIS',
          value: 'Priya Sharma',
          confidence: 96,
          recordRef: 'ERP-ADM-2022-84',
          matchStatus: 'PRIMARY_SOURCE',
        },
        {
          name: 'ABC National Registry Ingest Feed',
          type: 'ABC_PORTAL_SIMULATED',
          value: 'Priya Kumari Sharma',
          confidence: 92,
          recordRef: 'ABC-AP-SYN-0001',
          matchStatus: 'MIDDLE_NAME_VARIANCE',
        },
      ],
      mismatchDescription:
        'Middle name "Kumari" present in simulated ABC ingest feed but absent on formal JoSAA enrolment and Board certificate.',
      resolution: {
        method: 'Formal Ledger Comparison',
        resolvedBy: 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)',
        evidenceDoc: 'JoSAA Enrolment Sheet 2022 + Class X Gazette Verification',
        authoritativeValue: 'Priya Sharma',
        timestamp: '15-Oct-2024 11:22:15 IST',
      },
      disclosureStatus: 'DISCLOSED IN PROOF PASS',
      disclosureReason:
        'Essential identity anchor. Transmitted with issuing institution seal to verify certificate holder identity.',
      isDisclosed: true,
    },
    program: {
      name: 'Academic Degree Program',
      canonicalValue: 'Bachelor of Technology (Computer Science & Engineering)',
      sources: [
        {
          name: 'AICTE Northern Regional Approved Intake Roster',
          type: 'INSTITUTE_SIS',
          value: 'B.Tech (Computer Science & Engineering)',
          confidence: 100,
          recordRef: 'AICTE-PRG-CSE-01',
          matchStatus: 'CORROBORATED',
        },
        {
          name: 'Academic Bank of Credits Curriculum Mapping',
          type: 'ABC_PORTAL_SIMULATED',
          value: 'B.Tech (CSE) 4-Year Full Time',
          confidence: 100,
          recordRef: 'ABC-CURR-CSE-2022',
          matchStatus: 'CORROBORATED',
        },
      ],
      mismatchDescription:
        'Zero discrepancy. Corroborated 100% across institutional ERP and AICTE approved seat matrix.',
      resolution: {
        method: 'Direct Ingest Corroboration',
        resolvedBy: 'Automated Corroboration Engine with Academic Dean Seal',
        evidenceDoc: 'AICTE Permanent Approval 1-94827104',
        authoritativeValue: 'Bachelor of Technology (Computer Science & Engineering)',
        timestamp: '01-Sep-2024 00:00:00 IST',
      },
      disclosureStatus: 'DISCLOSED IN PROOF PASS',
      disclosureReason:
        'Core credential qualification requested by verifiers.',
      isDisclosed: true,
    },
    credits: {
      name: 'Earned Credits & Academic Standing',
      canonicalValue: '118 / 160 Credits Completed (CGPA 8.72)',
      sources: [
        {
          name: 'NITAS Controller of Examinations Official Transcript',
          type: 'INSTITUTE_SIS',
          value: '118 Earned Credits • Semesters 1 to 5 Passed',
          confidence: 100,
          recordRef: 'COE-SEMESTERS-1-5',
          matchStatus: 'AUTHENTIC_EXAM_CELL',
        },
        {
          name: 'ABC National Credit Transfer Depository',
          type: 'ABC_PORTAL_SIMULATED',
          value: '118 Approved Credits Deposited',
          confidence: 99,
          recordRef: 'ABC-CRD-118',
          matchStatus: 'MUTUAL_CONFIRMATION',
        },
      ],
      mismatchDescription:
        'Perfect alignment between Examination Cell internal tabulation ledger and ABC portal sync.',
      resolution: {
        method: 'Dean Academic Affairs Verification',
        resolvedBy: 'Prof. Rajesh Verma (Head, CSE) & COE',
        evidenceDoc: 'COE-NITAS-2024-SEM5-RESULT-TABULATION',
        authoritativeValue: '118 / 160 Credits (CGPA: 8.72 / 10.0)',
        timestamp: '15-Jan-2025 09:00:00 IST',
      },
      disclosureStatus: 'DISCLOSED IN PROOF PASS',
      disclosureReason:
        'Student explicitly authorizes cumulative CGPA and completed credit metrics to be shared with recruiter.',
      isDisclosed: true,
    },
    apaar: {
      name: 'APAAR National Student ID (Synthetic Placeholder)',
      canonicalValue: 'APAAR-SYN-0001 (Synthetic Demo)',
      sources: [
        {
          name: 'Institutional Identity Vault (Restricted Intranet)',
          type: 'INSTITUTE_SIS',
          value: 'APAAR-SYN-0001 (Masked by default)',
          confidence: 100,
          recordRef: 'VAULT-ID-ENC-SYN01',
          matchStatus: 'SECURE_VAULT',
        },
      ],
      mismatchDescription:
        'Synthetic citizen identifier placeholder. Subject to institutional unmask policy requiring staff justification and audit logging.',
      resolution: {
        method: 'Institutional Vault Masking',
        resolvedBy: 'System Cryptographic Subsystem',
        evidenceDoc: 'National APAAR Guidelines Compliance Policy (Fictional Prototype Context)',
        authoritativeValue: 'Masked: AP-SYN-••••-0001',
        timestamp: 'Continuous Rule Enforcement',
      },
      disclosureStatus: 'STRICTLY WITHHELD FROM VERIFIER',
      disclosureReason:
        'Privacy Protection Principle: External verifiers receive institutional proof validity, not permanent citizen identification numbers.',
      isDisclosed: false,
    },
  };

  const currentField = fieldData[selectedField];

  // Radar Cohort Data for CSE
  const cseStudents = students.filter((s) => s.department === 'Computer Science & Engineering');
  const otherStudents = students.filter((s) => s.department !== 'Computer Science & Engineering');

  // Chronological Audit Replay sequence for Priya Sharma
  const auditJourney = [
    {
      seq: 1,
      timestamp: '12-Aug-2022 11:30:00 IST',
      actor: 'NITAS Admissions Office (Staff #ADM-109)',
      role: 'Registrar Admissions Staff',
      action: 'RECORD_INGESTION_BASELINE',
      details:
        'Enrolled into B.Tech CSE (Roll: 2022-CSE-084). Input baseline: Name Priya Sharma, DOB 15-Aug-2004, CBSE Certificate #82190.',
      ip: '10.20.4.12 (Internal Campus ERP)',
      status: 'COMPLIANT',
    },
    {
      seq: 2,
      timestamp: '14-Oct-2024 08:15:00 IST',
      actor: 'Zeycb Ingest Daemon (Batch Sync Job #7482)',
      role: 'Automated Sync System',
      action: 'RECORD_SYNC_SIMULATED',
      details:
        'ABC Feed ingest conflict flagged: Incoming Name "Priya Kumari Sharma" vs Local "Priya Sharma"; Incoming DOB "15-Aug-2003" vs Local "15-Aug-2004". Automated pass issuance quarantined.',
      ip: '127.0.0.1 (System Sync Service)',
      status: 'FLAGGED',
    },
    {
      seq: 3,
      timestamp: '14-Oct-2024 14:02:10 IST',
      actor: 'Prof. Rajesh Verma (Head, Computer Science & Engineering)',
      role: 'Department Academic Head',
      action: 'RECORD_VIEW',
      details:
        'Department Head reviewed cohort readiness blockers. Flagged identity conflict noted; forwarded to Registrar for statutory ledger reconciliation.',
      ip: '10.20.14.88 (Faculty Intranet IP)',
      status: 'COMPLIANT',
    },
    {
      seq: 4,
      timestamp: '15-Oct-2024 10:14:22 IST',
      actor: 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)',
      role: 'Registrar Office Staff',
      action: 'UNMASK_ATTEMPT',
      details:
        'Authorized unmasking executed for national ID reference with justification: "Reconciliation against Physical Admission Ledger CS-22-084".',
      ip: '10.20.4.12 (Registrar Secure Terminal)',
      status: 'COMPLIANT',
    },
    {
      seq: 5,
      timestamp: '15-Oct-2024 11:22:15 IST',
      actor: 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)',
      role: 'Registrar Office Staff',
      action: 'DISCREPANCY_RESOLVE',
      details:
        'Authoritative resolution recorded: Accepted Local SIS Name (Priya Sharma) and DOB (15-Aug-2004). Rejected ABC middle name insertion. Evidence Ref: CBSE/DEL/2020/82190. Readiness restored to 98%.',
      ip: '10.20.4.12 (Registrar Secure Terminal)',
      status: 'COMPLIANT',
    },
    {
      seq: 6,
      timestamp: '22-Jan-2025 10:00:00 IST',
      actor: 'Priya Sharma (Student #2022-CSE-084)',
      role: 'Student (Credential Holder)',
      action: 'PROOF_PASS_CREATED',
      details:
        'Student consented and authorized Proof Pass for TCS Campus Recruitment. Shared 5 academic fields; strictly withheld 7 private fields (DOB, APAAR, Address). Token: proof-nitas-9a4f2e generated.',
      ip: '172.16.88.42 (Campus WiFi Client IP)',
      status: 'COMPLIANT',
    },
    {
      seq: 7,
      timestamp: '22-Jan-2025 14:10:44 IST',
      actor: 'External Evaluation Gateway (Simulated Third-Party)',
      role: 'External Verifier',
      action: 'PROOF_PASS_VIEWED',
      details:
        'External verifier inspected Proof Pass token proof-nitas-9a4f2e in simulated verifier view. Verified NITAS accreditation, degree program, and 8.72 CGPA. Zero personal PII disclosed.',
      ip: '198.51.100.114 (Simulated Verifier Portal IP)',
      status: 'COMPLIANT',
    },
  ];

  return (
    <section
      id="trust-trace"
      aria-label="Flagship Trust Trace and Core Differentiators"
      className="rounded-2xl bg-white border border-slate-200 shadow-card p-4 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cobalt-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Differentiator Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif mt-1">
            Auditable Provenance & Data Minimization
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Explore the four working pillars of Zeycb: field-level auditable timelines, selective privacy preview, department readiness radars, and chronological audit replay.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium shrink-0 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('flagship')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'flagship'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-cobalt-600" />
            <span>1. Trust Trace (Flagship)</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 text-rose-600" />
            <span>2. Privacy Preview</span>
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'radar'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-indigo-600" />
            <span>3. Readiness Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-700" />
            <span>4. Audit Replay</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FLAGSHIP TRUST TRACE                                               */}
      {/* ========================================================================= */}
      {activeTab === 'flagship' && (
        <div className="space-y-6 animate-fade-in">
          {/* Subtitle & Human Governance Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-canvas border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-semibold text-slate-900">
                Synthetic Record: Priya Sharma (Roll: 2022-CSE-084)
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-600">NITAS Computer Science & Engineering</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
              <Ban className="w-3 h-3 text-amber-700" />
              <span>NEVER AUTO-RESOLVE: Mandatory Human Staff Sign-Off</span>
            </div>
          </div>

          {/* Interactive Field Selector Pills */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Field to Audit Its Origin, Conflict & Disclosure:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'dob', label: 'Date of Birth (DOB)', tag: 'Conflict Resolved • Withheld' },
                  { id: 'name', label: 'Candidate Name', tag: 'Conflict Resolved • Disclosed' },
                  { id: 'program', label: 'Degree Program', tag: 'Corroborated • Disclosed' },
                  { id: 'credits', label: 'Credits & CGPA', tag: 'Corroborated • Disclosed' },
                  { id: 'apaar', label: 'APAAR National ID', tag: 'Vault Masked • Withheld' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedField(f.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedField === f.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{f.label}</div>
                  <div
                    className={`text-[10px] mt-1 font-mono truncate ${
                      selectedField === f.id ? 'text-cobalt-200' : 'text-slate-500'
                    }`}
                  >
                    {f.tag}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deep-Dive Four-Quadrant Field Timeline Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            {/* Quadrant 1: Ingestion Sources */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cobalt-600" />
                  <span>1. Multi-Source Ingest</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {currentField.sources.length} Ingest Feeds
                </span>
              </div>

              <div className="space-y-3">
                {currentField.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{src.name}</span>
                      <span className="font-mono text-[10px] text-cobalt-700 font-bold">
                        {src.confidence}% Confidence
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200/80 font-mono text-xs text-slate-800 font-bold">
                      {src.value}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {src.recordRef}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Variance Analysis</span>
                </div>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  {currentField.mismatchDescription}
                </p>
              </div>
            </div>

            {/* Quadrant 2: Human Resolution Authority */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Explicit Staff Resolution</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  Staff Review Recorded
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Authoritative Established Value:</span>
                  <div className="mt-1 p-2 rounded-lg bg-emerald-50 border border-emerald-200 font-mono text-xs font-bold text-emerald-950">
                    {currentField.resolution.authoritativeValue}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-500 text-[11px]">Authorized Institutional Staff:</div>
                  <div className="font-medium text-slate-900">
                    {currentField.resolution.resolvedBy}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-500 text-[11px]">Physical Documentary Evidence Linked:</div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800">
                    {currentField.resolution.evidenceDoc}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Timestamp: {currentField.resolution.timestamp}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                Staff member verified original matriculation certificate against physical JoSAA dossier. Automated auto-merging was blocked.
              </div>
            </div>

            {/* Quadrant 3: Proof Pass Disclosure Standing */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cobalt-600" />
                  <span>3. Proof Pass Disclosure</span>
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    currentField.isDisclosed
                      ? 'bg-cobalt-50 text-cobalt-800 border-cobalt-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {currentField.disclosureStatus}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                    currentField.isDisclosed
                      ? 'bg-cobalt-50/60 border-cobalt-200 text-cobalt-950'
                      : 'bg-rose-50/60 border-rose-200 text-rose-950'
                  }`}
                >
                  {currentField.isDisclosed ? (
                    <Eye className="w-4 h-4 text-cobalt-700 shrink-0 mt-0.5" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-xs">
                      {currentField.isDisclosed
                        ? 'Attribute Released to External Verifier'
                        : 'Attribute Strictly Withheld from Verifier'}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {currentField.disclosureReason}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-900">Verifier Experience:</div>
                  {currentField.isDisclosed ? (
                    <p>
                      Employer portal receives verified value with issuing institution digital seal.
                    </p>
                  ) : (
                    <p>
                      Employer portal receives notice that identity was verified by the institution, but raw personal data is withheld.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/verify/proof-nitas-9a4f2e"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Verifier View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRIVACY PREVIEW                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'privacy' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-canvas border border-slate-200 text-xs text-slate-700 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-slate-900 font-semibold">Privacy Preview Architecture:</strong>{' '}
              Compare what the institution holds in full confidence versus what the student authorizes an employer to inspect before issuing the pass.
            </div>
            <Link
              href="/passes"
              className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold shrink-0 shadow-xs"
            >
              Manage Institutional Passes →
            </Link>
          </div>

          {/* Side-by-side comparison matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Institution-Held Record (Full Data) */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cobalt-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Institution-Held Record (Internal SIS)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Full Institutional View
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { label: 'Full Legal Name', val: 'Priya Sharma', isPrivate: false },
                  { label: 'Date of Birth & Age', val: '15-Aug-2004 (Age: 20)', isPrivate: true },
                  { label: 'Synthetic APAAR ID', val: 'APAAR-SYN-0001 (Unmasked Demo)', isPrivate: true },
                  { label: 'Degree & Department', val: 'B.Tech Computer Science & Engg', isPrivate: false },
                  { label: 'Cumulative CGPA', val: '8.72 / 10.0 (COE Transcript)', isPrivate: false },
                  { label: 'Completed Credits', val: '118 / 160 Credits', isPrivate: false },
                  { label: 'Home Address (Fictional)', val: 'Flat 402, Rohini Sector 14, New Delhi (Synthetic)', isPrivate: true },
                  { label: 'Parent / Guardian Contact', val: 'Mr. R. K. Sharma (SYN-TEL-••••-0001)', isPrivate: true },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-[11px] text-slate-500">{row.label}</div>
                      <div className="font-mono text-xs font-semibold text-slate-900 mt-0.5">
                        {row.val}
                      </div>
                    </div>
                    {row.isPrivate ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                        Protected PII
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Academic Standing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Verifier-Visible / Withheld Preview */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Verifier-Visible Proof Pass
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  Zero Unneeded PII
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { label: 'Candidate Name', val: 'Priya Sharma', status: 'DISCLOSED', safe: true },
                  { label: 'Date of Birth', val: '••••-••-•• [WITHHELD BY DESIGN]', status: 'REDACTED', safe: false },
                  { label: 'Synthetic APAAR Placeholder', val: 'AP-SYN-••••-0001 [MASKED]', status: 'REDACTED', safe: false },
                  { label: 'Degree & Department', val: 'B.Tech Computer Science & Engg', status: 'DISCLOSED', safe: true },
                  { label: 'Cumulative CGPA', val: '8.72 / 10.0', status: 'DISCLOSED', safe: true },
                  { label: 'Completed Credits', val: '118 / 160 Credits Completed', status: 'DISCLOSED', safe: true },
                  { label: 'Home Address', val: '[COMPLETELY WITHHELD]', status: 'REDACTED', safe: false },
                  { label: 'Parent / Contact Details', val: '[COMPLETELY WITHHELD]', status: 'REDACTED', safe: false },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                      row.safe
                        ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'
                        : 'bg-slate-50 border-slate-200/90 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] text-slate-500">{row.label}</div>
                      <div className="font-mono text-xs font-semibold text-slate-900 mt-0.5">
                        {row.val}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
                        row.safe
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: READINESS RADAR                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'radar' && (
        <div className="space-y-6 animate-fade-in">
          {/* Institutional Role Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <strong className="font-semibold text-amber-950">
                Department Academic Head Boundary Enforcement:
              </strong>
              <p className="text-amber-800 leading-relaxed">
                Department Academic Heads can monitor cohort blockers and graduation readiness for their department, but <strong>CANNOT issue or revoke Proof Passes</strong>. Issuance authority is reserved strictly for the Registrar Office.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-200/70 text-amber-950 font-mono text-[11px] font-bold shrink-0">
              Registrar Seal Required
            </span>
          </div>

          {/* Department Readiness Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* CSE Monitored Cohort */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-cobalt-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Computer Science & Engineering Cohort (Dept Review)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {cseStudents.length} Students Monitored
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {cseStudents.map((s) => {
                  const hasConflict = s.seededMismatch && !s.seededMismatch.resolved;
                  return (
                    <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">
                            {s.fullName.value}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            ({s.rollNumber})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {s.totalCreditsCompleted.value} / {s.totalCreditsRequired} Credits Completed • Sem {s.currentSemester.value}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">
                            {s.readinessScore}%
                          </div>
                          <div className="text-[10px] text-slate-400">Readiness</div>
                        </div>

                        {hasConflict ? (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Blocked: Identity Conflict
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Ready for Proof
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Blocker Summary */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-subtle flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Radar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Curriculum Blocker Radar</span>
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Active blockers preventing 100% cohort credential clearance:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-0.5">
                    <div className="font-semibold">Blocker 1: Name & Birth Year Variance</div>
                    <p className="text-[11px] text-amber-800">
                      Priya Sharma: Admission ERP vs ABC mock feed. Requires Registrar physical ledger reconciliation.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 space-y-0.5">
                    <div className="font-semibold">Blocker 2: Patronymic & Credit Sync Checks</div>
                    <p className="text-[11px] text-slate-600">
                      Aarav Kulkarni (middle name initial) & Tanvi Deshmukh (elective credit delta) require staff clearance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/workbench"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <span>Open Mismatch Workbench</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT REPLAY                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6 animate-fade-in">
          {/* Subtitle */}
          <div className="p-4 rounded-xl bg-canvas border border-slate-200 text-xs text-slate-700 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <strong className="text-slate-900 font-semibold">Read-Only Institutional Audit Trail:</strong>{' '}
              Inspect the sequential chronological timeline of events for Priya Sharma. Every staff view, unmask attempt, and conflict resolution is logged with simulated verification metadata.
            </div>
            <Link
              href="/audit"
              className="px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold shrink-0 shadow-xs"
            >
              Full Institutional Audit Stream →
            </Link>
          </div>

          {/* Sequential Timeline Player */}
          <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
            {auditJourney.map((evt) => (
              <div key={evt.seq} className="relative group">
                {/* Timeline node marker */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cobalt-600" />
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-2 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                        STEP {evt.seq}
                      </span>
                      <span className="font-semibold text-slate-900 font-sans">{evt.actor}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({evt.role})</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{evt.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {evt.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono text-slate-500">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        evt.status === 'COMPLIANT'
                          ? 'bg-slate-100 text-slate-800 border border-slate-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {evt.action}
                    </span>
                    <span>IP: {evt.ip}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Integrity Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default TrustTraceSuite;
