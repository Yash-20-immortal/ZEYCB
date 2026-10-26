'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  User,
  Shield,
  Eye,
  EyeOff,
  GitCompare,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  History,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { ProofPassModal } from '@/components/ProofPassModal';
import { UnmaskModal } from '@/components/UnmaskModal';

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = (params?.id as string) || 'stu-001';
  const { students, proofPasses, activeRole } = useStore();

  const isDeptHead = activeRole === 'Department Academic Head';
  const isAuditor = activeRole === 'Auditor / Compliance Inspector';
  const isRegistrar = activeRole === 'Registrar Office (Staff #RO-402)';

  // Scope cohort for Department Academic Head
  const scopedStudents = isDeptHead
    ? students.filter((s) => s.department === 'Computer Science & Engineering')
    : students;

  const student = students.find((s) => s.id === studentId) || students[0];

  const [isUnmasked, setIsUnmasked] = useState(false);
  const [showUnmaskModal, setShowUnmaskModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  // Active passes for this student
  const studentPasses = proofPasses.filter((p) => p.studentId === student.id);
  const hasMismatch = student.seededMismatch && !student.seededMismatch.resolved;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
          Registry Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-700">Student Records</span>
        <span>/</span>
        <span className="font-semibold text-slate-900">{student.fullName.value} ({student.rollNumber})</span>
      </div>
      {isDeptHead && student.department !== 'Computer Science & Engineering' && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
          <span>
            This student record belongs to <strong>{student.department}</strong>. Department Academic Head review scope is restricted to Computer Science & Engineering.
          </span>
          <Link
            href="/students/stu-001"
            className="font-semibold text-amber-950 underline shrink-0"
          >
            Switch to CSE Roster (Priya Sharma) →
          </Link>
        </div>
      )}

      {/* Student Selector Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs text-slate-500 font-medium mr-1.5">
            {isDeptHead ? 'Department Roster:' : 'Cohort Record:'}
          </span>
          {scopedStudents.map((s) => (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                s.id === student.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{s.fullName.value}</span>
              {s.seededMismatch && !s.seededMismatch.resolved && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            id="btn-open-review-brief"
            href={`/students/${student.id}/brief`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs transition-colors shadow-xs"
            title="Open printable review brief for this student"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Review Brief</span>
          </Link>
          {hasMismatch ? (
            <Link
              href="/workbench"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>{isAuditor ? 'Inspect in Workbench' : 'Resolve in Workbench'}</span>
            </Link>
          ) : student.status === 'pending_sync' ? (
            <span className="px-3 py-1.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-xs font-medium">
              Evidence Sync Pending
            </span>
          ) : isRegistrar ? (
            <button
              onClick={() => setShowProofModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-cobalt-600 hover:bg-cobalt-700 text-white font-medium text-xs transition-colors shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Issue Proof Pass</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
              <User className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 font-serif">
                  {student.fullName.value}
                </h1>
                {hasMismatch ? (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Discrepancy Flagged
                  </span>
                ) : student.status === 'pending_sync' ? (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
                    Pending Sync ({student.readinessScore}% Evidence Pending)
                  </span>
                ) : student.status === 'proof_issued' ? (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-cobalt-50 text-cobalt-700 border border-cobalt-200">
                    Proof Active ({student.readinessScore}% Verified)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ready ({student.readinessScore}% Verified)
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Synthetic Demo Record
                </span>
              </div>

              <p className="text-xs text-slate-600">
                {student.program.value} • Roll: <strong className="text-slate-900">{student.rollNumber}</strong>
              </p>

              {/* Masked Identifier Display */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-medium">Synthetic APAAR:</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {isUnmasked ? student.unmaskedApaarId : student.maskedApaarId}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isUnmasked) {
                        setIsUnmasked(false);
                      } else {
                        setShowUnmaskModal(true);
                      }
                    }}
                    className="ml-1 text-slate-500 hover:text-slate-800 p-0.5"
                    title={isUnmasked ? 'Mask Identifier' : 'Unmask Identifier (Requires Audit Justification)'}
                  >
                    {isUnmasked ? (
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>

                <span className="text-slate-400 text-[11px]">
                  {isUnmasked ? 'Raw synthetic placeholder exposed (Logged in audit)' : 'Masked under privacy minimization policy (Synthetic Demo)'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium block">
                Earned Credits
              </span>
              <span className="text-base font-bold text-slate-900">
                {student.totalCreditsCompleted.value} / {student.totalCreditsRequired}
              </span>
            </div>
            <span className="text-xs text-slate-700 font-medium bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              CGPA: {student.cgpa.value.split('/')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Conflict Notice (if active) */}
      {hasMismatch && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                1 Unresolved Identity Discrepancy Active
              </p>
              <p className="text-slate-600 mt-0.5">
                Admission ERP records DOB as 15-Aug-2004 whereas simulated ABC feed records 15-Aug-2003.
              </p>
            </div>
          </div>
          <Link
            href="/workbench"
            className="px-3 py-1.5 rounded-md bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <span>Review in Workbench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Field-level Source Provenance Matrix */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-subtle p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cobalt-600" />
            Field-Level Source Provenance Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every credential attribute tracks its authoritative origin, ingest confidence, and sync timestamp.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Field Attribute</th>
                <th className="py-2.5 px-3">Recorded Value</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-3">Authoritative Source Provenance</th>
                <th className="py-2.5 px-3">Confidence & Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-3 font-medium text-slate-900">Legal Name</td>
                <td className="py-3 px-3 font-semibold text-slate-900">{student.fullName.value}</td>
                <td className="py-3 px-3">
                  {student.fullName.status === 'discrepancy' ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      Discrepancy Flag
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Match
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {student.fullName.provenance.sourceName}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  {student.fullName.provenance.confidence}% • {student.fullName.provenance.recordRef}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-medium text-slate-900">Date of Birth</td>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  {isUnmasked ? student.dateOfBirth.value : '••••-••-15 (Masked)'}
                </td>
                <td className="py-3 px-3">
                  {student.dateOfBirth.status === 'discrepancy' ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      DOB Variance
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified
                    </span>
                  )}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {student.dateOfBirth.provenance.sourceName}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  {student.dateOfBirth.provenance.confidence}% • {student.dateOfBirth.provenance.recordRef}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-medium text-slate-900">Program & Degree</td>
                <td className="py-3 px-3 font-semibold text-slate-900">{student.program.value}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    Approved Curriculum
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {student.program.provenance.sourceName}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  {student.program.provenance.confidence}% • {student.program.provenance.recordRef}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-medium text-slate-900">Current Academic Term</td>
                <td className="py-3 px-3 font-semibold text-slate-900">Semester {student.currentSemester.value}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Matriculation
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {student.currentSemester.provenance.sourceName}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  100% • {student.currentSemester.provenance.recordRef}
                </td>
              </tr>

              <tr>
                <td className="py-3 px-3 font-medium text-slate-900">Earned Academic Credits</td>
                <td className="py-3 px-3 font-semibold text-slate-900">
                  {student.totalCreditsCompleted.value} / {student.totalCreditsRequired} Credits
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ABC Synced (Simulated)
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {student.totalCreditsCompleted.provenance.sourceName}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  {student.totalCreditsCompleted.provenance.confidence}% • {student.totalCreditsCompleted.provenance.recordRef}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column: Chronological Audit Trail & Active Proof Passes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Chronological History */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-subtle p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              Chronological Audit Trail
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Local Demo Log</span>
          </div>

          <div className="space-y-3">
            {student.changeHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-md bg-slate-50 border border-slate-100 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <strong className="text-slate-900">{item.field}</strong>
                  <span className="text-slate-400">{formatDate(item.timestamp)}</span>
                </div>
                <div className="text-slate-700">
                  <span className="text-emerald-700 font-medium">Recorded Value:</span> {item.newValue}
                </div>
                <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-200/60 flex justify-between">
                  <span>Author: {item.author}</span>
                  <span className="italic">{item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issued Proof Passes for Student */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-subtle p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cobalt-600" />
              Issued Proof Passes ({studentPasses.length})
            </h3>
            <button
              onClick={() => setShowProofModal(true)}
              className="text-xs text-cobalt-600 hover:underline font-medium"
            >
              + Issue New Pass
            </button>
          </div>

          {studentPasses.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs space-y-2">
              <QrCode className="w-8 h-8 mx-auto text-slate-300" />
              <p>No Proof Passes generated yet for {student.fullName.value}.</p>
              <button
                onClick={() => setShowProofModal(true)}
                className="mt-1 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
              >
                Generate First Proof Pass
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {studentPasses.map((pass) => (
                <div
                  key={pass.id}
                  className={`p-3.5 rounded-md border text-xs space-y-1.5 ${
                    pass.isRevoked
                      ? 'bg-rose-50/50 border-rose-200 text-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {pass.passToken}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-medium ${
                        pass.isRevoked
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {pass.isRevoked ? 'REVOKED' : 'VALID'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Recipient: <strong>{pass.verifierRecipientName}</strong>
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Issued {formatTimeAgo(pass.issuedAt)}</span>
                    <Link
                      href={`/verify/${pass.passToken}`}
                      target="_blank"
                      className="text-cobalt-600 hover:underline font-medium"
                    >
                      Open Verifier Portal →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showProofModal && (
        <ProofPassModal
          student={student}
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
        />
      )}

      {showUnmaskModal && (
        <UnmaskModal
          isOpen={showUnmaskModal}
          studentName={student.fullName.value}
          studentId={student.id}
          fieldToUnmask="Full National APAAR ID & Date of Birth"
          onConfirm={() => {
            setIsUnmasked(true);
            setShowUnmaskModal(false);
          }}
          onCancel={() => setShowUnmaskModal(false)}
        />
      )}
    </div>
  );
}
