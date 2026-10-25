'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Shield,
  FileCheck2,
  GitCompare,
  History,
  QrCode,
  UserCheck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Building2,
  X,
} from 'lucide-react';
import { useStore, UserRole } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { institution, students, activeRole, setActiveRole, resetDemoData } = useStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Direct navigation guard for External Verifier
  useEffect(() => {
    if (activeRole === 'External Verifier' && !pathname.startsWith('/verify')) {
      router.push('/verify/proof-nitas-9a4f2e');
    }
  }, [activeRole, pathname, router]);

  // Check unresolved mismatches
  const unresolvedCount = students.filter(
    (s) => s.seededMismatch && !s.seededMismatch.resolved
  ).length;

  const roles: UserRole[] = [
    'Registrar Office (Staff #RO-402)',
    'Department Academic Head',
    'Auditor / Compliance Inspector',
    'External Verifier',
  ];

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setShowRoleMenu(false);
    if (role === 'Registrar Office (Staff #RO-402)') {
      router.push('/');
    } else if (role === 'Department Academic Head') {
      router.push('/');
    } else if (role === 'Auditor / Compliance Inspector') {
      router.push('/audit');
    } else if (role === 'External Verifier') {
      router.push('/verify/proof-nitas-9a4f2e');
    }
  };

  const navLinks = [
    { href: '/', label: 'Overview', icon: Building2 },
    {
      href: '/workbench',
      label: 'Mismatch Workbench',
      icon: GitCompare,
      badge: unresolvedCount > 0 ? unresolvedCount : undefined,
    },
    { href: '/students/stu-001', label: 'Student Records', icon: FileCheck2 },
    { href: '/passes', label: 'Proof Passes', icon: QrCode },
    { href: '/audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo and Institution Context */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
                  <Shield className="w-4 h-4 text-cobalt-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-slate-900">
                      Zeycb
                    </span>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      SIH26263
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    NITAS • Permanent ID: {institution.aictePermanentId} (Fictional Scope)
                  </p>
                </div>
              </Link>

              {/* Navigation Links (Desktop) */}
              {activeRole === 'External Verifier' ? (
                <div className="hidden lg:flex items-center pl-4 border-l border-slate-200">
                  <span className="text-xs font-medium text-slate-500">
                    External Verifier Portal • Restricted Proof View
                  </span>
                </div>
              ) : (
                <nav className="hidden lg:flex items-center gap-1 pl-4 border-l border-slate-200">
                  {navLinks.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-slate-900 bg-slate-100'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Right Controls: Role Switcher & Tour */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTour(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200/80 transition-colors border border-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-cobalt-600" />
                <span>Demo Walkthrough</span>
              </button>

              {/* Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 transition-colors shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden md:inline truncate max-w-[150px]">
                    {activeRole.split('(')[0].trim()}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 rounded-lg bg-white border border-slate-200 shadow-dropdown py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Acting Persona Role
                    </div>
                    {roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          activeRole === role
                            ? 'text-cobalt-700 font-semibold bg-cobalt-50/50'
                            : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-medium">{role}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {role.includes('Registrar')
                              ? 'Full review, reconciliation, and Proof Pass issue'
                              : role.includes('Head')
                              ? 'Departmental review & readiness metrics'
                              : role.includes('Auditor')
                              ? 'Read-only compliance & access logs'
                              : 'Restricted external verifier proof view'}
                          </p>
                        </div>
                        {activeRole === role && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cobalt-600 shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-100 pt-1 mt-1 px-3 py-1">
                      <button
                        onClick={() => {
                          resetDemoData();
                          setShowRoleMenu(false);
                          router.push('/');
                        }}
                        className="w-full text-left text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 py-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Seeded Demo Data
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile subnavigation */}
          {activeRole !== 'External Verifier' && (
            <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
              {navLinks.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Demo Tour Modal for Judges */}
      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 max-w-xl w-full rounded-xl p-6 shadow-dropdown relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-cobalt-50 text-cobalt-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    SIH26263 Evaluation Flow
                  </h3>
                  <p className="text-xs text-slate-500">
                    2-minute institutional walkthrough
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTour(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  1. Dashboard Overview
                </span>
                Observe the composite Record Readiness Index (68% for Priya Sharma due to 1 flagged mismatch). Notice that all national identifiers are masked by default.
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                <span className="font-semibold text-amber-900 block mb-0.5">
                  2. Mismatch Workbench
                </span>
                Open <strong>Mismatch Workbench</strong>. Inspect the side-by-side comparison between Admission ERP and simulated ABC feed. Staff reviews physical Class X file evidence and attributes an authoritative resolution.
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  3. Issue Proof Pass
                </span>
                Open Priya Sharma or Rohan Verma. Click <strong>Issue Proof Pass</strong>. Select academic fields to verify (Degree & Credits), strictly withholding Date of Birth and National ID.
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  4. Verifier View & Revocation
                </span>
                In the external verifier portal, inspect the verified attributes and the explicit Withheld Fields list. Click <strong>Simulate Instant Revocation</strong> to see immediate invalidation.
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  5. Institutional Audit Log
                </span>
                Review the chronologically ordered local audit trail recording each access, unmask attempt, edit justification, and verification touchpoint.
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowTour(false)}
                className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
