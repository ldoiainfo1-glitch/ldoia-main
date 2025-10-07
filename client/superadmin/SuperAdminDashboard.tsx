import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommitteeTableAdmin from './CommitteeTableAdmin';
import AdvisoryTableAdmin from './AdvisoryTableAdmin';
import PromotionImagesAdmin from './PromotionImagesAdmin';

interface DashboardStats {
  totalApplications: number;
  committeeApplications: number;
  advisoryApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    committeeApplications: 0,
    advisoryApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });

  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      console.log('📊 Fetching Super Admin dashboard statistics...');
      const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api';
      
      // Fetch from the combined endpoint (fetches both collections)
      const response = await fetch(`${API_BASE_URL}/applications`);
      const data = await response.json();
      
      if (data.success) {
        const applications = data.data;
        
        // Transform data to handle both old and new field names
        const transformedApps = applications.map((app: any) => ({
          ...app,
          appliedPost: app.applied_position || app.appliedPost || 'N/A',
          status: app.application_status || 'pending'
        }));
        
        const committeeApps = transformedApps.filter((app: any) => 
          !app.appliedPost?.includes('Advisory Level')
        );
        const advisoryApps = transformedApps.filter((app: any) => 
          app.appliedPost?.includes('Advisory Level')
        );
        
        const pending = transformedApps.filter((app: any) => 
          app.status === 'pending' || !app.status
        );
        const approved = transformedApps.filter((app: any) => 
          app.status === 'approved'
        );
        const rejected = transformedApps.filter((app: any) => 
          app.status === 'rejected'
        );

        setStats({
          totalApplications: transformedApps.length,
          committeeApplications: committeeApps.length,
          advisoryApplications: advisoryApps.length,
          pendingApplications: pending.length,
          approvedApplications: approved.length,
          rejectedApplications: rejected.length
        });

        console.log('✅ Stats loaded:', {
          total: transformedApps.length,
          committee: committeeApps.length,
          advisory: advisoryApps.length,
          pending: pending.length,
          approved: approved.length,
          rejected: rejected.length
        });
        console.log(`📦 Data from ${data.committee || 0} committee + ${data.advisory || 0} advisory collections`);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshKey(prev => prev + 1);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-orange-800 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🛡️ LDOIA Super Admin Panel</h1>
              <p className="text-amber-100">Manage and monitor all applications</p>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-white text-amber-800 px-6 py-2 rounded-lg font-semibold hover:bg-amber-100 transition-all shadow-md hover:shadow-lg"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Committee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.committeeApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Advisory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.advisoryApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.approvedApplications}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.rejectedApplications}</div>
            </CardContent>
          </Card>
        </div>

        {/* Application Tables */}
        <Card className="shadow-xl border-2 border-amber-200">
          <CardContent className="p-6">
            <Tabs defaultValue="committee" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-amber-100">
                <TabsTrigger 
                  value="committee"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold"
                >
                  📋 Committee ({stats.committeeApplications})
                </TabsTrigger>
                <TabsTrigger 
                  value="advisory"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold"
                >
                  🎓 Advisory ({stats.advisoryApplications})
                </TabsTrigger>
                <TabsTrigger 
                  value="promotions"
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white font-semibold"
                >
                  🎨 Promotion Images
                </TabsTrigger>
              </TabsList>

              <TabsContent value="committee">
                <CommitteeTableAdmin 
                  refreshKey={refreshKey}
                  onStatusChange={fetchStats}
                />
              </TabsContent>

              <TabsContent value="advisory">
                <AdvisoryTableAdmin 
                  refreshKey={refreshKey}
                  onStatusChange={fetchStats}
                />
              </TabsContent>

              <TabsContent value="promotions">
                <PromotionImagesAdmin />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
