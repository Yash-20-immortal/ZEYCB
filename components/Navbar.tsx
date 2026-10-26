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
  GraduationCap,
  X,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useStore, UserRole } from '@/lib/store';
import { ZeycbLogo } from '@/components/ZeycbLogo';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { institution, students, activeRole, setActiveRole, resetDemoData } = useStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const isPublicPage = pathname === '/' || pathname === '/login';

  // Direct navigation guard for External Verifier
  useEffect(() => {
    if (activeRole === 'External Verifier' && !pathname.startsWith('/verify') && !isPublicPage) {
      router.push('/verify/proof-nitas-9a4f2e');
    }
  }, [activeRole, pathname, router, isPublicPage]);

  // Check unresolved mismatches
  const unresolvedCount = students.filter(
    (s) => s.seededMismatch && !s.seededMismatch.resolved
  ).length;

  const roles: UserRole[] = [
    'Student (Credential Holder)',
    'Registrar Office (Staff #RO-402)',
    'Department Academic Head',
    'Auditor / Compliance Inspector',
    'External Verifier',
  ];

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setShowRoleMenu(false);
    if (role === 'Student (Credential Holder)') {
      router.push('/students/stu-001');
    } else if (role === 'Registrar Office (Staff #RO-402)') {
      router.push('/dashboard');
    } else if (role === 'Department Academic Head') {
      router.push('/dashboard');
    } else if (role === 'Auditor / Compliance Inspector') {
      router.push('/audit');
    } else if (role === 'External Verifier') {
      router.push('/verify/proof-nitas-9a4f2e');
    }
  };

  // Public Landing Navigation Links
  const publicNavLinks = [
    { href: '/', label: 'Overview' },
    { href: '/trust-trace', label: 'Trust Trace' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#audiences', label: 'Audiences' },
  ];

  // Workspace Navigation Links
  const workspaceNavLinks = [
    { href: '/dashboard', label: 'Registry', icon: Building2 },
    { href: '/trust-trace', label: 'Trust Trace', icon: GitCompare },
    {
      href: '/workbench',
      label: 'Workbench',
      icon: GitCompare,
      badge: unresolvedCount > 0 ? unresolvedCount : undefined,
    },
    { href: '/students/stu-001', label: 'Records', icon: FileCheck2 },
    { href: '/passes', label: 'Proof Passes', icon: QrCode },
    { href: '/audit', label: 'Audit', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo and Institution Context */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <ZeycbLogo size="sm" showWordmark={true} showSubtitle={false} />
              </Link>

              {/* Navigation Links (Desktop) */}
              {isPublicPage ? (
                <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-slate-200">
                  {publicNavLinks.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          isActive
                            ? 'text-slate-900 bg-slate-100 font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              ) : activeRole === 'External Verifier' ? (
                <div className="hidden lg:flex items-center pl-4 border-l border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                    External Verifier Portal • Restricted Proof View
                  </span>
                </div>
              ) : (
                <nav className="hidden xl:flex items-center gap-1 pl-4 border-l border-slate-200">
                  {workspaceNavLinks.map((item) => {
                    const isActive =
                      item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                          isActive
                            ? 'text-slate-900 bg-slate-100 font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* If on Public Landing or Login: Primary CTA is "Sign in" to /login */}
              {isPublicPage ? (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowTour(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cobalt-600" />
                    <span>Walkthrough</span>
                  </button>

                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in</span>
                  </Link>
                </div>
              ) : (
                /* Inside Demo Workspace: Role Switcher & Exit to Home */
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/"
                    className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded transition-colors"
                    title="Exit to Public Landing"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit Demo</span>
                  </Link>

                  <button
                    onClick={() => setShowTour(true)}
                    className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cobalt-600" />
                    <span>Walkthrough</span>
                  </button>

                  {/* Role Switcher (Workspace Only) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRoleMenu(!showRoleMenu)}
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors shadow-xs"
                      aria-expanded={showRoleMenu}
                      aria-label="Switch active persona role"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-cobalt-600" />
                      <span className="hidden lg:inline truncate max-w-[130px]">
                        {activeRole.split('(')[0].trim()}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {showRoleMenu && (
                      <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-dropdown py-2 z-50 text-xs animate-fade-in">
                        <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Active Persona Role
                          </span>
                          <Link
                            href="/login"
                            onClick={() => setShowRoleMenu(false)}
                            className="text-[11px] font-semibold text-cobalt-600 hover:underline"
                          >
                            All Roles →
                          </Link>
                        </div>

                        <div className="divide-y divide-slate-50">
                          {roles.map((role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleSelect(role)}
                              className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between hover:bg-slate-50 transition-colors ${
                                activeRole === role
                                  ? 'text-cobalt-800 font-semibold bg-cobalt-50/50'
                                  : 'text-slate-700'
                              }`}
                            >
                              <div className="space-y-0.5 pr-2">
                                <p className="text-xs font-bold">{role}</p>
                                <p className="text-[11px] text-slate-500 leading-tight">
                                  {role.includes('Student')
                                    ? 'Priya Sharma • Inspect record & configure consent passes'
                                    : role.includes('Registrar')
                                    ? 'Dr. Sen • Reconcile conflicts & issue/revoke Proof Passes'
                                    : role.includes('Head')
                                    ? 'Prof. Verma • CSE cohort readiness review (No pass issue)'
                                    : role.includes('Auditor')
                                    ? 'Compliance inspector • Strictly read-only event replay'
                                    : 'TCS Gateway • Verify student pass with zero unneeded PII'}
                                </p>
                              </div>
                              {activeRole === role && (
                                <span className="w-2 h-2 rounded-full bg-cobalt-600 shrink-0 mt-1" />
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-slate-100 pt-2 mt-1 px-3.5">
                          <button
                            id="btn-reset-seeded-demo-data"
                            onClick={() => {
                              resetDemoData();
                              setShowRoleMenu(false);
                              router.push('/dashboard');
                            }}
                            className="w-full text-left text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 py-1 font-medium"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset Seeded Demo Data
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile subnavigation (Workspace Only) */}
          {!isPublicPage && activeRole !== 'External Verifier' && (
            <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
              {workspaceNavLinks.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
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
                  1. Public Landing & 3D Atlas
                </span>
                Start at <strong>Home (/)</strong> to inspect the dimensional Atlas record journey. Click on the tilted record tiles to see synthetic payload diffs and what gets withheld.
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                <span className="font-semibold text-amber-900 block mb-0.5">
                  2. Mismatch Workbench
                </span>
                Open <strong>Workbench (/workbench)</strong>. Inspect the side-by-side comparison between Admission ERP (2004) and ABC feed (2003). Staff verifies physical CBSE certificate #82190.
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  3. Trust Trace Flagship
                </span>
                Navigate to <strong>Trust Trace (/trust-trace)</strong>. Select any field (Name, DOB, Credits, APAAR) to see multi-source provenance, human resolution, and selective disclosure status.
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-0.5">
                  4. Verifier View & Revocation
                </span>
                Open <strong>Verifier Portal (/verify/proof-nitas-9a4f2e)</strong>. Observe that verified academic credentials are verified against the institutional record while sensitive national IDs and DOB are withheld.
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
