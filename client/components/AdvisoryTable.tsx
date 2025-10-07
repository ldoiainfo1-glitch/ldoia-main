import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IDCard from "./IDCard";

interface AdvisoryTableProps {
  selectedCountry: string;
  selectedZone: string;
  selectedState: string;
  selectedDiv: string;
  selectedDistrict: string;
  selectedTehsil: string;
  selectedPincode: string;
  selectedVillage: string;
  applications: Record<string, any>;
  isLoadingApplications: boolean;
  isInitialLoad: boolean;
  getApplicationKey: (position: string) => string;
  getImageSrc: (application: any) => string;
  getAdvisoryTableTitle: () => string;
  handleAdvisoryApplyClick: (level: string) => void;
  calculateDaysSinceApproval: (approvedDate: string) => number;
  handleEditMember: (name: string) => void;
  handleCopyReferralCode: (code: string) => void;
  openDropdown: string;
  setOpenDropdown: (value: string) => void;
}

function AdvisoryTable({
  selectedCountry,
  selectedZone,
  selectedState,
  selectedDiv,
  selectedDistrict,
  selectedTehsil,
  selectedPincode,
  selectedVillage,
  applications,
  isLoadingApplications,
  isInitialLoad,
  getApplicationKey,
  getImageSrc,
  getAdvisoryTableTitle,
  handleAdvisoryApplyClick,
  calculateDaysSinceApproval,
  handleEditMember,
  handleCopyReferralCode,
  openDropdown,
  setOpenDropdown
}: AdvisoryTableProps) {
  const navigate = useNavigate();
  
  // State for ID Card modal
  const [showIDCard, setShowIDCard] = useState(false);
  const [selectedMemberForID, setSelectedMemberForID] = useState<any>(null);

  // Function to handle ID card display
  const handleShowIDCard = (application: any, position: string) => {
    setSelectedMemberForID({
      name: application.name || application.applicant_name,
      phone: application.phone || application.phone_number,
      photo: getImageSrc(application), // Use getImageSrc to handle all photo formats
      appliedPost: application.appliedPost || application.applied_position || position,
      location: application.location || {},
      applicationId: application._id || application.id,
    });
    setShowIDCard(true);
  };

  // Debug logging to track when applications prop updates
  useEffect(() => {
    console.log('📊 AdvisoryTable: applications prop updated');
    console.log('📊 Application keys in prop:', Object.keys(applications));
    console.log('📊 Total applications:', Object.keys(applications).length);
  }, [applications]);

  if (!selectedCountry) return null;

  return (
    <div className="mt-8 sm:mt-12">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900 mb-4 sm:mb-6 text-center px-2">
        {getAdvisoryTableTitle()}
      </h3>
      
      {/* Loading indicator - only show on initial load if no cached data */}
      {isLoadingApplications && isInitialLoad && Object.keys(applications).length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 mx-2 sm:mx-0">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 font-medium">📥 Loading advisory applications from database...</p>
          </div>
        </div>
      )}
      
      {/* Background refresh indicator - show subtle indicator when refreshing with cached data */}
      {isLoadingApplications && !isInitialLoad && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4 mx-2 sm:mx-0">
          <p className="text-green-700 text-sm text-center">🔄 Refreshing advisory applications...</p>
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
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Introduced</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Days</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Status</th>
              <th className="px-2 sm:px-3 py-2 text-left text-amber-100 font-semibold border-b border-amber-600 text-xs sm:text-sm">Others</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-600 bg-amber-100">
            {/* Advisory Level 1-15 - Similar to Committee structure */}
            {[
              { position: "Advisory Level 1", designation: "Available" },
              { position: "Advisory Level 2", designation: "Available" },
              { position: "Advisory Level 3", designation: "Available" },
              { position: "Advisory Level 4", designation: "Available" },
              { position: "Advisory Level 5", designation: "Available" },
              { position: "Advisory Level 6", designation: "Available" },
              { position: "Advisory Level 7", designation: "Available" },
              { position: "Advisory Level 8", designation: "Available" },
              { position: "Advisory Level 9", designation: "Available" },
              { position: "Advisory Level 10", designation: "Available" },
              { position: "Advisory Level 11", designation: "Available" },
              { position: "Advisory Level 12", designation: "Available" },
              { position: "Advisory Level 13", designation: "Available" },
              { position: "Advisory Level 14", designation: "Available" },
              { position: "Advisory Level 15", designation: "Available" }
            ].map((item, index) => {
              const positionKey = getApplicationKey(item.position);
              const app = applications[positionKey];
              
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
                  <td className="px-3 py-2 text-amber-800 text-sm">{item.position}</td>
                  <td className="px-3 py-2 text-amber-800 text-sm">{app ? app.currentDesignation || item.designation : item.designation}</td>
                  <td className="px-3 py-2 text-amber-800">
                    {app ? (
                      <div className="text-sm font-medium">{app.name}</div>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleAdvisoryApplyClick(item.position)}
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
                  <td className="px-3 py-2 text-amber-800 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {app ? (app.introduced || 0) : "-"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-amber-800 text-sm">
                    {app ? (
                      <span className="text-amber-700 font-medium">
                        Day {calculateDaysSinceApproval(app.appliedDate || new Date().toISOString())}
                      </span>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                        -
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-2 text-amber-800 text-sm">
                    {app ? (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          app.status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                          'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        {app.status}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                        Available
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-2 text-amber-800 text-sm">
                    {app ? (
                      <div className="relative dropdown-container">
                        {openDropdown === `advisory-${index}` && (
                          <div className="absolute top-8 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-30 min-w-[120px] animate-in slide-in-from-top-2 duration-200">
                            <div className="p-1">
                              <button
                                className="w-full text-left px-2 py-1.5 text-xs hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-blue-700 rounded flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                onClick={() => {
                                  handleShowIDCard(app, item.position);
                                  setOpenDropdown('');
                                }}
                              >
                                <span>ID Card</span>
                              </button>
                              <button
                                className="w-full text-left px-2 py-1.5 text-xs hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 text-green-700 rounded flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                onClick={() => {
                                  handleEditMember(app.name);
                                  setOpenDropdown('');
                                }}
                              >
                                <span>Edit</span>
                              </button>
                              <button
                                className="w-full text-left px-2 py-1.5 text-xs hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 text-purple-700 rounded flex items-center gap-2 transition-all duration-200 font-medium border-b border-gray-100"
                                onClick={() => {
                                  handleCopyReferralCode(`INDIA-${item.position.replace(/\s+/g, '-').toUpperCase()}`);
                                  setOpenDropdown('');
                                }}
                              >
                                <span>Referral Code</span>
                              </button>
                              <button
                                className="w-full text-left px-2 py-1.5 text-xs hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 text-orange-700 rounded flex items-center gap-2 transition-all duration-200 font-medium"
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
                          className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700 text-xs px-1 sm:px-1.5 py-0.5 rounded shadow-sm hover:shadow transition-all duration-200 font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === `advisory-${index}` ? '' : `advisory-${index}`);
                          }}
                        >
                          <span className="hidden sm:inline">Actions</span>
                          <span className="sm:hidden">⋯</span>
                        </Button>
                      </div>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                        Available
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
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

export default AdvisoryTable;
