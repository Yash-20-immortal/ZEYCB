'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentRecord, ProofPass, AuditEvent, InstitutionProfile } from './types';
import { INSTITUTION, INITIAL_STUDENTS, INITIAL_PROOF_PASSES, INITIAL_AUDIT_EVENTS } from './mock-data';

export type UserRole =
  | 'Student (Credential Holder)'
  | 'Registrar Office (Staff #RO-402)'
  | 'Department Academic Head'
  | 'Auditor / Compliance Inspector'
  | 'External Verifier';

interface StoreContextType {
  institution: InstitutionProfile;
  students: StudentRecord[];
  proofPasses: ProofPass[];
  auditEvents: AuditEvent[];
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  getStudentById: (id: string) => StudentRecord | undefined;
  getProofPassById: (id: string) => ProofPass | undefined;
  getProofPassByToken: (token: string) => ProofPass | undefined;
  resolveMismatch: (
    studentId: string,
    acceptedSource: 'SIS' | 'ABC' | 'CUSTOM',
    chosenName: string,
    chosenDob: string,
    reasonNote: string,
    supportingEvidenceRef: string
  ) => void;
  createProofPass: (params: {
    studentId: string;
    purpose: string;
    verifierRecipientName: string;
    validityHours: number;
    selectedFields: {
      fullName: boolean;
      program: boolean;
      department: boolean;
      currentSemester: boolean;
      enrollmentStatus: boolean;
      cgpa: boolean;
      creditsCompleted: boolean;
      degreeEligibility: boolean;
      institutionalAccreditation: boolean;
    };
  }) => ProofPass;
  revokeProofPass: (passId: string, reason: string) => void;
  logAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'actor' | 'actorRole' | 'ipAddress'>) => void;
  logPassAccess: (passId: string) => void;
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = 'zeycb_prototype_state_v3';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [proofPasses, setProofPasses] = useState<ProofPass[]>(INITIAL_PROOF_PASSES);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);
  const [activeRole, setActiveRole] = useState<UserRole>('Registrar Office (Staff #RO-402)');
  const [isHydrated, setIsHydrated] = useState(false);

  // Immediate persistent role update
  const handleSetActiveRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      parsed.activeRole = newRole;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.warn('Could not immediately persist role to localStorage', e);
    }
  };

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.proofPasses) setProofPasses(parsed.proofPasses);
        if (parsed.auditEvents) setAuditEvents(parsed.auditEvents);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
      }
    } catch (e) {
      console.warn('Could not read state from localStorage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          students,
          proofPasses,
          auditEvents,
          activeRole,
        })
      );
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }, [students, proofPasses, auditEvents, activeRole, isHydrated]);

  const logAuditEvent = (eventData: Omit<AuditEvent, 'id' | 'timestamp' | 'actor' | 'actorRole' | 'ipAddress'>) => {
    let actorName: string = activeRole;
    if (activeRole === 'Student (Credential Holder)') {
      actorName = 'Priya Sharma (Student #2022-CSE-084)';
    } else if (activeRole.includes('Registrar')) {
      actorName = 'Dr. Anirudh Sen (Deputy Registrar, Staff #RO-402)';
    } else if (activeRole === 'Department Academic Head') {
      actorName = 'Prof. Rajesh Verma (Head, Computer Science & Engineering)';
    } else if (activeRole === 'Auditor / Compliance Inspector') {
      actorName = 'State Higher-Ed Compliance Audit Division';
    } else if (activeRole === 'External Verifier') {
      actorName = 'External Evaluation Gateway (Simulated Third-Party)';
    }

    const newEvent: AuditEvent = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: actorName,
      actorRole: activeRole,
      ipAddress: activeRole === 'External Verifier' ? '198.51.100.89 (Simulated External Gateway IP)' : activeRole === 'Student (Credential Holder)' ? '172.16.88.42 (Campus WiFi Client IP)' : '10.20.4.12 (Simulated Intranet IP)',
      ...eventData,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  const getStudentById = (id: string) => students.find((s) => s.id === id);
  const getProofPassById = (id: string) => proofPasses.find((p) => p.id === id);
  const getProofPassByToken = (token: string) => proofPasses.find((p) => p.passToken === token || p.id === token);

  const resolveMismatch = (
    studentId: string,
    acceptedSource: 'SIS' | 'ABC' | 'CUSTOM',
    chosenName: string,
    chosenDob: string,
    reasonNote: string,
    supportingEvidenceRef: string
  ) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const resolvedTime = new Date().toISOString();
        const staffActor =
          activeRole === 'Department Academic Head'
            ? 'Prof. Rajesh Verma (Head, Computer Science & Engineering)'
            : 'Dr. Anirudh Sen (Staff #RO-402, Deputy Registrar)';

        const updatedHistory = [
          {
            id: `hist-${Date.now()}`,
            timestamp: resolvedTime,
            field: 'Legal Identity & DOB Reconciliation',
            oldValue: `Discrepancy: ${student.seededMismatch?.localValue} vs ${student.seededMismatch?.incomingValue}`,
            newValue: `Authoritative: ${chosenName} (DOB: ${chosenDob}) [Source: ${acceptedSource}]`,
            author: staffActor,
            reason: `${reasonNote} | Verified Evidence: ${supportingEvidenceRef}`,
          },
          ...student.changeHistory,
        ];

        return {
          ...student,
          readinessScore: 98,
          status: 'verified',
          fullName: {
            ...student.fullName,
            value: chosenName,
            status: 'manual_verified',
            provenance: {
              ...student.fullName.provenance,
              sourceName: `Reconciled by ${staffActor} (${supportingEvidenceRef})`,
              confidence: 100,
              lastSynced: resolvedTime,
            },
          },
          dateOfBirth: {
            ...student.dateOfBirth,
            value: chosenDob,
            status: 'manual_verified',
            provenance: {
              ...student.dateOfBirth.provenance,
              sourceName: `Verified against Physical Ledger (${supportingEvidenceRef})`,
              confidence: 100,
              lastSynced: resolvedTime,
            },
          },
          seededMismatch: student.seededMismatch
            ? {
                ...student.seededMismatch,
                resolved: true,
                resolvedAt: resolvedTime,
                resolvedBy: staffActor,
                resolutionNote: `${reasonNote} (Evidence: ${supportingEvidenceRef})`,
              }
            : undefined,
          changeHistory: updatedHistory,
        };
      })
    );

    // Audit Event
    logAuditEvent({
      action: 'DISCREPANCY_RESOLVE',
      studentId,
      studentName: chosenName,
      details: `Authorized staff resolved identity mismatch using evidence '${supportingEvidenceRef}'. Set Authoritative Name: '${chosenName}', DOB: '${chosenDob}'. Justification: ${reasonNote}`,
      status: 'COMPLIANT',
    });
  };

  const createProofPass = (params: {
    studentId: string;
    purpose: string;
    verifierRecipientName: string;
    validityHours: number;
    selectedFields: {
      fullName: boolean;
      program: boolean;
      department: boolean;
      currentSemester: boolean;
      enrollmentStatus: boolean;
      cgpa: boolean;
      creditsCompleted: boolean;
      degreeEligibility: boolean;
      institutionalAccreditation: boolean;
    };
  }) => {
    const student = students.find((s) => s.id === params.studentId);
    if (!student) throw new Error('Student not found');

    const passId = `pass-${Date.now()}`;
    const token = `proof-${student.rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const expires = new Date(now.getTime() + params.validityHours * 60 * 60 * 1000);

    // Build field values based on selection
    const fieldValues: Record<string, { label: string; value: string; provenance: string }> = {};

    if (params.selectedFields.fullName) {
      fieldValues.fullName = {
        label: 'Candidate Full Name',
        value: student.fullName.value,
        provenance: student.fullName.provenance.sourceName,
      };
    }
    if (params.selectedFields.program) {
      fieldValues.program = {
        label: 'Degree Program',
        value: student.program.value,
        provenance: student.program.provenance.sourceName,
      };
    }
    if (params.selectedFields.department) {
      fieldValues.department = {
        label: 'Academic Department',
        value: student.department,
        provenance: 'NITAS Institutional Registry',
      };
    }
    if (params.selectedFields.currentSemester) {
      fieldValues.currentSemester = {
        label: 'Current Academic Term',
        value: `Semester ${student.currentSemester.value} (Regular Full-time)`,
        provenance: student.currentSemester.provenance.sourceName,
      };
    }
    if (params.selectedFields.enrollmentStatus) {
      fieldValues.enrollmentStatus = {
        label: 'Enrollment Standing',
        value: 'Active & Matriculated (Good Standing)',
        provenance: 'Dean Academic Affairs Registrar Seal',
      };
    }
    if (params.selectedFields.cgpa) {
      fieldValues.cgpa = {
        label: 'Cumulative Grade Point Average (CGPA)',
        value: student.cgpa.value,
        provenance: student.cgpa.provenance.sourceName,
      };
    }
    if (params.selectedFields.creditsCompleted) {
      fieldValues.creditsCompleted = {
        label: 'Verified Earned Credits',
        value: `${student.totalCreditsCompleted.value} / ${student.totalCreditsRequired} Credits Completed`,
        provenance: student.totalCreditsCompleted.provenance.sourceName,
      };
    }
    if (params.selectedFields.degreeEligibility) {
      fieldValues.degreeEligibility = {
        label: 'Degree Completion Status',
        value: student.degreeEligibility.value,
        provenance: student.degreeEligibility.provenance.sourceName,
      };
    }
    if (params.selectedFields.institutionalAccreditation) {
      fieldValues.institution = {
        label: 'Issuing Institution & Accreditation',
        value: `${INSTITUTION.name} | NAAC ${INSTITUTION.naacGrade} | AICTE ID: ${INSTITUTION.aictePermanentId}`,
        provenance: 'AICTE Northern Regional Approval Directory',
      };
    }

    // Simulated SHA-256 demo digest
    const simulatedDigest = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')}`;

    const newPass: ProofPass = {
      id: passId,
      passToken: token,
      studentId: student.id,
      studentName: student.fullName.value,
      maskedApaarId: student.maskedApaarId,
      program: student.program.value,
      department: student.department,
      institutionName: INSTITUTION.name,
      aicteApprovalId: INSTITUTION.aictePermanentId,
      purpose: params.purpose || 'Verification of Academic Standing & Credential Authenticity',
      verifierRecipientName: params.verifierRecipientName || 'Authorized External Verifier',
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      isRevoked: false,
      sharedFields: params.selectedFields,
      fieldValues,
      withheldFields: [
        'Synthetic National APAAR ID (Masked: ' + student.maskedApaarId + ')',
        'Date of Birth & Age (Data minimization principle)',
        'Synthetic Aadhaar Reference (Strictly Withheld; Placeholders Only)',
        'Personal Residential Address & Domicile (Fictional)',
        'Parent / Guardian Personal Contact Information',
        'Mobile Phone Number & Personal Email Address (Synthetic Placeholders)',
        'Caste / Category / Financial Assistance Classification',
      ],
      simulatedSignature: {
        algorithm: 'SIMULATED-SHA256-DEMO-DIGEST',
        digest: simulatedDigest,
        publicKeyId: 'PUBKEY-NITAS-SEAL-2025-ED01 (Simulated)',
        certificateSerial: `CERT-AICTE-NITAS-${Math.floor(100000 + Math.random() * 900000)} (Simulated)`,
        timestamp: now.toISOString(),
        issuer: `${INSTITUTION.name} Simulated Digest Service (Prototype; Not a Digital Signature)`,
      },
      accessLog: [],
    };

    setProofPasses((prev) => [newPass, ...prev]);

    // Update student status if not already proof_issued
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, status: 'proof_issued' as const } : s))
    );

    // Audit Event
    logAuditEvent({
      action: 'PROOF_PASS_CREATED',
      studentId: student.id,
      studentName: student.fullName.value,
      passId: newPass.id,
      details: `Generated Proof Pass (Token: ${token}) for '${params.verifierRecipientName || 'Verifier'}'. Expiry: ${params.validityHours}h. Shared ${Object.values(params.selectedFields).filter(Boolean).length} fields, Withheld 7 private fields.`,
      status: 'COMPLIANT',
    });

    return newPass;
  };

  const revokeProofPass = (passId: string, reason: string) => {
    const revokedTime = new Date().toISOString();
    const actorName = activeRole.includes('Registrar') ? 'Dr. Anirudh Sen (Deputy Registrar)' : activeRole;

    setProofPasses((prev) =>
      prev.map((pass) => {
        if (pass.id !== passId) return pass;
        return {
          ...pass,
          isRevoked: true,
          revokedAt: revokedTime,
          revokedBy: actorName,
          revocationReason: reason || 'Revoked by Institutional Registrar upon review.',
        };
      })
    );

    const pass = proofPasses.find((p) => p.id === passId);
    if (pass) {
      logAuditEvent({
        action: 'PROOF_PASS_REVOKED',
        studentId: pass.studentId,
        studentName: pass.studentName,
        passId: pass.id,
        details: `REVOCATION EXECUTED: Proof Pass ${pass.passToken} was terminated by ${actorName}. Stated Reason: "${reason}". Verifier links immediately invalidated.`,
        status: 'COMPLIANT',
      });
    }
  };

  const logPassAccess = (passId: string) => {
    const now = new Date().toISOString();
    setProofPasses((prev) =>
      prev.map((pass) => {
        if (pass.id !== passId && pass.passToken !== passId) return pass;
        const isCurrentlyRevoked = pass.isRevoked;
        const isCurrentlyExpired = new Date(pass.expiresAt) < new Date();
        const status: 'AUTHENTICATED' | 'REVOKED_VIEW' | 'EXPIRED_VIEW' = isCurrentlyRevoked
          ? 'REVOKED_VIEW'
          : isCurrentlyExpired
          ? 'EXPIRED_VIEW'
          : 'AUTHENTICATED';

        const accessEntry = {
          timestamp: now,
          ipSimulated: '198.51.100.114 (Simulated Verifier Portal IP)',
          userAgentSimulated: 'Mozilla/5.0 (Windows NT 10.0; x64) ZeycbVerifierClient/1.0',
          status,
        };

        return {
          ...pass,
          accessLog: [accessEntry, ...pass.accessLog],
        };
      })
    );

    const pass = proofPasses.find((p) => p.id === passId || p.passToken === passId);
    if (pass) {
      logAuditEvent({
        action: 'PROOF_PASS_VIEWED',
        studentId: pass.studentId,
        studentName: pass.studentName,
        passId: pass.id,
        details: `External Verifier inspected Proof Pass '${pass.passToken}'. State: ${
          pass.isRevoked ? 'REVOKED' : new Date(pass.expiresAt) < new Date() ? 'EXPIRED' : 'VALID'
        }. Withheld attributes remained strictly protected.`,
        status: pass.isRevoked ? 'FLAGGED' : 'COMPLIANT',
      });
    }
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudents(INITIAL_STUDENTS);
    setProofPasses(INITIAL_PROOF_PASSES);
    setAuditEvents(INITIAL_AUDIT_EVENTS);
    setActiveRole('Registrar Office (Staff #RO-402)');
  };

  return (
    <StoreContext.Provider
      value={{
        institution: INSTITUTION,
        students,
        proofPasses,
        auditEvents,
        activeRole,
        setActiveRole: handleSetActiveRole,
        getStudentById,
        getProofPassById,
        getProofPassByToken,
        resolveMismatch,
        createProofPass,
        revokeProofPass,
        logAuditEvent,
        logPassAccess,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
