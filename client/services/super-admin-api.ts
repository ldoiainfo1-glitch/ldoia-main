// Super Admin API Service
// This service handles communication with the super admin system

export interface ApplicationData {
  application_id: string;
  applicant_name: string;
  phone_number: string;
  email: string;
  applied_position: string;
  current_position?: string;
  salary_expectation?: string;
  application_status: 'pending' | 'approved' | 'rejected';
  uploaded_files?: FileData[];
  applied_date: string;
  location_details: {
    country: string;
    state: string;
    division: string;
    district: string;
    village: string;
    pincode: string;
  };
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
}

class SuperAdminAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    // Your LDOIA website API base URL
    this.baseUrl = import.meta.env.PROD 
      ? 'https://ldioa-land-developer.netlify.app/api'
      : 'http://localhost:3001/api';
    
    // API key for authentication with super admin
    this.apiKey = import.meta.env.VITE_SUPER_ADMIN_API_KEY || 'your-api-key-here';
  }

  // Submit new application to your database (will be picked up by super admin)
  async submitApplication(applicationData: FormData): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/applications`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          // Don't set Content-Type for FormData, let browser set it
        },
        body: applicationData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit application');
      }

      return {
        success: true,
        data: result.data,
        message: 'Application submitted successfully'
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit application'
      };
    }
  }

  // Get all applications (for admin view)
  async getAllApplications(): Promise<ApplicationData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch applications');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  // Get approved applications only (for public display)
  async getApprovedApplications(): Promise<ApplicationData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/applications?status=approved`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch approved applications');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching approved applications:', error);
      return [];
    }
  }

  // Update application status (used when super admin approves/rejects)
  async updateApplicationStatus(
    applicationId: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({ status })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status');
      }

      return {
        success: true,
        message: 'Status updated successfully'
      };
    } catch (error) {
      console.error('Error updating status:', error);
      return {
        success: false,
        message: error.message || 'Failed to update status'
      };
    }
  }

  // Get application documents
  async getApplicationDocuments(applicationId: string): Promise<FileData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/applications/${applicationId}/documents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch documents');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  // Sync with super admin system (call this periodically)
  async syncWithSuperAdmin(): Promise<{ success: boolean; message?: string }> {
    try {
      // This endpoint tells super admin to check for new applications
      const response = await fetch(`${this.baseUrl}/sync-super-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
        },
        body: JSON.stringify({
          website: 'ldoia',
          lastSync: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to sync');
      }

      return {
        success: true,
        message: 'Sync completed successfully'
      };
    } catch (error) {
      console.error('Error syncing with super admin:', error);
      return {
        success: false,
        message: error.message || 'Sync failed'
      };
    }
  }
}

export const superAdminAPI = new SuperAdminAPI();
export default superAdminAPI;
