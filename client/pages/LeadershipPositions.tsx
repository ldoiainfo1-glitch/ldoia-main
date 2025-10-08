import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, Crown, Shield, Briefcase, Award, User, ArrowLeft, Building,
  CheckCircle, AlertCircle, Plus, Search, Filter, Mail, Phone, 
  Calendar, MapPin, Star, TrendingUp, Clock, Globe, Edit3
} from "lucide-react";
import { Link } from "react-router-dom";
import { Position, Community } from "@shared/types";

export default function LeadershipPositions() {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("fee-desc");
  const [positions, setPositions] = useState<Position[]>([]);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  // Load positions and community data from MongoDB
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_BACKEND_API_URL 
          ? `${import.meta.env.VITE_BACKEND_API_URL}/applications`
          : 'http://localhost:3001/api/applications';

        // Load all applications to build positions
        const response = await fetch(apiUrl);
        if (response.ok) {
          const result = await response.json();
          const applications = result.data || [];
          
          // Build positions from applications
          const positionsMap = new Map<string, Position>();
          
          applications.forEach((app: any) => {
            const positionName = app.applied_position || 'Unknown';
            const key = positionName.toLowerCase().replace(/\s+/g, '-');
            
            if (!positionsMap.has(key)) {
              positionsMap.set(key, {
                id: key,
                title: positionName,
                communityId: '1',
                positionName: positionName,
                level: 'india',
                description: `${positionName} position`,
                annualFee: parseInt(app.salary_expectation || '0'),
                fee: parseInt(app.salary_expectation || '0'),
                status: app.application_status === 'approved' ? 'filled' : 'available',
                isElected: false,
                isFilled: app.application_status === 'approved',
                memberId: app._id || app.application_id,
                memberName: app.applicant_name || app.name,
                memberPhoto: app.photo_data ? `data:${app.photo_mimetype};base64,${app.photo_data}` : '',
                memberContact: app.phone_number || app.phone,
                maxSlots: 1,
                filledSlots: app.application_status === 'approved' ? 1 : 0,
                responsibilities: [],
                requirements: [],
                isActive: true
              });
            }
          });
          
          setPositions(Array.from(positionsMap.values()));
          console.log('✅ Loaded positions from MongoDB:', positionsMap.size);
          
          // Set community info
          setCommunity({
            id: "1",
            name: "Land Developers & Owners Association of India",
            description: "Premier association for land developers, property owners, and real estate professionals across India.",
            logo: "",
            slug: "ldoai",
            level: 'india',
            positions: Array.from(positionsMap.values()),
            memberCount: 0,
            establishedDate: "2020-01-15"
          });
        }
        
      } catch (error) {
        console.error('❌ Error loading positions from MongoDB:', error);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredPositions = positions
    .filter(position => {
      const matchesSearch = position.positionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           position.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === "all" || 
                           (filterType === "vacant" && !position.isFilled) ||
                           (filterType === "filled" && position.isFilled) ||
                           (filterType === "elected" && position.isElected) ||
                           (filterType === "contribution" && !position.isElected);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "fee-desc":
          return b.annualFee - a.annualFee;
        case "fee-asc":
          return a.annualFee - b.annualFee;
        case "name":
          return a.positionName.localeCompare(b.positionName);
        case "vacant-first":
          return Number(a.isFilled) - Number(b.isFilled);
        default:
          return 0;
      }
    });

  const filledPositions = positions.filter(p => p.isFilled);
  const vacantPositions = positions.filter(p => !p.isFilled);
  const totalSlots = positions.reduce((sum, p) => sum + p.maxSlots, 0);
  const filledSlots = positions.reduce((sum, p) => sum + p.filledSlots, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ldoai-cream via-amber-50 to-ldoai-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ldoai-blue mx-auto mb-4"></div>
          <p className="text-ldoai-blue">Loading positions from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/community/${slug}`} className="flex items-center space-x-3">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-ldoai-blue to-ldoai-purple rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Leadership Positions</h1>
                  <p className="text-xs text-muted-foreground">{community?.name}</p>
                </div>
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-ldoai-green to-ldoai-cyan text-white border-0">
                {filledSlots}/{totalSlots} Positions Filled
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Join Our Leadership Team
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Take on leadership roles and shape the future of {community?.name}. 
              Make a meaningful impact in the industry while building your professional network.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-ldoai-blue">{positions.length}</div>
                <div className="text-sm text-muted-foreground">Total Positions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-ldoai-green">{filledPositions.length}</div>
                <div className="text-sm text-muted-foreground">Filled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-ldoai-orange">{vacantPositions.length}</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-ldoai-purple">
                  ₹{positions.length > 0 ? Math.round(positions.reduce((sum, p) => sum + p.annualFee, 0) / positions.length / 1000) : 0}k
                </div>
                <div className="text-sm text-muted-foreground">Avg. Fee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <Card className="border-border bg-card/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search positions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-muted/50"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="vacant">Available Only</SelectItem>
                    <SelectItem value="filled">Filled Only</SelectItem>
                    <SelectItem value="contribution">Contribution-based</SelectItem>
                    <SelectItem value="elected">Elected Positions</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fee-desc">Highest Fee</SelectItem>
                    <SelectItem value="fee-asc">Lowest Fee</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="vacant-first">Available First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Positions Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPositions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPositions.map((position) => (
                <Card key={position.id} className={`border-border bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
                  !position.isFilled ? 'border-ldoai-blue/30 hover:border-ldoai-blue' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {position.isFilled ? (
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={position.memberPhoto} />
                              <AvatarFallback className="bg-gradient-to-r from-ldoai-blue to-ldoai-purple text-white">
                                {position.memberName?.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center border-2 border-dashed border-ldoai-blue/50">
                              <User className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-xl">{position.positionName}</CardTitle>
                            {position.isFilled ? (
                              <CardDescription className="font-medium">{position.memberName}</CardDescription>
                            ) : (
                              <CardDescription className="text-ldoai-blue">Position Available</CardDescription>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={
                          position.isFilled 
                            ? "bg-green-100 text-green-800 border-0" 
                            : "bg-orange-100 text-orange-600 border-0"
                        }>
                          {position.isFilled ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Filled
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Available
                            </>
                          )}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xl font-bold text-ldoai-blue">
                            {position.isElected ? "Elected" : `₹${position.annualFee.toLocaleString()}`}
                          </div>
                          {!position.isElected && (
                            <div className="text-xs text-muted-foreground">per year</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{position.description}</p>

                    {/* Responsibilities */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-ldoai-blue" />
                        Key Responsibilities
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {position.responsibilities.slice(0, 3).map((resp, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-ldoai-green flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                        {position.responsibilities.length > 3 && (
                          <li className="text-xs text-muted-foreground ml-5">
                            +{position.responsibilities.length - 3} more responsibilities
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-2 text-ldoai-purple" />
                        Requirements
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {position.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <Award className="w-3 h-3 mr-2 mt-0.5 text-ldoai-orange flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                        {position.requirements.length > 3 && (
                          <li className="text-xs text-muted-foreground ml-5">
                            +{position.requirements.length - 3} more requirements
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Slots Info */}
                    {position.maxSlots > 1 && (
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-ldoai-blue" />
                          <span>
                            {position.filledSlots} of {position.maxSlots} slots filled
                          </span>
                        </div>
                        {position.maxSlots > position.filledSlots && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {position.maxSlots - position.filledSlots} positions still available
                          </div>
                        )}
                      </div>
                    )}

                    {/* Contact Info for Filled Positions */}
                    {position.isFilled && (
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <h4 className="font-medium mb-2">Contact Information</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="w-4 h-4 mr-2" />
                          {position.memberContact}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {position.isFilled ? (
                        <Button variant="outline" className="flex-1" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Position Filled
                        </Button>
                      ) : (
                        <Link to={`/community/${slug}/positions/${position.id}/apply`} className="flex-1">
                          <Button className="w-full bg-gradient-to-r from-ldoai-blue to-ldoai-purple hover:from-ldoai-purple hover:to-ldoai-pink transition-all duration-300">
                            <Plus className="w-4 h-4 mr-2" />
                            Apply for Position
                          </Button>
                        </Link>
                      )}
                      <Button variant="outline" size="sm">
                        <Globe className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No positions found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all positions</p>
              <Button onClick={() => { setSearchTerm(""); setFilterType("all"); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {vacantPositions.length > 0 && (
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <Card className="border-border bg-gradient-to-r from-ldoai-blue/10 to-ldoai-purple/10 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Ready to Lead the Change?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join {community?.name} leadership team and make a lasting impact in the industry. 
                  {vacantPositions.length} leadership positions are currently available.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to={`/community/${slug}/register`}>
                    <Button size="lg" className="bg-gradient-to-r from-ldoai-blue to-ldoai-purple hover:from-ldoai-purple hover:to-ldoai-pink transition-all duration-300 text-lg px-8 py-6">
                      <Users className="w-5 h-5 mr-2" />
                      Join as Member First
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-ldoai-blue text-ldoai-blue hover:bg-ldoai-blue hover:text-white transition-all duration-300 text-lg px-8 py-6">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Admin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 {community?.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
