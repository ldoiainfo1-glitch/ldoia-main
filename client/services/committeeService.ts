// Committee Service - Manages all committee-related API calls
// Connects frontend with MongoDB backend for dynamic data

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api' 
  : 'http://localhost:3001/api';

export interface CommitteeApplication {
  _id?: string;
  application_id: string;
  applicant_name: string;
  phone_number: string;
  email?: string;
  date_of_birth?: string;
  phone_verified?: boolean;
  company_organization?: string;
  designation?: string;
  applied_position: string;
  current_position?: string;
  Position_fee?: string;
  experience_years?: number;
  application_status: 'pending' | 'approved' | 'rejected';
  location_details?: {
    country?: string;
    zone?: string;
    state?: string;
    division?: string;
    district?: string;
    tehsil?: string;
    pincode?: string;
    village?: string;
  };
  qualification?: string;
  referral_code?: string;
  source_website?: string;
  applied_date?: string;
  uploaded_files?: string[];
  created_at?: string;
  updated_at?: string;
  
  // File data (Base64 encoded)
  photo_data?: string;
  photo_mimetype?: string;
  photo_filename?: string;
  photo_original_name?: string;
  
  id_proof_data?: string;
  id_proof_mimetype?: string;
  id_proof_filename?: string;
  id_proof_original_name?: string;
  
  address_proof_data?: string;
  address_proof_mimetype?: string;
  address_proof_filename?: string;
  address_proof_original_name?: string;
  
  pan_card_data?: string;
  pan_card_mimetype?: string;
  pan_card_filename?: string;
  pan_card_original_name?: string;
}

export interface CommitteePosition {
  _id?: string;
  id: number;
  post: string;
  designation?: string;
  name?: string;
  phone?: string;
  photo?: string;
  contribution?: string;
  initials?: string;
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  tehsil?: string;
  pincode?: string;
  village?: string;
  referral_code?: string;
  introduced_count?: number;
  approval_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

class CommitteeService {
  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Committee API Request failed:', error);
      throw error;
    }
  }

  // Get all applications (approved ones appear in the table)
  async getApplications(): Promise<CommitteeApplication[]> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/applications`);
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  // Get single application by ID
  async getApplication(applicationId: string): Promise<CommitteeApplication | null> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/applications/${applicationId}`);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Error fetching application:', error);
      return null;
    }
  }

  // Submit new application
  async submitApplication(formData: FormData): Promise<{ success: boolean; applicationId?: string; message?: string }> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/applications`, {
        method: 'POST',
        body: formData // FormData for file uploads
      });
      
      return {
        success: response.success,
        applicationId: response.applicationId,
        message: response.message || 'Application submitted successfully'
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit application'
      };
    }
  }

  // Edit/Update application
  async updateApplication(applicationId: string, formData: FormData): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'PUT',
        body: formData // FormData for file uploads
      });
      
      return {
        success: response.success,
        message: response.message || 'Application updated successfully'
      };
    } catch (error) {
      console.error('Error updating application:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update application'
      };
    }
  }

  // Update application status (approve/reject)
  async updateApplicationStatus(applicationId: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      return {
        success: response.success,
        message: response.message || 'Application status updated successfully'
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update application status'
      };
    }
  }

  // Get committee positions (for reference/display)
  async getCommitteePositions(): Promise<CommitteePosition[]> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/committee/positions`);
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Error fetching committee positions:', error);
      return [];
    }
  }

  // Convert Base64 image data to blob URL for display
  createImageUrl(base64Data: string, mimeType: string): string {
    if (!base64Data || !mimeType) return '/placeholder.svg';
    
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating image URL:', error);
      return '/placeholder.svg';
    }
  }

  // Get photo URL for display (handles both uploaded and default photos)
  getPhotoUrl(application: CommitteeApplication): string {
    if (application.photo_data && application.photo_mimetype) {
      return this.createImageUrl(application.photo_data, application.photo_mimetype);
    }
    
    // Fallback to placeholder
    return '/placeholder.svg';
  }
}

// Export singleton instance
export const committeeService = new CommitteeService();
export default committeeService;
