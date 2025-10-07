// LDOIA Application API Server with MongoDB Atlas
require('dotenv').config();
const express = require('express');
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');
const axios = require('axios');
const sharp = require('sharp');
const app = express();
const PORT = 3001;

// Configure multer for file uploads (in memory storage)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per file
  },
  fileFilter: (req, file, cb) => {
    // Allow image files for photo and promotion images, and document files for others
    if ((file.fieldname === 'photo' || file.fieldname === 'image') && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (['id_proof', 'address_proof', 'pan_card'].includes(file.fieldname) && 
               (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Only images (photo) or PDF/images (documents) are allowed!`), false);
    }
  }
});

// Configure multiple file upload fields
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'id_proof', maxCount: 1 },
  { name: 'address_proof', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 }
]);

// MongoDB Atlas connection
const mongoUrl = process.env.MONGODB_URI || 'mongodb+srv://application:Newpass123@cluster0.5cmxzxj.mongodb.net/';

// Extract database name from MongoDB URI
// Expected format: mongodb+srv://user:pass@host/DATABASE_NAME?params
let dbName = 'ldoia_database'; // Default to ldoia_database

if (process.env.MONGODB_URI) {
  try {
    const uriParts = process.env.MONGODB_URI.split('/');
    const dbPart = uriParts[uriParts.length - 1]; // Get last part after final /
    const dbNameExtracted = dbPart.split('?')[0]; // Remove query parameters
    if (dbNameExtracted && dbNameExtracted.trim() !== '') {
      dbName = dbNameExtracted;
    }
  } catch (err) {
    console.warn('⚠️ Could not parse database name from URI, using default: ldoia_database');
  }
}

console.log(`📊 Database name: ${dbName}`);

let db = null;

// Initialize MongoDB connection
async function initializeDatabase() {
  try {
    const client = new MongoClient(mongoUrl, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      writeConcern: { w: 'majority' }
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB Atlas - Database: ${dbName}`);
    console.log(`📁 Collections will be accessed from: ${dbName}`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/superadmin', express.static(path.join(__dirname, 'superadmin')));

// Serve superadmin dashboard at root path for easier access
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'superadmin', 'index.html'));
});

// Initialize database connection
initializeDatabase().catch(console.error);

// Helper function to get applications collection
async function getApplicationsCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('applications');
}

// Helper function to get committee applications collection
async function getCommitteeApplicationsCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('committee_applications');
}

// Helper function to get advisory applications collection
async function getAdvisoryApplicationsCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('advisory_applications');
}

// Helper function to get committee positions collection
async function getCommitteePositionsCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('committee_positions');
}

// Helper function to get applications with referral tracking
async function getApplicationsWithReferralCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('applications_with_referral');
}

// Helper function to get promotion images collection
async function getPromotionImagesCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('promotion_images');
}

// Helper function to get promotion records collection
async function getPromotionRecordsCollection() {
  if (!db) {
    await initializeDatabase();
  }
  return db.collection('promotion_records');
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LDOIA Application API is running',
    timestamp: new Date().toISOString()
  });
});

// Send SMS OTP endpoint with Twilio integration
app.post('/api/send-sms', async (req, res) => {
  try {
    const { phone, otp, message } = req.body;
    
    console.log(`📱 SMS OTP Request: ${phone} - ${otp}`);
    
    // Twilio credentials
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.log('⚠️ Twilio credentials not configured. Using simulation mode.');
      console.log(`📱 SMS would be sent to ${phone}: ${message || `Your LDOIA verification OTP is: ${otp}. Do not share this with anyone.`}`);
      
      res.json({
        success: true,
        message: 'OTP sent successfully (simulation mode)',
        phone: phone
      });
      return;
    }
    
    try {
      // Initialize Twilio client
      const twilio = require('twilio');
      const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      
      // Format phone number - ensure it has country code
      let formattedPhone = phone.replace(/\D/g, '');
      
      // If it's a 10-digit Indian number, add +91
      if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone;
      } else if (formattedPhone.length === 12 && formattedPhone.startsWith('91')) {
        formattedPhone = '+' + formattedPhone;
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }
      
      console.log(`📱 Sending OTP ${otp} to ${formattedPhone} via Twilio`);
      
      const messageBody = message || `Your LDOIA verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes. Do not share this code.`;
      
      // Send SMS via Twilio
      const messageResponse = await client.messages.create({
        body: messageBody,
        from: TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });
      
      console.log('📱 Twilio Response:', {
        sid: messageResponse.sid,
        status: messageResponse.status,
        to: messageResponse.to,
        from: messageResponse.from
      });
      
      if (messageResponse.sid) {
        console.log(`✅ SMS sent successfully to ${phone} with OTP: ${otp}`);
        console.log(`� Message SID: ${messageResponse.sid}`);
        
        res.json({
          success: true,
          message: 'OTP sent successfully',
          phone: phone,
          messageId: messageResponse.sid
        });
      } else {
        throw new Error('SMS service returned failure response');
      }
      
    } catch (smsError) {
      console.error('❌ Twilio Service Error:', smsError);
      
      // Fallback to simulation if SMS service fails
      console.log(`📱 Fallback: SMS would be sent to ${phone}: ${message || `Your LDOIA verification OTP is: ${otp}`}`);
      
      res.json({
        success: true,
        message: 'OTP sent successfully (fallback mode)',
        phone: phone,
        note: 'SMS service temporarily unavailable, using fallback'
      });
    }
    
  } catch (error) {
    console.error('❌ Error sending SMS:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS',
      details: error.message
    });
  }
});

// Submit new application
// Applications endpoint with multiple file upload support
app.post('/api/applications', uploadFields, async (req, res) => {
  try {
    // Determine if this is a committee or advisory application
    const appliedPosition = req.body.applied_position || '';
    const isAdvisory = appliedPosition.toLowerCase().includes('advisory level');
    
    // Select the appropriate collection
    const applications = isAdvisory 
      ? await getAdvisoryApplicationsCollection()
      : await getCommitteeApplicationsCollection();
    
    console.log(`📝 Creating ${isAdvisory ? 'ADVISORY' : 'COMMITTEE'} application...`);
    
    // Parse location_details from JSON string
    let locationDetails = {};
    if (req.body.location_details) {
      try {
        locationDetails = JSON.parse(req.body.location_details);
      } catch (e) {
        console.log('Error parsing location_details:', e);
      }
    }
    
    // Create enhanced application object from FormData
    const application = {
      // Form type identifier
      form_type: isAdvisory ? 'advisory' : 'committee',
      
      // Basic identification
      application_id: req.body.application_id,
      applicant_name: req.body.applicant_name,
      
      // Enhanced personal information
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      date_of_birth: req.body.date_of_birth,
      phone_verified: req.body.phone_verified === 'true',
      
      // Professional information
      company_organization: req.body.company_organization,
      designation: req.body.designation,
      applied_position: req.body.applied_position,
      current_position: req.body.current_position,
      salary_expectation: req.body.salary_expectation,
      experience_years: parseInt(req.body.experience_years) || 0,
      
      // Application status and metadata
      application_status: req.body.application_status,
      location_details: locationDetails,
      qualification: req.body.qualification,
      referral_code: req.body.referral_code,
      source_website: req.body.source_website,
      applied_date: req.body.applied_date,
      
      // File storage
      uploaded_files: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Handle multiple file uploads
    const fileFields = ['photo', 'id_proof', 'address_proof', 'pan_card'];
    
    if (req.files) {
      for (const fieldName of fileFields) {
        const fileArray = req.files[fieldName];
        if (fileArray && fileArray.length > 0) {
          try {
            const file = fileArray[0];
            const base64Data = file.buffer.toString('base64');
            const timestamp = Date.now();
            const fileExtension = path.extname(file.originalname);
            const filename = `${application.application_id}_${fieldName}_${timestamp}${fileExtension}`;
            
            // Store file data in the application document
            application[`${fieldName}_data`] = base64Data;
            application[`${fieldName}_mimetype`] = file.mimetype;
            application[`${fieldName}_filename`] = filename;
            application[`${fieldName}_original_name`] = file.originalname;
            application.uploaded_files.push(filename);
            
            console.log(`✅ ${fieldName} converted to Base64: ${filename} (${Math.round(base64Data.length / 1024)}KB)`);
            
          } catch (uploadError) {
            console.error(`❌ ${fieldName} upload error:`, uploadError);
            // Continue without this file if upload fails
          }
        }
      }
    }

    // Insert application into MongoDB
    const result = await applications.insertOne(application);
    console.log(`✅ ${isAdvisory ? 'Advisory' : 'Committee'} application saved to MongoDB:`, result.insertedId);
    
    res.json({ 
      success: true, 
      applicationId: application.application_id,
      mongoId: result.insertedId,
      hasPhoto: application.uploaded_files.length > 0,
      formType: application.form_type
    });
    
  } catch (error) {
    console.error('Error saving application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all applications (legacy endpoint - combines both collections)
app.get('/api/applications', async (req, res) => {
  try {
    const committeeApps = await getCommitteeApplicationsCollection();
    const advisoryApps = await getAdvisoryApplicationsCollection();
    
    const committee = await committeeApps.find({}).toArray();
    const advisory = await advisoryApps.find({}).toArray();
    
    const allApplications = [...committee, ...advisory];
    
    res.json({
      success: true,
      data: allApplications,
      total: allApplications.length,
      committee: committee.length,
      advisory: advisory.length
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
});

// Get committee applications only
app.get('/api/applications/committee', async (req, res) => {
  try {
    const committeeApps = await getCommitteeApplicationsCollection();
    const applications = await committeeApps.find({}).toArray();
    
    console.log(`📊 Fetched ${applications.length} committee applications`);
    
    res.json({
      success: true,
      data: applications,
      total: applications.length,
      type: 'committee'
    });
  } catch (error) {
    console.error('❌ Error fetching committee applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch committee applications'
    });
  }
});

// Get advisory applications only
app.get('/api/applications/advisory', async (req, res) => {
  try {
    const advisoryApps = await getAdvisoryApplicationsCollection();
    const applications = await advisoryApps.find({}).toArray();
    
    console.log(`📊 Fetched ${applications.length} advisory applications`);
    
    res.json({
      success: true,
      data: applications,
      total: applications.length,
      type: 'advisory'
    });
  } catch (error) {
    console.error('❌ Error fetching advisory applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch advisory applications'
    });
  }
});

// Update application status
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📝 Updating application ${id} to status: ${status}`);
    
    // Try committee collection first
    const committeeApps = await getCommitteeApplicationsCollection();
    let result = await committeeApps.updateOne(
      { application_id: id },
      { 
        $set: { 
          application_status: status,
          updated_at: new Date().toISOString()
        }
      }
    );
    
    // If not found in committee, try advisory
    if (result.matchedCount === 0) {
      const advisoryApps = await getAdvisoryApplicationsCollection();
      result = await advisoryApps.updateOne(
        { application_id: id },
        { 
          $set: { 
            application_status: status,
            updated_at: new Date().toISOString()
          }
        }
      );
    }
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    console.log(`✅ Application ${id} updated to: ${status}`);
    
    res.json({
      success: true,
      message: `Application status updated to ${status}`
    });
    
  } catch (error) {
    console.error('❌ Error updating application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application'
    });
  }
});

// PATCH endpoint for updating application status (Super Admin)
app.patch('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 PATCH request received for application ${id} with status: ${status}`);
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    if (!['pending', 'approved', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    // Try committee collection first
    const committeeApps = await getCommitteeApplicationsCollection();
    let result = await committeeApps.updateOne(
      { application_id: id },
      { 
        $set: { 
          application_status: status.toLowerCase(),
          updated_at: new Date().toISOString()
        }
      }
    );
    
    let collection = 'committee';
    
    // If not found in committee, try advisory
    if (result.matchedCount === 0) {
      const advisoryApps = await getAdvisoryApplicationsCollection();
      result = await advisoryApps.updateOne(
        { application_id: id },
        { 
          $set: { 
            application_status: status.toLowerCase(),
            updated_at: new Date().toISOString()
          }
        }
      );
      collection = 'advisory';
    }
    
    if (result.matchedCount === 0) {
      console.log(`❌ Application ${id} not found in database`);
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    console.log(`✅ ${collection.toUpperCase()} Application ${id} status updated to: ${status}`);
    
    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: { 
        application_id: id, 
        status: status.toLowerCase(),
        collection: collection
      }
    });
    
  } catch (error) {
    console.error('❌ Error in PATCH /api/applications/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application status'
    });
  }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        error: 'Database connection not available'
      });
    }

    const collection = await getRegistrationsCollection();
    
    const registrations = await collection.find({}).toArray();
    
    res.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('❌ Error fetching registrations from MongoDB:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registrations'
    });
  }
});

// Get registration by ID
app.get('/api/registrations/:id', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        error: 'Database connection not available'
      });
    }

    const collection = await getRegistrationsCollection();
    
    const registration = await collection.findOne({ registration_id: req.params.id });
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    res.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('❌ Error fetching registration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch registration'
    });
  }
});

// Update registration status (for admin)
app.put('/api/registrations/:id/status', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(500).json({
        success: false,
        error: 'Database connection not available'
      });
    }

    const { registration_status, payment_status } = req.body;
    const collection = await getRegistrationsCollection();
    
    const updateFields = {
      updated_at: new Date().toISOString()
    };
    
    if (registration_status) {
      updateFields.registration_status = registration_status;
    }
    if (payment_status) {
      updateFields.payment_status = payment_status;
    }
    
    const result = await collection.updateOne(
      { registration_id: req.params.id },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    // Get updated registration
    const updatedRegistration = await collection.findOne({ registration_id: req.params.id });
    
    console.log(`✅ Registration ${req.params.id} status updated`);
    
    res.json({
      success: true,
      data: updatedRegistration,
      message: 'Registration status updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating registration status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update registration status'
    });
  }
});

// OTP storage
const otpStorage = new Map();

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    otpStorage.set(phoneNumber, {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000
    });
    
    // Fast2SMS API configuration
    const fast2smsApiKey = process.env.FAST2SMS_API_KEY || 'tH2an11rgORVwQE5FT8sHLqOYbn6AexAVGe3Y47JH9BszQM79JsISCg7aqGy';
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    try {
      // Send OTP via Fast2SMS standard API
      const message = `Your LDOIA verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;
      
      const response = await axios.post(
        'https://www.fast2sms.com/dev/bulkV2',
        {
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: phoneNumber.replace(/^\+91/, '') // Remove +91 prefix if present
        },
        {
          headers: {
            'authorization': fast2smsApiKey,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('📱 Fast2SMS Response:', response.data);
      
      if (response.data.return === true) {
        res.json({
          success: true,
          message: 'OTP sent successfully',
          data: {
            message_id: response.data.request_id
          }
        });
      } else {
        throw new Error('Failed to send OTP via Fast2SMS');
      }
      
    } catch (smsError) {
      console.log('⚠️ SMS API Error:', smsError.response?.data || smsError.message);
      
      // For development or when SMS fails, log OTP to console
      console.log(`🔍 [DEV] OTP for ${phoneNumber}: ${otp}`);
      
      res.json({
        success: true,
        message: isDevelopment ? 
          `OTP sent successfully. [DEV] OTP: ${otp}` : 
          'OTP sent successfully',
        data: {
          message_id: 'dev_' + Date.now(),
          ...(isDevelopment && { dev_otp: otp })
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Error in send-otp endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and OTP are required'
      });
    }
    
    const storedOtpData = otpStorage.get(phoneNumber);
    
    if (!storedOtpData) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found or expired'
      });
    }
    
    if (Date.now() > storedOtpData.expires) {
      otpStorage.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        error: 'OTP has expired'
      });
    }
    
    if (storedOtpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP'
      });
    }
    
    // OTP verified successfully, remove from storage
    otpStorage.delete(phoneNumber);
    
    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
    
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP'
    });
  }
});

// Superadmin: Update registration status
app.put('/api/registrations/:id/status', async (req, res) => {
  try {
    const { status, reason, updated_by } = req.body;
    const registrationId = req.params.id;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }
    
    const registrations = await loadRegistrations();
    const registrationIndex = registrations.findIndex(r => r.registration_id === registrationId);
    
    if (registrationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    // Update the registration
    registrations[registrationIndex].registration_status = status;
    registrations[registrationIndex].status_reason = reason;
    registrations[registrationIndex].updated_by = updated_by;
    registrations[registrationIndex].updated_at = new Date().toISOString();
    
    if (status === 'approved') {
      registrations[registrationIndex].approved_at = new Date().toISOString();
      registrations[registrationIndex].login_id = generateLoginId(registrations[registrationIndex]);
      registrations[registrationIndex].login_password = generatePassword();
    }
    
    // Save to MongoDB
    const updateResult = await db.collection('registrations').updateOne(
      { registration_id: registrationId },
      { 
        $set: {
          registration_status: status,
          status_reason: reason,
          updated_by: updated_by,
          updated_at: new Date().toISOString(),
          ...(status === 'approved' && {
            approved_at: new Date().toISOString(),
            login_id: registrations[registrationIndex].login_id,
            login_password: registrations[registrationIndex].login_password
          })
        }
      }
    );
    
    if (updateResult.modifiedCount === 0) {
      // If not found in MongoDB, add it
      await db.collection('registrations').insertOne(registrations[registrationIndex]);
    }
    
    // Also save to JSON file for backward compatibility
    await saveRegistrations(registrations);
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: registrations[registrationIndex]
    });
    
  } catch (error) {
    console.error('❌ Error updating registration status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update registration status'
    });
  }
});

// Superadmin: Delete registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const registrationId = req.params.id;
    
    const registrations = await loadRegistrations();
    const registrationIndex = registrations.findIndex(r => r.registration_id === registrationId);
    
    if (registrationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    // Remove from array
    const deletedRegistration = registrations.splice(registrationIndex, 1)[0];
    
    // Delete from MongoDB
    await db.collection('registrations').deleteOne({ registration_id: registrationId });
    
    // Delete associated files from GridFS if they exist
    if (deletedRegistration.photo_id) {
      try {
        await bucket.delete(new ObjectId(deletedRegistration.photo_id));
      } catch (error) {
        console.log('Photo file not found in GridFS:', error.message);
      }
    }
    
    // Save updated registrations
    await saveRegistrations(registrations);
    
    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting registration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete registration'
    });
  }
});

// Superadmin: Send credentials email (placeholder)
app.post('/api/registrations/:id/send-credentials', async (req, res) => {
  try {
    const registrationId = req.params.id;
    
    const registrations = await loadRegistrations();
    const registration = registrations.find(r => r.registration_id === registrationId);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    if (registration.registration_status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Registration must be approved to send credentials'
      });
    }
    
    // Here you would integrate with email service
    // For now, just log the credentials
    console.log(`📧 Sending credentials to ${registration.email}:`);
    console.log(`Login ID: ${registration.login_id}`);
    console.log(`Password: ${registration.login_password}`);
    
    res.json({
      success: true,
      message: 'Credentials email sent successfully'
    });
    
  } catch (error) {
    console.error('❌ Error sending credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send credentials email'
    });
  }
});

// Helper functions for superadmin
function generateLoginId(registration) {
  const namePrefix = (registration.firstName || registration.name || 'USER').substring(0, 3).toUpperCase();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${namePrefix}${randomNum}`;
}

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Create payment session (placeholder for payment integration)
app.post('/api/registrations/:id/payment', async (req, res) => {
  try {
    const registrations = await loadRegistrations();
    const registration = registrations.find(r => r.registration_id === req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        error: 'Registration not found'
      });
    }
    
    if (registration.registration_status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Registration must be approved before payment'
      });
    }
    
    // Here you would integrate with actual payment gateway
    // For now, we'll return a mock payment URL
    const paymentUrl = `https://payment-gateway.com/pay?id=${req.params.id}&amount=${registration.registration_fee}`;
    
    res.json({
      success: true,
      data: {
        payment_url: paymentUrl,
        amount: registration.registration_fee,
        registration_id: req.params.id
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating payment session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment session'
    });
  }
});

// ==================== COMMITTEE POSITIONS API ====================

// Initialize committee positions with hardcoded data (run once)
app.post('/api/committee/initialize', async (req, res) => {
  try {
    const committeeCollection = await getCommitteePositionsCollection();
    
    // Check if data already exists
    const existingCount = await committeeCollection.countDocuments();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Committee positions already initialized',
        count: existingCount
      });
    }
    
    // Initial committee members data
    const initialCommitteeMembers = [
      // India Level
      { 
        id: 1, 
        post: "President", 
        designation: "", 
        name: "Ingit Dave", 
        phone: "9967477210", 
        photo: "/Ingit Dave.jpeg", 
        contribution: "₹5,00,000", 
        initials: "ID", 
        zone: "", 
        state: "", 
        division: "", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "ID001",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        id: 2, 
        post: "Secretary", 
        designation: "", 
        name: "Rajesh Modi", 
        phone: "9967477227", 
        photo: "/Rajesh Modi.jpeg", 
        contribution: "₹5,00,000", 
        initials: "RM", 
        zone: "", 
        state: "", 
        division: "", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "RM002",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        id: 3, 
        post: "Treasurer", 
        designation: "", 
        name: "Srinivas Shetty", 
        phone: "9820540202", 
        photo: "/Srinivas Shetty.png", 
        contribution: "₹5,00,000", 
        initials: "SS", 
        zone: "", 
        state: "", 
        division: "", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "SS003",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      { 
        id: 4, 
        post: "Chairman", 
        designation: "Land Developer", 
        name: "DB Chand", 
        phone: "9967477213", 
        photo: "/DB Chand.jpeg", 
        contribution: "₹5,00,000", 
        initials: "DC", 
        zone: "", 
        state: "", 
        division: "", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "DC004",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Division Level - Konkan Division, Maharashtra
      { 
        id: 5, 
        post: "Division President", 
        designation: "", 
        name: "Mangesh Chaudhary", 
        phone: "9158884748", 
        photo: "/Mangesh Chaudhary.jpeg", 
        contribution: "₹1,25,000", 
        initials: "MC", 
        zone: "Western", 
        state: "Maharashtra", 
        division: "Konkan", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "MC005",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // State Level - Maharashtra
      { 
        id: 6, 
        post: "State President", 
        designation: "", 
        name: "Rahul Sharma", 
        phone: "9876543210", 
        photo: "/placeholder.svg", 
        contribution: "₹1,50,000", 
        initials: "RS", 
        zone: "Western", 
        state: "Maharashtra", 
        division: "", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "RS006",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      // Zone Level - Western Zone
      { 
        id: 7, 
        post: "Zone President", 
        designation: "", 
        name: "Amit Kumar", 
        phone: "9123456789", 
        photo: "/placeholder.svg", 
        contribution: "₹2,00,000", 
        initials: "AK", 
        zone: "Western", 
        state: "", 
        division: "", 
        district: "", 
        tehsil: "", 
        pincode: "", 
        village: "",
        referral_code: "AK007",
        introduced_count: 0,
        approval_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    // Insert the initial data
    const result = await committeeCollection.insertMany(initialCommitteeMembers);
    console.log('✅ Committee positions initialized successfully');
    
    res.json({
      success: true,
      message: 'Committee positions initialized successfully',
      count: result.insertedCount,
      insertedIds: result.insertedIds
    });
    
  } catch (error) {
    console.error('❌ Error initializing committee positions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize committee positions'
    });
  }
});

// Get all committee positions
app.get('/api/committee/positions', async (req, res) => {
  try {
    const committeeCollection = await getCommitteePositionsCollection();
    // Return only actual data from database, not hardcoded members
    const positions = await committeeCollection.find({}).sort({ created_at: -1 }).toArray();
    
    res.json({
      success: true,
      positions: positions,
      count: positions.length
    });
  } catch (error) {
    console.error('❌ Error fetching committee positions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch committee positions'
    });
  }
});

// Clear all hardcoded committee data (development only)
app.delete('/api/committee/clear-all', async (req, res) => {
  try {
    const committeeCollection = await getCommitteePositionsCollection();
    const result = await committeeCollection.deleteMany({});
    
    console.log(`🗑️ Cleared ${result.deletedCount} hardcoded committee members`);
    
    res.json({
      success: true,
      message: 'All hardcoded committee data cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Error clearing committee data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear committee data'
    });
  }
});

// Verify referral code
app.post('/api/committee/verify-referral', async (req, res) => {
  try {
    const { referral_code } = req.body;
    
    if (!referral_code) {
      return res.status(400).json({
        success: false,
        error: 'Referral code is required'
      });
    }
    
    const committeeCollection = await getCommitteePositionsCollection();
    const referrer = await committeeCollection.findOne({ referral_code: referral_code });
    
    if (!referrer) {
      return res.json({
        success: false,
        message: 'Invalid referral code',
        valid: false
      });
    }
    
    res.json({
      success: true,
      message: 'Valid referral code',
      valid: true,
      referrer: {
        id: referrer.id,
        name: referrer.name,
        post: referrer.post,
        phone: referrer.phone,
        referral_code: referrer.referral_code,
        introduced_count: referrer.introduced_count
      }
    });
    
  } catch (error) {
    console.error('❌ Error verifying referral code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify referral code'
    });
  }
});

// Submit application with referral tracking
app.post('/api/committee/applications', async (req, res) => {
  try {
    const applicationData = req.body;
    
    // Generate application ID
    const applicationId = 'APP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Create application with referral tracking
    const application = {
      ...applicationData,
      application_id: applicationId,
      status: 'pending',
      submitted_at: new Date(),
      approved_at: null,
      approved_by: null
    };
    
    // Save to applications collection
    const applicationsCollection = await getApplicationsWithReferralCollection();
    const result = await applicationsCollection.insertOne(application);
    
    console.log('✅ Application submitted:', applicationId);
    
    res.json({
      success: true,
      message: 'Application submitted successfully',
      application_id: applicationId,
      data: application
    });
    
  } catch (error) {
    console.error('❌ Error submitting application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit application'
    });
  }
});

// Approve application and increment referrer count
app.post('/api/committee/applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;
    
    const applicationsCollection = await getApplicationsWithReferralCollection();
    const committeeCollection = await getCommitteePositionsCollection();
    
    // Find the application
    const application = await applicationsCollection.findOne({ application_id: id });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    if (application.status === 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Application already approved'
      });
    }
    
    // Update application status
    await applicationsCollection.updateOne(
      { application_id: id },
      {
        $set: {
          status: 'approved',
          approved_at: new Date(),
          approved_by: approved_by || 'System'
        }
      }
    );
    
    // If there's a referral code, increment the referrer's count
    if (application.referral_code) {
      const updateResult = await committeeCollection.updateOne(
        { referral_code: application.referral_code },
        {
          $inc: { introduced_count: 1 },
          $set: { updated_at: new Date() }
        }
      );
      
      if (updateResult.modifiedCount > 0) {
        console.log(`✅ Incremented referral count for code: ${application.referral_code}`);
      }
    }
    
    res.json({
      success: true,
      message: 'Application approved successfully',
      application_id: id
    });
    
  } catch (error) {
    console.error('❌ Error approving application:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve application'
    });
  }
});

// Get all applications with referral tracking
app.get('/api/committee/applications', async (req, res) => {
  try {
    const applicationsCollection = await getApplicationsWithReferralCollection();
    const applications = await applicationsCollection
      .find({})
      .sort({ submitted_at: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: applications,
      count: applications.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
});

// Get referral statistics for a committee member
app.get('/api/committee/referral-stats/:referralCode', async (req, res) => {
  try {
    const { referralCode } = req.params;
    
    const committeeCollection = await getCommitteePositionsCollection();
    const applicationsCollection = await getApplicationsWithReferralCollection();
    
    // Get referrer details
    const referrer = await committeeCollection.findOne({ referral_code: referralCode });
    
    if (!referrer) {
      return res.status(404).json({
        success: false,
        error: 'Referral code not found'
      });
    }
    
    // Get applications made with this referral code
    const applications = await applicationsCollection
      .find({ referral_code: referralCode })
      .sort({ submitted_at: -1 })
      .toArray();
    
    const approvedApplications = applications.filter(app => app.status === 'approved');
    const pendingApplications = applications.filter(app => app.status === 'pending');
    
    res.json({
      success: true,
      data: {
        referrer: {
          name: referrer.name,
          post: referrer.post,
          referral_code: referrer.referral_code,
          introduced_count: referrer.introduced_count
        },
        stats: {
          total_applications: applications.length,
          approved_applications: approvedApplications.length,
          pending_applications: pendingApplications.length,
          success_rate: applications.length > 0 ? (approvedApplications.length / applications.length * 100).toFixed(2) : 0
        },
        recent_applications: applications.slice(0, 10) // Last 10 applications
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching referral stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch referral statistics'
    });
  }
});

// Additional endpoints for frontend compatibility

// Get all positions (alias for /api/committee/positions)
app.get('/api/positions', async (req, res) => {
  try {
    const collection = await getCommitteePositionsCollection();
    const positions = await collection.find({ is_active: true }).toArray();
    
    res.json({
      success: true,
      positions: positions
    });
  } catch (error) {
    console.error('❌ Error fetching positions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch positions'
    });
  }
});

// Get advisory applications
app.get('/api/applications/advisory', async (req, res) => {
  try {
    const collection = await getApplicationsWithReferralCollection();
    const applications = await collection.find({}).sort({ created_at: -1 }).toArray();
    
    res.json({
      success: true,
      applications: applications
    });
  } catch (error) {
    console.error('❌ Error fetching advisory applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch advisory applications'
    });
  }
});

// Get members endpoint
app.get('/api/members', async (req, res) => {
  try {
    if (!db) await initializeDatabase();
    const collection = db.collection('members');
    const members = await collection.find({}).toArray();
    
    res.json({
      success: true,
      members: members
    });
  } catch (error) {
    console.error('❌ Error fetching members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch members'
    });
  }
});

// Get member by phone
app.get('/api/members/:phone', async (req, res) => {
  try {
    const { phone } = req.params;
    if (!db) await initializeDatabase();
    const collection = db.collection('members');
    const member = await collection.findOne({ phone: phone });
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    res.json({
      success: true,
      member: member
    });
  } catch (error) {
    console.error('❌ Error fetching member:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch member'
    });
  }
});

// Verify credentials
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!db) await initializeDatabase();
    const collection = db.collection('members');
    const member = await collection.findOne({ phone: phone, password: password });
    
    if (!member) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      member: member
    });
  } catch (error) {
    console.error('❌ Error verifying credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify credentials'
    });
  }
});

// ==================== PROMOTION API ====================

// DEBUG: Check all applications
app.get('/api/debug/applications', async (req, res) => {
  try {
    const committeeApps = await getCommitteeApplicationsCollection();
    const allApps = await committeeApps.find({}).toArray();
    
    const debug = allApps.map(app => ({
      _id: app._id,
      name: app.applicant_name,
      phone: app.phone_number,
      application_status: app.application_status,
      status: app.status,
      allStatusFields: Object.keys(app).filter(k => k.toLowerCase().includes('status'))
    }));
    
    res.json({ success: true, count: allApps.length, applications: debug });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all promotion records with available languages
app.get('/api/promotions/records', async (req, res) => {
  try {
    // Fetch from BOTH committee and advisory collections
    const committeeApps = await getCommitteeApplicationsCollection();
    const advisoryApps = await getAdvisoryApplicationsCollection();
    const promotionImages = await getPromotionImagesCollection();
    
    // Debug: Check total count
    const committeeTotal = await committeeApps.countDocuments({});
    const committeeApproved = await committeeApps.countDocuments({ application_status: 'approved' });
    const advisoryTotal = await advisoryApps.countDocuments({});
    const advisoryApproved = await advisoryApps.countDocuments({ application_status: 'approved' });
    
    console.log(`📊 Committee - Total: ${committeeTotal}, Approved: ${committeeApproved}`);
    console.log(`📊 Advisory - Total: ${advisoryTotal}, Approved: ${advisoryApproved}`);
    
    // Get all approved applications from BOTH collections
    const committeeMembers = await committeeApps.find({ application_status: 'approved' }).toArray();
    const advisoryMembers = await advisoryApps.find({ application_status: 'approved' }).toArray();
    
    // Combine both arrays
    const allMembers = [...committeeMembers, ...advisoryMembers];
    
    console.log(`✅ Found ${committeeMembers.length} committee + ${advisoryMembers.length} advisory = ${allMembers.length} total approved members`);
    
    // Get all promotion images
    const images = await promotionImages.find({}).toArray();
    
    // Create a map of available images by language and date
    const imageMap = {};
    images.forEach(img => {
      const dateKey = new Date(img.uploadDate).toISOString().split('T')[0];
      if (!imageMap[dateKey]) {
        imageMap[dateKey] = new Set();
      }
      imageMap[dateKey].add(img.language);
    });
    
    // Build promotion records
    const promotionRecords = allMembers.map(member => {
      const memberDate = new Date(member.applied_date || member.created_at || member.updated_at).toISOString().split('T')[0];
      const availableLanguages = imageMap[memberDate] || new Set();
      
      return {
        _id: member._id.toString(),
        name: member.applicant_name || member.name,
        phone: member.phone_number || member.phone,
        date: memberDate,
        photo: member.photo_data ? `data:${member.photo_mimetype};base64,${member.photo_data}` : null,
        location: member.location_details || {},
        availableLanguages: {
          hindi: availableLanguages.has('hindi'),
          english: availableLanguages.has('english'),
          marathi: availableLanguages.has('marathi'),
          gujarati: availableLanguages.has('gujarati'),
          tamil: availableLanguages.has('tamil'),
          telugu: availableLanguages.has('telugu'),
          kannada: availableLanguages.has('kannada'),
          bengali: availableLanguages.has('bengali'),
          odia: availableLanguages.has('odia'),
          urdu: availableLanguages.has('urdu')
        }
      };
    });
    
    console.log(`📊 Fetched ${promotionRecords.length} promotion records (${committeeMembers.length} committee + ${advisoryMembers.length} advisory)`);
    
    res.json({
      success: true,
      records: promotionRecords
    });
    
  } catch (error) {
    console.error('❌ Error fetching promotion records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch promotion records'
    });
  }
});

// Upload promotion image for a specific language
app.post('/api/promotions/upload-image', upload.single('image'), async (req, res) => {
  try {
    const { language, date } = req.body;
    
    if (!language || !date) {
      return res.status(400).json({
        success: false,
        error: 'Language and date are required'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image file is required'
      });
    }
    
    const promotionImages = await getPromotionImagesCollection();
    
    // Convert image to base64
    const base64Image = req.file.buffer.toString('base64');
    
    // Check if image already exists for this language and date
    const existing = await promotionImages.findOne({
      language: language,
      uploadDate: date
    });
    
    if (existing) {
      // Update existing image
      await promotionImages.updateOne(
        { _id: existing._id },
        {
          $set: {
            imageData: base64Image,
            mimetype: req.file.mimetype,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`✅ Updated promotion image for ${language} on ${date}`);
      
      res.json({
        success: true,
        message: 'Promotion image updated successfully',
        imageId: existing._id.toString()
      });
    } else {
      // Insert new image
      const result = await promotionImages.insertOne({
        language: language,
        imageData: base64Image,
        mimetype: req.file.mimetype,
        uploadDate: date,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Uploaded promotion image for ${language} on ${date}`);
      
      res.json({
        success: true,
        message: 'Promotion image uploaded successfully',
        imageId: result.insertedId.toString()
      });
    }
    
  } catch (error) {
    console.error('❌ Error uploading promotion image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload promotion image'
    });
  }
});

// Check if promotion image exists for language and date
app.get('/api/promotions/check-image', async (req, res) => {
  try {
    const { language, date } = req.query;
    
    if (!language || !date) {
      return res.status(400).json({
        success: false,
        error: 'Language and date are required'
      });
    }
    
    const promotionImages = await getPromotionImagesCollection();
    const image = await promotionImages.findOne({
      language: language,
      uploadDate: date
    });
    
    res.json({
      success: true,
      available: !!image
    });
    
  } catch (error) {
    console.error('❌ Error checking promotion image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check promotion image'
    });
  }
});

// Generate promotion card (combines template + member info)
app.get('/api/promotions/generate', async (req, res) => {
  try {
    const { memberId, language, date } = req.query;
    
    if (!memberId || !language || !date) {
      return res.status(400).json({
        success: false,
        error: 'Member ID, language, and date are required'
      });
    }
    
    // Get member details
    const committeeApps = await getCommitteeApplicationsCollection();
    const advisoryApps = await getAdvisoryApplicationsCollection();
    
    console.log(`🔍 Looking for member with ID: ${memberId}`);
    
    let member = await committeeApps.findOne({ _id: new ObjectId(memberId) });
    let memberType = 'committee';
    
    if (!member) {
      member = await advisoryApps.findOne({ _id: new ObjectId(memberId) });
      memberType = 'advisory';
    }
    
    if (!member) {
      console.log(`❌ Member not found with ID: ${memberId}`);
      return res.status(404).json({
        success: false,
        error: 'Member not found'
      });
    }
    
    console.log(`✅ Found ${memberType} member: ${member.applicant_name || member.name}`);
    console.log(`📞 Phone: ${member.phone_number || member.phone}`);
    console.log(`📸 Has photo: ${!!member.photo_data}`);
    
    // Get promotion template image
    const promotionImages = await getPromotionImagesCollection();
    const templateImage = await promotionImages.findOne({
      language: language,
      uploadDate: date
    });
    
    if (!templateImage) {
      return res.status(404).json({
        success: false,
        error: 'Promotion template not found for this language and date'
      });
    }
    
    // Prepare template image
    const templateBuffer = Buffer.from(templateImage.imageData, 'base64');
    
    // Get template image dimensions
    const templateMetadata = await sharp(templateBuffer).metadata();
    const templateWidth = templateMetadata.width;
    const templateHeight = templateMetadata.height;
    
    // Calculate dimensions (80% template, 20% member details)
    const templateDisplayHeight = Math.floor(templateHeight * 0.8);
    const memberSectionHeight = templateHeight - templateDisplayHeight;
    
    // Resize template to 80% height
    const resizedTemplate = await sharp(templateBuffer)
      .resize(templateWidth, templateDisplayHeight, { fit: 'cover', position: 'top' })
      .toBuffer();
    
    // Create member details section (20% at bottom)
    // Background color: white/cream
    const memberName = member.applicant_name || member.name || 'Member';
    const memberPhone = member.phone_number || member.phone || '';
    const memberDate = new Date(date).toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    
    // Prepare member photo (left side of bottom section)
    let memberPhotoBuffer = null;
    const photoSize = Math.floor(memberSectionHeight * 0.8); // 80% of bottom section height
    const photoLeftMargin = Math.floor(templateWidth * 0.05); // 5% from left
    const photoTopMargin = Math.floor(memberSectionHeight * 0.1); // 10% from top of section
    
    if (member.photo_data) {
      try {
        const originalPhotoBuffer = Buffer.from(member.photo_data, 'base64');
        // Resize and make circular
        memberPhotoBuffer = await sharp(originalPhotoBuffer)
          .resize(photoSize, photoSize, { fit: 'cover' })
          .composite([{
            input: Buffer.from(`<svg width="${photoSize}" height="${photoSize}">
              <circle cx="${photoSize/2}" cy="${photoSize/2}" r="${photoSize/2}" fill="white"/>
            </svg>`),
            blend: 'dest-in'
          }])
          .toBuffer();
      } catch (err) {
        console.error('Error processing member photo:', err);
      }
    }
    
    // Create SVG for text overlay (member details on the right side)
    const fontSize = Math.floor(memberSectionHeight * 0.2); // 20% of section height for name
    const smallFontSize = Math.floor(memberSectionHeight * 0.14); // 14% of section height
    const textLeftPosition = photoLeftMargin + photoSize + Math.floor(templateWidth * 0.05); // After photo + margin
    const textTopPosition = Math.floor(memberSectionHeight * 0.3); // 30% from top
    
    console.log(`📝 Member details: ${memberName}, ${memberPhone}`);
    
    const textSvg = `
    <svg width="${templateWidth}" height="${memberSectionHeight}">
      <rect width="${templateWidth}" height="${memberSectionHeight}" fill="#FEF3C7"/>
      
      <!-- Orange square placeholder for photo area (shown if no photo) -->
      ${!memberPhotoBuffer ? `<rect x="${photoLeftMargin}" y="${photoTopMargin}" width="${photoSize}" height="${photoSize}" fill="#FB923C" rx="10"/>` : ''}
      
      <!-- User Name -->
      <text x="${textLeftPosition}" y="${textTopPosition}" 
            font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#78350F">
        ${memberName}
      </text>
      
      <!-- Mobile Number Label -->
      <text x="${textLeftPosition}" y="${textTopPosition + fontSize + 15}" 
            font-family="Arial, sans-serif" font-size="${smallFontSize}" fill="#92400E">
        Mobile No.
      </text>
      
      <!-- Mobile Number Value -->
      <text x="${textLeftPosition}" y="${textTopPosition + fontSize + smallFontSize + 30}" 
            font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="600" fill="#451A03">
        ${memberPhone}
      </text>
    </svg>`;
    
    const textBuffer = Buffer.from(textSvg);
    
    // Composite the final image
    const compositeInputs = [
      { input: textBuffer, top: 0, left: 0 }
    ];
    
    // Add member photo if available
    if (memberPhotoBuffer) {
      compositeInputs.push({
        input: memberPhotoBuffer,
        top: photoTopMargin,
        left: photoLeftMargin
      });
    }
    
    // Create bottom section with member details
    const bottomSection = await sharp({
      create: {
        width: templateWidth,
        height: memberSectionHeight,
        channels: 4,
        background: { r: 254, g: 243, b: 199, alpha: 1 }
      }
    })
    .composite(compositeInputs)
    .png()
    .toBuffer();
    
    // Combine template (top 80%) and member details (bottom 20%)
    const finalImage = await sharp({
      create: {
        width: templateWidth,
        height: templateHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([
      { input: resizedTemplate, top: 0, left: 0 },
      { input: bottomSection, top: templateDisplayHeight, left: 0 }
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
    
    // Send the final composite image
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="Promotion_${memberName.replace(/\s+/g, '_')}_${language}_${memberDate.replace(/\s+/g, '_')}.jpg"`);
    res.send(finalImage);
    
    console.log(`✅ Generated promotion card for ${memberName} in ${language}`);
    
  } catch (error) {
    console.error('❌ Error generating promotion card:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate promotion card',
      details: error.message
    });
  }
});

// Get all promotion images (Super Admin)
app.get('/api/promotions/images', async (req, res) => {
  try {
    const promotionImages = await getPromotionImagesCollection();
    const images = await promotionImages.find({}).toArray();
    
    // Don't send full image data, just metadata
    const imageList = images.map(img => ({
      _id: img._id.toString(),
      language: img.language,
      uploadDate: img.uploadDate,
      mimetype: img.mimetype,
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
      size: img.imageData ? img.imageData.length : 0
    }));
    
    res.json({
      success: true,
      images: imageList,
      count: imageList.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching promotion images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch promotion images'
    });
  }
});

// Delete promotion image (Super Admin)
app.delete('/api/promotions/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const promotionImages = await getPromotionImagesCollection();
    const result = await promotionImages.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Promotion image not found'
      });
    }
    
    console.log(`✅ Deleted promotion image: ${id}`);
    
    res.json({
      success: true,
      message: 'Promotion image deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting promotion image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete promotion image'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LDOIA Registration Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Registrations API: http://localhost:${PORT}/api/registrations`);
});

module.exports = app;
