'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  QrCode,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  History,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { StudentRecord } from '@/lib/types';
import { formatTimeAgo } from '@/lib/utils';
import { ProofPassModal } from '@/components/ProofPassModal';

export default function DashboardPage() {
  const { institution, students, proofPasses, auditEvents, activeRole } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'action_required' | 'verified' | 'proof_issued'>('all');
  const [selectedStudentForPass, setSelectedStudentForPass] = useState<StudentRecord | null>(null);

  const isDeptHead = activeRole === 'Department Academic Head';
  const isAuditor = activeRole === 'Auditor / Compliance Inspector';
  const isRegistrar = activeRole === 'Registrar Office (Staff #RO-402)';

  // Scope students if Department Academic Head (scoped to Computer Science & Engineering)
  const scopedStudents = isDeptHead
    ? students.filter((s) => s.department === 'Computer Science & Engineering')
    : students;

  // Compute stats
  const totalStudents = scopedStudents.length;
  const unresolvedMismatches = scopedStudents.filter(
    (s) => s.seededMismatch && !s.seededMismatch.resolved
  );
  const verifiedCount = scopedStudents.filter((s) => s.status === 'verified').length;
  const proofIssuedCount = isDeptHead ? 0 : proofPasses.filter((p) => !p.isRevoked).length;
  const avgReadiness = Math.round(
    scopedStudents.reduce((acc, s) => acc + s.readinessScore, 0) / (totalStudents || 1)
  );

  // Filter students
  const filteredStudents = scopedStudents.filter((s) => {
    const matchesSearch =
      s.fullName.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.maskedApaarId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    return s.status === filterTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-slate-700">
              {isDeptHead
                ? 'Department of Computer Science & Engineering (Head Review Scope)'
                : isAuditor
                ? 'Institutional Compliance & Audit Scope (Read-Only)'
                : 'AICTE Northern Region Scope (Fictional Prototype)'}
            </span>
            <span>•</span>
            <span className="font-mono">ID: {institution.aictePermanentId}</span>
            <span>•</span>
            <span>{institution.naacGrade}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 font-serif">
            {isDeptHead
              ? `${institution.name} — Computer Science & Engineering`
              : institution.name}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {isDeptHead
              ? 'Departmental student record readiness, academic progress review, and source discrepancy cross-examination.'
              : isAuditor
              ? 'Read-only institutional audit review of student cohorts, provenance evidence, and verified readiness.'
              : 'Student record readiness, provenance cross-examination, and selective Proof Pass issuance platform.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/workbench"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-sm"
          >
            <span>Mismatch Workbench</span>
            {unresolvedMismatches.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-amber-400 text-slate-950 font-bold">
                {unresolvedMismatches.length}
              </span>
            )}
          </Link>
          {isRegistrar && (
            <Link
              href="/passes"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition-colors shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              <span>Active Proof Passes</span>
            </Link>
          )}
        </div>
      </div>

      {/* Urgent Discrepancy Alert (Restrained Amber) */}
      {unresolvedMismatches.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-amber-900">
                1 High-Priority Source Discrepancy Pending Staff Review
              </h2>
              <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                <strong>Priya Sharma (Roll: 2022-CSE-084)</strong> has conflicting birth year and name spelling between Institute Admission ERP (15-Aug-2004) and simulated ABC Feed (15-Aug-2003). Automated credential issuance is held.
              </p>
            </div>
          </div>
          <Link
            href="/workbench"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium shrink-0 transition-colors shadow-sm"
          >
            <span>Investigate Conflict</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metric Cards (Clean White with hairline borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Record Readiness Index
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {avgReadiness}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              Cohort composite
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                avgReadiness >= 90 ? 'bg-cobalt-600' : 'bg-amber-500'
              }`}
              style={{ width: `${avgReadiness}%` }}
            />
          </div>
          <p className="mt-2.5 text-xs text-slate-500">
            {unresolvedMismatches.length === 0
              ? 'All 4 records reconciled'
              : `${unresolvedMismatches.length} record holds back 100% readiness`}
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Pending Conflicts
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {unresolvedMismatches.length}
            </span>
            <span
              className={`text-xs font-semibold ${
                unresolvedMismatches.length > 0 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {unresolvedMismatches.length > 0 ? 'Staff review required' : 'Zero flags'}
            </span>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            {unresolvedMismatches.length > 0
              ? 'Human-in-the-loop review mandatory'
              : 'All ingest feeds aligned'}
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {isDeptHead ? 'Credential Proofs' : 'Active Proof Passes'}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isDeptHead ? (
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Registrar Scope
              </span>
            ) : (
              <>
                <span className="text-3xl font-bold tracking-tight text-slate-900">
                  {proofIssuedCount}
                </span>
                <span className="text-xs font-medium text-cobalt-700">
                  Time-limited tokens
                </span>
              </>
            )}
          </div>
          <p className="mt-5 text-xs text-slate-500">
            {isDeptHead
              ? 'Proof Pass issuance restricted to Registrar Office'
              : 'Shared with external evaluators'}
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Verified Eligible Cohort
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {verifiedCount + proofIssuedCount} / {totalStudents}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              Ready for proof
            </span>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Reconciled against Admission SIS
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Student Cohort Roster (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-500" />
                {isDeptHead
                  ? 'Computer Science & Engineering Monitored Cohort'
                  : 'Monitored Cohort Roster'}
              </h2>
              <p className="text-xs text-slate-500">
                {isDeptHead
                  ? 'Academic Year 2024–25 Departmental Records'
                  : 'Academic Year 2024–25 Synthetic Cohort'}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterTab === 'all'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({scopedStudents.length})
              </button>
              <button
                onClick={() => setFilterTab('action_required')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  filterTab === 'action_required'
                    ? 'bg-white text-amber-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flagged ({unresolvedMismatches.length})
              </button>
              <button
                onClick={() => setFilterTab('verified')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterTab === 'verified'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilterTab('proof_issued')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterTab === 'proof_issued'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Proof Active
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by student name, roll number, or department..."
              className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cobalt-500 focus:border-cobalt-500 shadow-xs"
            />
          </div>

          {/* Clean Student Roster Cards */}
          <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100 shadow-subtle overflow-hidden">
            {filteredStudents.map((student) => {
              const hasMismatch = student.seededMismatch && !student.seededMismatch.resolved;
              return (
                <div
                  key={student.id}
                  className={`p-4 transition-colors ${
                    hasMismatch ? 'bg-amber-50/30 hover:bg-amber-50/50' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="font-semibold text-slate-900 text-sm hover:text-cobalt-600 transition-colors"
                        >
                          {student.fullName.value}
                        </Link>
                        <span className="text-xs text-slate-500 font-mono">
                          ({student.rollNumber})
                        </span>
                        {hasMismatch ? (
                          <span className="px-2 py-0.2 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            Action Required
                          </span>
                        ) : student.status === 'proof_issued' ? (
                          <span className="px-2 py-0.2 rounded text-[11px] font-medium bg-cobalt-50 text-cobalt-700 border border-cobalt-200">
                            Proof Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.2 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                        <span>{student.department}</span>
                        <span>•</span>
                        <span>Sem {student.currentSemester.value}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-600">
                          APAAR: {student.maskedApaarId}
                        </span>
                      </div>
                    </div>

                    {/* Readiness Gauge & Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-semibold text-slate-900">
                          {student.readinessScore}%
                        </div>
                        <div className="text-[10px] text-slate-400">Readiness</div>
                      </div>

                      {hasMismatch ? (
                        <Link
                          href="/workbench"
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                        >
                          {isAuditor
                            ? 'Inspect Discrepancy'
                            : isDeptHead
                            ? 'Review Conflict'
                            : 'Resolve Conflict'}
                        </Link>
                      ) : isRegistrar ? (
                        <button
                          onClick={() => setSelectedStudentForPass(student)}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-slate-500" />
                          <span>Issue Proof Pass</span>
                        </button>
                      ) : (
                        <Link
                          href={`/students/${student.id}`}
                          className="px-3 py-1.5 rounded-md text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs"
                        >
                          <span>View Record</span>
                        </Link>
                      )}

                      <Link
                        href={`/students/${student.id}`}
                        className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Full Record"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Seeded Conflict Preview (if present) */}
                  {hasMismatch && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-xs text-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span>
                        Conflict: <strong>Admission ERP (2004)</strong> vs{' '}
                        <strong>ABC Feed (2003)</strong>
                      </span>
                      <Link
                        href="/workbench"
                        className="text-amber-900 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                      >
                        Review Evidence in Workbench →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Clean Institutional Controls & Audit Stream */}
        <div className="space-y-6">
          {/* Proof Pass Design System Card */}
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-cobalt-600" />
              Proof Pass Privacy Architecture
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Institutional staff issues minimal, expiring verification proofs rather than releasing unredacted academic transcripts.
            </p>
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Selective Disclosure:</strong> Only verified academic attributes (Degree, Credits) are revealed.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Explicitly Withheld:</strong> Date of Birth, National ID, and Address stay protected.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Revocable:</strong> Immediate 1-click invalidation across active links and QR codes.
                </span>
              </div>
            </div>
          </div>

          {/* Audit Stream Panel */}
          <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                Recent Audit Events
              </h3>
              <Link
                href="/audit"
                className="text-xs text-cobalt-600 hover:underline font-medium"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-2.5">
              {auditEvents.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-md bg-slate-50/80 border border-slate-100 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{evt.actor}</span>
                    <span className="text-slate-400">{formatTimeAgo(evt.timestamp)}</span>
                  </div>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {evt.details}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono ${
                        evt.status === 'COMPLIANT'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {evt.action}
                    </span>
                    <span className="text-slate-400 truncate">{evt.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proof Pass Creation Modal */}
      {selectedStudentForPass && (
        <ProofPassModal
          student={selectedStudentForPass}
          isOpen={Boolean(selectedStudentForPass)}
          onClose={() => setSelectedStudentForPass(null)}
        />
      )}
    </div>
  );
}
