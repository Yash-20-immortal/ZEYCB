'use client';

import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function AuditLogPage() {
  const { auditEvents } = useStore();
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredEvents = auditEvents.filter((evt) => {
    const matchesSearch =
      evt.actor.toLowerCase().includes(search.toLowerCase()) ||
      evt.details.toLowerCase().includes(search.toLowerCase()) ||
      (evt.studentName && evt.studentName.toLowerCase().includes(search.toLowerCase())) ||
      evt.ipAddress.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedAction !== 'ALL' && evt.action !== selectedAction) return false;
    if (selectedStatus !== 'ALL' && evt.status !== selectedStatus) return false;
    return true;
  });

  const exportAuditJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nitas-audit-log-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const actionTypes: { label: string; value: string }[] = [
    { label: 'All Actions', value: 'ALL' },
    { label: 'Record Views', value: 'RECORD_VIEW' },
    { label: 'Unmask Attempts', value: 'UNMASK_ATTEMPT' },
    { label: 'Discrepancy Resolves', value: 'DISCREPANCY_RESOLVE' },
    { label: 'Proof Created', value: 'PROOF_PASS_CREATED' },
    { label: 'Proof Viewed by Verifier', value: 'PROOF_PASS_VIEWED' },
    { label: 'Proof Revoked', value: 'PROOF_PASS_REVOKED' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Institutional Compliance</span>
            <span>•</span>
            <span className="font-mono">Chronological Local Demo Log</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-serif">
            Institutional Audit Log & Access Trail
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Complete local tamper-evident audit log recording every record access, unmask attempt, staff resolution, Proof Pass creation, and verifier touchpoint.
          </p>
        </div>

        <button
          onClick={exportAuditJson}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <span className="text-slate-500 block text-[11px] font-medium uppercase tracking-wider">
            Total Logged Events
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {auditEvents.length}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <span className="text-emerald-700 block text-[11px] font-medium uppercase tracking-wider">
            Compliant Actions
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {auditEvents.filter((e) => e.status === 'COMPLIANT').length}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <span className="text-amber-800 block text-[11px] font-medium uppercase tracking-wider">
            Audited Unmasks & Conflicts
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {auditEvents.filter((e) => e.action === 'UNMASK_ATTEMPT' || e.action === 'DISCREPANCY_RESOLVE').length}
          </span>
        </div>
        <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-subtle">
          <span className="text-cobalt-700 block text-[11px] font-medium uppercase tracking-wider">
            Proof Pass Touchpoints
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {auditEvents.filter((e) => e.action.startsWith('PROOF_PASS')).length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, student, details, IP..."
            className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cobalt-500 focus:border-cobalt-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cobalt-500 shadow-xs"
          >
            {actionTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-cobalt-500 shadow-xs"
          >
            <option value="ALL">All Dispositions</option>
            <option value="COMPLIANT">Compliant Only</option>
            <option value="FLAGGED">Flagged / Audited</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor Persona</th>
                <th className="py-2.5 px-3">Subject / Pass</th>
                <th className="py-2.5 px-3">Details & Justification</th>
                <th className="py-2.5 px-3">Network Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap text-slate-500">
                    {formatDate(evt.timestamp)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.2 rounded text-[11px] font-mono font-medium ${
                        evt.action === 'UNMASK_ATTEMPT'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : evt.action === 'DISCREPANCY_RESOLVE'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : evt.action === 'PROOF_PASS_REVOKED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : evt.action === 'PROOF_PASS_CREATED'
                          ? 'bg-cobalt-50 text-cobalt-800 border border-cobalt-200'
                          : evt.action === 'PROOF_PASS_VIEWED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {evt.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {evt.actor}
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium whitespace-nowrap">
                    {evt.studentName || evt.passId || 'System'}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-xs max-w-md leading-relaxed">
                    {evt.details}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {evt.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
