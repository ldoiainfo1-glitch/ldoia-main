// Type definitions for committee-api.js

export interface CommitteeMember {
  id: number;
  name: string;
  post: string;
  designation?: string;
  phone: string;
  email?: string;
  photo?: string;
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  village?: string;
  contribution?: string;
  initials?: string;
}

export interface Application {
  id: string;
  applicant_name: string;
  phone: string;
  email: string;
  position_applied: string;
  date_of_birth?: string;
  company?: string;
  designation?: string;
  experience?: string;
  country?: string;
  state?: string;
  division?: string;
  district?: string;
  city?: string;
  pincode?: string;
  complete_address?: string;
  referral_code?: string | null;
  has_photo?: boolean;
  has_id_proof?: boolean;
  has_address_proof?: boolean;
  has_pan_card?: boolean;
}

export interface ReferralVerification {
  valid: boolean;
  referrer?: CommitteeMember;
  message?: string;
}

declare const committeeAPI: {
  initializePositions: () => Promise<void>;
  getAllPositions: () => Promise<CommitteeMember[]>;
  submitApplication: (application: Application) => Promise<{ success: boolean; application_id: string }>;
  verifyReferral: (code: string) => Promise<ReferralVerification>;
};

export const applicationAPI: {
  submitApplication: (data: any) => Promise<{ success: boolean; id: string }>;
};

export default committeeAPI;
