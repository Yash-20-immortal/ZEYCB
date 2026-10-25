'use client';

import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { StudentRecord, ProofPass } from '@/lib/types';
import { generateQrCodeDataUrl } from '@/lib/utils';
import Link from 'next/link';

interface ProofPassModalProps {
  student: StudentRecord;
  isOpen: boolean;
  onClose: () => void;
}

export function ProofPassModal({ student, isOpen, onClose }: ProofPassModalProps) {
  const { createProofPass } = useStore();

  const [purpose, setPurpose] = useState('Campus Recruitment / Credential Authenticity Proof');
  const [recipient, setRecipient] = useState('Authorized Recruiter / Evaluation Body');
  const [validityHours, setValidityHours] = useState(24);
  const [copied, setCopied] = useState(false);
  const [createdPass, setCreatedPass] = useState<ProofPass | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Field selection state
  const [fields, setFields] = useState({
    fullName: true,
    program: true,
    department: true,
    currentSemester: true,
    enrollmentStatus: true,
    cgpa: true,
    creditsCompleted: true,
    degreeEligibility: true,
    institutionalAccreditation: true,
  });

  if (!isOpen) return null;

  const toggleField = (key: keyof typeof fields) => {
    if (key === 'fullName') return; // Name is required
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async () => {
    const pass = createProofPass({
      studentId: student.id,
      purpose,
      verifierRecipientName: recipient,
      validityHours,
      selectedFields: fields,
    });

    setCreatedPass(pass);

    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/verify/${pass.passToken}`;
      const qr = await generateQrCodeDataUrl(url);
      setQrCodeDataUrl(qr);
    }
  };

  const copyLink = () => {
    if (!createdPass) return;
    const url = `${window.location.origin}/verify/${createdPass.passToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 max-w-xl w-full rounded-xl shadow-dropdown p-6 relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">Issue Proof Pass</h3>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Data Minimization
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate an expiring, revocable verification link & QR code for {student.fullName.value}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!createdPass ? (
          /* Configuration Phase */
          <div className="mt-4 space-y-4 text-xs">
            {/* Student Context Bar */}
            <div className="p-3 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{student.fullName.value}</p>
                <p className="text-slate-500 text-[11px]">
                  Roll: {student.rollNumber} • APAAR: {student.maskedApaarId}
                </p>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Readiness: {student.readinessScore}% Verified
              </span>
            </div>

            {/* Recipient & Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Recipient Entity
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Acme Labs Hiring Team"
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cobalt-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Verification Scope
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Campus Placement Credential Check"
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cobalt-500 text-xs"
                />
              </div>
            </div>

            {/* Expiry Selector */}
            <div>
              <label className="block text-slate-700 font-medium mb-1.5">
                Access Validity Window (Time-Limited)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { hours: 1, label: '1 Hour', note: 'Single Interview' },
                  { hours: 24, label: '24 Hours', note: 'Standard Review' },
                  { hours: 168, label: '7 Days', note: 'Recruitment Drive' },
                  { hours: 720, label: '30 Days', note: 'Clearance' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setValidityHours(item.hours)}
                    className={`p-2 rounded-md border text-left transition-colors ${
                      validityHours === item.hours
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        validityHours === item.hours ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {item.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selective Disclosure Matrix */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Select Academic Fields to Disclose
                </label>
                <span className="text-[11px] text-slate-500">
                  {Object.values(fields).filter(Boolean).length} attributes selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'fullName', label: 'Full Legal Name', value: student.fullName.value, lock: true },
                  { key: 'program', label: 'Degree & Program', value: student.program.value },
                  { key: 'currentSemester', label: 'Current Term', value: `Semester ${student.currentSemester.value}` },
                  { key: 'enrollmentStatus', label: 'Enrollment Standing', value: 'Active / Good Standing' },
                  { key: 'cgpa', label: 'Cumulative GPA', value: student.cgpa.value },
                  { key: 'creditsCompleted', label: 'Earned Credits', value: `${student.totalCreditsCompleted.value} / ${student.totalCreditsRequired}` },
                  { key: 'degreeEligibility', label: 'Degree Standing', value: 'On-track' },
                  { key: 'institutionalAccreditation', label: 'Accreditation Reference', value: 'NITAS A++ Scope' },
                ].map((item) => {
                  const isChecked = fields[item.key as keyof typeof fields];
                  return (
                    <div
                      key={item.key}
                      onClick={() => !item.lock && toggleField(item.key as keyof typeof fields)}
                      className={`p-2 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-slate-50 border-slate-300 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded text-slate-900 focus:ring-0 border-slate-300"
                        />
                        <div className="truncate">
                          <p className="font-medium text-xs truncate">{item.label}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.value}</p>
                        </div>
                      </div>
                      {item.lock && <Lock className="w-3 h-3 text-slate-400 shrink-0 ml-1" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explicit Withheld Attributes Box */}
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold mb-1">
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Protected Under Data Minimization Policy</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                The verifier will be explicitly notified that these attributes are withheld to protect candidate privacy:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Date of Birth',
                  'Full APAAR ID',
                  'Aadhaar Reference',
                  'Residential Address',
                  'Parental Details',
                  'Phone & Email',
                  'Social Quota / Category',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-white text-slate-600 border border-slate-200"
                  >
                    🔒 {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
              >
                <span>Issue Simulated Proof Pass</span>
              </button>
            </div>
          </div>
        ) : (
          /* Issuance Success Phase */
          <div className="mt-4 space-y-4 animate-fade-in text-xs">
            <div className="text-center p-3.5 rounded-md bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
              <h4 className="text-sm font-semibold text-emerald-950">
                Proof Pass Successfully Issued
              </h4>
              <p className="text-xs text-emerald-800/90 mt-0.5">
                Authorized under Deputy Registrar Staff #RO-402 with simulated SHA-256 demo digest
              </p>
            </div>

            {/* QR and Details Card */}
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
              {qrCodeDataUrl ? (
                <div className="p-1.5 bg-white rounded border border-slate-200 shrink-0">
                  <img
                    src={qrCodeDataUrl}
                    alt="Proof Pass QR"
                    className="w-28 h-28 object-contain"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <QrCode className="w-8 h-8 text-slate-400" />
                </div>
              )}

              <div className="space-y-1.5 w-full">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                    Pass Token
                  </span>
                  <p className="font-mono text-xs text-slate-900 font-semibold break-all">
                    {createdPass.passToken}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400">Recipient:</span>{' '}
                    <span className="font-medium text-slate-800 truncate block">
                      {createdPass.verifierRecipientName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Validity:</span>{' '}
                    <span className="font-medium text-slate-800 block">
                      Expires in {validityHours}h
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">
                    SHA-256 Demo Digest
                  </span>
                  <p className="font-mono text-[10px] text-slate-500 break-all bg-white p-1 rounded border border-slate-200">
                    {createdPass.simulatedSignature.digest}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={copyLink}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Verifier Public Link'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/verify/${createdPass.passToken}`}
                  target="_blank"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Verifier View</span>
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-3 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  Close & Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
