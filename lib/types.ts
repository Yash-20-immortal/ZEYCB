export type RecordStatus = 'verified' | 'action_required' | 'pending_sync' | 'proof_issued';

export type SourceType = 'INSTITUTE_SIS' | 'ABC_PORTAL_SIMULATED' | 'DIGILOCKER_MOCK' | 'CBSE_BOARD_MOCK' | 'NPTEL_SWAYAM';

export interface SourceProvenance {
  sourceName: string;
  sourceType: SourceType;
  lastSynced: string;
  confidence: number; // 0-100
  recordRef: string;
  isSimulated: true;
}

export interface StudentField<T = string | number | boolean> {
  value: T;
  provenance: SourceProvenance;
  status: 'matched' | 'discrepancy' | 'manual_verified' | 'unverified';
  alternateValue?: T;
  alternateSource?: SourceProvenance;
}

export interface StudentRecord {
  id: string;
  rollNumber: string;
  maskedApaarId: string;
  unmaskedApaarId: string; // Synthetic placeholder only, e.g. "APAAR-SYN-0001"
  fullName: StudentField<string>;
  dateOfBirth: StudentField<string>; // YYYY-MM-DD
  program: StudentField<string>;
  department: string;
  currentSemester: StudentField<number>;
  enrollmentYear: number;
  readinessScore: number; // 0 - 100
  status: RecordStatus;
  cgpa: StudentField<string>;
  totalCreditsCompleted: StudentField<number>;
  totalCreditsRequired: number;
  degreeEligibility: StudentField<string>;
  withheldByDefault: string[]; // List of fields like ["Full National ID", "Home Address", "Contact Number", "Parent Details"]
  seededMismatch?: {
    field: string;
    fieldLabel: string;
    localValue: string;
    localSource: string;
    incomingValue: string;
    incomingSource: string;
    aiExplanation: string;
    aiSuggestedResolution: string;
    supportingDocument: string;
    severity: 'high' | 'medium' | 'low';
    resolved: boolean;
    resolvedAt?: string;
    resolvedBy?: string;
    resolutionNote?: string;
  };
  changeHistory: Array<{
    id: string;
    timestamp: string;
    field: string;
    oldValue: string;
    newValue: string;
    author: string;
    reason: string;
  }>;
}

export interface ProofPass {
  id: string;
  passToken: string;
  studentId: string;
  studentName: string;
  maskedApaarId: string;
  program: string;
  department: string;
  institutionName: string;
  aicteApprovalId: string;
  purpose: string;
  verifierRecipientName?: string;
  issuedAt: string;
  expiresAt: string;
  isRevoked: boolean;
  revokedAt?: string;
  revokedBy?: string;
  revocationReason?: string;
  sharedFields: {
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
  fieldValues: Record<string, { label: string; value: string; provenance: string }>;
  withheldFields: string[];
  simulatedSignature: {
    algorithm: string;
    digest: string;
    publicKeyId: string;
    certificateSerial: string;
    timestamp: string;
    issuer: string;
  };
  accessLog: Array<{
    timestamp: string;
    ipSimulated: string;
    userAgentSimulated: string;
    status: 'AUTHENTICATED' | 'REVOKED_VIEW' | 'EXPIRED_VIEW';
  }>;
}

export type AuditActionType =
  | 'RECORD_VIEW'
  | 'UNMASK_ATTEMPT'
  | 'DISCREPANCY_RESOLVE'
  | 'PROOF_PASS_CREATED'
  | 'PROOF_PASS_VIEWED'
  | 'PROOF_PASS_REVOKED'
  | 'RECORD_SYNC_SIMULATED'
  | 'EXPORT_AUDIT_LOG';

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: AuditActionType;
  studentId?: string;
  studentName?: string;
  passId?: string;
  details: string;
  status: 'COMPLIANT' | 'FLAGGED' | 'SYSTEM';
  ipAddress: string;
}

export interface InstitutionProfile {
  name: string;
  aictePermanentId: string;
  naacGrade: string;
  nirfRank: string;
  affiliatingUniversity: string;
  nodalOfficer: {
    name: string;
    designation: string;
    staffId: string;
    email: string;
  };
}
