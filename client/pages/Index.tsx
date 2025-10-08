import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Users, MapPin, Award, Building, Briefcase, UserCheck, Crown, Shield, Eye, Target, Building2, Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { locationData } from "@/data/locationData";
import LanguageSelector from "@/components/LanguageSelector";
import CommitteeTable from "@/components/CommitteeTable";
import AdvisoryTable from "@/components/AdvisoryTable";
import { cn } from "@/lib/utils";
import committeeAPI, { applicationAPI as superAdminAPI } from "@/services/committee-api";
import { applicationAPI } from "@/services/api";

// Define types
interface CommitteeMember {
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
}

interface AdvisoryMember extends CommitteeMember {
  currentDesignation?: string;
}

const positionFees = [
  { titleKey: "position.chairman", fee: "₹2,00,000", icon: Crown, color: "bg-gradient-to-r from-ldoai-orange to-ldoai-pink", descKey: "positionDesc.chairman" },
  { titleKey: "position.secretary", fee: "₹1,50,000", icon: Shield, color: "bg-gradient-to-r from-ldoai-blue to-ldoai-purple", descKey: "positionDesc.secretary" },
  { titleKey: "position.treasurer", fee: "₹1,00,000", icon: Briefcase, color: "bg-gradient-to-r from-ldoai-green to-ldoai-cyan", descKey: "positionDesc.treasurer" },
  { titleKey: "position.avcCore", fee: "₹75,000", icon: UserCheck, color: "bg-gradient-to-r from-ldoai-purple to-ldoai-pink", descKey: "positionDesc.avcCore" },
  { titleKey: "position.avcSupport", fee: "₹50,000", icon: Users, color: "bg-gradient-to-r from-ldoai-cyan to-ldoai-blue", descKey: "positionDesc.avcSupport" },
  { titleKey: "position.advisory", fee: "₹25,000", icon: Award, color: "bg-gradient-to-r from-ldoai-green to-ldoai-orange", descKey: "positionDesc.advisory" },
  { titleKey: "position.regular", fee: "₹10,000", icon: Building, color: "bg-gradient-to-r from-ldoai-blue to-ldoai-green", descKey: "positionDesc.regular" }
];

const membershipTypes = [
  { type: "Individual Membership", fee: "₹5,000 - ₹10,000", benefits: ["Voting Rights", "Networking Events", "Advisory Access", "Legal Support"] },
  { type: "Corporate Membership", fee: "₹15,000 - ₹25,000", benefits: ["Business Networking", "Government Liaison", "Industry Updates", "Priority Support"] }
];



export default function Index() {
  // State variables
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDiv, setSelectedDiv] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTehsil, setSelectedTehsil] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // Popover open states for searchable dropdowns
  const [zoneOpen, setZoneOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [divOpen, setDivOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [tehsilOpen, setTehsilOpen] = useState(false);
  const [pincodeOpen, setPincodeOpen] = useState(false);

  // Search state variables
  const [searchZone, setSearchZone] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchDivision, setSearchDivision] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchTehsil, setSearchTehsil] = useState("");
  const [searchPincode, setSearchPincode] = useState("");
  const [searchPostOffice, setSearchPostOffice] = useState("");

  // Name and Phone search for committee table
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  
  // Dropdown state for Others column
  const [openDropdown, setOpenDropdown] = useState("");

  // Application management state with loading indicators
  const [applications, setApplications] = useState<Record<string, any>>(() => {
    // 🚀 Load from localStorage immediately for instant display
    try {
      const cached = localStorage.getItem('ldoia_applications');
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('🚀 Loaded applications from cache:', Object.keys(parsed).length, 'entries');
        return parsed;
      }
    } catch (error) {
      console.log('ℹ️ No cached applications found');
    }
    return {};
  });
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [advisoryApplications, setAdvisoryApplications] = useState<any[]>(() => {
    // 🚀 Load advisory applications from localStorage immediately for instant display
    try {
      const cached = localStorage.getItem('ldoia_advisory_applications');
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('🚀 Loaded advisory applications from cache:', parsed.length, 'entries');
        return parsed;
      }
    } catch (error) {
      console.log('ℹ️ No cached advisory applications found');
    }
    return [];
  });
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationPosition, setApplicationPosition] = useState<string>("");
  const [applicationFee, setApplicationFee] = useState<string>("");
  
  // Enhanced application form data
  const [applicationData, setApplicationData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    photo: null as File | null,
    
    // Professional Information  
    company: "",
    designation: "",
    experience: "",
    
    // Location Information
    formCountry: "India",
    formState: "",
    formDivision: "",
    formDistrict: "",
    formCity: "",
    formPincode: "",
    completeAddress: "",
    
    // Document Upload
    idProof: null as File | null,
    addressProof: null as File | null,
    panCard: null as File | null,
    
    // Legacy fields for backward compatibility
    name: "",
    qualifications: "",
    referralCode: ""
  });

  // OTP Verification state
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  // Edit functionality state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMemberData, setEditMemberData] = useState({
    memberName: "",
    applicantId: "",
    password: "",
    verificationStep: "credentials", // "credentials" or "edit"
    // Edit form data
    id: null as number | null,
    isCommittee: false,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: null as File | null,
    company: "",
    designation: "",
    completeAddress: ""
  });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [editOtpValue, setEditOtpValue] = useState("");
  const [isEditOtpVerified, setIsEditOtpVerified] = useState(false);

  // Forgot Password state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("phone"); // "phone", "otp", "newPassword"
  const [forgotPasswordData, setForgotPasswordData] = useState({
    phoneNumber: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  
  // Custom passwords storage (in real app, this would be in database)
  const [customPasswords, setCustomPasswords] = useState<{[phoneNumber: string]: string}>({});

  // Candidate Applications Management states
  const [candidateApplications, setCandidateApplications] = useState<any[]>([]);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [candidateDocuments, setCandidateDocuments] = useState<any[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  // Referral System states
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [selectedMemberReferral, setSelectedMemberReferral] = useState<any>(null);
  const [referralCode, setReferralCode] = useState('');

//   // Full Width Banner Carousel state
// const [currentSlide, setCurrentSlide] = useState(0);
// const [isAutoPlaying, setIsAutoPlaying] = useState(true);

// const slides = [
//   {
//     // images: ['/Carousel3.png', '/Carousel4.png']
//     images: ['/carousel7.png','/carousel6.png'], // Slide 1 → two banners side by side
//   },
//   {
//     images: ['/Carousel3.png', '/Carousel4.png'], // Slide 2 → two banners side by side
//   },
// ];

  // Helper function to calculate days since approval
  const calculateDaysSinceApproval = (approvedDate: string) => {
    if (!approvedDate) return 0;
    const approved = new Date(approvedDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - approved.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper function to create application keys with location context
  const getApplicationKey = (position: string) => {
    // Create a unique key based on position and location
    const locationContext = [
      (selectedCountry || 'india').toLowerCase(), // Ensure lowercase for consistency
      selectedZone || 'all',
      selectedState || 'all', 
      selectedDiv || 'all',
      selectedDistrict || 'all',
      selectedTehsil || 'all',
      selectedPincode || 'all',
      selectedVillage || 'all'
    ].join('-');
    
    const positionKey = position.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
      
    return `${locationContext}-${positionKey}`;
  };

  // Helper function to get image source (handles both File objects and URLs)
  const getImageSrc = (application: any) => {
    if (application?.photo && application.photo instanceof File) {
      // For newly uploaded files (File objects)
      return URL.createObjectURL(application.photo);
    } else if (application?.photo && typeof application.photo === 'string' && application.photo.startsWith('data:')) {
      // For Base64 data URLs stored in photo field (from database)
      return application.photo;
    } else if (application?.photo_data && application?.photo_mimetype) {
      // For Base64 data stored in photo_data field (from MongoDB)
      return `data:${application.photo_mimetype};base64,${application.photo_data}`;
    } else if (application?.photo_data) {
      // For Base64 data stored in photo_data field (from MongoDB) 
      const mimeType = application.photo_mimetype || 'image/jpeg';
      return `data:${mimeType};base64,${application.photo_data}`;
    } else if (application?.photoUrl) {
      // For images loaded from database (Base64 URLs) - legacy format
      return application.photoUrl;
    } else if (application?.photo && typeof application.photo === 'string') {
      // For other string formats or URLs
      return application.photo;
    }
    return '/placeholder.svg';
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click is outside the dropdown container
      if (openDropdown && !target.closest('.dropdown-container')) {
        setOpenDropdown('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);

  // Update name field when firstName or lastName changes
  useEffect(() => {
    const fullName = `${applicationData.firstName} ${applicationData.lastName}`.trim();
    if (fullName && fullName !== applicationData.name) {
      setApplicationData(prev => ({ ...prev, name: fullName }));
    }
  }, [applicationData.firstName, applicationData.lastName]);

  // Load applications from MongoDB when component mounts
  useEffect(() => {
    const loadApplicationsFromDatabase = async () => {
      try {
        console.log('📥 Fetching applications from API...');
        setIsLoadingApplications(true);
        
        // Use environment-based API URL
        const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
          : 'http://localhost:3001/api/applications';

        console.log('📡 Loading applications from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Applications loaded from database:', result);
          console.log('📊 Applications state before render:', Object.keys(applications).length);
          
          if (result.success && result.data) {
            // Convert MongoDB applications to local application format
            const loadedApplications: Record<string, any> = {};
            
            result.data.forEach((app: any) => {
              // Create application key from stored location data
              // IMPORTANT: Must use position_location (where they applied), not location_details
              const locationData = app.position_location || app.location_details || {};
              
              const locationContext = [
                (locationData.country || locationData.selection_country || 'india').toLowerCase(),
                locationData.zone || locationData.selection_zone || 'all',
                locationData.state || locationData.selection_state || 'all', 
                locationData.division || locationData.selection_division || 'all',
                locationData.district || locationData.selection_district || 'all',
                locationData.tehsil || locationData.selection_tehsil || 'all',
                locationData.pincode || locationData.selection_pincode || 'all',
                locationData.village || locationData.selection_village || 'all'
              ].join('-');
              
              const positionKey = (app.applied_position || app.position || '').toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
                
              const applicationKey = `${locationContext}-${positionKey}`;
              
              console.log(`🔑 Loading from DB - Position: ${app.applied_position || app.position}, Key: ${applicationKey}`);
              
              // Only store if position key doesn't exist or if this application is more recent
              if (!loadedApplications[applicationKey] || 
                  new Date(app.applied_date || 0) > new Date(loadedApplications[applicationKey].appliedDate || 0)) {
                loadedApplications[applicationKey] = {
                  id: app._id || app.application_id,
                  position: app.applied_position,
                  name: app.applicant_name,
                  phone: app.phone_number,
                  email: app.email,
                  experience: app.experience_years?.toString() || "",
                  qualifications: app.qualification || "",
                  referralCode: app.referral_code || "",
                  status: app.application_status || "pending",
                  appliedDate: app.applied_date,
                  photo: app.photo_data ? `data:${app.photo_mimetype || 'image/jpeg'};base64,${app.photo_data}` : null,
                  photoUrl: app.photo_url || null // Store both file object (for new uploads) and URL (for loaded data)
                };
              }
            });
            
            setApplications(loadedApplications);
            
            // 💾 Cache to localStorage for instant reload
            try {
              localStorage.setItem('ldoia_applications', JSON.stringify(loadedApplications));
              console.log('💾 Applications cached to localStorage');
            } catch (error) {
              console.log('⚠️ Could not cache applications:', error);
            }
            
            console.log('✅ Applications loaded successfully:', Object.keys(loadedApplications).length, 'applications');
            console.log('📊 Applications state after render:', Object.keys(loadedApplications).length);
          }
        } else {
          console.log('ℹ️ No applications found or server not available');
        }
      } catch (error) {
        console.log('ℹ️ Could not load applications from database:', error.message);
        // Keep cached data if API fails
        console.log('📊 Using cached applications:', Object.keys(applications).length);
      } finally {
        setIsLoadingApplications(false);
        setIsInitialLoad(false);
      }
    };

    loadApplicationsFromDatabase();
    
    // Load candidate applications for the admin panel
    const loadCandidateApplications = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
          : 'http://localhost:3001/api/applications';

        const response = await fetch(apiUrl);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setCandidateApplications(result.data);
            console.log('✅ Candidate applications loaded:', result.data.length);
          }
        }
      } catch (error) {
        console.log('ℹ️ Could not load candidate applications:', error.message);
      }
    };
    
    loadCandidateApplications();
  }, []);

  // {/* Carousel auto-play effect */}
  // useEffect(() => {
  //   if (!isAutoPlaying) return;

  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //   }, 5000); // Change slide every 5 seconds (increased from 4 for better UX)

  //   return () => clearInterval(timer);
  // }, [slides.length, isAutoPlaying]);

  // Committee members database - loaded from MongoDB
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [isCommitteeLoading, setIsCommitteeLoading] = useState(true);

  // Load committee positions from MongoDB on component mount
  useEffect(() => {
    const initializeAndLoadCommitteePositions = async () => {
      try {
        setIsCommitteeLoading(true);
        
        // Load ALL applications from MongoDB (pending + approved)
        const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
          : 'http://localhost:3001/api/applications';
        
        const response = await fetch(apiUrl);
        if (response.ok) {
          const result = await response.json();
          const allApplications = result.data || [];
          
          // Convert applications to committee member format for display
          const members = allApplications.map((app: any) => ({
            id: app._id || app.application_id,
            name: app.applicant_name || app.name,
            phone: app.phone_number || app.phone,
            email: app.email_address || app.email,
            post: app.applied_position || app.position,
            company: app.company_organization || app.company,
            designation: app.current_position || app.designation,
            photo: app.photo_data,
            photo_mimetype: app.photo_mimetype,
            // Use position_location (where they applied) NOT home_address or location_details
            zone: app.position_location?.zone || '',
            state: app.position_location?.state || '',
            division: app.position_location?.division || '',
            district: app.position_location?.district || '',
            tehsil: app.position_location?.tehsil || '',
            pincode: app.position_location?.pincode || '',
            village: app.position_location?.village || '',
            approvedDate: app.updated_at || app.created_at,
            applicationStatus: app.application_status || 'pending',
            contribution: app.salary_expectation || app.Position_fee
          }));
          
          setCommitteeMembers(members);
          console.log('✅ Loaded all applications as committee members:', members.length);
          
          // NOTE: Don't overwrite applications state here! 
          // The first useEffect already loads applications correctly with proper keys.
          // This would cause a race condition and overwrite instant updates from form submissions.
          
          console.log('ℹ️ Committee members loaded (applications state managed by first useEffect)');
        }
      } catch (error) {
        console.error('❌ Error loading committee data:', error);
        // Show empty array - no hardcoded fallback
        setCommitteeMembers([]);
        // Don't clear applications here - it would erase instant updates!
      } finally {
        setIsCommitteeLoading(false);
      }
    };

    initializeAndLoadCommitteePositions();
  }, []);

  // Load advisory applications from MongoDB only
  useEffect(() => {
    const loadAdvisoryApplications = async () => {
      try {
        console.log('📥 Fetching advisory applications from MongoDB...');
        console.log('📊 Advisory applications state before render:', advisoryApplications.length);
        
        const apps = await applicationAPI.getAdvisoryApplications();
        const loadedApps = Array.isArray(apps) ? apps : [];
        
        setAdvisoryApplications(loadedApps);
        
        // 💾 Cache to localStorage for instant reload
        try {
          localStorage.setItem('ldoia_advisory_applications', JSON.stringify(loadedApps));
          console.log('💾 Advisory applications cached to localStorage');
        } catch (error) {
          console.log('⚠️ Could not cache advisory applications:', error);
        }
        
        console.log('✅ Advisory applications loaded successfully:', loadedApps.length, 'applications');
        console.log('📊 Advisory applications state after render:', loadedApps.length);
      } catch (error) {
        console.error('❌ Error loading advisory applications from MongoDB:', error);
        console.log('📊 Using cached advisory applications:', advisoryApplications.length);
        // Don't clear state on error - keep cached data
      }
    };

    loadAdvisoryApplications();
  }, []);

  // Advisory Committee members - dynamic from applications
  const [advisoryMembers, setAdvisoryMembers] = useState<AdvisoryMember[]>([]);

  // Filter committee members based on search and location
  const getFilteredMembers = () => {
    return committeeMembers.filter(member => {
      // Name and phone filtering
      const nameMatch = searchName === "" || member.name.toLowerCase().includes(searchName.toLowerCase());
      const phoneMatch = searchPhone === "" || member.phone.includes(searchPhone);
      
      // Location filtering based on current selection
      let locationMatch = true;
      
      if (selectedVillage) {
        locationMatch = member.village === selectedVillage;
      } else if (selectedPincode) {
        locationMatch = member.pincode === selectedPincode && !member.village;
      } else if (selectedTehsil) {
        locationMatch = member.tehsil === selectedTehsil && !member.pincode && !member.village;
      } else if (selectedDistrict) {
        locationMatch = member.district === selectedDistrict && !member.tehsil && !member.pincode && !member.village;
      } else if (selectedDiv) {
        locationMatch = member.division === selectedDiv && !member.district && !member.tehsil && !member.pincode && !member.village;
      } else if (selectedState) {
        locationMatch = member.state === selectedState && !member.division && !member.district && !member.tehsil && !member.pincode && !member.village;
      } else if (selectedZone) {
        locationMatch = member.zone === selectedZone && !member.state && !member.division && !member.district && !member.tehsil && !member.pincode && !member.village;
      } else {
        // India level - show members with no specific location
        locationMatch = !member.zone && !member.state && !member.division && !member.district && !member.tehsil && !member.pincode && !member.village;
      }
      
      return nameMatch && phoneMatch && locationMatch;
    });
  };

  // Filter advisory members based on search and location
  const getFilteredAdvisoryMembers = () => {
    return advisoryMembers.filter(member => {
      // Name and phone filtering
      const nameMatch = searchName === "" || member.name.toLowerCase().includes(searchName.toLowerCase());
      const phoneMatch = searchPhone === "" || member.phone.includes(searchPhone);
      
      // Location filtering based on current selection
      let locationMatch = true;
      
      if (selectedVillage) {
        locationMatch = member.village === selectedVillage;
      } else if (selectedPincode) {
        locationMatch = member.pincode === selectedPincode && !member.village;
      } else if (selectedTehsil) {
        locationMatch = member.tehsil === selectedTehsil && !member.pincode && !member.village;
      } else if (selectedDistrict) {
        locationMatch = member.district === selectedDistrict && !member.tehsil && !member.pincode && !member.village;
      } else if (selectedDiv) {
        locationMatch = member.division === selectedDiv && !member.district && !member.tehsil && !member.pincode && !member.village;
      } else if (selectedState) {
        locationMatch = member.state === selectedState && !member.division && !member.district && !member.tehsil && !member.pincode && !member.village;
      } else if (selectedZone) {
        locationMatch = member.zone === selectedZone && !member.state && !member.division && !member.district && !member.tehsil && !member.pincode && !member.village;
      } else {
        // India level - show members with no specific location
        locationMatch = !member.zone && !member.state && !member.division && !member.district && !member.tehsil && !member.pincode && !member.village;
      }
      
      return nameMatch && phoneMatch && locationMatch;
    });
  };

  // Auto-navigate to member's location when search finds a match
  const handleNameSearch = (value: string) => {
    setSearchName(value);
    
    if (value.length >= 2) {
      const matchingMember = committeeMembers.find(member => 
        member.name.toLowerCase().includes(value.toLowerCase())
      );
      
      if (matchingMember) {
        // Auto-navigate to the member's location
        if (matchingMember.zone) setSelectedZone(matchingMember.zone);
        if (matchingMember.state) setSelectedState(matchingMember.state);
        if (matchingMember.division) setSelectedDiv(matchingMember.division);
        if (matchingMember.district) setSelectedDistrict(matchingMember.district);
        if (matchingMember.tehsil) setSelectedTehsil(matchingMember.tehsil);
        if (matchingMember.pincode) setSelectedPincode(matchingMember.pincode);
        if (matchingMember.village) setSelectedVillage(matchingMember.village);
        
        // Auto-scroll to the member row after a small delay
        setTimeout(() => {
          const memberRow = document.querySelector(`[data-member-id="${matchingMember.id}"]`);
          if (memberRow) {
            memberRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add highlight effect
            memberRow.classList.add('bg-yellow-200');
            setTimeout(() => {
              memberRow.classList.remove('bg-yellow-200');
            }, 3000);
          }
        }, 100);
      }
    }
  };

  const handlePhoneSearch = (value: string) => {
    setSearchPhone(value);
    
    if (value.length >= 3) {
      const matchingMember = committeeMembers.find(member => 
        member.phone.includes(value)
      );
      
      if (matchingMember) {
        // Auto-navigate to the member's location
        if (matchingMember.zone) setSelectedZone(matchingMember.zone);
        if (matchingMember.state) setSelectedState(matchingMember.state);
        if (matchingMember.division) setSelectedDiv(matchingMember.division);
        if (matchingMember.district) setSelectedDistrict(matchingMember.district);
        if (matchingMember.tehsil) setSelectedTehsil(matchingMember.tehsil);
        if (matchingMember.pincode) setSelectedPincode(matchingMember.pincode);
        if (matchingMember.village) setSelectedVillage(matchingMember.village);
        
        // Auto-scroll to the member row after a small delay
        setTimeout(() => {
          const memberRow = document.querySelector(`[data-member-id="${matchingMember.id}"]`);
          if (memberRow) {
            memberRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add highlight effect
            memberRow.classList.add('bg-yellow-200');
            setTimeout(() => {
              memberRow.classList.remove('bg-yellow-200');
            }, 3000);
          }
        }, 100);
      }
    }
  };


  // Helper function to get all states from all zones
  const getAllStates = () => {
    const allStates = [];
    Object.values(zoneStatesMapping).forEach(states => {
      allStates.push(...states);
    });
    return allStates.sort();
  };

  // Helper function to get zone for a state
  const getZoneForState = (stateName) => {
    for (const [zone, states] of Object.entries(zoneStatesMapping)) {
      if (states.includes(stateName)) {
        return zone;
      }
    }
    return null;
  };

  // Helper function to get all divisions from all states
  const getAllDivisions = () => {
    const allDivisions = [];
    Object.values(locationData.divisions).forEach(divisions => {
      allDivisions.push(...divisions);
    });
    return [...new Set(allDivisions)].sort();
  };

  // Helper function to get divisions for a specific state
  const getDivisionsForState = (stateName) => {
    if (!stateName) {
      return getAllDivisions(); // Show all divisions when no state is selected
    }
    return locationData.divisions[stateName] || [];
  };

  // Helper function to get all districts from all divisions
  const getAllDistricts = () => {
    const allDistricts = [];
    Object.values(locationData.districts).forEach(districts => {
      allDistricts.push(...districts);
    });
    return [...new Set(allDistricts)].sort();
  };

  // Helper function to get districts for a specific division
  const getDistrictsForDivision = (divisionName) => {
    if (!divisionName) {
      return getAllDistricts(); // Show all districts when no division is selected
    }
    return locationData.districts[divisionName] || [];
  };

  // Helper function to get all tehsils from all districts
  const getAllTehsils = () => {
    const allTehsils = [];
    Object.values(locationData.cities).forEach(cities => {
      allTehsils.push(...cities);
    });
    return [...new Set(allTehsils)].sort();
  };

  // Helper function to get tehsils for a specific district
  const getTehsilsForDistrict = (districtName) => {
    if (!districtName) {
      return getAllTehsils(); // Show all tehsils when no district is selected
    }
    return locationData.cities[districtName] || [];
  };

  // Helper function to get all pincodes from all tehsils
  const getAllPincodes = () => {
    const allPincodes = [];
    Object.values(locationData.pincodes).forEach(pincodes => {
      allPincodes.push(...pincodes);
    });
    return [...new Set(allPincodes)].sort();
  };

  // Helper function to get pincodes for a specific tehsil
  const getPincodesForTehsil = (tehsilName) => {
    if (!tehsilName) {
      return getAllPincodes(); // Show all pincodes when no tehsil is selected
    }
    return locationData.pincodes[tehsilName] || [];
  };

  // Helper function to get state for a division
  const getStateForDivision = (divisionName) => {
    for (const [stateName, divisions] of Object.entries(locationData.divisions)) {
      if (divisions.includes(divisionName)) {
        return stateName;
      }
    }
    return null;
  };

  // Helper function to get division for a district
  const getDivisionForDistrict = (districtName) => {
    for (const [divisionName, districts] of Object.entries(locationData.districts)) {
      if (districts.includes(districtName)) {
        return divisionName;
      }
    }
    return null;
  };

  // Helper function to get district for a tehsil
  const getDistrictForTehsil = (tehsilName) => {
    for (const [districtName, cities] of Object.entries(locationData.cities)) {
      if (cities.includes(tehsilName)) {
        return districtName;
      }
    }
    return null;
  };

  // Helper function to get tehsil for a pincode
  const getTehsilForPincode = (pincodeName) => {
    for (const [tehsilName, pincodes] of Object.entries(locationData.pincodes)) {
      if (pincodes.includes(pincodeName)) {
        return tehsilName;
      }
    }
    return null;
  };
  const zoneStatesMapping = {
    "Northern": [
      "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Ladakh", 
      "Punjab", "Rajasthan", "Delhi", "Chandigarh"
    ],
    "Central": [
      "Chhattisgarh", "Madhya Pradesh", "Uttar Pradesh", "Uttarakhand"
    ],
    "Eastern": [
      "Bihar", "Jharkhand", "Odisha", "West Bengal"
    ],
    "Western": [
      "Goa", "Gujarat", "Maharashtra", "Dadra and Nagar Haveli", "Daman and Diu"
    ],
    "Southern": [
      "Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", 
      "Puducherry", "Andaman and Nicobar Islands", "Lakshadweep"
    ],
    "North Eastern": [
      "Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", 
      "Mizoram", "Nagaland", "Tripura", "Sikkim"
    ]
  };

  // Helper function to get states for a specific zone
  const getStatesForZone = (zoneName) => {
    if (!zoneName) {
      return getAllStates(); // Show all states when no zone is selected
    }
    return zoneStatesMapping[zoneName] || [];
  };

  // Reset selections function
  const resetSelections = (level: string) => {
    switch (level) {
      case "country":
        setSelectedZone("");
        setSelectedState("");
        setSelectedDiv("");
        setSelectedDistrict("");
        setSelectedTehsil("");
        setSelectedPincode("");
        setSelectedVillage("");
        break;
      case "zone":
        setSelectedState("");
        setSelectedDiv("");
        setSelectedDistrict("");
        setSelectedTehsil("");
        setSelectedPincode("");
        setSelectedVillage("");
        break;
      case "state":
        setSelectedDiv("");
        setSelectedDistrict("");
        setSelectedTehsil("");
        setSelectedPincode("");
        setSelectedVillage("");
        break;
      case "div":
        setSelectedDistrict("");
        setSelectedTehsil("");
        setSelectedPincode("");
        setSelectedVillage("");
        break;
      case "district":
        setSelectedTehsil("");
        setSelectedPincode("");
        setSelectedVillage("");
        break;
      case "tehsil":
        setSelectedPincode("");
        setSelectedVillage("");
        break;
      case "pincode":
        setSelectedVillage("");
        break;
    }
  };

  // OTP Verification functions
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    return otp;
  };

  const sendOtp = async () => {
    if (!applicationData.phone || applicationData.phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setOtpLoading(true);
    const otp = generateOtp();
    
    try {
      // Try to send via SMS API (you can integrate with services like Twilio, AWS SNS, etc.)
      const smsApiUrl = import.meta.env.VITE_BACKEND_API_URL 
        ? `${import.meta.env.VITE_BACKEND_API_URL}/send-sms`
        : 'http://localhost:3001/api/send-sms';

      const smsResponse = await fetch(smsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: applicationData.phone,
          otp: otp,
          message: `Your LDOIA verification code is: ${otp}. Please do not share this code with anyone.`
        })
      });

      if (smsResponse.ok) {
        console.log(`OTP sent via SMS to ${applicationData.phone}: ${otp}`);
        alert(`OTP has been sent to ${applicationData.phone}`);
      } else {
        // Fallback: show OTP in alert for development/testing
        console.log(`OTP for ${applicationData.phone}: ${otp}`);
        alert(`Your OTP is: ${otp}\n(SMS service unavailable - showing OTP for testing)`);
      }
      
      setShowOtpVerification(true);
    } catch (error) {
      // Fallback: show OTP in alert
      console.log(`OTP for ${applicationData.phone}: ${otp}`);
      alert(`Your OTP is: ${otp}\n(SMS service unavailable - showing OTP for testing)`);
      setShowOtpVerification(true);
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = () => {
    if (otpValue === generatedOtp) {
      setIsOtpVerified(true);
      setShowOtpVerification(false);
      alert("Phone number verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
      setOtpValue("");
    }
  };

  // Application handling functions
  const handleApplyClick = (position: string) => {
    setApplicationPosition(position);
    
    // Calculate fee based on current level selection
    const level = getSelectedLevel();
    let fee = "";
    switch(level) {
      case 'village': fee = "50000"; break;
      case 'pincode': fee = "60000"; break;
      case 'tehsil': fee = "75000"; break;
      case 'district': fee = "100000"; break;
      case 'division': fee = "125000"; break;
      case 'state': fee = "150000"; break;
      case 'zone': fee = "200000"; break;
      case 'india': fee = "500000"; break;
      default: fee = "500000"; break;
    }
    setApplicationFee(fee);
    
    setShowApplicationModal(true);
    // Reset form data when opening modal
    setApplicationData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      photo: null,
      company: "",
      designation: "",
      experience: "",
      formCountry: "India",
      formState: "",
      formDivision: "",
      formDistrict: "",
      formCity: "",
      formPincode: "",
      completeAddress: "",
      idProof: null,
      addressProof: null,
      panCard: null,
      name: "",
      qualifications: "",
      referralCode: ""
    });
    setIsOtpVerified(false);
    setShowOtpVerification(false);
    setOtpValue("");
    setGeneratedOtp("");
  };

  // Helper function to get current selected level for super admin
  const getSelectedLevel = () => {
    if (selectedVillage) return 'village';
    if (selectedPincode) return 'pincode';
    if (selectedTehsil) return 'tehsil';
    if (selectedDistrict) return 'district';
    if (selectedDiv) return 'division';
    if (selectedState) return 'state';
    if (selectedZone) return 'zone';
    return 'india';
  };

  // Helper function to convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleApplicationSubmit = async () => {
    // Validate all required fields
    if (!applicationData.photo) {
      alert("Photo upload is mandatory. Please select an image file first.");
      return;
    }

    if (!applicationData.firstName || !applicationData.lastName) {
      alert("Please fill in your First Name and Last Name");
      return;
    }

    if (!applicationData.email) {
      alert("Email Address is mandatory");
      return;
    }

    if (!applicationData.phone) {
      alert("Phone Number is mandatory");
      return;
    }

    // OTP verification is disabled for now
    // if (!isOtpVerified) {
    //   alert("Please verify your phone number using OTP first");
    //   return;
    // }

    if (!applicationData.company || !applicationData.designation) {
      alert("Company/Organization and Designation are mandatory");
      return;
    }

    if (!applicationData.formState || !applicationData.formDivision || !applicationData.formDistrict || !applicationData.formCity || !applicationData.formPincode) {
      alert("Please fill in all location information fields");
      return;
    }

    if (!applicationData.completeAddress) {
      alert("Complete Address is mandatory");
      return;
    }

    if (!applicationData.idProof || !applicationData.addressProof || !applicationData.panCard) {
      alert("Please upload all required documents: ID Proof, Address Proof, and PAN Card");
      return;
    }

    try {
      // Verify referral code if provided
      let referralVerification = null;
      if (applicationData.referralCode) {
        try {
          referralVerification = await committeeAPI.verifyReferral(applicationData.referralCode);
          if (!referralVerification.valid) {
            alert(`❌ Invalid referral code: ${applicationData.referralCode}\nPlease check the code and try again.`);
            return;
          }
          console.log('✅ Referral code verified:', referralVerification);
        } catch (error) {
          console.error('❌ Error verifying referral code:', error);
          alert('❌ Error verifying referral code. Please try again.');
          return;
        }
      }

      console.log('========== APPLICATION SUBMISSION DEBUG ==========');
      console.log('📍 Position applying for:', applicationPosition);
      console.log('📍 Current location context:', {
        country: selectedCountry,
        zone: selectedZone,
        state: selectedState,
        division: selectedDiv,
        district: selectedDistrict,
        tehsil: selectedTehsil,
        pincode: selectedPincode,
        village: selectedVillage
      });
      console.log('📝 Application data:', {
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        phone: applicationData.phone,
        email: applicationData.email,
        photo: applicationData.photo ? 'File object present' : 'No photo'
      });
      console.log('================================================');

      // Create FormData for file uploads (proper way to send files)
      console.log('Preparing application with file uploads...');
      
      const formData = new FormData();
      
      // Generate application ID
      const applicationId = `LDOIA-${Date.now()}`;
      
      // Add all form fields
      formData.append('application_id', applicationId);
      formData.append('applicant_name', `${applicationData.firstName} ${applicationData.lastName}`);
      formData.append('first_name', applicationData.firstName);
      formData.append('last_name', applicationData.lastName);
      formData.append('phone_number', applicationData.phone);
      formData.append('email', applicationData.email || '');
      formData.append('date_of_birth', applicationData.dateOfBirth || '');
      formData.append('phone_verified', 'false');
      
      formData.append('company_organization', applicationData.company || '');
      formData.append('designation', applicationData.designation || '');
      formData.append('applied_position', applicationPosition || '');
      formData.append('current_position', applicationData.designation || '');
      formData.append('salary_expectation', applicationFee || '');
      formData.append('experience_years', applicationData.experience || '0');
      
      formData.append('application_status', 'pending');
      formData.append('qualification', `${applicationData.company} - ${applicationData.designation}`);
      formData.append('referral_code', applicationData.referralCode || '');
      formData.append('source_website', 'LDOIA');
      formData.append('applied_date', new Date().toISOString());
      
      // Add POSITION location (from current filter selection - where they're applying)
      const positionLocation = {
        country: selectedCountry,
        zone: selectedZone,
        state: selectedState,
        division: selectedDiv,
        district: selectedDistrict,
        tehsil: selectedTehsil,
        pincode: selectedPincode,
        village: selectedVillage
      };
      formData.append('position_location', JSON.stringify(positionLocation));
      
      // Add HOME ADDRESS location (from application form - their personal address)
      const homeAddress = {
        country: applicationData.formCountry,
        state: applicationData.formState,
        division: applicationData.formDivision,
        district: applicationData.formDistrict,
        city: applicationData.formCity,
        pincode: applicationData.formPincode,
        complete_address: applicationData.completeAddress
      };
      formData.append('home_address', JSON.stringify(homeAddress));
      
      // Add files
      if (applicationData.photo) {
        formData.append('photo', applicationData.photo);
      }
      if (applicationData.idProof) {
        formData.append('id_proof', applicationData.idProof);
      }
      if (applicationData.addressProof) {
        formData.append('address_proof', applicationData.addressProof);
      }
      if (applicationData.panCard) {
        formData.append('pan_card', applicationData.panCard);
      }

      console.log('Submitting application to MongoDB...');

      // Submit application via MongoDB API
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
        : 'http://localhost:3001/api/applications';

      const response = await fetch(apiUrl, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with boundary for FormData
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to submit application');
      }

      const result = await response.json();
      console.log('✅ Application saved to MongoDB:', result);
      console.log('========== INSTANT UI UPDATE ==========');
      
      // Show success message with referral information
      let successMessage = `✅ Application submitted successfully!\nApplication ID: ${result.applicationId || result.mongoId}\nStatus: Pending Review\n\n📋 Your application has been saved to the database.`;
      
      if (referralVerification && referralVerification.referrer) {
        successMessage += `\n\nReferral Info:\n✓ Referred by: ${referralVerification.referrer.name}\n✓ Position: ${referralVerification.referrer.post}\n✓ Phone: ${referralVerification.referrer.phone}`;
      }

      alert(successMessage);

      // 🔥 INSTANT UPDATE - Add application to table immediately without page reload
      const newApplicationData = {
        id: result.applicationId || result.mongoId || applicationId,
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        phone: applicationData.phone,
        email: applicationData.email,
        photo: applicationData.photo,
        photo_data: null, // Will be set from server response if available
        photo_mimetype: applicationData.photo?.type || 'image/jpeg',
        designation: applicationData.designation,
        company: applicationData.company,
        contribution: applicationFee,
        status: 'pending',
        position: applicationPosition,
        // Position location (where they applied)
        zone: selectedZone,
        state: selectedState,
        division: selectedDiv,
        district: selectedDistrict,
        tehsil: selectedTehsil,
        pincode: selectedPincode,
        village: selectedVillage
      };

      // Create the application key for current position and location
      // ⚠️ IMPORTANT: Must use getApplicationKey() to ensure consistency!
      const applicationKey = getApplicationKey(applicationPosition);

      console.log('🔑 Generated application key:', applicationKey);
      console.log('📊 New application data being added:', newApplicationData);
      console.log('📋 Current applications state before update:', Object.keys(applications));

      // ✅ Update applications state immediately - this makes the table update live!
      // The photo File object will be handled by getImageSrc() which creates the object URL
      setApplications(prev => {
        const updated = {
          ...prev,
          [applicationKey]: newApplicationData
        };
        console.log('📋 Updated applications state:', Object.keys(updated));
        console.log('✅ Application key exists in state:', applicationKey in updated);
        
        // 💾 Update localStorage cache immediately for persistence
        try {
          localStorage.setItem('ldoia_applications', JSON.stringify(updated));
          console.log('💾 Cache updated with new application');
        } catch (error) {
          console.log('⚠️ Could not update cache:', error);
        }
        
        return updated;
      });

      console.log('✅ Application instantly added to table at key:', applicationKey);
      console.log('========================================');


    } catch (error: any) {
      console.error('❌ Error submitting application:', error);
      alert(`❌ Error submitting application: ${error.message || 'Please try again later.'}`);
      return;
    }

    // Reset form and close modal
    setApplicationData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      photo: null,
      company: "",
      designation: "",
      experience: "",
      formCountry: "India",
      formState: "",
      formDivision: "",
      formDistrict: "",
      formCity: "",
      formPincode: "",
      completeAddress: "",
      idProof: null,
      addressProof: null,
      panCard: null,
      name: "",
      qualifications: "",
      referralCode: ""
    });
    setShowApplicationModal(false);
    setApplicationPosition("");
    setApplicationFee("");
    setIsOtpVerified(false);
    setShowOtpVerification(false);
    setOtpValue("");
    setGeneratedOtp("");
  };

  // Handle advisory application clicks
  const handleAdvisoryApplyClick = (position: string) => {
    setApplicationPosition(position);
    
    // Calculate fee based on advisory level (position contains "Advisory Level 1" etc.)
    let fee = "";
    if (position.includes("Level 1")) fee = "25000";
    else if (position.includes("Level 2")) fee = "50000";
    else if (position.includes("Level 3")) fee = "75000";
    else if (position.includes("Level 4")) fee = "100000";
    else if (position.includes("Level 5")) fee = "150000";
    else if (position.includes("Level 6")) fee = "200000";
    else fee = "25000"; // default
    
    setApplicationFee(fee);
    
    setShowApplicationModal(true);
    // Reset form data when opening modal
    setApplicationData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      photo: null,
      company: "",
      designation: "",
      experience: "",
      formCountry: "India",
      formState: "",
      formDivision: "",
      formDistrict: "",
      formCity: "",
      formPincode: "",
      completeAddress: "",
      idProof: null,
      addressProof: null,
      panCard: null,
      name: "",
      qualifications: "",
      referralCode: ""
    });
    setIsOtpVerified(false);
    setShowOtpVerification(false);
    setOtpValue("");
    setGeneratedOtp("");
  };

  // Submit advisory application - MongoDB only
  const handleAdvisoryApplicationSubmit = async () => {
    // Validation (same as regular application)
    if (!applicationData.photo) {
      alert("Photo upload is mandatory. Please select an image file first.");
      return;
    }

    if (!applicationData.firstName || !applicationData.lastName) {
      alert("Please fill in your First Name and Last Name");
      return;
    }

    if (!applicationData.email) {
      alert("Email Address is mandatory");
      return;
    }

    if (!applicationData.phone) {
      alert("Phone Number is mandatory");
      return;
    }

    if (!isOtpVerified) {
      alert("Please verify your phone number with OTP first");
      return;
    }

    try {
      // Prepare application data for advisory position
      const applicationDataForSubmission = {
        name: `${applicationData.firstName} ${applicationData.lastName}`.trim(),
        phone: applicationData.phone,
        email: applicationData.email,
        appliedPost: applicationPosition,
        currentDesignation: applicationData.designation,
        price: applicationFee,
        location: {
          country: selectedCountry || applicationData.formCountry,
          zone: selectedZone || applicationData.formState,
          state: selectedState || applicationData.formState,
          division: selectedDiv || applicationData.formDivision,
          district: selectedDistrict || applicationData.formDistrict,
          tehsil: selectedTehsil || applicationData.formCity,
          pincode: selectedPincode || applicationData.formPincode,
          village: selectedVillage || ""
        },
        documents: [
          { type: 'photo', file: applicationData.photo },
          { type: 'idProof', file: applicationData.idProof },
          { type: 'addressProof', file: applicationData.addressProof },
          { type: 'panCard', file: applicationData.panCard }
        ]
      };

      // Submit directly to MongoDB API - no localStorage fallback
      console.log('========== ADVISORY APPLICATION SUBMISSION DEBUG ==========');
      console.log('📍 Advisory position applying for:', applicationPosition);
      console.log('📍 Advisory level:', getSelectedLevel());
      console.log('📍 Application fee:', applicationFee);
      console.log('📝 Advisory application data:', {
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        phone: applicationData.phone,
        email: applicationData.email,
        photo: applicationData.photo ? 'File object present' : 'No photo'
      });
      console.log('========================================================');
      
      const result = await applicationAPI.submitAdvisoryApplication(applicationDataForSubmission);
      console.log('✅ Advisory application saved to MongoDB:', result);
      console.log('========== INSTANT UI UPDATE FOR ADVISORY ==========');

      // Update the applications state using the same key-based structure as committee
      const applicationKey = getApplicationKey(applicationPosition);
      const applicationId = result.data?.id || result.data?.application_id || Date.now().toString();
      const newApplicationData = {
        id: applicationId,
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        phone: applicationData.phone,
        email: applicationData.email,
        photo: applicationData.photo, // Store File object for instant display
        position: applicationPosition,
        currentDesignation: applicationData.designation,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        introduced: 0,
        ...applicationDataForSubmission
      };
      
      console.log('� Application key:', applicationKey);
      console.log('📊 Applications before update:', Object.keys(applications).length);
      
      setApplications(prev => {
        const updated = { ...prev, [applicationKey]: newApplicationData };
        console.log('📊 Applications after update:', Object.keys(updated).length);
        console.log('✅ New advisory application added at key:', applicationKey);
        
        // 💾 Cache to localStorage for persistence
        try {
          localStorage.setItem('ldoia_applications', JSON.stringify(updated));
          console.log('💾 Applications cached to localStorage');
        } catch (error) {
          console.log('⚠️ Could not cache applications:', error);
        }
        
        return updated;
      });

      console.log('✅ Advisory application instantly added to table');
      console.log('========================================');

      // Show success message
      alert(`✅ Advisory application submitted successfully!\nApplication ID: ${applicationId}\nStatus: Pending Review\n\n📋 Your application has been saved to MongoDB and sent for review.`);

      // Reset form and close modal
      setApplicationData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        photo: null,
        company: "",
        designation: "",
        experience: "",
        formCountry: "India",
        formState: "",
        formDivision: "",
        formDistrict: "",
        formCity: "",
        formPincode: "",
        completeAddress: "",
        idProof: null,
        addressProof: null,
        panCard: null,
        name: "",
        qualifications: "",
        referralCode: ""
      });
      setShowApplicationModal(false);
      setApplicationPosition("");
      setApplicationFee("");
      setIsOtpVerified(false);
      setShowOtpVerification(false);
      setOtpValue("");
      setGeneratedOtp("");

    } catch (error) {
      console.error('❌ Error submitting advisory application to MongoDB:', error);
      alert(`❌ Error submitting advisory application: ${error.message || 'Please try again later.'}\n\nMake sure your MongoDB backend is running.`);
    }
  };

  // Edit functionality functions
  const handleEditMember = (memberName: string) => {
    setEditMemberData(prev => ({
      ...prev,
      memberName: memberName,
      applicantId: "",
      password: "",
      verificationStep: "credentials",
      // Reset edit form data
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      photo: null,
      company: "",
      designation: "",
      completeAddress: ""
    }));
    setShowEditModal(true);
    setOpenDropdown(''); // Close any open dropdown
  };

  const verifyCredentials = async () => {
    const { applicantId, password } = editMemberData;
    
    // Display credentials in console for verification (as requested)
    console.log("Edit Request - Credential Verification:");
    console.log(`Member Name: ${editMemberData.memberName}`);
    console.log(`Phone Number (ID): ${applicantId}`);
    console.log(`Password: ${password}`);
    console.log("Timestamp:", new Date().toLocaleString());
    
    // Basic validation
    if (!applicantId || !password) {
      alert("Please enter both Phone Number and Password");
      return;
    }
    
    try {
      // Use API to verify credentials
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: applicantId, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Invalid credentials');
        return;
      }
      
      const member = data.member;
      
      // Credentials are valid - proceed directly to edit without OTP
      setEditMemberData(prev => ({
        ...prev,
        verificationStep: "edit",
        memberName: member.name,  // Set the correct member name
        firstName: member.name.split(' ')[0] || '',
        lastName: member.name.split(' ').slice(1).join(' ') || '',
        phone: member.phone,
        email: member.email || '',
        company: member.company || '',
        designation: member.designation || '',
        completeAddress: member.completeAddress || ''
      }));
      
      alert(`Welcome ${member.name}! You can now edit your information directly.`);
      
    } catch (error) {
      console.error('Error verifying credentials:', error);
      alert('Error connecting to server. Please try again.');
    }
  };

  // Forgot Password Functions
  const sendForgotPasswordOtp = async () => {
    const phoneNumber = forgotPasswordData.phoneNumber;
    
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    // Check if phone number exists in committee members
    const member = committeeMembers.find(m => m.phone === phoneNumber);
    
    if (!member) {
      alert("Phone number not found. Please enter your registered phone number.");
      return;
    }

    setForgotPasswordLoading(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setForgotPasswordOtp(otp);
    
    try {
      // Try to send via SMS API
      const smsApiUrl = import.meta.env.VITE_BACKEND_API_URL 
        ? `${import.meta.env.VITE_BACKEND_API_URL}/send-sms`
        : 'http://localhost:3001/api/send-sms';

      const smsResponse = await fetch(smsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otp,
          message: `Your LDOIA password reset OTP is: ${otp}. Please do not share this code with anyone.`
        })
      });

      if (smsResponse.ok) {
        console.log(`Password Reset OTP sent via SMS to ${phoneNumber}: ${otp}`);
        alert(`Password reset OTP has been sent to ${phoneNumber}`);
      } else {
        // Fallback: show OTP in alert for development/testing
        console.log(`Password Reset OTP for ${phoneNumber}: ${otp}`);
        alert(`Your Password Reset OTP is: ${otp}\n(SMS service unavailable - showing OTP for testing)`);
      }
      
      setForgotPasswordStep("otp");
    } catch (error) {
      // Fallback: show OTP in alert
      console.log(`Password Reset OTP for ${phoneNumber}: ${otp}`);
      alert(`Your Password Reset OTP is: ${otp}\n(SMS service unavailable - showing OTP for testing)`);
      setForgotPasswordStep("otp");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const verifyForgotPasswordOtp = () => {
    if (forgotPasswordData.otp === forgotPasswordOtp) {
      setForgotPasswordStep("newPassword");
      alert("OTP verified successfully! Now set your new password.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const resetPassword = async () => {
    const { newPassword, confirmPassword, phoneNumber } = forgotPasswordData;
    
    if (!newPassword || newPassword.length < 4) {
      alert("Password must be at least 4 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Find the member and update their password logic
    const member = committeeMembers.find(m => m.phone === phoneNumber);
    
    if (member) {
      try {
        // Update password via API
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone: phoneNumber, newPassword }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`Password changed for ${member.name} (${phoneNumber})`);
          console.log(`New password: ${newPassword}`);
          
          // Reset the forgot password flow
          setShowForgotPasswordModal(false);
          setForgotPasswordStep("phone");
          setForgotPasswordData({
            phoneNumber: "",
            otp: "",
            newPassword: "",
            confirmPassword: ""
          });
          setForgotPasswordOtp("");
          
          alert(`Password successfully changed for ${member.name}!\nYou can now login with your new password: ${newPassword}`);
        } else {
          alert(data.error || 'Failed to update password');
        }
      } catch (error) {
        console.error('Error updating password:', error);
        alert('Error connecting to server. Please try again.');
      }
    }
  };

  const generateEditOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log(`Generated OTP for ${editMemberData.memberName}: ${otp}`);
    
    // In production, this would send OTP via email/SMS
    setTimeout(() => {
      alert(`OTP for verification: ${otp} (This is for testing - in production, OTP would be sent to registered email/phone)`);
    }, 500);
  };

  const verifyEditOtp = () => {
    if (editOtpValue === generatedOtp) {
      setIsEditOtpVerified(true);
      setShowOtpModal(false);
      alert("OTP verified successfully! You can now edit your details.");
      // Pre-fill current data (in production, this would come from database)
      setEditMemberData(prev => ({
        ...prev,
        firstName: editMemberData.memberName.split(' ')[0] || "",
        lastName: editMemberData.memberName.split(' ').slice(1).join(' ') || "",
        phone: "9999999999", // This would come from database
        email: "member@example.com", // This would come from database
        company: "Current Company", // This would come from database
        designation: "Current Designation", // This would come from database
        completeAddress: "Current Address" // This would come from database
      }));
    } else {
      alert("Invalid OTP. Please try again.");
      setEditOtpValue("");
    }
  };

  const handleEditSubmit = () => {
    // Validate required fields
    if (!editMemberData.firstName || !editMemberData.lastName) {
      alert("Please fill in First Name and Last Name");
      return;
    }
    
    if (!editMemberData.phone || !editMemberData.email) {
      alert("Please fill in Phone and Email");
      return;
    }
    
    if (!isEditOtpVerified) {
      alert("Please verify OTP first");
      return;
    }
    
    console.log("Edit Submission:");
    console.log(`Member: ${editMemberData.memberName}`);
    console.log(`Updated Data:`, {
      firstName: editMemberData.firstName,
      lastName: editMemberData.lastName,
      phone: editMemberData.phone,
      email: editMemberData.email,
      company: editMemberData.company,
      designation: editMemberData.designation,
      completeAddress: editMemberData.completeAddress,
      photoUpdated: editMemberData.photo ? "Yes" : "No"
    });
    console.log("Edit Timestamp:", new Date().toLocaleString());
    
    // Update the member data in the appropriate array
    const updatedMemberData = {
      name: `${editMemberData.firstName} ${editMemberData.lastName}`,
      phone: editMemberData.phone,
      email: editMemberData.email,
      company: editMemberData.company,
      designation: editMemberData.designation,
      completeAddress: editMemberData.completeAddress,
      // Keep the existing photo if no new one was uploaded
      ...(editMemberData.photo && { photo: editMemberData.photo.name })
    };
    
    if (editMemberData.isCommittee) {
      // Update committee member
      setCommitteeMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === editMemberData.id 
            ? { ...member, ...updatedMemberData }
            : member
        )
      );
      console.log("Committee member updated in state successfully");
    } else {
      // Update advisory member
      setAdvisoryMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === editMemberData.id 
            ? { ...member, ...updatedMemberData }
            : member
        )
      );
      console.log("Advisory member updated in state successfully");
    }
    
    alert(`Details updated successfully for ${editMemberData.memberName}!`);
    
    // Reset and close modal
    setShowEditModal(false);
    setEditOtpValue("");
    setIsEditOtpVerified(false);
    setGeneratedOtp("");
  };

  // Candidate Applications Management Functions
  const handleViewDocuments = async (candidate: any) => {
    console.log("Viewing documents for candidate:", candidate.applicant_name || candidate.name);
    setSelectedCandidate(candidate);
    
    try {
      // Fetch real documents from MongoDB
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
        : 'http://localhost:3001/api/applications';
      
      const response = await fetch(`${apiUrl}/${candidate._id || candidate.application_id}/documents`);
      
      if (response.ok) {
        const result = await response.json();
        const documents = result.data || [];
        
        // Format documents for display
        const formattedDocs = documents.map((doc: any) => ({
          id: doc._id,
          name: doc.document_name || doc.name,
          type: doc.document_type || doc.mimetype,
          size: doc.size || 'Unknown',
          uploadedAt: doc.uploaded_at || candidate.created_at,
          url: doc.document_data ? `data:${doc.document_type};base64,${doc.document_data}` : '#'
        }));
        
        setCandidateDocuments(formattedDocs);
        console.log('✅ Documents loaded from MongoDB:', formattedDocs.length);
      } else {
        console.log('⚠️ No documents found for this candidate');
        setCandidateDocuments([]);
      }
    } catch (error) {
      console.error('❌ Error loading documents from MongoDB:', error);
      setCandidateDocuments([]);
    }
    
    setShowDocumentsModal(true);
  };

  const handleChangeStatus = async (candidate: any, newStatus: string) => {
    console.log(`Changing status for ${candidate.applicant_name || candidate.name} to ${newStatus}`);
    
    // Update candidate status in MongoDB and local state
    try {
      // In production, update MongoDB first
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
        : 'http://localhost:3001/api/applications';
      
      const response = await fetch(`${apiUrl}/${candidate.application_id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Update local candidate applications
        setCandidateApplications(prev => 
          prev.map(app => 
            app.application_id === candidate.application_id 
              ? { ...app, application_status: newStatus }
              : app
          )
        );
        
        // If approved, generate login credentials and send email
        if (newStatus === 'approved') {
          const loginId = `${candidate.initials || candidate.applicant_name.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
          const password = `Pass@${Math.floor(Math.random() * 10000)}`;
          
          console.log(`Generated credentials for ${candidate.applicant_name}: ID: ${loginId}, Password: ${password}`);
          // In production, send email with credentials
          alert(`Application approved! Login credentials sent to ${candidate.email}`);
        } else {
          alert(`Status updated to ${newStatus} successfully!`);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handleGenerateReferralCode = (member: any) => {
    console.log("Generating referral code for:", member.name);
    setSelectedMemberReferral(member);
    setReferralCode(member.referralCode || `${member.initials}${Date.now().toString().slice(-3)}`);
    setShowReferralModal(true);
  };

  const handleCopyReferralCode = (code?: string) => {
    if (code) {
      // Called from dropdown - show modal with code
      setReferralCode(code);
      setShowReferralModal(true);
    } else {
      // Called from modal's "Copy Code" button - copy to clipboard
      navigator.clipboard.writeText(referralCode);
      alert("Referral code copied to clipboard!");
    }
  };

  const handleEditFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditMemberData(prev => ({
        ...prev,
        photo: file
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (file) {
      setApplicationData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  // Handle double-click to clear selection
  const handleDoubleClick = (level: string) => {
    switch (level) {
      case "country":
        setSelectedCountry("India");
        resetSelections("country");
        break;
      case "zone":
        setSelectedZone("");
        resetSelections("zone");
        break;
      case "state":
        setSelectedState("");
        resetSelections("state");
        break;
      case "div":
        setSelectedDiv("");
        resetSelections("div");
        break;
      case "district":
        setSelectedDistrict("");
        resetSelections("district");
        break;
      case "tehsil":
        setSelectedTehsil("");
        resetSelections("tehsil");
        break;
      case "pincode":
        setSelectedPincode("");
        resetSelections("pincode");
        break;
      case "village":
        setSelectedVillage("");
        break;
    }
  };

  // Get table title based on selection level
  const getTableTitle = () => {
    if (selectedVillage) return `List of Proposed Committee Positions of ${selectedVillage} Village`;
    if (selectedPincode) return `List of Proposed Committee Positions of ${selectedPincode} Pincode`;
    if (selectedTehsil) return `List of Proposed Committee Positions of ${selectedTehsil} Tehsil`;
    if (selectedDistrict) return `List of Proposed Committee Positions of ${selectedDistrict} District`;
    if (selectedDiv) return `List of Proposed Committee Positions of ${selectedDiv} Division`;
    if (selectedState) return `List of Proposed Committee Positions of ${selectedState} State`;
    if (selectedZone) return `List of Proposed Committee Positions of ${selectedZone} Zone`;
    return 'List of Proposed Committee Positions of India';
  };

  // Get advisory table title based on selection level
  const getAdvisoryTableTitle = () => {
    if (selectedVillage) return `List of Advisory Committee of ${selectedVillage} Village`;
    if (selectedPincode) return `List of Advisory Committee of ${selectedPincode} Pincode`;
    if (selectedTehsil) return `List of Advisory Committee of ${selectedTehsil} Tehsil`;
    if (selectedDistrict) return `List of Advisory Committee of ${selectedDistrict} District`;
    if (selectedDiv) return `List of Advisory Committee of ${selectedDiv} Division`;
    if (selectedState) return `List of Advisory Committee of ${selectedState} State`;
    if (selectedZone) return `List of Advisory Committee of ${selectedZone} Zone`;
    return 'List of Advisory Committee of India';
  };

  // Get safe location data
  const getLocationOptions = (level: string, parent: string) => {
    try {
      switch (level) {
        case "states":
          return locationData?.states?.[parent as keyof typeof locationData.states] || [];
        case "divisions":
          return locationData?.divisions?.[parent as keyof typeof locationData.divisions] || [];
        case "districts":
          return locationData?.districts?.[parent as keyof typeof locationData.districts] || [];
        case "cities":
          return locationData?.cities?.[parent as keyof typeof locationData.cities] || [];
        case "pincodes":
          return locationData?.pincodes?.[parent as keyof typeof locationData.pincodes] || [];
        default:
          return [];
      }
    } catch (error) {
      console.error(`Error getting location options for ${level}:`, error);
      return [];
    }
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedZone("");
    setSelectedState("");
    setSelectedDiv("");
    setSelectedDistrict("");
    setSelectedTehsil("");
    setSelectedPincode("");
    setSelectedVillage("");
  };
  // Add this helper function at the top of your component, before the return statement
const getPositionLevel = () => {
  if (selectedVillage) return "village";
  if (selectedPincode) return "pincode";
  if (selectedTehsil) return "tehsil";
  if (selectedDistrict) return "district";
  if (selectedDiv) return "division";
  if (selectedState) return "state";
  if (selectedZone) return "zone";
  return "india";
};


  return (
    <div className="min-h-screen bg-amber-50">
          {/* Navigation Header */}
          <header className="border-b border-amber-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-amber-800"><strong>LDOIA</strong></h1>
                    <p className="text-xs text-amber-600"><strong>Land Developers & Owners India Association</strong></p>
                  </div>
                </div>
                <nav className="hidden md:flex space-x-6 items-center">
                  <a href="/" className="text-amber-900 border-b-2 border-amber-600 font-semibold">Home</a>
                  <Link to="/ldoai/about" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                    About
                  </Link>
                  <Link to="/ldoai/benefits" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                    Benefits
                  </Link>
                  {/* <Link to="/ldoai/committee" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                    Committee
                  </Link> */}
                  <a href="#positions" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">Positions</a>
                  <Link to="/gallery" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                    Gallery
                  </Link>
                  <Link to="/contact" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                    Contact
                  </Link>
                  <LanguageSelector />
                </nav>
                <div className="flex items-center space-x-3">
                  <Link to="/contact">
                    <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 text-sm font-medium shadow-md">
                      Get In Touch
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Mobile Navigation */}
              <div className="md:hidden mt-4 pt-4 border-t border-amber-200">
                <nav className="flex flex-wrap gap-4 justify-center">
                  <a href="/" className="text-amber-900 border-b-2 border-amber-600 font-semibold text-sm">Home</a>
                  <Link to="/ldoai/about" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                    About
                  </Link>
                  <Link to="/ldoai/benefits" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                    Benefits
                  </Link>
                  <a href="#positions" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">Positions</a>
                  <Link to="/gallery" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                    Gallery
                  </Link>
                  <Link to="/contact" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </header>

{/* Full Width Image Banner Carousel */}
{/* <section className="relative z-40 h-[33vh] w-full overflow-hidden"> */}
  {/* Carousel Slides Container */}
  {/* <div className="relative w-full h-full">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
      > */}
        {/* Full width container with no gaps */}
        {/* <div className="flex flex-col md:flex-row w-full h-full">
          {slide.images.map((img, i) => (
            <div key={i} className="flex-1 h-1/2 md:h-full relative overflow-hidden bg-gray-100">
              <img 
                src={img}
                alt={`Carousel slide ${index + 1}, image ${i + 1}`}
                className="w-full h-full object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement; */}
                  {/* // Use cover to fill entire container without gaps
                  img.style.objectFit = 'cover';
                  img.style.objectPosition = 'center';
                  img.style.width = '100%';
                  img.style.height = '100%';
                  img.style.display = 'block';
                }}
                onError={(e) => {
                  // Show error message if image fails to load
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-gradient-to-r from-amber-100 to-orange-100">
                        <div class="text-amber-600 text-center">
                          <div class="text-2xl mb-2">📷</div>
                          <p class="text-sm">Image not available</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div> */}

  {/* Navigation Dots */}
  {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => {
          setCurrentSlide(index);
          setIsAutoPlaying(false);
          // Resume auto-play after 10 seconds of user interaction
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }}
        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
          index === currentSlide
            ? 'bg-white scale-110 shadow-lg'
            : 'bg-white/50 hover:bg-white/70'
        }`}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
</section> */}

          {/* Exhibition Brochure Section - Matches the advertisement above */}
          {/* <section className="relative z-30 py-3 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500"> */}
            {/* Background Pattern */}
            {/* <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-yellow-300/30 to-red-400/30"></div>
            </div>
            
            <div className="relative z-10 container mx-auto px-4">
              <div className="max-w-6xl mx-auto"> */}
                {/* <Card className="border-2 border-red-600 bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row"> */}
                      {/* Left Side - Exhibition Info */}
                      {/* <div className="lg:w-2/3 p-4 sm:p-5 bg-gradient-to-br from-red-50 to-orange-50">
                        <div className="flex items-start gap-3"> */}
                          {/* Exhibition Icon */}
                          {/* <div className="flex-shrink-0">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          </div> */}
                          
                          {/* Content */}
                          {/* <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge className="bg-red-600 text-white font-bold px-2 py-1 text-xs">
                                🏢 REAL ESTATE EXPO
                              </Badge>
                              <Badge className="bg-orange-600 text-white font-bold px-2 py-1 text-xs">
                                📅 27th & 28th Sept
                              </Badge>
                            </div>
                            
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-2">
                              Zameen Ka Bazaar Exhibition Report
                            </h3>
                            
                            <p className="text-red-700 text-xs sm:text-sm mb-3 leading-relaxed">
                              📋 Download the comprehensive report from our recent <strong>Real Estate Exhibition</strong> featuring:
                            </p>
                            
                            <ul className="text-xs text-red-700 space-y-1 mb-3">
                              <li>🏆 <strong>Stall Owner Benefits</strong> & Extra Rewards</li>
                              <li>🎯 <strong>Exhibition Highlights</strong> & Success Stories</li>
                              <li>📊 <strong>Industry Insights</strong> & Market Trends</li>
                              <li>🤝 <strong>Networking Opportunities</strong> & Future Events</li>
                            </ul>
                            
                            <div className="flex flex-wrap gap-1">
                              <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                                📄 PDF Report
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                                🆕 Latest Event
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                                👥 Member Exclusive
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      
                      {/* Right Side - Download Button */}
                      {/* <div className="lg:w-1/3 bg-gradient-to-br from-red-600 to-orange-600 p-4 sm:p-5 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mb-3">
                            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h4 className="text-white font-bold text-base mb-1">FREE DOWNLOAD</h4>
                            <p className="text-white/90 text-xs">Exhibition Brochure & Report</p>
                          </div>
                          
                          <Button
                            onClick={() => window.open('/expo_broucher.pdf', '_blank')}
                            className="bg-white text-red-600 hover:bg-gray-100 hover:text-red-700 
                              px-6 py-2 text-sm font-bold shadow-lg hover:shadow-xl 
                              transition-all duration-300 hover:scale-105 active:scale-95
                              border-0 rounded-xl w-full group"
                          >
                            <svg className="w-4 h-4 mr-1 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            DOWNLOAD NOW
                          </Button>
                          
                          <p className="text-white/80 text-xs mt-2">
                            🔒 Secure Download • 📱 Mobile Friendly
                          </p>
                        </div>
                      </div> */}
                    {/* </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section> */}


          {/* Hero Section */}
          <section className="relative overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat h-[70vh] sm:h-[80vh] lg:h-[90vh]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.6), rgba(160, 82, 45, 0.5)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`
                  }}
            ></div>
            
            {/* Content Overlay */}
            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20 lg:py-24 flex items-center h-[70vh] sm:h-[80vh] lg:h-[90vh]">
              <div className="text-center max-w-4xl mx-auto text-white">
                <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-amber-100 border border-white/30">
                  India's Premier Land Development Association
                </Badge>

               <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">LDOIA</span>
                  <span className="block">Land Developers & Owners</span>
                  <span className="block">India Association</span>
                </h1>
                <p className="text-lg md:text-xl text-amber-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of land developers, property owners, and industry professionals in India's most influential association. Connect with your local community, access exclusive benefits, and shape the future of land development.
                </p>
                
                {/* Quick Navigation */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link to="/ldoai/about">
                    <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm">
                      About LDOAI
                    </Button>
                  </Link>
                  <Link to="/ldoai/committee">
                    <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm">
                      Committee Structure
                    </Button>
                  </Link>
                  <Link to="/ldoai/benefits">
                    <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm">
                      Membership Benefits
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

{/* Location Filter Section with Committee Positions Table */}
      <section id="positions" className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900 mb-2 sm:mb-4 px-4">
              Find Your Local Community
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-amber-700 max-w-2xl mx-auto px-4">
              Discover members, committee representatives, and events in your area through our hierarchical location search
            </p>
            <p className="text-xs sm:text-sm text-amber-600 mt-2 px-4">
              💡 <strong>Tip:</strong> Double-click on any dropdown to clear that selection and go back to the previous level
            </p>
          </div>

          <Card className="w-full max-w-7xl mx-auto border-amber-200 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 px-3 sm:px-6">
              <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl text-amber-800">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-amber-600" />
                Select your location Position Given, Available Post and Apply For Posts
              </CardTitle>
              <CardDescription className="text-amber-700 text-sm sm:text-base">
                <span className="font-medium">Location-Based Search</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
              {/* Name and Phone Search Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Name Search */}
                <div className="relative">
                  <Input 
                    placeholder="Search by name..." 
                    value={searchName}
                    onChange={(e) => handleNameSearch(e.target.value)}
                    className="bg-blue-50 border-blue-200 focus:border-blue-400 text-xs sm:text-sm h-9 sm:h-10"
                  />
                  {searchName && (
                    <button
                      onClick={() => setSearchName("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Phone Search */}
                <div className="relative">
                  <Input 
                    placeholder="Search by phone number..." 
                    value={searchPhone}
                    onChange={(e) => handlePhoneSearch(e.target.value)}
                    className="bg-blue-50 border-blue-200 focus:border-blue-400 text-xs sm:text-sm h-9 sm:h-10"
                  />
                  {searchPhone && (
                    <button
                      onClick={() => setSearchPhone("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Search Button Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                {/* Search Button in the first column */}
                <div className="col-span-2 sm:col-span-1">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full h-8 sm:h-9 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    onClick={() => {
                      // Trigger search functionality
                      console.log('Searching...', { searchName, searchPhone });
                    }}
                  >
                    <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline" style={{ color: 'black' }}>SEARCH</span>
                    {/* <span className="xs:hidden">🔍</span> */}
                  </Button>
                </div>

                {/* Zone Search */}
                <div className="relative">
                  <Input 
                    placeholder="Zones..." 
                    value={searchZone}
                    onChange={(e) => {
                      setSearchZone(e.target.value);
                    }}
                    onFocus={() => {
                      if (!zoneOpen) {
                        setZoneOpen(true);
                      }
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedCountry}
                  />
                </div>

                {/* State Search */}
                <div className="relative">
                  <Input 
                    placeholder="States..." 
                    value={searchState}
                    onChange={(e) => {
                      setSearchState(e.target.value);
                    }}
                    onFocus={() => {
                      if (!stateOpen) {
                        setStateOpen(true);
                      }
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedCountry}
                  />
                </div>

                {/* Division Search */}
                <div className="relative">
                  <Input 
                    placeholder="Divisions..." 
                    value={searchDivision}
                    onChange={(e) => {
                      setSearchDivision(e.target.value);
                    }}
                    onFocus={() => {
                      if (!divOpen) {
                        setDivOpen(true);
                      }
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedCountry}
                  />
                </div>

                {/* District Search */}
                <div className="relative">
                  <Input 
                    placeholder="Districts..." 
                    value={searchDistrict}
                    onChange={(e) => {
                      setSearchDistrict(e.target.value);
                    }}
                    onFocus={() => {
                      if (!districtOpen) {
                        setDistrictOpen(true);
                      }
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedCountry}
                  />
                </div>

                {/* Tehsil Search */}
                <div className="relative">
                  <Input 
                    placeholder="Tehsils..." 
                    value={searchTehsil}
                    onChange={(e) => {
                      setSearchTehsil(e.target.value);
                    }}
                    onFocus={() => {
                      if (!tehsilOpen) {
                        setTehsilOpen(true);
                      }
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedCountry}
                  />
                </div>

                {/* Pincode Search */}
                <div className="relative">
                  <Input 
                    placeholder="Pincodes..." 
                    value={searchPincode}
                    onChange={(e) => {
                      setSearchPincode(e.target.value);
                    }}
                    onFocus={() => {
                      if (!pincodeOpen) {
                        setPincodeOpen(true);
                      }
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedCountry}
                  />
                </div>

                {/* Village Search */}
                <div className="relative">
                  <Input 
                    placeholder="Villages..." 
                    value={searchPostOffice}
                    onChange={(e) => {
                      setSearchPostOffice(e.target.value);
                    }}
                    className="bg-amber-50 border-amber-200 focus:border-amber-400 text-xs sm:text-sm h-8 sm:h-9"
                    disabled={!selectedPincode}
                  />
                </div>
              </div>

              {/* Filter Grid - Dropdown Buttons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
                {/* India */}
                <div className="relative">
                  <Select value={selectedCountry} onValueChange={(value) => { setSelectedCountry(value); resetSelections("country"); }}>
                    <SelectTrigger className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                      <SelectValue placeholder="India" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-amber-200 shadow-xl max-h-60 overflow-y-auto">
                      <SelectItem value="India" className="text-gray-900 hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-100 focus:text-amber-900 cursor-pointer py-2 px-3">
                        India
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Zone */}
                <div className="relative">
                  <Popover open={zoneOpen} onOpenChange={setZoneOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={zoneOpen}
                        className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer w-full justify-between text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                        disabled={!selectedCountry}
                        onClick={() => setZoneOpen(!zoneOpen)}
                      >
                        {selectedZone || "Zone"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No zone found.</CommandEmpty>
                          <CommandGroup>
                            {selectedCountry && [
                              'Northern', 
                              'Central', 
                              'Eastern', 
                              'Western', 
                              'Southern', 
                              'North Eastern'
                            ].filter(zone => 
                              zone.toLowerCase().includes(searchZone.toLowerCase())
                            ).map((zone) => (
                              <CommandItem
                                key={zone}
                                value={zone}
                                onSelect={(currentValue) => {
                                  setSelectedZone(currentValue === selectedZone ? "" : currentValue);
                                  resetSelections("zone");
                                  setZoneOpen(false);
                                  setSearchZone("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedZone === zone ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {zone}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedZone && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("zone")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>


                {/* State - Updated to show all states and auto-update zone */}
                <div className="relative">
                  <Popover open={stateOpen} onOpenChange={setStateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={stateOpen}
                        className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer w-full justify-between text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                        disabled={!selectedCountry}
                        onClick={() => setStateOpen(!stateOpen)}
                      >
                        {selectedState || "State"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup>
                            {selectedCountry && getStatesForZone(selectedZone).filter(state => 
                              state.toLowerCase().includes(searchState.toLowerCase())
                            ).map((state) => (
                              <CommandItem
                                key={state}
                                value={state}
                                onSelect={(currentValue) => {
                                  if (currentValue !== selectedState) {
                                    // Auto-update zone when state is selected
                                    const zone = getZoneForState(currentValue);
                                    if (zone) {
                                      setSelectedZone(zone);
                                    }
                                    setSelectedState(currentValue);
                                    resetSelections("state");
                                  } else {
                                    setSelectedState("");
                                    setSelectedZone("");
                                    resetSelections("zone");
                                  }
                                  setStateOpen(false);
                                  setSearchState("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedState === state ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {state}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedState && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("state")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>

                {/* Rest of the dropdowns remain the same */}
                {/* Div (Division) - Updated to show all divisions and auto-update state/zone */}
                <div className="relative">
                  <Popover open={divOpen} onOpenChange={setDivOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={divOpen}
                        className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer w-full justify-between text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                        disabled={!selectedCountry}
                        onClick={() => setDivOpen(!divOpen)}
                      >
                        {selectedDiv || "Div"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No division found.</CommandEmpty>
                          <CommandGroup>
                            {selectedCountry && getDivisionsForState(selectedState).filter(division => 
                              division.toLowerCase().includes(searchDivision.toLowerCase())
                            ).map((division) => (
                              <CommandItem
                                key={division}
                                value={division}
                                onSelect={(currentValue) => {
                                  if (currentValue !== selectedDiv) {
                                    // Auto-update state and zone when division is selected
                                    const stateName = getStateForDivision(currentValue);
                                    if (stateName) {
                                      setSelectedState(stateName);
                                      const zone = getZoneForState(stateName);
                                      if (zone) {
                                        setSelectedZone(zone);
                                      }
                                    }
                                    setSelectedDiv(currentValue);
                                    resetSelections("div");
                                  } else {
                                    setSelectedDiv("");
                                    resetSelections("div");
                                  }
                                  setDivOpen(false);
                                  setSearchDivision("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDiv === division ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {division}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedDiv && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("div")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>

                {/* District - Updated to show all districts and auto-update division/state/zone */}
                <div className="relative">
                  <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={districtOpen}
                        className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer w-full justify-between text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                        disabled={!selectedCountry}
                        onClick={() => setDistrictOpen(!districtOpen)}
                      >
                        {selectedDistrict || "District"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            {selectedCountry && getDistrictsForDivision(selectedDiv).filter(district => 
                              district.toLowerCase().includes(searchDistrict.toLowerCase())
                            ).map((district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={(currentValue) => {
                                  if (currentValue !== selectedDistrict) {
                                    // Auto-update division, state, and zone when district is selected
                                    const divisionName = getDivisionForDistrict(currentValue);
                                    if (divisionName) {
                                      setSelectedDiv(divisionName);
                                      const stateName = getStateForDivision(divisionName);
                                      if (stateName) {
                                        setSelectedState(stateName);
                                        const zone = getZoneForState(stateName);
                                        if (zone) {
                                          setSelectedZone(zone);
                                        }
                                      }
                                    }
                                    setSelectedDistrict(currentValue);
                                    resetSelections("district");
                                  } else {
                                    setSelectedDistrict("");
                                    resetSelections("district");
                                  }
                                  setDistrictOpen(false);
                                  setSearchDistrict("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDistrict === district ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {district}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedDistrict && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("district")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>

                {/* Tehsil - Updated to show all tehsils and auto-update district/division/state/zone */}
                <div className="relative">
                  <Popover open={tehsilOpen} onOpenChange={setTehsilOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={tehsilOpen}
                        className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer w-full justify-between text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                        disabled={!selectedCountry}
                        onClick={() => setTehsilOpen(!tehsilOpen)}
                      >
                        {selectedTehsil || "Tehsil"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No tehsil found.</CommandEmpty>
                          <CommandGroup>
                            {selectedCountry && getTehsilsForDistrict(selectedDistrict).filter(tehsil => 
                              tehsil.toLowerCase().includes(searchTehsil.toLowerCase())
                            ).map((tehsil) => (
                              <CommandItem
                                key={tehsil}
                                value={tehsil}
                                onSelect={(currentValue) => {
                                  if (currentValue !== selectedTehsil) {
                                    // Auto-update district, division, state, and zone when tehsil is selected
                                    const districtName = getDistrictForTehsil(currentValue);
                                    if (districtName) {
                                      setSelectedDistrict(districtName);
                                      const divisionName = getDivisionForDistrict(districtName);
                                      if (divisionName) {
                                        setSelectedDiv(divisionName);
                                        const stateName = getStateForDivision(divisionName);
                                        if (stateName) {
                                          setSelectedState(stateName);
                                          const zone = getZoneForState(stateName);
                                          if (zone) {
                                            setSelectedZone(zone);
                                          }
                                        }
                                      }
                                    }
                                    setSelectedTehsil(currentValue);
                                    resetSelections("tehsil");
                                  } else {
                                    setSelectedTehsil("");
                                    resetSelections("tehsil");
                                  }
                                  setTehsilOpen(false);
                                  setSearchTehsil("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedTehsil === tehsil ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {tehsil}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedTehsil && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("tehsil")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>

                {/* Pincode - Updated to show all pincodes and auto-update tehsil/district/division/state/zone */}
                <div className="relative">
                  <Popover open={pincodeOpen} onOpenChange={setPincodeOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={pincodeOpen}
                        className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer w-full justify-between text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                        disabled={!selectedCountry}
                        onClick={() => setPincodeOpen(!pincodeOpen)}
                      >
                        {selectedPincode || "Pincode"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No pincode found.</CommandEmpty>
                          <CommandGroup>
                            {selectedCountry && getPincodesForTehsil(selectedTehsil).filter(pincode => 
                              pincode.toLowerCase().includes(searchPincode.toLowerCase())
                            ).map((pincode) => (
                              <CommandItem
                                key={pincode}
                                value={pincode}
                                onSelect={(currentValue) => {
                                  if (currentValue !== selectedPincode) {
                                    // Auto-update tehsil, district, division, state, and zone when pincode is selected
                                    const tehsilName = getTehsilForPincode(currentValue);
                                    if (tehsilName) {
                                      setSelectedTehsil(tehsilName);
                                      const districtName = getDistrictForTehsil(tehsilName);
                                      if (districtName) {
                                        setSelectedDistrict(districtName);
                                        const divisionName = getDivisionForDistrict(districtName);
                                        if (divisionName) {
                                          setSelectedDiv(divisionName);
                                          const stateName = getStateForDivision(divisionName);
                                          if (stateName) {
                                            setSelectedState(stateName);
                                            const zone = getZoneForState(stateName);
                                            if (zone) {
                                              setSelectedZone(zone);
                                            }
                                          }
                                        }
                                      }
                                    }
                                    setSelectedPincode(currentValue);
                                    resetSelections("pincode");
                                  } else {
                                    setSelectedPincode("");
                                    resetSelections("pincode");
                                  }
                                  setPincodeOpen(false);
                                  setSearchPincode("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedPincode === pincode ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {pincode}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedPincode && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("pincode")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>

                {/* Post Office */}
                <div className="relative">
                  <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedPincode}>
                    <SelectTrigger className="bg-amber-50 border-amber-200 focus:border-amber-400 cursor-pointer text-xs sm:text-sm h-8 sm:h-9 md:h-10">
                      <SelectValue placeholder="Village" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-amber-200 shadow-xl max-h-60 overflow-y-auto">
                      {selectedPincode && [
                        'Central Post Office', 
                        'Civil Lines Post Office', 
                        'Railway Station Post Office', 
                        'Market Post Office', 
                        'Industrial Area Post Office',
                        'University Post Office',
                        'Hospital Post Office',
                        'Bus Stand Post Office'
                      ].filter(postOffice => 
                        postOffice.toLowerCase().includes(searchPostOffice.toLowerCase())
                      ).map((postOffice) => (
                        <SelectItem 
                          key={postOffice} 
                          value={postOffice} 
                          className="text-gray-900 hover:bg-amber-50 hover:text-amber-900 focus:bg-amber-100 focus:text-amber-900 cursor-pointer py-2 px-3"
                        >
                          {postOffice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVillage && (
                    <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors" 
                      onClick={() => handleDoubleClick("village")}
                      title="Clear selection"
                    >
                      ×
                    </div>
                  )}
                </div>
              </div>

              {/* Clear All Button */}
              {(selectedZone || selectedState || selectedDiv || selectedDistrict || selectedTehsil || selectedPincode || selectedVillage) && (
                <div className="mb-4 sm:mb-6 text-center px-2">
                  <Button 
                    variant="outline" 
                    onClick={clearAllSelections}
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 text-xs sm:text-sm px-3 sm:px-4 py-2"
                  >
                    Clear All Selections
                  </Button>
                </div>
              )}

              {/* Current Selection Display */}
              <div className="mb-4 sm:mb-6 flex flex-wrap gap-1 sm:gap-2 justify-center px-2">
                {selectedCountry && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs sm:text-sm">
                    India: {selectedCountry}
                  </Badge>
                )}
                {selectedZone && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs sm:text-sm">
                    Zone: {selectedZone}
                  </Badge>
                )}
                {selectedState && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs sm:text-sm">
                    State: {selectedState}
                  </Badge>
                )}
                {selectedDiv && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs sm:text-sm">
                    Div: {selectedDiv}
                  </Badge>
                )}
                {selectedDistrict && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs sm:text-sm">
                    District: {selectedDistrict}
                  </Badge>
                )}
                {selectedTehsil && (
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 text-xs sm:text-sm">
                    Tehsil: {selectedTehsil}
                  </Badge>
                )}
                {selectedPincode && (
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs sm:text-sm">
                    Pincode: {selectedPincode}
                  </Badge>
                )}
                {selectedVillage && (
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 text-xs sm:text-sm">
                    Post Office: {selectedVillage}
                  </Badge>
                )}
              </div>

              {/* Committee Positions Table */}
              <CommitteeTable
                selectedCountry={selectedCountry}
                selectedZone={selectedZone}
                selectedState={selectedState}
                selectedDiv={selectedDiv}
                selectedDistrict={selectedDistrict}
                selectedTehsil={selectedTehsil}
                selectedPincode={selectedPincode}
                selectedVillage={selectedVillage}
                applications={applications}
                committeeMembers={committeeMembers}
                isLoadingApplications={isLoadingApplications}
                isInitialLoad={isInitialLoad}
                getApplicationKey={getApplicationKey}
                getImageSrc={getImageSrc}
                getTableTitle={getTableTitle}
                handleApplyClick={handleApplyClick}
                calculateDaysSinceApproval={calculateDaysSinceApproval}
                handleEditMember={handleEditMember}
                handleCopyReferralCode={handleCopyReferralCode}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />

              {/* Advisory Committee Table */}
              <AdvisoryTable
                selectedCountry={selectedCountry}
                selectedZone={selectedZone}
                selectedState={selectedState}
                selectedDiv={selectedDiv}
                selectedDistrict={selectedDistrict}
                selectedTehsil={selectedTehsil}
                selectedPincode={selectedPincode}
                selectedVillage={selectedVillage}
                applications={applications}
                isLoadingApplications={isLoadingApplications}
                isInitialLoad={isInitialLoad}
                getApplicationKey={getApplicationKey}
                getImageSrc={getImageSrc}
                getAdvisoryTableTitle={getAdvisoryTableTitle}
                handleAdvisoryApplyClick={handleAdvisoryApplyClick}
                calculateDaysSinceApproval={calculateDaysSinceApproval}
                handleEditMember={handleEditMember}
                handleCopyReferralCode={handleCopyReferralCode}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />


            </CardContent>
          </Card>
        </div>
      </section>

      {/* Committee Tables Section - Remove the duplicate committee positions table */}
      <section className="py-16 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-4">

          {/* Membership Charges Table */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8 text-center">
              Membership Charges
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-amber-200 rounded-lg shadow-lg max-w-3xl mx-auto">
                <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-amber-900 font-semibold border-b border-amber-200">Membership Type</th>
                    <th className="px-4 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Charges</th>
                    <th className="px-4 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Name</th>
                    <th className="px-4 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Photo</th>
                    <th className="px-4 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Phone</th>
                    <th className="px-4 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Status</th>
                    <th className="px-4 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Apply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">


                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700 font-medium">Land Owner</td>
                    <td className="px-4 py-2 text-center text-gray-700 font-semibold text-green-600">25000</td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Land Owner Membership")] ? (
                        <div className="text-sm font-medium">{applications[getApplicationKey("Land Owner Membership")].name}</div>
                      ) : (
                        <span className="text-gray-400 text-sm">Available</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Land Owner Membership")]?.photo ? (
                        <img 
                          src={getImageSrc(applications[getApplicationKey("Land Owner Membership")])} 
                          alt={applications[getApplicationKey("Land Owner Membership")].name} 
                          className="w-12 h-16 rounded object-cover border-2 border-amber-600 shadow-sm mx-auto"
                        />
                      ) : (
                        applications[getApplicationKey("Land Owner Membership")] ? (
                          <div className="w-12 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-xs font-semibold border-2 border-amber-600 shadow-sm mx-auto">
                            {applications[getApplicationKey("Land Owner Membership")].name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ) : null
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700">
                      {applications[getApplicationKey("Land Owner Membership")] ? 
                        applications[getApplicationKey("Land Owner Membership")].phone : 
                        "Available after application"
                      }
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Land Owner Membership")] ? (
                        <Badge variant="outline" className="text-xs">
                          {applications[getApplicationKey("Land Owner Membership")].status}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                          Available
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {!applications[getApplicationKey("Land Owner Membership")] && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApplyClick("Land Owner Membership")}
                          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs px-4 py-1"
                        >
                          Apply Now
                        </Button>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700 font-medium">Developer per Company</td>
                    <td className="px-4 py-2 text-center text-gray-700 font-semibold text-green-600">25000</td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Developer Membership")] ? (
                        <div className="text-sm font-medium">{applications[getApplicationKey("Developer Membership")].name}</div>
                      ) : (
                        <span className="text-gray-400 text-sm">Available</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Developer Membership")]?.photo ? (
                        <img 
                          src={getImageSrc(applications[getApplicationKey("Developer Membership")])} 
                          alt={applications[getApplicationKey("Developer Membership")].name} 
                          className="w-12 h-16 rounded object-cover border-2 border-amber-600 shadow-sm mx-auto"
                        />
                      ) : (
                        applications[getApplicationKey("Developer Membership")] ? (
                          <div className="w-12 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-xs font-semibold border-2 border-amber-600 shadow-sm mx-auto">
                            {applications[getApplicationKey("Developer Membership")].name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ) : null
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700">
                      {applications[getApplicationKey("Developer Membership")] ? 
                        applications[getApplicationKey("Developer Membership")].phone : 
                        "Available after application"
                      }
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Developer Membership")] ? (
                        <Badge variant="outline" className="text-xs">
                          {applications[getApplicationKey("Developer Membership")].status}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                          Available
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {!applications[getApplicationKey("Developer Membership")] && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApplyClick("Developer Membership")}
                          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs px-4 py-1"
                        >
                          Apply Now
                        </Button>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-4 py-2 text-gray-700 font-medium">Real Estate Agent</td>
                    <td className="px-4 py-2 text-center text-gray-700 font-semibold text-green-600">5000</td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Real Estate Agent Membership")] ? (
                        <div className="text-sm font-medium">{applications[getApplicationKey("Real Estate Agent Membership")].name}</div>
                      ) : (
                        <span className="text-gray-400 text-sm">Available</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Real Estate Agent Membership")]?.photo ? (
                        <img 
                          src={getImageSrc(applications[getApplicationKey("Real Estate Agent Membership")])} 
                          alt={applications[getApplicationKey("Real Estate Agent Membership")].name} 
                          className="w-12 h-16 rounded object-cover border-2 border-amber-600 shadow-sm mx-auto"
                        />
                      ) : (
                        applications[getApplicationKey("Real Estate Agent Membership")] ? (
                          <div className="w-12 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-xs font-semibold border-2 border-amber-600 shadow-sm mx-auto">
                            {applications[getApplicationKey("Real Estate Agent Membership")].name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ) : null
                      )}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700">
                      {applications[getApplicationKey("Real Estate Agent Membership")] ? 
                        applications[getApplicationKey("Real Estate Agent Membership")].phone : 
                        "Available after application"
                      }
                    </td>
                    <td className="px-4 py-2 text-center">
                      {applications[getApplicationKey("Real Estate Agent Membership")] ? (
                        <Badge variant="outline" className="text-xs">
                          {applications[getApplicationKey("Real Estate Agent Membership")].status}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                          Available
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {!applications[getApplicationKey("Real Estate Agent Membership")] && (
                        <Button 
                          size="sm" 
                          onClick={() => handleApplyClick("Real Estate Agent Membership")}
                          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs px-4 py-1"
                        >
                          Apply Now
                        </Button>
                      )}
                    </td>
                  </tr>


                </tbody>
              </table>
            </div>
          </div>

          {/* Committee Charges Table */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8 text-center">
              Charges for Becoming Committee Member
            </h2>
            <p className="text-center text-amber-700 mb-6 text-lg"></p>
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-amber-200 rounded-lg shadow-lg">
                <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-amber-900 font-semibold border-b border-amber-200">Position</th>
                    <th className="px-3 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">No of Post</th>
                    <th className="px-3 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Post in each Committee</th>
                    <th className="px-3 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Total Post</th>
                    <th className="px-3 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Post Given</th>
                    <th className="px-3 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Post Available</th>
                    <th className="px-3 py-2 text-center text-amber-900 font-semibold border-b border-amber-200">Per Post Holder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">India</td>
                    <td className="px-3 py-2 text-center text-gray-700">1</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-red-600">5</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">16</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">500000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">Zone</td>
                    <td className="px-3 py-2 text-center text-gray-700">6</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">126</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-red-600">10</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">116</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">200000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">State</td>
                    <td className="px-3 py-2 text-center text-gray-700">32</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">672</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-red-600">50</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">622</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">150000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">Div</td>
                    <td className="px-3 py-2 text-center text-gray-700">120</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">2520</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-orange-600">0</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">2520</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">125000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">District</td>
                    <td className="px-3 py-2 text-center text-gray-700">650</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">13650</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-orange-600">0</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">13650</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">100000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">Tehsil</td>
                    <td className="px-3 py-2 text-center text-gray-700">5000</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">105000</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-orange-600">0</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">105000</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">75000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">Pincode</td>
                    <td className="px-3 py-2 text-center text-gray-700">20000</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">420000</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-orange-600">0</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">420000</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">60000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors">
                    <td className="px-2 py-1 text-gray-700 text-sm font-medium">Village</td>
                    <td className="px-3 py-2 text-center text-gray-700">120000</td>
                    <td className="px-3 py-2 text-center text-gray-700">21</td>
                    <td className="px-3 py-2 text-center text-gray-700">2520000</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-orange-600">0</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">2520000</td>
                    <td className="px-3 py-2 text-center text-gray-700 font-semibold text-green-600">50000</td>
                  </tr>
                  <tr className="hover:bg-amber-50 transition-colors bg-amber-100">
                    <td className="px-3 py-2 text-amber-900 font-bold">Total</td>
                    <td className="px-3 py-2 text-center text-gray-700"></td>
                    <td className="px-3 py-2 text-center text-gray-700"></td>
                    <td className="px-3 py-2 text-center text-amber-900 font-bold">3061989</td>
                    <td className="px-3 py-2 text-center text-amber-900 font-bold">65</td>
                    <td className="px-3 py-2 text-center text-amber-900 font-bold">3061924</td>
                    <td className="px-3 py-2 text-center text-gray-700"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </section>



      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              About LDOIA
            </h2>
            <p className="text-lg text-amber-700 max-w-4xl mx-auto">
              The Land Developers & Owners India Association is dedicated to promoting sustainable land development and protecting the interests of property owners across India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-amber-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-800">
                  <Eye className="h-6 w-6" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">To be India's leading association representing land developers and property owners, fostering ethical practices and sustainable development.</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Target className="h-6 w-6" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">To empower land developers and property owners through advocacy, education, and community building while promoting responsible development practices.</p>
              </CardContent>
            </Card>
            
            <Card className="border-amber-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-800">
                  <Building2 className="h-6 w-6" />
                  Our Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">A hierarchical organization structure spanning from village to national level, ensuring local representation and effective governance.</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/about">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-br from-amber-100 via-white to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Get in touch with LDOIA for all your land development and property needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-800">
                  <MapPin className="h-6 w-6" />
                  Head Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">605 Instantlly, Range Heights, Behram Baug, Jogeshwari West, Mumbai 400102</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Building className="h-6 w-6" />
                  Phone Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700"> 9967477227</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Apply for {applicationPosition}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApplicationModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* Photo Upload Section - First */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Photo Upload</h4>
                <p className="text-sm text-blue-700 mb-4">Please upload your photo first before filling the form</p>
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-800">Upload Photo <span className="text-red-500">*</span></label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'photo')}
                    className="cursor-pointer border-blue-300 focus:border-blue-500"
                  />
                  {applicationData.photo && (
                    <p className="text-sm text-green-600 mt-2 font-medium">✓ Photo selected: {applicationData.photo.name}</p>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h4>
                <p className="text-sm text-gray-600 mb-4">Provide your basic personal details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.firstName}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.lastName}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                    <Input
                      type="email"
                      value={applicationData.email}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className="w-full"
                    />
                    {/* OTP verification disabled for now - will be implemented in future */}
                    {/* <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpLoading || !applicationData.phone || isOtpVerified}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                      >
                        {otpLoading ? "Sending..." : isOtpVerified ? "✓ Verified" : "Send OTP"}
                      </Button>
                    </div>
                    {isOtpVerified && (
                      <p className="text-sm text-green-600 mt-1">✓ Phone number verified</p>
                    )} */}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <Input
                      type="date"
                      value={applicationData.dateOfBirth}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>
              </div>

              {/* OTP Verification Modal - Disabled for now, will be implemented in future */}
              {/* {showOtpVerification && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-900 mb-2">OTP Verification</h5>
                  <p className="text-sm text-yellow-700 mb-3">Enter the OTP sent to {applicationData.phone}</p>
                  <div className="flex gap-2">
                    <Input
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button onClick={verifyOtp} className="bg-green-600 hover:bg-green-700">
                      Verify
                    </Button>
                  </div>
                </div>
              )} */}

              {/* Professional Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Information</h4>
                <p className="text-sm text-gray-600 mb-4">Tell us about your professional background</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company/Organization <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.company}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your company/organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Designation <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.designation}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, designation: e.target.value }))}
                      placeholder="Enter your designation"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Years of Experience</label>
                    <select
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select experience range</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16-20">16-20 years</option>
                      <option value="20+">20+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Referral Information */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="text-lg font-semibold text-purple-900 mb-2">Referral Information</h4>
                <p className="text-sm text-purple-700 mb-4">Enter referral code if you have one (Optional)</p>
                <div>
                  <label className="block text-sm font-medium mb-1 text-purple-800">Referral Code</label>
                  <Input
                    value={applicationData.referralCode || ''}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, referralCode: e.target.value }))}
                    placeholder="Enter referral code (optional)"
                    className="border-purple-300 focus:border-purple-500"
                  />
                  <p className="text-xs text-purple-600 mt-1">
                    Get this code from an existing LDOIA member to get priority processing
                  </p>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Location Information</h4>
                <p className="text-sm text-gray-600 mb-4">Specify your geographical location for local networking</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      value={applicationData.formCountry}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, formCountry: e.target.value }))}
                      placeholder="Country"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.formState}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, formState: e.target.value }))}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Division <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.formDivision}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, formDivision: e.target.value }))}
                      placeholder="Enter your division"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">District <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.formDistrict}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, formDistrict: e.target.value }))}
                      placeholder="Enter your district"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.formCity}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, formCity: e.target.value }))}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pincode <span className="text-red-500">*</span></label>
                    <Input
                      value={applicationData.formPincode}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, formPincode: e.target.value }))}
                      placeholder="Enter your pincode"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Complete Address <span className="text-red-500">*</span></label>
                    <textarea
                      value={applicationData.completeAddress}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, completeAddress: e.target.value }))}
                      placeholder="Enter your complete address"
                      className="w-full p-2 border border-gray-300 rounded-md resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Document Upload</h4>
                <p className="text-sm text-gray-600 mb-4">Upload required documents for verification</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ID Proof (Aadhaar/Passport) <span className="text-red-500">*</span></label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'idProof')}
                      className="cursor-pointer"
                    />
                    {applicationData.idProof && (
                      <p className="text-sm text-green-600 mt-1">✓ {applicationData.idProof.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address Proof <span className="text-red-500">*</span></label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'addressProof')}
                      className="cursor-pointer"
                    />
                    {applicationData.addressProof && (
                      <p className="text-sm text-green-600 mt-1">✓ {applicationData.addressProof.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PAN Card <span className="text-red-500">*</span></label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, 'panCard')}
                      className="cursor-pointer"
                    />
                    {applicationData.panCard && (
                      <p className="text-sm text-green-600 mt-1">✓ {applicationData.panCard.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowApplicationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplicationSubmit}
                className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Member Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEditModal(false);
                  setEditOtpValue("");
                  setIsEditOtpVerified(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              {editMemberData.verificationStep === "credentials" ? (
                /* Credential Verification Step */
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Verify Your Identity
                    </h4>
                    <p className="text-sm text-gray-600">
                      Please enter your Applicant ID and Password for <strong>{editMemberData.memberName}</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Phone Number (ID) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={editMemberData.applicantId}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, applicantId: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter your registered phone number (e.g., 9967477227)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="password"
                        value={editMemberData.password}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter first 4 letters of your name in uppercase (e.g., RAJE for Rajesh Modi)
                      </p>
                    </div>

                    {/* Forget Password Option */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPasswordModal(true);
                          setShowEditModal(false);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={verifyCredentials}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Verify & Continue
                    </Button>
                  </div>
                </div>
              ) : (
                /* Edit Form Step */
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Edit Details for {editMemberData.memberName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Update your information below
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                    <p className="text-sm text-green-800">
                      Welcome! You can now update your information below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input
                        value={editMemberData.firstName}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input
                        value={editMemberData.lastName}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input
                        value={editMemberData.phone}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input
                        type="email"
                        value={editMemberData.email}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        value={editMemberData.company}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, company: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Designation</label>
                      <Input
                        value={editMemberData.designation}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, designation: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter designation"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Complete Address</label>
                      <textarea
                        value={editMemberData.completeAddress}
                        onChange={(e) => setEditMemberData(prev => ({ ...prev, completeAddress: e.target.value }))}
                        disabled={!isEditOtpVerified}
                        placeholder="Enter complete address"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Update Photo</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileUpload}
                        disabled={!isEditOtpVerified}
                        className="cursor-pointer disabled:cursor-not-allowed"
                      />
                      {editMemberData.photo && (
                        <p className="text-sm text-green-600 mt-1">✓ New photo selected</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditSubmit}
                      disabled={!isEditOtpVerified}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50"
                    >
                      Update Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal for Edit */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Verify OTP</h4>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit OTP sent to your registered email/phone for {editMemberData.memberName}
            </p>
            
            <div className="space-y-4">
              <Input
                type="text"
                value={editOtpValue}
                onChange={(e) => setEditOtpValue(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowOtpModal(false);
                    setEditOtpValue("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={verifyEditOtp}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Verify OTP
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents View Modal */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-900">
                  Documents - {selectedCandidate?.name || selectedCandidate?.applicant_name}
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDocumentsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidateDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{doc.name}</h5>
                      <Badge variant="outline" className="text-xs">
                        {doc.type === 'application/pdf' ? 'PDF' : 'Image'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Size: {doc.size}</p>
                    <p className="text-sm text-gray-600 mb-3">Uploaded: {doc.uploadedAt}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {candidateDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No documents uploaded yet.
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <Button
                onClick={() => setShowDocumentsModal(false)}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Code Modal */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Referral Code</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReferralModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Referral code for
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-2xl font-bold text-amber-800 tracking-widest">
                  {referralCode}
                </p>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                Share this code with new applicants. When they join using this code and get approved, your referral count will increase.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowReferralModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleCopyReferralCode()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  Copy Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotPasswordStep("phone");
                  setForgotPasswordData({
                    phoneNumber: "",
                    otp: "",
                    newPassword: "",
                    confirmPassword: ""
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step 1: Enter Phone Number */}
            {forgotPasswordStep === "phone" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Enter Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={forgotPasswordData.phoneNumber}
                    onChange={(e) => setForgotPasswordData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter your registered phone number"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the phone number registered with your account
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={sendForgotPasswordOtp}
                    disabled={forgotPasswordLoading || !forgotPasswordData.phoneNumber}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {forgotPasswordLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Enter OTP */}
            {forgotPasswordStep === "otp" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={forgotPasswordData.otp}
                    onChange={(e) => setForgotPasswordData(prev => ({ ...prev, otp: e.target.value }))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    OTP sent to {forgotPasswordData.phoneNumber}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setForgotPasswordStep("phone")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={verifyForgotPasswordOtp}
                    disabled={!forgotPasswordData.otp}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Verify OTP
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {forgotPasswordStep === "newPassword" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={forgotPasswordData.newPassword}
                    onChange={(e) => setForgotPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 4 characters long
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    value={forgotPasswordData.confirmPassword}
                    onChange={(e) => setForgotPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Re-enter your new password to confirm
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setForgotPasswordStep("otp")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={resetPassword}
                    disabled={!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Reset Password
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-amber-800"><strong>LDOIA</strong></h3>
              </div>
              <p className="text-amber-700 text-sm">
                India's premier association for land developers and property owners, promoting sustainable development and protecting member interests.
              </p>
            </div>
            
            <div>
              <h4 className="text-amber-800 font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li><Link to="/ldoai/about" className="hover:text-amber-900 transition-colors">About LDOAI</Link></li>
                <li><Link to="/ldoai/committee" className="hover:text-amber-900 transition-colors">Committee Structure</Link></li>
                <li><Link to="/ldoai/benefits" className="hover:text-amber-900 transition-colors">Membership Benefits</Link></li>
                <li><Link to="/ldoai/apply" className="hover:text-amber-900 transition-colors">Apply Now</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-amber-800 font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>Government Liaison</li>
                <li>Legal Advisory</li>
                <li>Networking Events</li>
                <li>Industry Updates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-amber-800 font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>Email: ldoai.info1@gmail.com</li>
                <li>Phone:  9967477227</li>
                <li>Address: Mumbai, Maharashtra</li> 
              </ul>
            </div>
          </div>
          
          <div className="border-t border-amber-200 mt-8 pt-8 text-center text-sm text-amber-600">
            <p>&copy; 2024 LDOIA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

