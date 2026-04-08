// ── Product Brand Types ──────────────────────────────────────────────────────
export type ProductBrand = 'Xeomin' | 'Belotero' | 'Radiesse' | 'Ultherapy';
export type Market = 'UAE' | 'KSA' | 'GCC';
export type Territory = 'Dubai' | 'Abu Dhabi' | 'Riyadh' | 'Jeddah' | 'Sharjah';

// ── HCP Types ────────────────────────────────────────────────────────────────
export type HCPTier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type HCPSpecialty =
  | 'Dermatologist'
  | 'Plastic Surgeon'
  | 'Aesthetic Physician'
  | 'ENT Specialist'
  | 'Ophthalmologist';

export interface HCP {
  id: string;
  name: string;
  title: string;
  specialty: HCPSpecialty;
  clinic: string;
  territory: Territory;
  market: Market;
  tier: HCPTier;
  prescribingProducts: ProductBrand[];
  competitorProducts: string[];
  lastVisitDate: string;
  totalVisits: number;
  avatar?: string;
}

// ── Meeting Types ─────────────────────────────────────────────────────────────
export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled';
export type PrepStatus = 'not-started' | 'in-progress' | 'complete';

export interface Meeting {
  id: string;
  hcpId: string;
  hcp: HCP;
  date: string;
  time: string;
  duration: number; // minutes
  location: string;
  products: ProductBrand[];
  status: MeetingStatus;
  prepStatus: PrepStatus;
  repId: string;
  repName: string;
  objectives: string[];
  hasRecap: boolean;
  hasCRMEntry: boolean;
  hasFollowupEmail: boolean;
}

// ── Chat / Product Expert Types ───────────────────────────────────────────────
export type ComplianceFlag =
  | 'off-label'
  | 'pv-signal'
  | 'competitive'
  | 'low-confidence'
  | 'escalated'
  | 'compliant';

export interface ChatCitation {
  documentName: string;
  section: string;
  page?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  product?: ProductBrand;
  confidenceScore?: number;
  citations?: ChatCitation[];
  complianceFlags?: ComplianceFlag[];
  routingAction?: string;
}

export interface ChatSession {
  id: string;
  repId: string;
  repName: string;
  startTime: string;
  messages: ChatMessage[];
  product?: ProductBrand;
}

// ── Quiz / Micro-Training Types ───────────────────────────────────────────────
export type QuestionType = 'mcq' | 'true-false' | 'open-ended';
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  product: ProductBrand;
  type: QuestionType;
  difficulty: QuizDifficulty;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface QuizSession {
  id: string;
  repId: string;
  product: ProductBrand;
  questions: QuizQuestion[];
  answers: Record<string, string | number>;
  score?: number;
  completed: boolean;
  startTime: string;
  endTime?: string;
}

export interface RepTrainingScore {
  repId: string;
  repName: string;
  scores: Record<ProductBrand, number>;
  trend: Record<ProductBrand, number[]>;
  lastQuizDate: string;
}

// ── Recap / Post-Meeting Types ────────────────────────────────────────────────
export type HCPSentiment = 'positive' | 'neutral' | 'negative';

export interface MeetingRecap {
  id: string;
  meetingId: string;
  productsDiscussed: ProductBrand[];
  hcpSentiment: HCPSentiment;
  sentimentNotes: string;
  competitorMentions: string[];
  volumeDiscussed: string;
  aspDiscussed: string;
  samplesLeft: string;
  nextSteps: string;
  nextVisitDate: string;
  complianceFlags: ComplianceFlag[];
  voiceTranscript?: string;
  status: 'draft' | 'complete';
  crmEntryConfirmed: boolean;
  followupEmailSent: boolean;
  createdAt: string;
}

// ── Notification Types ────────────────────────────────────────────────────────
export type NotificationType =
  | 'pending-recap'
  | 'crm-entry'
  | 'follow-up-email'
  | 'training-quiz'
  | 'pv-alert'
  | 'report-ready'
  | 'meeting-reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionPath?: string;
  relatedId?: string;
}

// ── Report Types ──────────────────────────────────────────────────────────────
export type ReportType =
  | 'sales-activity'
  | 'commercial-performance'
  | 'hcp-engagement'
  | 'rep-performance'
  | 'competitive-intelligence'
  | 'off-label-query'
  | 'pv-alerts'
  | 'training-gap'
  | 'compliance-audit'
  | 'platform-adoption';

export interface ReportCard {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  recipients: string[];
  lastGenerated: string;
  cadence: string;
  status: 'ready' | 'generating' | 'scheduled';
}

// ── Auth Types ────────────────────────────────────────────────────────────────
export type UserRole = 'rep' | 'manager' | 'admin' | 'medical-affairs' | 'compliance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  territory: Territory;
  market: Market;
  avatar?: string;
}
