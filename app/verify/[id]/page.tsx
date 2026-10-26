'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  EyeOff,
  CheckCircle2,
  Copy,
  Lock,
  Building,
  Ban,
  Fingerprint,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatDate, formatExpiry, generateQrCodeDataUrl } from '@/lib/utils';

export default function VerifierPage() {
  const params = useParams();
  const token = (params?.id as string) || '';
  const { getProofPassByToken, logPassAccess, revokeProofPass, activeRole } = useStore();

  const isExternalVerifier = activeRole === 'External Verifier';

  const [pass, setPass] = useState(() => getProofPassByToken(token));
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [hasLogged, setHasLogged] = useState(false);

  // Sync pass on token change or store updates
  useEffect(() => {
    const found = getProofPassByToken(token);
    setPass(found);
    if (found && !hasLogged) {
      logPassAccess(found.id);
      setHasLogged(true);
    }
  }, [token, getProofPassByToken, logPassAccess, hasLogged]);

  // Generate QR
  useEffect(() => {
    if (typeof window !== 'undefined' && pass) {
      generateQrCodeDataUrl(window.location.href).then(setQrCodeUrl);
    }
  }, [pass]);

  if (!pass) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-lg bg-white border border-slate-200 text-center space-y-4 shadow-subtle">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">Invalid Verification Token</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            No active Proof Pass was found with token <code className="text-rose-700 font-mono">{token}</code>. The token may have expired or been revoked.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              Return to Institution Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const expiryInfo = formatExpiry(pass.expiresAt);
  const isRevoked = pass.isRevoked;
  const isExpired = expiryInfo.isExpired;

  const copyDigest = () => {
    navigator.clipboard.writeText(pass.simulatedSignature.digest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Verifier Scope Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-cobalt-300" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 text-sm tracking-tight block">
                Zeycb External Verification Portal
              </span>
              <p className="text-xs text-slate-500">
                Third-Party Credential Inspection Gateway (Simulated Prototype)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Prototype Scope
            </span>
            {!isExternalVerifier && (
              <Link
                href="/dashboard"
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Institute Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Status Callout Banner */}
        {isRevoked ? (
          <div className="p-5 rounded-lg bg-rose-50 border border-rose-200 shadow-xs space-y-2 animate-fade-in">
            <div className="flex items-start gap-3">
              <Ban className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-rose-950">
                    THIS PROOF PASS HAS BEEN REVOKED
                  </h2>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-200 text-rose-900 uppercase">
                    Invalidated
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  The issuing institution has formally revoked this credential proof. This verification token is no longer valid.
                </p>
                <div className="mt-2 text-xs text-rose-900/90 bg-white/80 p-2.5 rounded border border-rose-200/80 space-y-0.5">
                  <p>
                    <strong>Revocation Executed:</strong> {formatDate(pass.revokedAt || '')} by <strong>{pass.revokedBy}</strong>
                  </p>
                  <p>
                    <strong>Stated Reason:</strong> &quot;{pass.revocationReason}&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isExpired ? (
          <div className="p-5 rounded-lg bg-amber-50 border border-amber-200 shadow-xs flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-amber-950">THIS PROOF PASS HAS EXPIRED</h2>
              <p className="text-xs text-amber-800/90 mt-0.5">
                The time-limited authorization window for this verification proof closed on {formatDate(pass.expiresAt)}.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-emerald-950">
                    SIMULATED PROOF RECORDED & VALID
                  </h2>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    RECORD VERIFIED
                  </span>
                </div>
                <p className="text-xs text-emerald-800/90 mt-0.5">
                  Verified against {pass.institutionName} institutional registry.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-white/80 px-2.5 py-1 rounded border border-emerald-200">
              <Clock className="w-3.5 h-3.5" />
              <span>{expiryInfo.text}</span>
            </div>
          </div>
        )}

        {/* Certificate Card */}
        <div className="rounded-lg bg-white border border-slate-200 shadow-subtle overflow-hidden">
          {/* Card Institutional Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Building className="w-3.5 h-3.5" />
                <span>{pass.institutionName}</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 font-serif mt-1">
                Student Credential Verification Proof
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                AICTE Permanent ID: <span className="font-mono text-slate-700">{pass.aicteApprovalId}</span> (Fictional Scope)
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] text-slate-400 block font-medium">Token</span>
              <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block mt-0.5">
                {pass.passToken}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Candidate Summary Box */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Verified Subject
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-serif">{pass.studentName}</h3>
                <p className="text-xs text-slate-600">{pass.program}</p>
                <p className="text-xs text-slate-500">
                  Department: <strong className="text-slate-700">{pass.department}</strong> • APAAR:{' '}
                  <span className="font-mono text-slate-900 font-semibold">{pass.maskedApaarId}</span>
                </p>
              </div>

              {qrCodeUrl && (
                <div className="flex flex-col items-center gap-1 shrink-0 self-center">
                  <div className="p-1.5 bg-white rounded border border-slate-200">
                    <img
                      src={qrCodeUrl}
                      alt="Verification QR"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Scan to Verify</span>
                </div>
              )}
            </div>

            {/* Scope Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                  Authorized Verifier
                </span>
                <p className="text-slate-900 font-semibold">{pass.verifierRecipientName}</p>
              </div>
              <div className="p-3 rounded-md bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">
                  Verification Scope
                </span>
                <p className="text-slate-700">{pass.purpose}</p>
              </div>
            </div>

            {/* Verified Disclosed Fields */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Verified Disclosed Credentials ({Object.keys(pass.fieldValues).length} Attributes)
                </h4>
                <span className="text-[11px] text-slate-500">
                  Institutional Stamp Attached
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(pass.fieldValues).map(([key, item]) => (
                  <div
                    key={key}
                    className="p-3 rounded-md bg-slate-50/80 border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
                      <span>{item.label}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Provenance: {item.provenance}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explicit Withheld Attributes Section */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  <span>Withheld Personal Attributes (Privacy Minimization Policy)</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {pass.withheldFields.length} Attributes Protected
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Under the AICTE-compliant Zeycb data minimization standard, institutional staff has explicitly withheld these sensitive attributes from external release to prevent identity theft and discrimination:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {pass.withheldFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-white border border-slate-200 text-slate-600 flex items-center gap-2"
                  >
                    <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="text-[11px] truncate">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulated Proof Digest Block */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Fingerprint className="w-4 h-4 text-slate-500" />
                  <span>Simulated Credential Digest & Verification Stamp</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {pass.simulatedSignature.algorithm}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span>SHA-256 Demo Digest:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 break-all text-[11px]">
                      {pass.simulatedSignature.digest}
                    </span>
                    <button
                      onClick={copyDigest}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      title="Copy SHA-256 Demo Digest"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>Simulated Key ID (Demo Reference):</span>
                  <span className="font-mono text-slate-700">
                    {pass.simulatedSignature.publicKeyId}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>Simulated Certificate ID (Demo Only):</span>
                  <span className="font-mono text-slate-700">
                    {pass.simulatedSignature.certificateSerial}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span>Timestamp:</span>
                  <span className="text-slate-700">{formatDate(pass.issuedAt)}</span>
                </div>
              </div>
            </div>

            {/* Interactive Demo Test Trigger (Staff Simulator only, hidden for External Verifier) */}
            {!isExternalVerifier && (
              <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Judge Demo Test: Interactive Revocation
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Simulate an institutional officer revoking this pass to verify instant invalidation.
                  </span>
                </div>

                {!isRevoked ? (
                  <button
                    type="button"
                    onClick={() => {
                      revokeProofPass(
                        pass.id,
                        'Evaluated during SIH demonstration test. Authorized immediate closure.'
                      );
                      setPass((prev) =>
                        prev
                          ? {
                              ...prev,
                              isRevoked: true,
                              revokedAt: new Date().toISOString(),
                              revokedBy: 'Dr. Anirudh Sen (Deputy Registrar)',
                              revocationReason:
                                'Evaluated during SIH demonstration test. Authorized immediate closure.',
                            }
                          : undefined
                      );
                    }}
                    className="px-3 py-1.5 rounded-md bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-medium text-xs shrink-0 transition-colors shadow-xs"
                  >
                    Simulate Instant Revocation
                  </button>
                ) : (
                  <span className="text-rose-700 font-semibold shrink-0">
                    ✓ Pass is already revoked
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
