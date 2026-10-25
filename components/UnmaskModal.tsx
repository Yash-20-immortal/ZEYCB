'use client';

import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useStore } from '@/lib/store';

interface UnmaskModalProps {
  isOpen: boolean;
  studentName: string;
  studentId: string;
  fieldToUnmask: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnmaskModal({
  isOpen,
  studentName,
  studentId,
  fieldToUnmask,
  onConfirm,
  onCancel,
}: UnmaskModalProps) {
  const { logAuditEvent, activeRole } = useStore();
  const [reason, setReason] = useState('Manual Physical Ledger Verification (Class X Scrutiny)');
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!acknowledged) return;

    logAuditEvent({
      action: 'UNMASK_ATTEMPT',
      studentId,
      studentName,
      details: `AUDIT NOTICE: Identifier unmasked for field '${fieldToUnmask}'. Justification: "${reason}". Access authorized under role ${activeRole}.`,
      status: 'FLAGGED',
    });

    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 max-w-md w-full rounded-xl shadow-dropdown p-6 relative text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Unmask Protected Identifier</h3>
              <p className="text-[11px] text-slate-500">Compliance & Access Audit Required</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 space-y-3 text-slate-600">
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 leading-relaxed">
            <p className="text-slate-900 font-medium mb-0.5">Privacy Boundary Notice</p>
            <p className="text-slate-500 text-[11px]">
              You are requesting to view the raw synthetic value of{' '}
              <strong className="text-slate-800">{fieldToUnmask}</strong> for{' '}
              <strong className="text-slate-800">{studentName}</strong>. By institutional policy, identifiers are masked by default.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Statutory Business Reason (Mandatory)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-cobalt-500"
            >
              <option value="Manual Physical Ledger Verification">
                Manual Physical Ledger Verification (Class X Scrutiny)
              </option>
              <option value="AICTE Northern Regional Compliance Inspection">
                AICTE Northern Regional Compliance Inspection
              </option>
              <option value="JoSAA State Admission Quota Reconciliation">
                JoSAA State Admission Quota Reconciliation
              </option>
              <option value="Judicial / Formal RTI Registry Inquiry">
                Judicial / Formal RTI Registry Inquiry
              </option>
            </select>
          </div>

          <label className="flex items-start gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded text-slate-900 focus:ring-0 border-slate-300"
            />
            <span className="text-[11px] text-slate-600 leading-snug">
              I understand that my staff persona ({activeRole}) and simulated IP address will be recorded in the local institutional audit log for this unmask event.
            </span>
          </label>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel (Keep Masked)
          </button>
          <button
            type="button"
            disabled={!acknowledged}
            onClick={handleProceed}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-xs ${
              acknowledged
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Confirm & Log Unmask
          </button>
        </div>
      </div>
    </div>
  );
}
