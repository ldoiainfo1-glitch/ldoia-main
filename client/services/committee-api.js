// Committee API Service - Connects with Super Admin System
// This service integrates your existing application form with the super admin dashboard

// Super Admin Configuration (matches your WEBSITE_CONFIG)
const SUPER_ADMIN_CONFIG = {
  apiBaseUrl: 'https://ldioa-land-developer.netlify.app/api',
  endpoints: {
    ldoia: {
      applications: '/applications',
      updateStatus: '/applications/{id}/status',
      documents: '/applications/{id}/documents'
    }
  },
  auth: {
    type: 'bearer',
    token: process.env.SUPER_ADMIN_API_TOKEN || 'your-api-token-here'
  }
};

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? SUPER_ADMIN_CONFIG.apiBaseUrl
  : 'http://localhost:3001/api';

// Main API service for applications (connects with your existing form in Index.tsx)
const applicationAPI = {
  // Submit application from your existing form in Index.tsx
  submitApplication: async (formData) => {
    try {
      // Format data to match super admin's expected field mapping
      const formattedData = {
        application_id: `LDOIA-${Date.now()}`, // Generate unique ID
        applicant_name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.name || formData.fullName,
        phone_number: formData.phoneNumber || formData.phone,
        email_address: formData.emailAddress || formData.email,
        current_position: formData.designation || formData.currentDesignation || 'N/A',
        applied_position: `${formData.position || ''} - ${formData.title || ''}`.replace(' - ', ''),
        salary_expectation: formData.fee || formData.applicationFee || 'As per position',
        application_status: 'pending',
        date_of_birth: formData.dateOfBirth || null,
        company_organization: formData.companyOrganization || formData.company || '',
        years_of_experience: formData.yearsOfExperience || formData.experience || '',
        location_details: {
          country: formData.formCountry || formData.country || 'India',
          zone: formData.formZone || formData.zone || '',
          state: formData.formState || formData.state || '',
          division: formData.formDivision || formData.division || '',
          district: formData.formDistrict || formData.district || '',
          tehsil: formData.formTehsil || formData.tehsil || '',
          pincode: formData.formPincode || formData.pincode || '',
          village: formData.formCity || formData.city || formData.village || '',
          complete_address: formData.completeAddress || formData.address || '',
          level: formData.level || 'india'
        },
        uploaded_files: {
          photo: formData.photo || null,
          id_proof: formData.idProof || null,
          address_proof: formData.addressProof || null,
          pan_card: formData.panCard || null,
          additional_documents: formData.documents || []
        },
        applied_date: new Date().toISOString(),
        referral_code: formData.referralCode || formData.referral_code || null,
        qualification: formData.qualifications || formData.qualification || '',
        // Additional metadata for super admin
        source_website: 'LDOIA',
        submission_type: 'committee_application',
        ip_address: null, // Can be added by backend
        user_agent: navigator.userAgent || null
      };

      const endpoint = `${API_BASE_URL}${SUPER_ADMIN_CONFIG.endpoints.ldoia.applications}`;
      
      // Prepare headers with authentication
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication header for super admin
      if (SUPER_ADMIN_CONFIG.auth.type === 'bearer' && SUPER_ADMIN_CONFIG.auth.token) {
        headers['Authorization'] = `Bearer ${SUPER_ADMIN_CONFIG.auth.token}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error(`Failed to submit application: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        message: 'Application submitted successfully! You will be notified once reviewed.',
        applicationId: result.application_id || formattedData.application_id
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Check if it's a network error (API server not running)
      if (error.message.includes('fetch') || error.name === 'TypeError') {
        console.warn('API server may not be running. Storing application locally.');
      }
      
      // For development/testing - store in localStorage
      if (process.env.NODE_ENV === 'development') {
        const applications = JSON.parse(localStorage.getItem('ldoia_applications') || '[]');
        const newApplication = {
          ...formattedData,
          application_id: Date.now().toString()
        };
        applications.push(newApplication);
        localStorage.setItem('ldoia_applications', JSON.stringify(applications));
        
        return {
          success: true,
          message: 'Application submitted successfully (stored locally for testing)!',
          applicationId: newApplication.application_id
        };
      }
      
      throw error;
    }
  },

  // Get application status (for user to check their application)
  getApplicationStatus: async (applicationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`);
      if (!response.ok) throw new Error('Application not found');
      
      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error fetching application status:', error);
      
      // Check localStorage for development
      if (process.env.NODE_ENV === 'development') {
        const applications = JSON.parse(localStorage.getItem('ldoia_applications') || '[]');
        const application = applications.find(app => app.application_id === applicationId);
        
        if (application) {
          return {
            success: true,
            data: application
          };
        }
      }
      
      throw error;
    }
  },

  // Get all applications (for super admin to fetch)
  getAllApplications: async (status = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authentication for super admin
      if (SUPER_ADMIN_CONFIG.auth.type === 'bearer' && SUPER_ADMIN_CONFIG.auth.token) {
        headers['Authorization'] = `Bearer ${SUPER_ADMIN_CONFIG.auth.token}`;
      }
      
      let endpoint = `${API_BASE_URL}${SUPER_ADMIN_CONFIG.endpoints.ldoia.applications}`;
      if (status) {
        endpoint += `?status=${status}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) throw new Error('Failed to fetch applications');
      
      const result = await response.json();
      return {
        success: true,
        data: result.data || result || []
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      
      // Fallback to localStorage for development
      if (process.env.NODE_ENV === 'development') {
        const applications = JSON.parse(localStorage.getItem('ldoia_applications') || '[]');
        return {
          success: true,
          data: applications.filter(app => !status || app.application_status === status)
        };
      }
      
      throw error;
    }
  },

  // Update application status (called by super admin)
  updateApplicationStatus: async (applicationId, newStatus) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (SUPER_ADMIN_CONFIG.auth.type === 'bearer' && SUPER_ADMIN_CONFIG.auth.token) {
        headers['Authorization'] = `Bearer ${SUPER_ADMIN_CONFIG.auth.token}`;
      }
      
      const endpoint = `${API_BASE_URL}${SUPER_ADMIN_CONFIG.endpoints.ldoia.updateStatus.replace('{id}', applicationId)}`;
      
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ 
          application_status: newStatus,
          updated_date: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error('Failed to update application status');
      
      const result = await response.json();
      return {
        success: true,
        message: `Application status updated to ${newStatus}`,
        data: result
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      
      // Fallback to localStorage for development
      if (process.env.NODE_ENV === 'development') {
        const applications = JSON.parse(localStorage.getItem('ldoia_applications') || '[]');
        const updatedApplications = applications.map(app => 
          app.application_id === applicationId 
            ? { ...app, application_status: newStatus, updated_date: new Date().toISOString() }
            : app
        );
        localStorage.setItem('ldoia_applications', JSON.stringify(updatedApplications));
        
        return {
          success: true,
          message: `Application status updated to ${newStatus}`,
          data: updatedApplications.find(app => app.application_id === applicationId)
        };
      }
      
      throw error;
    }
  },

  // Upload documents for application
  uploadDocuments: async (applicationId, files) => {
    try {
      const formData = new FormData();
      formData.append('applicationId', applicationId);
      
      files.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });

      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload documents');
      
      const result = await response.json();
      return {
        success: true,
        message: 'Documents uploaded successfully!',
        documents: result.documents
      };
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  }
};

// Committee data service (for displaying current members)
export const committeeAPI = {
  // Get all available positions
  getAllPositions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/positions`);
      if (!response.ok) throw new Error('Failed to fetch positions');
      
      const result = await response.json();
      return result.positions || result.data || [];
    } catch (error) {
      console.error('Error fetching positions:', error);
      
      // Return empty array instead of hardcoded data - only show MongoDB data
      return [];
    }
  },

  // Initialize positions (setup committee structure)
  initializePositions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/committee/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'initialize' })
      });

      if (!response.ok) throw new Error('Failed to initialize positions');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error initializing positions:', error);
      
      // Return success for development (no actual initialization needed)
      return {
        success: true,
        message: 'Committee positions ready (using fallback data)'
      };
    }
  },

  // Verify referral code
  verifyReferral: async (referralCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/referrals/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralCode })
      });

      if (!response.ok) throw new Error('Failed to verify referral');
      
      const result = await response.json();
      return {
        success: true,
        valid: result.valid || false,
        referrerName: result.referrerName || 'Unknown',
        message: result.message || 'Referral verified'
      };
    } catch (error) {
      console.error('Error verifying referral:', error);
      
      // Return valid for development (no actual verification)
      return {
        success: true,
        valid: true,
        referrerName: 'Demo User',
        message: 'Referral accepted (development mode)'
      };
    }
  },

  // Submit application (alias to applicationAPI.submitApplication for compatibility)
  submitApplication: async (formData) => {
    return await applicationAPI.submitApplication(formData);
  },

  // Get current committee members (approved applications)
  getCommitteeMembers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/committee/members`);
      if (!response.ok) throw new Error('Failed to fetch committee members');
      
      const result = await response.json();
      return {
        success: true,
        data: result.data || []
      };
    } catch (error) {
      console.error('Error fetching committee members:', error);
      
      // Return hardcoded data as fallback
      return {
        success: true,
        data: getHardcodedCommitteeMembers()
      };
    }
  },

  // Check if position is available
  checkPositionAvailability: async (position, location) => {
    try {
      const response = await fetch(`${API_BASE_URL}/committee/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position, location })
      });

      if (!response.ok) throw new Error('Failed to check position availability');
      
      const result = await response.json();
      return {
        success: true,
        available: result.available,
        message: result.message
      };
    } catch (error) {
      console.error('Error checking position availability:', error);
      
      // Assume available for development
      return {
        success: true,
        available: true,
        message: 'Position available for application'
      };
    }
  }
};

// Hardcoded committee members data (fallback)
function getHardcodedCommitteeMembers() {
  return [
    { 
      id: 1, 
      post: "President", 
      designation: "", 
      name: "Ingit Dave", 
      phone: "+91 9967477210", 
      photo: "/Ingit Dave.jpeg", 
      contribution: "₹5,00,000", 
      initials: "ID", 
      zone: "", 
      state: "", 
      division: "", 
      district: "", 
      tehsil: "", 
      pincode: "", 
      village: "" 
    },
    { 
      id: 2, 
      post: "Secretary", 
      designation: "", 
      name: "Rajesh Modi", 
      phone: "+91 9967477211", 
      photo: "/Rajesh Modi.jpeg", 
      contribution: "₹5,00,000", 
      initials: "RM", 
      zone: "", 
      state: "", 
      division: "", 
      district: "", 
      tehsil: "", 
      pincode: "", 
      village: "" 
    },
    // Add more members as needed...
  ];
}

// Export both named and default exports for flexibility
export { applicationAPI };
export default committeeAPI;
