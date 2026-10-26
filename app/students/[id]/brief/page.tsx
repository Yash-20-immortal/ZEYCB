'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Printer,
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ZeycbLogo } from '@/components/ZeycbLogo';

export default function StudentReviewBriefPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = (params?.id as string) || 'stu-001';
  const { students, institution } = useStore();

  const student = students.find((s) => s.id === studentId) || students[0];
  const hasMismatch = student.seededMismatch && !student.seededMismatch.resolved;
  const isResolved = student.seededMismatch && student.seededMismatch.resolved;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 print:py-0">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Screen Controls Header (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-subtle print:hidden">
          <div className="flex items-center gap-2">
            <Link
              href={`/students/${student.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Student Profile</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/dashboard"
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Registry Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Printable Institutional Case Brief
            </span>
            <button
              id="btn-trigger-print"
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief (Save PDF)</span>
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0 print:rounded-none text-slate-900 font-sans">
          {/* Synthetic Demo Disclaimer Banner */}
          <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="font-semibold text-amber-950">SYNTHETIC RESEARCH PROTOTYPE RECORD:</strong>{' '}
              Fictional demonstration data for AICTE SIH26263 evaluation. Not an official legal instrument or government database extract.
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-200/80 font-bold shrink-0">
              NITAS Prototype Dataset
            </span>
          </div>

          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <ZeycbLogo className="w-7 h-7 text-slate-900" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Zeycb Credential Provenance Registry
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                {institution.name}
              </h1>
              <p className="text-xs text-slate-600">
                Office of the Registrar & Academic Evaluation Cell • {institution.affiliatingUniversity}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono pt-1 text-slate-600">
                <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Fictional institute / synthetic prototype only
                </span>
                <span>•</span>
                <span className="text-slate-500">Not an official or cryptographic credential</span>
              </div>
            </div>

            <div className="sm:text-right text-xs space-y-1 font-mono text-slate-600 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <div className="font-bold text-slate-900 text-sm">REVIEW BRIEF</div>
              <div>Doc Ref: BRIEF-SYN-{student.id.toUpperCase()}-2025</div>
              <div>Generated: {formatDate(new Date().toISOString())}</div>
              <div className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-800">
                Staff Scrutiny Mode
              </div>
            </div>
          </div>

          {/* Candidate Profile Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                1. Candidate Academic Profile
              </h2>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                hasMismatch
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : student.status === 'pending_sync'
                  ? 'bg-sky-100 text-sky-900 border border-sky-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {hasMismatch
                  ? 'Action Required (Conflict Held)'
                  : student.status === 'pending_sync'
                  ? 'Pending Sync (Evidence Review)'
                  : student.status === 'proof_issued'
                  ? 'Proof Pass Issued (Verified)'
                  : 'Ready for Credential Issuance'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Candidate Full Name</span>
                <span className="font-semibold text-slate-900 text-sm">{student.fullName.value}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">University Roll Number</span>
                <span className="font-mono font-semibold text-slate-900 text-sm">{student.rollNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Department</span>
                <span className="font-medium text-slate-800">{student.department}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Academic Program</span>
                <span className="font-medium text-slate-800">{student.program.value}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] block">Current Academic Term</span>
                <span className="font-medium text-slate-900">Semester {student.currentSemester.value} (3rd Year)</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Cumulative CGPA</span>
                <span className="font-semibold text-slate-900">{student.cgpa.value}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Academic Credits Completed</span>
                <span className="font-semibold text-slate-900">
                  {student.totalCreditsCompleted.value} / {student.totalCreditsRequired} Credits
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Synthetic APAAR Placeholder</span>
                <span className="font-mono text-slate-800 font-semibold">{student.maskedApaarId}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Source-by-Source Multi-Feed Comparison */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
              2. Source-by-Source Provenance Comparison Matrix
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Academic Attribute</th>
                    <th className="py-2.5 px-3">Authoritative Institutional SIS Ledger</th>
                    <th className="py-2.5 px-3">External Depository Feed (ABC / State Mock)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900">Legal Name</td>
                    <td className="py-2 px-3">
                      <div>{student.fullName.value}</div>
                      <div className="text-[10px] text-slate-500">{student.fullName.provenance.sourceName}</div>
                    </td>
                    <td className="py-2 px-3">
                      <div>{student.fullName.alternateValue || student.fullName.value}</div>
                      <div className="text-[10px] text-slate-500">
                        {student.fullName.alternateSource?.sourceName || 'Corroborating Ingest Feed'}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      {student.fullName.status === 'discrepancy' ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          Variance Flagged
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[10px]">
                          Corroborated
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900">Date of Birth</td>
                    <td className="py-2 px-3">
                      <div>{student.dateOfBirth.value}</div>
                      <div className="text-[10px] text-slate-500">{student.dateOfBirth.provenance.sourceName}</div>
                    </td>
                    <td className="py-2 px-3">
                      <div>{student.dateOfBirth.alternateValue || student.dateOfBirth.value}</div>
                      <div className="text-[10px] text-slate-500">
                        {student.dateOfBirth.alternateSource?.sourceName || 'Corroborated in Board File'}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      {student.dateOfBirth.status === 'discrepancy' ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px]">
                          1-Year Offset Flagged
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[10px]">
                          Corroborated
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900">Degree Program</td>
                    <td className="py-2 px-3">
                      <div>{student.program.value}</div>
                      <div className="text-[10px] text-slate-500">AICTE Intake Approval Master</div>
                    </td>
                    <td className="py-2 px-3">
                      <div>{student.program.value}</div>
                      <div className="text-[10px] text-slate-500">ABC Curriculum Matrix</div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[10px]">
                        Corroborated
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-900">Credits Completed</td>
                    <td className="py-2 px-3">
                      <div>{student.totalCreditsCompleted.value} Credits</div>
                      <div className="text-[10px] text-slate-500">COE Tabulation Ledger</div>
                    </td>
                    <td className="py-2 px-3">
                      <div>
                        {student.totalCreditsCompleted.alternateValue || student.totalCreditsCompleted.value} Credits
                      </div>
                      <div className="text-[10px] text-slate-500">ABC Verified Synced Ledger</div>
                    </td>
                    <td className="py-2 px-3">
                      {student.totalCreditsCompleted.status === 'unverified' ? (
                        <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 font-bold text-[10px]">
                          Sync Pending
                        </span>
                      ) : student.totalCreditsCompleted.status === 'discrepancy' ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          Elective Variance
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium text-[10px]">
                          Corroborated
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Outstanding Human-Review Decisions */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
              3. Outstanding Human-Review Decisions & Governance Ledger
            </h2>

            {student.seededMismatch ? (
              <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                student.seededMismatch.resolved
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {student.seededMismatch.resolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    )}
                    <span className="font-bold text-sm">
                      {student.seededMismatch.fieldLabel}: Source Reconciliation
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border font-bold">
                    {student.seededMismatch.resolved ? 'RESOLVED & SEALED' : 'STAFF ACTION REQUIRED'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded bg-white/80 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block font-medium">Local Institutional File:</span>
                    <span className="font-semibold text-slate-900">{student.seededMismatch.localValue}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{student.seededMismatch.localSource}</span>
                  </div>
                  <div className="p-2.5 rounded bg-white/80 border border-slate-200/60">
                    <span className="text-[11px] text-slate-500 block font-medium">External Depository Feed:</span>
                    <span className="font-semibold text-slate-900">{student.seededMismatch.incomingValue}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{student.seededMismatch.incomingSource}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-white/80 border border-slate-200/60 leading-relaxed text-[11px]">
                  <strong>AI Heuristic Assessment:</strong> {student.seededMismatch.aiExplanation}
                </div>

                <div className="pt-1 text-[11px] text-slate-600">
                  {student.seededMismatch.resolved ? (
                    <div>
                      <strong>Resolution Recorded:</strong> Reconciled by {student.seededMismatch.resolvedBy} on{' '}
                      {formatDate(student.seededMismatch.resolvedAt || '')}. Supporting Evidence: {student.seededMismatch.supportingDocument}.
                    </div>
                  ) : (
                    <div>
                      <strong>Action Required:</strong> Institutional staff must cross-examine physical file{' '}
                      <code className="text-slate-800 font-mono font-semibold">{student.seededMismatch.supportingDocument}</code> and record attributed resolution in Mismatch Workbench.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No Outstanding Source Discrepancies</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  All ingested attributes align with primary matriculation records. Record is cleared for degree eligibility verification.
                </p>
              </div>
            )}
          </div>

          {/* Section 4: Privacy Minimization & Withheld Attributes */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>4. Data Minimization & Withheld Attributes Schedule</span>
              <span className="text-[10px] font-mono font-normal text-slate-500">Privacy by Design Standard</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Under the institutional data minimization protocol, external verifiers and recruiters receive credential verification without exposing lifelong citizen identity numbers. The following attributes are strictly withheld:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {student.withheldByDefault.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded bg-white border border-slate-200/80 text-[11px] text-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Prototype Case Review & Institutional Context */}
          <div className="border-t-2 border-slate-900 pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Attributing Institutional Reviewer
                </span>
                <div className="font-bold text-slate-900 text-sm">{institution.nodalOfficer.name}</div>
                <div className="text-slate-600">{institution.nodalOfficer.designation}</div>
                <div className="text-slate-500 font-mono text-[11px]">Staff ID: {institution.nodalOfficer.staffId}</div>
              </div>

              <div className="sm:text-right space-y-1 font-mono text-[11px] text-slate-600">
                <span className="text-slate-500 uppercase tracking-wider block font-semibold text-[10px]">
                  Document Status & Provenance
                </span>
                <div className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs inline-block">
                  Fictional institute / synthetic prototype only
                </div>
                <div className="text-slate-500 text-[10px]">
                  This brief is not an official or cryptographic credential
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-600 leading-relaxed">
              <strong>Notice:</strong> This review brief is an internal case summary for demonstration and research purposes only. All institutional identities, student records, and evaluation metrics are fictional. This brief is not an official university credential, statutory gazette instrument, or cryptographic credential.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
