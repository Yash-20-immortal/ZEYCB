'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  AlertTriangle,
  Bot,
  FileText,
  CheckCircle2,
  Building,
  History,
  QrCode,
  Lock,
  FileCheck2,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { ProofPassModal } from '@/components/ProofPassModal';

export default function MismatchWorkbenchPage() {
  const { students, resolveMismatch, activeRole } = useStore();

  const isAuditor = activeRole === 'Auditor / Compliance Inspector';
  const isDeptHead = activeRole === 'Department Academic Head';
  const isRegistrar = activeRole === 'Registrar Office (Staff #RO-402)';

  // All students with seeded conflicts
  const conflictStudents = students.filter((s) => s.seededMismatch);

  // Default to Priya Sharma (stu-001) flagship story
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-001');

  const currentStudent =
    students.find((s) => s.id === selectedStudentId) ||
    students.find((s) => s.id === 'stu-001') ||
    students[0];

  const mismatch = currentStudent.seededMismatch;

  const [selectedSource, setSelectedSource] = useState<'SIS' | 'ABC' | 'CUSTOM'>('SIS');
  const [customName, setCustomName] = useState(currentStudent.fullName.value);
  const [customDob, setCustomDob] = useState(currentStudent.dateOfBirth.value);
  const [reasonNote, setReasonNote] = useState(
    'Verified against physical CBSE Matriculation Certificate #82190 on institutional file. Name confirmed as Priya Sharma, DOB confirmed as 15-Aug-2004. ABC mock feed middle name variance flagged as unverified pre-enrollment draft.'
  );
  const [evidenceRef, setEvidenceRef] = useState(
    'CBSE-DEL-2020-82190 (Physical Ledger CS-22-084)'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  const isResolved = mismatch?.resolved;

  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId);
    setSelectedSource('SIS');
    const target = students.find((s) => s.id === sId);
    if (target) {
      setCustomName(target.fullName.value);
      setCustomDob(target.dateOfBirth.value);
      if (sId === 'stu-001') {
        setReasonNote(
          'Verified against physical CBSE Matriculation Certificate #82190 on institutional file. Name confirmed as Priya Sharma, DOB confirmed as 15-Aug-2004.'
        );
        setEvidenceRef('CBSE-DEL-2020-82190 (Physical Ledger CS-22-084)');
      } else if (sId === 'stu-005') {
        setReasonNote(
          'Reconciled patronymic initial "N." against MSBSHSE Marksheet #091482. Authorized legal spelling retained as Aarav Narayan Kulkarni.'
        );
        setEvidenceRef('MSBSHSE-2020-091482 (Physical Ledger CS-22-012)');
      } else if (sId === 'stu-009') {
        setReasonNote(
          'Grade Moderation Committee minutes approved credit recognition for CS-308. Re-synchronized ABC ledger to 116 credits.'
        );
        setEvidenceRef('NITAS/GMC/2024/CS-308 (COE Tabulation Sheet)');
      } else {
        setReasonNote(
          `Reconciled against institutional ledger for ${target.fullName.value}. Evidence confirmed.`
        );
        setEvidenceRef(target.seededMismatch?.supportingDocument || 'INSTITUTIONAL-SIS-LEDGER');
      }
    }
  };

  const handleResolve = () => {
    setIsSubmitting(true);
    let chosenName = currentStudent.fullName.value;
    let chosenDob = currentStudent.dateOfBirth.value;

    if (currentStudent.id === 'stu-001') {
      if (selectedSource === 'SIS') {
        chosenName = 'Priya Sharma';
        chosenDob = '2004-08-15';
      } else if (selectedSource === 'ABC') {
        chosenName = 'Priya Kumari Sharma';
        chosenDob = '2003-08-15';
      } else {
        chosenName = customName;
        chosenDob = customDob;
      }
    } else if (currentStudent.id === 'stu-005') {
      if (selectedSource === 'SIS') {
        chosenName = 'Aarav N. Kulkarni';
      } else if (selectedSource === 'ABC') {
        chosenName = 'Aarav Narayan Kulkarni';
      } else {
        chosenName = customName;
      }
      chosenDob = currentStudent.dateOfBirth.value;
    } else {
      chosenName = selectedSource === 'CUSTOM' ? customName : currentStudent.fullName.value;
      chosenDob = selectedSource === 'CUSTOM' ? customDob : currentStudent.dateOfBirth.value;
    }

    setTimeout(() => {
      resolveMismatch(
        currentStudent.id,
        selectedSource,
        chosenName,
        chosenDob,
        reasonNote,
        evidenceRef
      );
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Source Provenance Investigation</span>
            <span>•</span>
            <span className="font-mono">Case #{currentStudent.id.toUpperCase()}-DISC</span>
            <span>•</span>
            <span>Roll: {currentStudent.rollNumber}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-serif">
            Mismatch Workbench: {currentStudent.fullName.value}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Resolve source data conflicts between Institutional Admissions Records and National Depository Feeds (Simulated).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/students/${currentStudent.id}`}
            className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 transition-colors shadow-xs"
          >
            Student Record Detail
          </Link>
          {isResolved && isRegistrar && (
            <button
              onClick={() => setShowProofModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-cobalt-600 hover:bg-cobalt-700 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Issue Proof Pass</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Switcher Tabs */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-semibold text-slate-900">Flagged Cases ({conflictStudents.length}):</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {conflictStudents.map((cs) => {
            const isSel = cs.id === currentStudent.id;
            const isCaseResolved = cs.seededMismatch?.resolved;
            return (
              <button
                key={cs.id}
                type="button"
                onClick={() => handleSelectStudent(cs.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cs.fullName.value}</span>
                {cs.id === 'stu-001' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isSel ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-900'}`}>
                    Flagship
                  </span>
                )}
                {isCaseResolved ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution State Notice */}
      {isResolved ? (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-emerald-950">
                  Discrepancy Successfully Reconciled & Attributed
                </h2>
                <span className="px-2 py-0.2 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                  Readiness: 98%
                </span>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed">
                Resolved by <strong>{mismatch?.resolvedBy}</strong> on{' '}
                {formatDate(mismatch?.resolvedAt || '')}. Authoritative Value:{' '}
                <em>{currentStudent.fullName.value}</em>.
              </p>
              <p className="text-[11px] text-emerald-800/80 italic">
                Note: &quot;{mismatch?.resolutionNote}&quot;
              </p>
            </div>
          </div>

          {isRegistrar && (
            <button
              onClick={() => setShowProofModal(true)}
              className="px-3.5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shrink-0 transition-colors shadow-xs"
            >
              Issue Proof Pass for {currentStudent.fullName.value.split(' ')[0]}
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-amber-950">Staff Action Required:</strong> An unresolved conflict holds back this student&apos;s record from full verification readiness. Review source evidence, confirm authoritative values with an attributed note, and seal the record.
          </div>
        </div>
      )}

      {/* Side-by-side Evidence Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Source A: Local Institutional SIS */}
        <div
          className={`p-5 rounded-lg border transition-all ${
            selectedSource === 'SIS' && !isResolved
              ? 'bg-white border-cobalt-600 shadow-sm ring-1 ring-cobalt-600'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <div>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Source A: Institutional Admissions SIS
                </h3>
                <p className="text-[11px] text-slate-500">Verified Physical Admission Ledger</p>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              98% High Confidence
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100 space-y-0.5">
              <span className="text-[11px] text-slate-500 block font-medium">
                Recorded Local Value
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {mismatch?.localValue || currentStudent.fullName.value}
              </p>
              <p className="text-[11px] text-emerald-700">
                Source: {mismatch?.localSource || 'Institutional Admission Ledger'}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Student ID / Roll:</span>
                <span className="text-slate-700 font-mono font-medium">{currentStudent.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span className="text-slate-700 font-medium">{currentStudent.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Type:</span>
                <span className="text-slate-700 font-medium">Physical Document Scrutiny</span>
              </div>
            </div>

            {!isResolved && (
              <button
                type="button"
                onClick={() => setSelectedSource('SIS')}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  selectedSource === 'SIS'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedSource === 'SIS'
                  ? '✓ Selected as Authoritative Value'
                  : 'Select Source A (Institutional SIS)'}
              </button>
            )}
          </div>
        </div>

        {/* Source B: Simulated Depository ABC */}
        <div
          className={`p-5 rounded-lg border transition-all ${
            selectedSource === 'ABC' && !isResolved
              ? 'bg-white border-cobalt-600 shadow-sm ring-1 ring-cobalt-600'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <div>
                <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                  Source B: ABC Depository Feed
                </h3>
                <p className="text-[11px] text-amber-700">Simulated Depository Ingest Feed</p>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Flagged Ingest
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="p-3 rounded-md bg-amber-50/50 border border-amber-200/60 space-y-0.5">
              <span className="text-[11px] text-slate-500 block font-medium">
                Incoming Ingest Value
              </span>
              <p className="text-sm font-semibold text-amber-900">
                {mismatch?.incomingValue || currentStudent.fullName.alternateValue || 'Conflicting Ingest Data'}
              </p>
              <p className="text-[11px] text-amber-700">
                Source: {mismatch?.incomingSource || 'National Academic Depository Feed'}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Ingest Feed Ref:</span>
                <span className="text-slate-700 font-mono">
                  {currentStudent.fullName.alternateSource?.recordRef || `ABC-FEED-${currentStudent.id.toUpperCase()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ingest Disposition:</span>
                <span className="text-amber-800 font-medium">Automated Merge Paused</span>
              </div>
              <div className="flex justify-between">
                <span>Synthetic APAAR:</span>
                <span className="text-slate-700 font-mono">{currentStudent.maskedApaarId}</span>
              </div>
            </div>

            {!isResolved && (
              <button
                type="button"
                onClick={() => setSelectedSource('ABC')}
                className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  selectedSource === 'ABC'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {selectedSource === 'ABC'
                  ? '✓ Selected as Authoritative Value'
                  : 'Select Source B (ABC Mock Feed)'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Decision Support Panel */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cobalt-600" />
            <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              AI Decision Support Analysis
            </h3>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Advisory Only • Non-Autonomous
          </span>
        </div>

        <div className="text-xs text-slate-700 leading-relaxed space-y-2">
          <p className="p-3 rounded-md bg-slate-50 border border-slate-100">
            <strong className="text-slate-900">Discrepancy Analysis:</strong>{' '}
            {mismatch?.aiExplanation}
          </p>
          <p className="p-3 rounded-md bg-amber-50/80 border border-amber-200/70 text-amber-900">
            <strong className="text-amber-950">Recommended Staff Action:</strong>{' '}
            {mismatch?.aiSuggestedResolution}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Human-in-the-Loop Policy: Zeycb does not allow AI to silently update records. Every change requires an authorized officer review and attributed sign-off.
          </span>
        </div>
      </div>

      {/* Physical Supporting Evidence Scrutiny Card */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <span className="font-semibold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            Institutional Ledger Supporting Evidence
          </span>
          <span className="text-emerald-700 font-mono text-xs font-medium">
            Physical File Scrutiny Completed
          </span>
        </div>

        <div className="p-3.5 rounded-md bg-slate-50 border border-slate-100 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Document / Record:</span>
            <span className="text-slate-900 font-medium">
              {mismatch?.supportingDocument || 'Physical Admission File & Marksheet Copy'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Candidate Target:</span>
            <span className="font-mono text-slate-900 font-medium">{currentStudent.fullName.value} ({currentStudent.rollNumber})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Physical Vault Location:</span>
            <span className="text-slate-700">
              NITAS Registrar Vault • Admission Cabinet {currentStudent.department.slice(0, 3).toUpperCase()}-22, Folder {currentStudent.rollNumber.split('-')[2] || '084'}
            </span>
          </div>
        </div>
      </div>

      {/* Staff Resolution Form */}
      {!isResolved && (
        isAuditor ? (
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <Lock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-900">
                Read-Only Inspection Mode (Auditor Persona)
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Auditor / Compliance Inspector persona operates with strictly read-only inspection access. Discrepancy reconciliation and record mutation authority are reserved for institutional staff (Registrar Office and Department Head).
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Audited Record: {currentStudent.fullName.value} ({currentStudent.rollNumber})</span>
              <span className="font-mono text-slate-400">Case #{currentStudent.id.toUpperCase()}-DISC</span>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-lg bg-white border border-slate-300 shadow-card space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Staff Decision & Attributed Resolution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Acting Persona: <strong>{activeRole}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Resolution Justification & Audit Note (Mandatory)
                </label>
                <textarea
                  rows={3}
                  value={reasonNote}
                  onChange={(e) => setReasonNote(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cobalt-500 focus:border-cobalt-500 text-xs leading-relaxed"
                  placeholder="Enter formal justification for authoritative reconciliation..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Supporting Physical Evidence Identifier
                  </label>
                  <input
                    type="text"
                    value={evidenceRef}
                    onChange={(e) => setEvidenceRef(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cobalt-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Authorizing Institutional Officer
                  </label>
                  <input
                    type="text"
                    disabled
                    value={
                      isDeptHead
                        ? 'Prof. Rajesh Verma (Head, Computer Science & Engineering)'
                        : 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)'
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-xs text-slate-700 leading-snug">
                  Reconciliation will approve authoritative record for{' '}
                  <strong className="text-slate-900">{currentStudent.fullName.value}</strong>. Student readiness score will be updated to 98% and state marked as verified.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Link
                  href="/dashboard"
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleResolve}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Recording Resolution...</span>
                  ) : (
                    <span>Approve Resolution & Update Record</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* Proof Pass Modal Launcher */}
      {showProofModal && (
        <ProofPassModal
          student={currentStudent}
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
        />
      )}
    </div>
  );
}
