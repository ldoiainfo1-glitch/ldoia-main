// Shared types for the LDOIA application

export interface Position {
  id: string;
  title: string;
  positionName: string;
  level: 'india' | 'zone' | 'state' | 'division' | 'district' | 'tehsil' | 'pincode' | 'village';
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  village?: string;
  fee: number;
  annualFee: number;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  status: 'available' | 'filled' | 'pending';
  isFilled: boolean;
  isElected: boolean;
  maxSlots: number;
  filledSlots: number;
  memberName?: string;
  memberPhoto?: string;
  memberContact?: string;
  memberId?: string;
  communityId: string;
  isActive?: boolean;
  applicant?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    appliedDate: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface Community {
  id: string;
  name: string;
  logo: string;
  slug: string;
  level: 'india' | 'zone' | 'state' | 'division' | 'district' | 'tehsil' | 'pincode' | 'village';
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  village?: string;
  positions: Position[];
  memberCount: number;
  establishedDate?: string;
  description?: string;
}

export interface CommitteeMember {
  id: number | string;
  name: string;
  phone: string;
  email?: string;
  post?: string;
  company?: string;
  designation?: string;
  completeAddress?: string;
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  village?: string;
  photo?: string | File;
  referralCode?: string;
  initials?: string;
  introduced?: number;
  approvedDate?: string;
  applicationStatus?: 'pending' | 'approved' | 'rejected';
  contribution?: string;
}

export interface AdvisoryMember extends CommitteeMember {
  currentDesignation?: string;
}

export interface Application {
  id: string;
  applicantName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth?: string;
  photo?: File | string;
  company?: string;
  designation?: string;
  experience?: string;
  appliedPosition: string;
  positionFee: string;
  applicationStatus: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  
  // Location information (where they're applying for position)
  positionLocation: {
    country: string;
    zone?: string;
    state?: string;
    division?: string;
    district?: string;
    tehsil?: string;
    pincode?: string;
    village?: string;
  };
  
  // Home address
  homeAddress: {
    country: string;
    state: string;
    division?: string;
    district?: string;
    city?: string;
    pincode?: string;
    completeAddress: string;
  };
  
  // Documents
  documents: {
    idProof?: File;
    addressProof?: File;
    panCard?: File;
  };
  
  referralCode?: string;
  qualification?: string;
}

export interface LocationData {
  divisions: Record<string, string[]>;
  districts: Record<string, string[]>;
  cities: Record<string, string[]>;
  pincodes: Record<string, string[]>;
}

export interface ZoneStatesMapping {
  [zone: string]: string[];
}

export type LocationLevel = 'india' | 'zone' | 'state' | 'division' | 'district' | 'tehsil' | 'pincode' | 'village';

export interface LocationSelection {
  country: string;
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  village?: string;
}
