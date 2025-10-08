import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Phone, Mail, Calendar, MapPin, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IDCard from "./IDCard";

interface CommitteeTableProps {
  selectedCountry: string;
  selectedZone: string;
  selectedState: string;
  selectedDiv: string;
  selectedDistrict: string;
  selectedTehsil: string;
  selectedPincode: string;
  selectedVillage: string;
  applications: Record<string, any>;
  committeeMembers: Array<any>;
  isLoadingApplications: boolean;
  isInitialLoad: boolean;
  getApplicationKey: (position: string) => string;
  getImageSrc: (application: any) => string;
  getTableTitle: () => string;
  handleApplyClick: (position: string) => void;
  calculateDaysSinceApproval: (approvedDate: string) => number;
  handleEditMember: (name: string) => void;
  handleCopyReferralCode: (code: string) => void;
  openDropdown: string;
  setOpenDropdown: (value: string) => void;
}

export default function CommitteeTable(props: CommitteeTableProps) {
  const navigate = useNavigate();
  const {
    selectedCountry,
    selectedZone,
    selectedState,
    selectedDiv,
    selectedDistrict,
    selectedTehsil,
    selectedPincode,
    selectedVillage,
    applications,
    committeeMembers,
    isLoadingApplications,
    isInitialLoad,
    getApplicationKey,
    getImageSrc,
    getTableTitle,
    handleApplyClick,
    calculateDaysSinceApproval,
    handleEditMember,
    handleCopyReferralCode,
    openDropdown,
    setOpenDropdown,
  } = props;

  // State for ID Card modal
  const [showIDCard, setShowIDCard] = useState(false);
  const [selectedMemberForID, setSelectedMemberForID] = useState<any>(null);

  // Function to handle ID card display
  const handleShowIDCard = (application: any, position: string) => {
    const photoSrc = getImageSrc(application);
    console.log('🎴 Opening ID Card for:', application.name || application.applicant_name);
    console.log('📸 Photo source:', photoSrc);
    console.log('📦 Application data:', application);
    
    setSelectedMemberForID({
      name: application.name || application.applicant_name,
      phone: application.phone || application.phone_number,
      photo: photoSrc, // Use getImageSrc to handle all photo formats
      appliedPost: application.appliedPost || application.applied_position || position,
      location: application.location || {},
      applicationId: application._id || application.id,
    });
    setShowIDCard(true);
  };

  // Debug logging to track when applications prop updates
  useEffect(() => {
    console.log('📊 CommitteeTable: applications prop updated');
    console.log('📊 Application keys in prop:', Object.keys(applications));
    console.log('📊 Total applications:', Object.keys(applications).length);
  }, [applications]);

  if (!selectedCountry) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900 mb-4 sm:mb-6 text-center px-2">
        {getTableTitle()}
      </h3>
      
      {/* Loading indicator - only show on initial load if no cached data */}
      {isLoadingApplications && isInitialLoad && Object.keys(applications).length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 mx-2 sm:mx-0">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 font-medium">📥 Loading applications from database...</p>
          </div>
        </div>
      )}
      
      {/* Background refresh indicator - show subtle indicator when refreshing with cached data */}
      {isLoadingApplications && !isInitialLoad && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4 mx-2 sm:mx-0">
          <p className="text-green-700 text-sm text-center">🔄 Refreshing applications...</p>
        </div>
      )}
      
      <div className="overflow-x-auto bg-amber-50 rounded-lg shadow-lg border border-amber-600 mx-2 sm:mx-0">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-amber-800 to-orange-800">
            <tr>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">S No</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Post</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Designation</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Name</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Photo</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Phone</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Contribution</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Introduced</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Days</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Status</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Others</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-600 bg-amber-100">
            {!selectedZone ? (
              <>
                {/* India Level - 25 Positions */}
                {[
                  { position: "President", designation: "" },
                  { position: "Secretary", designation: "" },
                  { position: "Treasurer", designation: "" },
                  { position: "Chairman Land Developer", designation: "Land Developer" },
                  { position: "Chairman Building Developer", designation: "Building Developer" },
                  { position: "Chairman Estate Consultant", designation: "Estate Consultant" },
                  { position: "Chairman Subcidy Collection", designation: "Subcidy Collection" },
                  { position: "Chairman Bank Institution Pvt Loan", designation: "Bank Institution Pvt Loan" },
                  { position: "Chairman Development Fund", designation: "Development Fund" },
                  { position: "Chairman Govt Liasoning", designation: "Govt Liasoning" },
                  { position: "Chairman Collector Town Planner PR", designation: "Collector Town Planner PR" },
                  { position: "Chairman Prant & Tehsildar PR", designation: "Prant & Tehsildar PR" },
                  { position: "Chairman Talathi & Circle PR", designation: "Talathi & Circle PR" },
                  { position: "Chairman Police PR", designation: "Police PR" },
                  { position: "Chairman Media PR & Latest News", designation: "Media PR & Latest News" },
                  { position: "Chairman Property Marketing", designation: "Property Marketing" },
                  { position: "Chairman Dispute Solution", designation: "Dispute Solution" },
                  { position: "Chairman Payment Recovery", designation: "Payment Recovery" },
                  { position: "Chairman Property Security", designation: "Property Security" },
                  { position: "Chairman Agriculture", designation: "Agriculture" },
                  { position: "Chairman Architect", designation: "Architect" },
                  { position: "Chairman Advocate", designation: "Advocate" },
                  { position: "Chairman Chartered Accountant", designation: "Chartered Accountant" },
                  { position: "Chairman Membership Growth", designation: "Membership Growth" },
                  { position: "Chairman Training", designation: "Training" }
                ].map((item, index) => {
                  const positionKey = getApplicationKey(item.position);
                  const app = applications[positionKey];
                  const post = item.position.split(' ')[0]; // "President", "Secretary", "Chairman"
                  
                  // Debug: Log key lookup for the first position to track rendering
                  if (index === 0) {
                    console.log(`🔍 Rendering ${item.position}:`);
                    console.log(`  - Position key: ${positionKey}`);
                    console.log(`  - Application found: ${!!app}`);
                    console.log(`  - Application data:`, app);
                    console.log(`  - Will render: ${app ? 'Name: ' + app.name : 'Apply Now button'}`);
                  }
                  
                  return (
                    <tr key={index + 1} className="hover:bg-amber-200 transition-colors bg-amber-50">
                      <td className="px-3 py-2 text-amber-800 text-sm">{index + 1}</td>
                      <td className="px-3 py-2 text-amber-800 text-sm">{post}</td>
                      <td className="px-3 py-2 text-amber-800 text-sm">{item.designation}</td>
                      <td className="px-3 py-2 text-amber-800">
                        {app ? (
                          <div className="text-sm font-medium">{app.name}</div>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyClick(item.position)}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs px-3 py-1"
                          >
                            Apply Now
                          </Button>
                        )}
                      </td>
                      <td className="px-3 py-2 text-amber-800">
                        {app?.photo ? (
                          <img 
                            src={getImageSrc(app)} 
                            alt={app.name} 
                            className="w-12 h-16 rounded object-cover border-2 border-amber-600 shadow-sm"
                          />
                        ) : (
                          app ? (
                            <div className="w-12 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-xs font-semibold border-2 border-amber-600 shadow-sm">
                              {app.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          ) : null
                        )}
                      </td>
                      <td className="px-3 py-2 text-amber-800 font-medium text-sm">
                        {app ? app.phone : "Available after selection"}
                      </td>
                      <td className="px-3 py-2 text-amber-800 font-semibold text-blue-700 text-sm">₹5,00,000</td>
                      <td className="px-3 py-2 text-amber-800 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {app ? (app.introduced || 0) : "-"}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-amber-800 text-sm">
                        {app ? (
                          <span className="text-amber-700 font-medium">
                            Day {calculateDaysSinceApproval(app.appliedDate || app.created_at || new Date().toISOString())}
                          </span>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                            Available
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-amber-800 text-sm">
                        {app ? (
                          <Badge variant="outline" className="text-xs">
                            {app.status}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                            Available
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-amber-800 text-sm">
                        <div className="relative dropdown-container">
                          {app && app.status === 'approved' ? (
                            <>
                              {openDropdown === `india-position-${index + 1}` && (
                                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 min-w-[140px] animate-in slide-in-from-top-2 duration-200">
                                  <div className="py-1">
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-blue-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                      onClick={() => {
                                        handleShowIDCard(app, item.position);
                                        setOpenDropdown('');
                                      }}
                                    >
                                      <span>ID Card</span>
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 text-green-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                      onClick={() => {
                                        handleEditMember(app.name);
                                        setOpenDropdown('');
                                      }}
                                    >
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 text-purple-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                      onClick={() => {
                                        handleCopyReferralCode(`INDIA-${item.position.replace(/\s+/g, '-').toUpperCase()}`);
                                        setOpenDropdown('');
                                      }}
                                    >
                                      <span>Referral Code</span>
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 text-orange-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium"
                                      onClick={() => {
                                        console.log('🎯 Promotion clicked for app:', app);
                                        console.log('🎯 Available ID fields:', {
                                          _id: app._id,
                                          id: app.id,
                                          applicationId: app.application_id,
                                          objectId: app.objectId
                                        });
                                        const memberId = app._id || app.id || app.application_id || app.objectId;
                                        console.log('🎯 Using memberId:', memberId);
                                        navigate(`/promotion?memberId=${memberId}`);
                                        setOpenDropdown('');
                                      }}
                                    >
                                      <span>Promotion</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 text-xs px-2 py-1 rounded-md shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown(openDropdown === `india-position-${index + 1}` ? '' : `india-position-${index + 1}`);
                                }}
                              >
                                Actions ▼
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-500 text-xs px-2 py-1"
                              onClick={() => {
                                alert('This position is not yet approved. ID Card and Edit options are only available for approved positions.');
                              }}
                            >
                              Actions ▼
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              /* Other levels - Zone, State, Division, etc. */
              Array.from({ length: 25 }, (_, index) => {
                const getCurrentLevel = () => {
                  if (selectedVillage) return { level: 'village', price: '₹50,000', feeAmount: '50000' };
                  if (selectedPincode) return { level: 'pincode', price: '₹60,000', feeAmount: '60000' };
                  if (selectedTehsil) return { level: 'tehsil', price: '₹75,000', feeAmount: '75000' };
                  if (selectedDistrict) return { level: 'district', price: '₹1,00,000', feeAmount: '100000' };
                  if (selectedDiv) return { level: 'division', price: '₹1,25,000', feeAmount: '125000' };
                  if (selectedState) return { level: 'state', price: '₹1,50,000', feeAmount: '150000' };
                  return { level: 'zone', price: '₹2,00,000', feeAmount: '200000' };
                };
                
                const { level, price, feeAmount } = getCurrentLevel();
                
                const getPositionDetails = (index: number) => {
                  const positions = [
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} President`, designation: '', id: 'president' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Secretary`, designation: '', id: 'secretary' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Treasurer`, designation: '', id: 'treasurer' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Land Developer', id: 'chairman-land-developer' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Building Developer', id: 'chairman-building-developer' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Estate Consultant', id: 'chairman-estate-consultant' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Subcidy Collection', id: 'chairman-subcidy-collection' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Bank Institution Pvt Loan', id: 'chairman-bank-institution' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Development Fund', id: 'chairman-development-fund' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Govt Liasoning', id: 'chairman-govt-liasoning' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Collector Town Planner PR', id: 'chairman-collector-town-planner' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Prant & Tehsildar PR', id: 'chairman-prant-tehsildar' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Talathi & Circle PR', id: 'chairman-talathi-circle' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Police PR', id: 'chairman-police-pr' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Media PR & Latest News', id: 'chairman-media-pr' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Property Marketing', id: 'chairman-property-marketing' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Dispute Solution', id: 'chairman-dispute-solution' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Payment Recovery', id: 'chairman-payment-recovery' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Property Security', id: 'chairman-property-security' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Agriculture', id: 'chairman-agriculture' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Architect', id: 'chairman-architect' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Advocate', id: 'chairman-advocate' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Chartered Accountant', id: 'chairman-chartered-accountant' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Membership Growth', id: 'chairman-membership-growth' },
                    { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: 'Training', id: 'chairman-training' }
                  ];
                  return positions[index] || { post: `${level.charAt(0).toUpperCase() + level.slice(1)} Chairman`, designation: '', id: 'chairman-general' };
                };

                const positionDetails = getPositionDetails(index);
                const fullTitle = positionDetails.designation ? 
                  `${positionDetails.post} ${positionDetails.designation}` : 
                  positionDetails.post;
                
                const app = applications[getApplicationKey(fullTitle)];
                
                return (
                  <tr key={index + 1} className="hover:bg-amber-200 transition-colors bg-amber-50">
                    <td className="px-3 py-2 text-amber-800 text-sm">{index + 1}</td>
                    <td className="px-3 py-2 text-amber-800 text-sm">{positionDetails.post}</td>
                    <td className="px-3 py-2 text-amber-800 text-sm">{positionDetails.designation}</td>
                    <td className="px-3 py-2 text-amber-800">
                      {app ? (
                        <div className="text-sm font-medium">{app.name}</div>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleApplyClick(fullTitle)}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs px-3 py-1"
                        >
                          Apply Now
                        </Button>
                      )}
                    </td>
                    <td className="px-3 py-2 text-amber-800">
                      {app?.photo ? (
                        <img 
                          src={getImageSrc(app)} 
                          alt={app.name} 
                          className="w-12 h-16 rounded object-cover border-2 border-amber-600 shadow-sm"
                        />
                      ) : (
                        app ? (
                          <div className="w-12 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center text-white text-xs font-semibold border-2 border-amber-600 shadow-sm">
                            {app.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                        ) : null
                      )}
                    </td>
                    <td className="px-3 py-2 text-amber-800 font-medium text-sm">
                      {app ? app.phone : 'Available after selection'}
                    </td>
                    <td className="px-3 py-2 text-amber-800 font-semibold text-blue-700 text-sm">
                      {price}
                    </td>
                    <td className="px-3 py-2 text-amber-800 text-sm">
                      <Badge variant="outline" className="text-xs">
                        {app ? (app.introduced || 0) : "-"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-amber-800 text-sm">
                      {app ? (
                        <span className="text-amber-700 font-medium">
                          Day {calculateDaysSinceApproval(app.appliedDate || app.created_at || new Date().toISOString())}
                        </span>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                          Available
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-amber-800 text-sm">
                      {app ? (
                        <Badge variant="outline" className="text-xs">
                          {app.status}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                          Available
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-amber-800 text-sm">
                      <div className="relative dropdown-container">
                        {app ? (
                          <>
                            {openDropdown === `position-${index + 1}` && (
                              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 min-w-[140px] animate-in slide-in-from-top-2 duration-200">
                                <div className="py-1">
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-blue-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                    onClick={() => {
                                      handleShowIDCard(app, fullTitle);
                                      setOpenDropdown('');
                                    }}
                                  >
                                    <span>ID Card</span>
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 text-green-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                    onClick={() => {
                                      handleEditMember(app.name);
                                      setOpenDropdown('');
                                    }}
                                  >
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 text-purple-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                    onClick={() => {
                                      handleCopyReferralCode(`${positionDetails.id.toUpperCase()}${index + 1}`);
                                      setOpenDropdown('');
                                    }}
                                  >
                                    <span>Referral Code</span>
                                  </button>
                                  <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 text-orange-700 rounded-md flex items-center gap-2 transition-all duration-200 font-medium"
                                    onClick={() => {
                                      console.log('🎯 Promotion clicked for app:', app);
                                      const memberId = app._id || app.id || app.application_id || app.objectId;
                                      console.log('🎯 Using memberId:', memberId);
                                      navigate(`/promotion?memberId=${memberId}`);
                                      setOpenDropdown('');
                                    }}
                                  >
                                    <span>Promotion</span>
                                  </button>
                                </div>
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 text-xs px-2 py-1 rounded-md shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === `position-${index + 1}` ? '' : `position-${index + 1}`);
                              }}
                            >
                              Actions ▼
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-500 text-xs px-2 py-1"
                            onClick={() => {
                              alert('This position is not yet filled. Actions are only available after someone applies and gets approved.');
                            }}
                          >
                            Actions ▼
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ID Card Modal */}
      {showIDCard && selectedMemberForID && (
        <IDCard
          member={selectedMemberForID}
          onClose={() => setShowIDCard(false)}
        />
      )}
    </div>
  );
}
