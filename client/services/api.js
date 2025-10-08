// API functions for MongoDB integration
// Updated: Using VITE_BACKEND_API_URL from Netlify environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Member API functions
export const memberAPI = {
  // Get all members
  getAllMembers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/members`);
      if (!response.ok) throw new Error('Failed to fetch members');
      return await response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  },

  // Get member by phone
  getMemberByPhone: async (phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${phone}`);
      if (!response.ok) throw new Error('Member not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching member:', error);
      return null;
    }
  },

  // Verify member credentials
  verifyCredentials: async (phone, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid credentials');
      return data;
    } catch (error) {
      console.error('Error verifying credentials:', error);
      throw error;
    }
  },

  // Update member information
  updateMember: async (phone, memberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${phone}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });
      
      if (!response.ok) throw new Error('Failed to update member');
      return await response.json();
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (phone, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, newPassword }),
      });
      
      if (!response.ok) throw new Error('Failed to reset password');
      return await response.json();
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};

// Application API functions
export const applicationAPI = {
  // Submit new application
  submitApplication: async (applicationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      
      if (!response.ok) throw new Error('Failed to submit application');
      return await response.json();
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  // Get all applications
  getAllApplications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },

  // Approve application
  approveApplication: async (applicationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to approve application');
      return await response.json();
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  },

  // Update application status (Super Admin - uses PATCH)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      console.log(`📤 Updating application ${applicationId} to status: ${status}`);
      
      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update application status');
      }
      
      console.log('✅ Status update successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      throw error;
    }
  },

  // Submit committee application
  submitCommitteeApplication: async (applicationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/committee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: applicationData.name,
          phone: applicationData.phone,
          email: applicationData.email,
          appliedPost: applicationData.appliedPost,
          currentDesignation: applicationData.currentDesignation || '',
          price: applicationData.price,
          location: {
            country: applicationData.location?.country || '',
            zone: applicationData.location?.zone || '',
            state: applicationData.location?.state || '',
            division: applicationData.location?.division || '',
            district: applicationData.location?.district || '',
            tehsil: applicationData.location?.tehsil || '',
            pincode: applicationData.location?.pincode || '',
            village: applicationData.location?.village || ''
          },
          documents: applicationData.documents || [],
          appliedDate: new Date().toISOString(),
          status: 'pending'
        })
      });

      if (!response.ok) throw new Error('Failed to submit application');
      return await response.json();
    } catch (error) {
      console.error('Error submitting committee application:', error);
      throw error;
    }
  },

  // Submit advisory application
  submitAdvisoryApplication: async (applicationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/advisory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: applicationData.name,
          phone: applicationData.phone,
          email: applicationData.email,
          appliedPost: applicationData.appliedPost,
          currentDesignation: applicationData.currentDesignation || '',
          price: applicationData.price,
          location: {
            country: applicationData.location?.country || '',
            zone: applicationData.location?.zone || '',
            state: applicationData.location?.state || '',
            division: applicationData.location?.division || '',
            district: applicationData.location?.district || '',
            tehsil: applicationData.location?.tehsil || '',
            pincode: applicationData.location?.pincode || '',
            village: applicationData.location?.village || ''
          },
          documents: applicationData.documents || [],
          appliedDate: new Date().toISOString(),
          status: 'pending',
          applicationType: 'advisory'
        })
      });

      if (!response.ok) throw new Error('Failed to submit advisory application');
      return await response.json();
    } catch (error) {
      console.error('Error submitting advisory application:', error);
      throw error;
    }
  },

  // Get committee applications
  getCommitteeApplications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/committee`);
      if (!response.ok) throw new Error('Failed to fetch committee applications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching committee applications:', error);
      return [];
    }
  },

  // Get advisory applications
  getAdvisoryApplications: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/advisory`);
      if (!response.ok) throw new Error('Failed to fetch advisory applications');
      return await response.json();
    } catch (error) {
      console.error('Error fetching advisory applications:', error);
      return [];
    }
  }
};

// SMS API function
export const smsAPI = {
  sendOTP: async (phone, otp, message) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp, message }),
      });
      
      if (!response.ok) throw new Error('Failed to send SMS');
      return await response.json();
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }
};

// Local storage fallback for development/testing
export const localStorageAPI = {
  saveCommitteeApplication: (application) => {
    const applications = JSON.parse(localStorage.getItem('ldoia_committee_applications') || '[]');
    const newApp = {
      ...application,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString(),
      status: 'pending'
    };
    applications.push(newApp);
    localStorage.setItem('ldoia_committee_applications', JSON.stringify(applications));
    return newApp;
  },

  saveAdvisoryApplication: (application) => {
    const advisoryApplications = JSON.parse(localStorage.getItem('ldoia_advisory_applications') || '[]');
    const newApp = {
      ...application,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString(),
      status: 'pending',
      applicationType: 'advisory'
    };
    advisoryApplications.push(newApp);
    localStorage.setItem('ldoia_advisory_applications', JSON.stringify(advisoryApplications));
    return newApp;
  },

  getCommitteeApplications: () => {
    return JSON.parse(localStorage.getItem('ldoia_committee_applications') || '[]');
  },

  getAdvisoryApplications: () => {
    return JSON.parse(localStorage.getItem('ldoia_advisory_applications') || '[]');
  }
};
