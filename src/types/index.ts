export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ------------------------------------------------------------------ */
/* NEW: Week 1 - Meeting Scheduling Calendar                           */
/* ------------------------------------------------------------------ */
export interface AvailabilitySlot {
  id: string;
  userId: string;
  date: string;      // ISO date, e.g. "2026-07-08"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  isBooked: boolean;
}

export type MeetingStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface MeetingRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: MeetingStatus;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* NEW: Week 2 - Document Processing Chamber                           */
/* ------------------------------------------------------------------ */
export type DocumentStatus = 'Draft' | 'In Review' | 'Signed';

export interface DealDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  ownerId: string;
  sharedWith: string[];
  status: DocumentStatus;
  signatureDataUrl?: string;
  signedBy?: string;
  signedAt?: string;
  fileDataUrl?: string;
}

/* ------------------------------------------------------------------ */
/* NEW: Week 3 - Payments                                              */
/* ------------------------------------------------------------------ */
export type TransactionType = 'deposit' | 'withdraw' | 'transfer' | 'funding';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  senderId: string;
  receiverId: string;
  status: TransactionStatus;
  note?: string;
  createdAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
}
