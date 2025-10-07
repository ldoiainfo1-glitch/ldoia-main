import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import NavigationHeader from "../components/NavigationHeader";
import { 
  Crown, 
  Shield, 
  Briefcase, 
  Users, 
  UserCheck, 
  Landmark,
  Building,
  HandHeart,
  Scale,
  TrendingUp,
  DollarSign,
  Home,
  TreePine,
  Ruler,
  FileText,
  Calculator,
  Phone,
  UserPlus,
  Star
} from "lucide-react";

export default function LDOAICommittee() {
  const currentCommittee = [
    { position: "Chairman", name: "Ingit Dave", area: "Area Chairman", fee: "₹2,00,000", icon: Crown, color: "from-orange-500 to-pink-500" },
    { position: "Secretary", name: "Rajesh Modi", area: "Area Secretary", fee: "₹1,50,000", icon: Shield, color: "from-blue-500 to-purple-500" },
    { position: "Treasurer", name: "Srinivas Shetty", area: "Area Treasurer", fee: "₹1,00,000", icon: Briefcase, color: "from-green-500 to-cyan-500" },
    { position: "Asst Vice Chairman Payment Recovery", name: "**", area: "Position Available", fee: "₹75,000", icon: DollarSign, color: "from-purple-500 to-pink-500" },
    { position: "Asst Vice Chairman Membership Growth 1", name: "Deepak Bhanushali", area: "Membership Growth", fee: "₹75,000", icon: UserPlus, color: "from-cyan-500 to-blue-500" },
    { position: "Asst Vice Chairman Membership Growth 2", name: "Vibhuti Jain", area: "Membership Growth", fee: "₹75,000", icon: UserPlus, color: "from-cyan-500 to-blue-500" },
    { position: "Asst Vice Chairman Property Marketing", name: "Purshottam Khandelwal", area: "Property Marketing", fee: "₹75,000", icon: TrendingUp, color: "from-green-500 to-orange-500" },
    { position: "Asst Vice Chairman Bank Loan", name: "**", area: "Position Available", fee: "₹75,000", icon: Landmark, color: "from-blue-500 to-green-500" },
    { position: "Asst Vice Chairman Development Fund Generation", name: "**", area: "Position Available", fee: "₹75,000", icon: DollarSign, color: "from-purple-500 to-pink-500" },
    { position: "Asst Vice Chairman Building Developer", name: "**", area: "Position Available", fee: "₹75,000", icon: Building, color: "from-orange-500 to-red-500" },
    { position: "Asst Vice Chairman Land Developer", name: "**", area: "Position Available", fee: "₹75,000", icon: Home, color: "from-green-500 to-blue-500" },
    { position: "Asst Vice Chairman Govt Liaisoning", name: "Akil Bansal", area: "Government Relations", fee: "₹75,000", icon: HandHeart, color: "from-blue-500 to-purple-500" },
    { position: "Asst Vice Chairman Property Security", name: "**", area: "Position Available", fee: "₹75,000", icon: Shield, color: "from-red-500 to-orange-500" },
    { position: "Asst Vice Chairman Dispute Solution", name: "**", area: "Position Available", fee: "₹75,000", icon: Scale, color: "from-purple-500 to-blue-500" },
    { position: "Asst Vice Chairman Agriculture Expert", name: "**", area: "Position Available", fee: "₹50,000", icon: TreePine, color: "from-green-500 to-cyan-500" },
    { position: "Asst Vice Chairman Title Paper", name: "**", area: "Position Available", fee: "₹50,000", icon: FileText, color: "from-gray-500 to-blue-500" },
    { position: "Asst Vice Chairman Architect", name: "Vijay Sonawne", area: "Architecture & Design", fee: "₹50,000", icon: Ruler, color: "from-orange-500 to-yellow-500" },
    { position: "Asst Vice Chairman Advocate", name: "**", area: "Position Available", fee: "₹50,000", icon: Scale, color: "from-purple-500 to-blue-500" },
    { position: "Asst Vice Chairman Chartered Accountant", name: "**", area: "Position Available", fee: "₹50,000", icon: Calculator, color: "from-blue-500 to-green-500" },
    { position: "Asst Vice Chairman Public Relation Officer", name: "Mukesh Shah", area: "Public Relations", fee: "₹50,000", icon: Phone, color: "from-pink-500 to-purple-500" },
    { position: "Asst Vice Chairman NPA Solutions", name: "Himanshu Shah", area: "NPA Recovery", fee: "₹50,000", icon: DollarSign, color: "from-red-500 to-orange-500" },
    { position: "Position to be allotted", name: "Shyam Bihani", area: "Awaiting Assignment", fee: "TBD", icon: UserCheck, color: "from-gray-400 to-gray-600" }
  ];

  const proposedCommitteeStructure = [
    { title: "President", focus: "National Leadership", icon: Crown },
    { title: "Secretary", focus: "Administration & Coordination", icon: Shield },
    { title: "Treasurer", focus: "Financial Oversight", icon: Briefcase },
    { title: "Chairman Land Developer", focus: "Land Development Strategy", icon: Home },
    { title: "Chairman Building Developer", focus: "Construction & Planning", icon: Building },
    { title: "Chairman Govt Liaisoning", focus: "Government Relations", icon: HandHeart },
    { title: "Chairman Collector PR", focus: "District Administration", icon: Landmark },
    { title: "Chairman Town Planner PR", focus: "Urban Planning", icon: Ruler },
    { title: "Chairman Prant & Tehsildar PR", focus: "Revenue Coordination", icon: FileText },
    { title: "Chairman Talathi & Circle PR", focus: "Local Land Records", icon: FileText },
    { title: "Chairman Police PR", focus: "Law & Order Liaison", icon: Shield },
    { title: "Chairman Media PR & News", focus: "Public Relations", icon: Phone },
    { title: "Chairman Property Marketing", focus: "Sales & Promotion", icon: TrendingUp },
    { title: "Chairman Dispute Solution", focus: "Conflict Resolution", icon: Scale },
    { title: "Chairman NPA Solutions", focus: "Non-Performing Assets", icon: DollarSign },
    { title: "Chairman Payment Recovery", focus: "Financial Recovery", icon: DollarSign },
    { title: "Chairman Bank Loan", focus: "Financing & Lending", icon: Landmark },
    { title: "Chairman Development Fund", focus: "Infrastructure Funding", icon: DollarSign },
    { title: "Chairman Property Security", focus: "Asset Protection", icon: Shield },
    { title: "Chairman Agriculture", focus: "Rural Integration", icon: TreePine },
    { title: "Chairman Architect", focus: "Design & Planning", icon: Ruler },
    { title: "Chairman Advocate", focus: "Legal Advisory", icon: Scale },
    { title: "Chairman Chartered Accountant", focus: "Financial Compliance", icon: Calculator },
    { title: "Chairman Membership Growth", focus: "Expansion Strategy", icon: UserPlus },
    { title: "Chairman Training", focus: "Capacity Building", icon: Users }
  ];

  const getStatusBadge = (name: string) => {
    if (name === "**") {
      return <Badge variant="destructive">Position Available</Badge>;
    } else if (name === "Shyam Bihani") {
      return <Badge variant="secondary">Awaiting Assignment</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-600">Appointed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation Header */}
      <NavigationHeader currentPage="committee" />

      {/* Hero Section */}

      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/70 to-orange-700/70"></div>
        <div className="relative text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <Badge className="bg-white/20 backdrop-blur-sm text-amber-100 border border-white/30 text-lg px-6 py-2">
                  🏛️ LDOIA Committee
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Committee
                <span className="block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  Structure & Leadership
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto">
                Discover Our Organizational Framework and Leadership Across India
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Apply for Position
                  </Button>
                </Link>
                <Link to="/ldoai/benefits">
                  <Button size="lg" variant="outline" className="text-amber-800 bg-white border-white hover:bg-amber-50 hover:text-amber-900 transform hover:scale-105 transition-all duration-300">
                    <Star className="h-5 w-5 mr-2" />
                    View Benefits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Current Committee */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Current Committee Members
            </CardTitle>
            <CardDescription>
              Leadership structure and position holders in LDOAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCommittee.map((member, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${member.color} text-white`}>
                        <member.icon className="h-5 w-5" />
                      </div>
                      {getStatusBadge(member.name)}
                    </div>
                    <CardTitle className="text-lg">{member.position}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="font-medium">
                          {member.name === "**" ? "Open Position" : member.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Area:</span>
                        <span className="text-sm">{member.area}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fee:</span>
                        <Badge variant="outline">{member.fee}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proposed Complete Structure */}
        <Card className="shadow-lg border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-3xl flex items-center gap-3">
              <Landmark className="h-8 w-8 text-purple-600" />
              👥 Proposed Complete Committee Structure
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Comprehensive organizational framework for optimal governance
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Role</th>
                    <th className="border p-3 text-left">Focus Area</th>
                    <th className="border p-3 text-center">Icon</th>
                  </tr>
                </thead>
                <tbody>
                  {proposedCommitteeStructure.map((role, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-3 font-medium">{role.title}</td>
                      <td className="border p-3">{role.focus}</td>
                      <td className="border p-3 text-center">
                        <role.icon className="h-5 w-5 mx-auto text-blue-600" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">22</div>
              <div className="text-sm text-gray-600">Total Positions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">9</div>
              <div className="text-sm text-gray-600">Filled Positions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Open Positions</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
              <div className="text-sm text-gray-600">Pending Assignment</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <Link to="/ldoai/about">
            <Button variant="outline">
              Back to About
            </Button>
          </Link>
          <Link to="/ldoai/benefits">
            <Button className="bg-blue-600 hover:bg-blue-700">
              View Benefits
            </Button>
          </Link>
          <Link to="/ldoai/apply">
            <Button className="bg-green-600 hover:bg-green-700">
              Apply for Position
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
