// Super Admin Integration Configuration
// This file contains all the settings needed to connect your LDOIA website with the super admin system

export const SUPER_ADMIN_CONFIG = {
    // Super admin system details
    superAdmin: {
        // The URL where your super admin website is hosted
        baseUrl: 'https://your-super-admin-website.com',
        
        // API endpoints that super admin will call to get data from your website
        apiEndpoints: {
            // Super admin will call these endpoints to get application data
            applications: '/api/applications',           // GET: fetch all applications
            applicationById: '/api/applications/{id}',   // GET: fetch specific application
            updateStatus: '/api/applications/{id}/status', // PUT: update application status
            documents: '/api/applications/{id}/documents'   // GET: fetch documents
        },
        
        // Authentication for super admin to access your API
        auth: {
            type: 'bearer', // 'bearer', 'api-key', or 'none'
            // You'll provide this token to the super admin team
            apiKey: 'your-secure-api-key-here-change-this',
            allowedOrigins: [
                'https://your-super-admin-website.com',
                'http://localhost:3000' // For testing
            ]
        }
    },

    // Your LDOIA website configuration
    ldoiaWebsite: {
        // Your website's API base URL
        apiBaseUrl: 'https://ldioa-land-developer.netlify.app/api',
        
        // Endpoints your website will use
        endpoints: {
            submitApplication: '/applications',
            checkStatus: '/applications/{id}',
            uploadDocuments: '/applications/{id}/documents',
            getMembers: '/committee/members'
        },
        
        // Data format that matches super admin expectations
        applicationFormat: {
            // Map your form fields to super admin expected fields
            fieldMapping: {
                'name': 'applicant_name',
                'phone': 'phone_number',
                'email': 'email_address',
                'designation': 'current_position',
                'appliedPost': 'applied_position',
                'price': 'salary_expectation',
                'country': 'location.country',
                'zone': 'location.zone',
                'state': 'location.state',
                'division': 'location.division',
                'district': 'location.district',
                'tehsil': 'location.tehsil',
                'pincode': 'location.pincode',
                'village': 'location.village'
            },
            
            // Required fields for application
            requiredFields: [
                'applicant_name',
                'phone_number',
                'applied_position',
                'location.state'
            ],
            
            // Application statuses
            statusTypes: {
                pending: 'pending',
                approved: 'approved',
                rejected: 'rejected',
                underReview: 'under_review'
            }
        }
    },

    // Webhook configuration (if super admin needs to notify your website)
    webhooks: {
        // URL where super admin will send status updates
        statusUpdate: 'https://ldioa-land-developer.netlify.app/api/webhooks/status-update',
        
        // Secret key for webhook verification
        secret: 'your-webhook-secret-key-change-this',
        
        // Events you want to receive
        events: [
            'application.approved',
            'application.rejected',
            'application.under_review'
        ]
    },

    // Position configuration
    positions: {
        // Available positions by level
        levels: {
            india: {
                fee: 500000,
                positions: [
                    'President', 'Secretary', 'Treasurer', 
                    'Chairman Land Developer', 'Chairman Building Developer',
                    'Chairman Estate Consultant', 'Chairman Subsidy Collection',
                    'Chairman Bank Institution', 'Chairman Development Fund',
                    'PR Officer Police', 'PR Officer Media', 'Chairman Agriculture'
                ]
            },
            zone: {
                fee: 200000,
                positions: [
                    'Zone President', 'Zone Secretary', 'Zone Treasurer',
                    'Zone Chairman Land Developer', 'Zone Chairman Building Developer'
                ]
            },
            state: {
                fee: 150000,
                positions: [
                    'State President', 'State Secretary', 'State Treasurer',
                    'State Chairman Land Developer'
                ]
            },
            division: {
                fee: 125000,
                positions: [
                    'Division President', 'Division Secretary', 'Division Treasurer'
                ]
            },
            district: {
                fee: 100000,
                positions: [
                    'District President', 'District Secretary', 'District Treasurer'
                ]
            },
            tehsil: {
                fee: 75000,
                positions: [
                    'Tehsil President', 'Tehsil Secretary', 'Tehsil Treasurer'
                ]
            },
            pincode: {
                fee: 50000,
                positions: [
                    'Pincode President', 'Pincode Secretary'
                ]
            },
            village: {
                fee: 25000,
                positions: [
                    'Village President', 'Village Secretary'
                ]
            }
        }
    }
};

// Helper functions for super admin integration
export const SuperAdminHelper = {
    // Format application data for super admin
    formatApplicationForSuperAdmin: (applicationData) => {
        const formatted = {
            application_id: Date.now().toString(),
            applicant_name: applicationData.name,
            phone_number: applicationData.phone,
            email_address: applicationData.email || '',
            current_position: applicationData.designation || 'N/A',
            applied_position: applicationData.appliedPost,
            salary_expectation: applicationData.price,
            application_status: 'pending',
            location: {
                country: applicationData.country || 'India',
                zone: applicationData.zone || '',
                state: applicationData.state || '',
                division: applicationData.division || '',
                district: applicationData.district || '',
                tehsil: applicationData.tehsil || '',
                pincode: applicationData.pincode || '',
                village: applicationData.village || ''
            },
            documents: applicationData.documents || [],
            applied_date: new Date().toISOString(),
            referral_code: applicationData.referralCode || null,
            website_source: 'ldoia' // Identifies which website the application came from
        };

        return formatted;
    },

    // Validate application data
    validateApplication: (applicationData) => {
        const errors = [];
        const required = SUPER_ADMIN_CONFIG.ldoiaWebsite.applicationFormat.requiredFields;

        required.forEach(field => {
            if (field.includes('.')) {
                // Handle nested fields like 'location.state'
                const [parent, child] = field.split('.');
                if (!applicationData[parent] || !applicationData[parent][child]) {
                    errors.push(`${field} is required`);
                }
            } else {
                if (!applicationData[field]) {
                    errors.push(`${field} is required`);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Get position fee by level
    getPositionFee: (level) => {
        return SUPER_ADMIN_CONFIG.positions.levels[level]?.fee || 0;
    },

    // Get available positions for level
    getPositionsForLevel: (level) => {
        return SUPER_ADMIN_CONFIG.positions.levels[level]?.positions || [];
    }
};

export default SUPER_ADMIN_CONFIG;
