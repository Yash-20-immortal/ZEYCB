'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  QrCode,
  Clock,
  Ban,
  Copy,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate, formatTimeAgo, formatExpiry } from '@/lib/utils';
import { ProofPass } from '@/lib/types';

export default function PassesManagementPage() {
  const { proofPasses, revokeProofPass, activeRole } = useStore();
  const [filter, setFilter] = useState<'all' | 'valid' | 'revoked'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isRegistrar = activeRole === 'Registrar Office (Staff #RO-402)';

  // Revoke modal state
  const [revokingPass, setRevokingPass] = useState<ProofPass | null>(null);
  const [revokeReason, setRevokeReason] = useState('Recruitment verification completed. Access window closed.');

  const filteredPasses = proofPasses.filter((pass) => {
    const matchesSearch =
      pass.studentName.toLowerCase().includes(search.toLowerCase()) ||
      pass.passToken.toLowerCase().includes(search.toLowerCase()) ||
      pass.purpose.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'valid') return !pass.isRevoked && new Date(pass.expiresAt) > new Date();
    if (filter === 'revoked') return pass.isRevoked;
    return true;
  });

  const handleCopy = (token: string, id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/verify/${token}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleConfirmRevoke = () => {
    if (!revokingPass) return;
    revokeProofPass(revokingPass.id, revokeReason);
    setRevokingPass(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-700">Institutional Credential Proofs</span>
            <span>•</span>
            <span>Selective Disclosure & Privacy Minimization</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 font-serif">
            Proof Pass Tokens & Verifier Links
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage expiring, revocable verification proofs issued to external employers and academic evaluators (Simulated).
          </p>
        </div>

        {isRegistrar && (
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            + Issue Pass from Roster
          </Link>
        )}
      </div>

      {/* Read-Only Notice for non-Registrar */}
      {!isRegistrar && (
        <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            <strong>Read-Only Token Inspection:</strong> Credential Proof Pass issuance and revocation are restricted to Registrar Office authority.
          </span>
          <span className="font-medium text-slate-500 text-[11px] shrink-0">
            Acting Persona: {activeRole}
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, pass token, or purpose..."
            className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cobalt-500 focus:border-cobalt-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md text-xs shrink-0 self-start">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Passes ({proofPasses.length})
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'valid'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active & Valid
          </button>
          <button
            onClick={() => setFilter('revoked')}
            className={`px-3 py-1 rounded transition-colors ${
              filter === 'revoked'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Revoked ({proofPasses.filter((p) => p.isRevoked).length})
          </button>
        </div>
      </div>

      {/* Proof Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPasses.map((pass) => {
          const expiryInfo = formatExpiry(pass.expiresAt);
          const isInvalid = pass.isRevoked || expiryInfo.isExpired;

          return (
            <div
              key={pass.id}
              className={`p-5 rounded-lg border transition-all ${
                pass.isRevoked
                  ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                  : 'bg-white border-slate-200 shadow-subtle hover:border-slate-300'
              }`}
            >
              {/* Pass Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {pass.passToken}
                    </span>
                    {pass.isRevoked ? (
                      <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">
                        REVOKED
                      </span>
                    ) : expiryInfo.isExpired ? (
                      <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                        EXPIRED
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{pass.studentName}</h3>
                  <p className="text-xs text-slate-500 truncate max-w-sm">{pass.program}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Validity</span>
                  <span
                    className={`text-xs font-medium ${
                      pass.isRevoked
                        ? 'text-rose-700'
                        : expiryInfo.isExpired
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {pass.isRevoked ? 'Revoked by Staff' : expiryInfo.text}
                  </span>
                </div>
              </div>

              {/* Pass Details */}
              <div className="py-3 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Recipient:</span>
                  <span className="text-slate-800 font-medium truncate max-w-[220px]">
                    {pass.verifierRecipientName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Scope:</span>
                  <span className="text-slate-700 truncate max-w-[220px]">{pass.purpose}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Disclosed:</span>
                  <span className="text-slate-900 font-medium">
                    {Object.keys(pass.fieldValues).length} attributes verified
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Withheld (Privacy):</span>
                  <span className="text-slate-500">
                    🔒 {pass.withheldFields.length} attributes protected
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Access Views:</span>
                  <span className="font-mono text-slate-700">
                    {pass.accessLog.length} view events logged
                  </span>
                </div>

                {pass.isRevoked && (
                  <div className="mt-2 p-2.5 rounded-md bg-rose-50 border border-rose-100 text-[11px] text-rose-900">
                    <p className="font-medium">Revocation Note:</p>
                    <p>
                      Revoked on {formatDate(pass.revokedAt || '')} by {pass.revokedBy}.
                    </p>
                    <p className="italic mt-0.5">&quot;{pass.revocationReason}&quot;</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(pass.passToken, pass.id)}
                    className="p-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    title="Copy Public Verifier Link"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">
                      {copiedId === pass.id ? 'Copied!' : 'Copy Link'}
                    </span>
                  </button>

                  <Link
                    href={`/verify/${pass.passToken}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Verifier Portal</span>
                  </Link>
                </div>

                {!pass.isRevoked && isRegistrar && (
                  <button
                    onClick={() => setRevokingPass(pass)}
                    className="px-2.5 py-1.5 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Revoke Pass</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Revocation Modal */}
      {revokingPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 max-w-md w-full rounded-xl shadow-dropdown p-6 relative">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">Revoke Proof Pass</h3>
                <p className="text-xs text-rose-600">Immediate Invalidation</p>
              </div>
            </div>

            <div className="mt-3.5 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                You are revoking Proof Pass <strong className="text-slate-900 font-mono">{revokingPass.passToken}</strong> for <strong className="text-slate-900">{revokingPass.studentName}</strong>.
              </p>
              <p className="text-slate-500">
                External verifier links will immediately return a REVOKED status with your timestamp and reason.
              </p>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Reason for Revocation (Mandatory)
                </label>
                <textarea
                  rows={2}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md p-2 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  placeholder="Enter reason for revocation..."
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRevokingPass(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-3.5 py-1.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors shadow-xs"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
