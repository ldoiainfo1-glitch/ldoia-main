// Type definitions for api.js

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Member {
  id: number;
  name: string;
  position: string;
  phone: string;
  email?: string;
  photo?: string;
  password?: string;
  company?: string;
  designation?: string;
  completeAddress?: string;
  [key: string]: any;
}

export interface Application {
  id?: string;
  application_id?: string;
  applicant_name: string;
  phone_number: string;
  email_address: string;
  applied_position: string;
  application_fee: string;
  application_status: 'pending' | 'approved' | 'rejected';
  applied_date: string;
  [key: string]: any;
}

// Export memberAPI as a named export to match api.js
export const memberAPI: {
  getAllMembers: () => Promise<Member[]>;
  getMemberByPhone: (phone: string) => Promise<Member | null>;
  verifyCredentials: (phone: string, password: string) => Promise<{
    success: boolean;
    member?: Member;
    error?: string;
  }>;
  updateMember: (phone: string, updates: Partial<Member>) => Promise<ApiResponse<Member>>;
  resetPassword: (phone: string, newPassword: string) => Promise<ApiResponse>;
  createMember: (member: Partial<Member>) => Promise<ApiResponse<Member>>;
};

// Export applicationAPI as a named export to match api.js
export const applicationAPI: {
  submitApplication: (applicationData: any) => Promise<ApiResponse<Application>>;
  getAllApplications: () => Promise<ApiResponse<Application[]>>;
  approveApplication: (applicationId: string) => Promise<ApiResponse>;
  submitCommitteeApplication: (applicationData: any) => Promise<ApiResponse<Application>>;
  submitAdvisoryApplication: (applicationData: any) => Promise<ApiResponse<Application>>;
  getCommitteeApplications: () => Promise<Application[]>;
  getAdvisoryApplications: () => Promise<Application[]>;
};

// Export smsAPI as a named export to match api.js
export const smsAPI: {
  sendOTP: (phone: string, otp: string, message: string) => Promise<ApiResponse>;
};

// Export localStorageAPI as a named export to match api.js
export const localStorageAPI: {
  saveCommitteeApplication: (application: any) => any;
  saveAdvisoryApplication: (application: any) => any;
  getCommitteeApplications: () => any[];
  getAdvisoryApplications: () => any[];
};
