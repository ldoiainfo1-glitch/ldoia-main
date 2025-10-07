import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Download,
  Eye,
  Mail,
  Phone
} from 'lucide-react';

interface Application {
  _id: string;
  application_id: string;
  name: string;
  phone: string;
  email: string;
  appliedPost: string;
  currentDesignation?: string;
  price: number;
  application_status: string;
  location: {
    country: string;
    zone?: string;
    state?: string;
    division?: string;
    district?: string;
    tehsil?: string;
    pincode?: string;
    village?: string;
  };
  photo_path?: string;
  created_at: string;
}

interface CommitteeTableAdminProps {
  refreshKey: number;
  onStatusChange: () => void;
}

export default function CommitteeTableAdmin({ refreshKey, onStatusChange }: CommitteeTableAdminProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api';

  // Fetch all committee applications
  const fetchApplications = async () => {
    try {
      console.log('📥 Fetching committee applications from dedicated collection...');
      setLoading(true);

      // Use the new committee-specific endpoint
      const response = await fetch(`${API_BASE_URL}/applications/committee`);
      const data = await response.json();

      if (data.success) {
        // Transform MongoDB data to match our Application interface
        const transformedData = data.data.map((app: any) => ({
          ...app,
          name: app.applicant_name || app.name || 'N/A',
          phone: app.phone_number || app.phone || 'N/A',
          email: app.email || 'N/A',
          appliedPost: app.applied_position || app.appliedPost || 'N/A',
          price: app.salary_expectation || app.price || 0
        }));

        console.log(`✅ Committee applications loaded: ${transformedData.length} (from committee_applications collection)`);
        setApplications(transformedData);
        setFilteredApplications(transformedData);
      }
    } catch (error) {
      console.error('❌ Error fetching committee applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateStatus = async (applicationId: string, newStatus: string) => {
    try {
      console.log(`🖱️ ${newStatus === 'approved' ? 'Approving' : 'Rejecting'} application:`, applicationId);

      const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      console.log('📤 Status update response:', result);

      if (result.success) {
        // Update local state instantly (Option B - Better UX)
        setApplications(prev =>
          prev.map(app =>
            app.application_id === applicationId 
              ? { ...app, application_status: newStatus } 
              : app
          )
        );

        setFilteredApplications(prev =>
          prev.map(app =>
            app.application_id === applicationId 
              ? { ...app, application_status: newStatus } 
              : app
          )
        );

        console.log(`✅ Application ${applicationId} status updated to: ${newStatus}`);
        
        // Notify parent to refresh stats
        onStatusChange();

        // Show success message
        alert(`✅ Application ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('❌ Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('❌ Error updating status. Please check the console.');
    }
  };

  // Filter applications
  useEffect(() => {
    let filtered = [...applications];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.phone || '').includes(searchTerm) ||
        (app.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.appliedPost || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => {
        const status = app.application_status || 'pending';
        return status === statusFilter;
      });
    }

    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  // Fetch on mount and when refreshKey changes
  useEffect(() => {
    fetchApplications();
  }, [refreshKey]);

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusLower = (status || 'pending').toLowerCase();
    
    switch (statusLower) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  // Get location display
  const getLocationDisplay = (location: Application['location']) => {
    if (!location) return 'N/A';
    if (location.village) return `${location.village}, ${location.pincode || ''}`;
    if (location.pincode) return location.pincode;
    if (location.tehsil) return location.tehsil;
    if (location.district) return location.district;
    if (location.division) return location.division;
    if (location.state) return location.state;
    if (location.zone) return location.zone;
    return location.country || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        <p className="ml-4 text-amber-700 font-medium">Loading committee applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="all">All Status ({applications.length})</option>
            <option value="pending">
              Pending ({applications.filter(a => !a.application_status || a.application_status === 'pending').length})
            </option>
            <option value="approved">
              Approved ({applications.filter(a => a.application_status === 'approved').length})
            </option>
            <option value="rejected">
              Rejected ({applications.filter(a => a.application_status === 'rejected').length})
            </option>
          </select>
        </div>

        <Button
          variant="outline"
          className="border-amber-300 hover:bg-amber-100"
          onClick={() => {
            console.log('📊 Exporting committee applications...');
            const csvContent = "data:text/csv;charset=utf-8," + 
              "Name,Phone,Email,Position,Location,Status,Applied Date\n" +
              filteredApplications.map(app => 
                `"${app.name}","${app.phone}","${app.email}","${app.appliedPost}","${getLocationDisplay(app.location)}","${app.application_status || 'pending'}","${app.created_at}"`
              ).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `committee_applications_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredApplications.length} of {applications.length} applications
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-amber-200">
        <table className="w-full min-w-[1200px]">
          <thead className="bg-gradient-to-r from-amber-700 to-orange-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">S.No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Position</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Fee</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Applied Date</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No applications found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredApplications.map((app, index) => (
                <tr 
                  key={app._id} 
                  className="hover:bg-amber-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {app.photo_path ? (
                        <img 
                          src={`${API_BASE_URL.replace('/api', '')}${app.photo_path}`}
                          alt={app.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-amber-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                          {app.name ? app.name.split(' ').map((n: string) => n[0]).join('') : '??'}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{app.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">ID: {app.application_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1 text-gray-700">
                        <Phone className="w-3 h-3" />
                        <span>{app.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="text-xs truncate max-w-[150px]">{app.email || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-amber-800">{app.appliedPost || 'N/A'}</div>
                    {app.currentDesignation && (
                      <div className="text-xs text-gray-500">{app.currentDesignation}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getLocationDisplay(app.location)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-700">
                    ₹{app.price ? app.price.toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(app.application_status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(app.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      
                      {(!app.application_status || app.application_status === 'pending') && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateStatus(app.application_id, 'approved')}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => updateStatus(app.application_id, 'rejected')}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {app.application_status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                          onClick={() => updateStatus(app.application_id, 'rejected')}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Revoke
                        </Button>
                      )}
                      
                      {app.application_status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                          onClick={() => updateStatus(app.application_id, 'approved')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{selectedApp.name}</h3>
                  <p className="text-amber-100 mt-1">Application ID: {selectedApp.application_id}</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Position Applied</label>
                  <p className="text-lg font-medium text-amber-800">{selectedApp.appliedPost || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Application Fee</label>
                  <p className="text-lg font-bold text-blue-700">₹{selectedApp.price ? selectedApp.price.toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedApp.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-900 truncate">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Location</label>
                  <p className="text-gray-900">{getLocationDisplay(selectedApp.location)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedApp.application_status)}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Applied Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedApp.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
