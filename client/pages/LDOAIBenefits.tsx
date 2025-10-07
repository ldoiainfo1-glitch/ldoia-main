import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import NavigationHeader from "../components/NavigationHeader";
import { 
  Crown, 
  Shield, 
  Briefcase, 
  Users, 
  UserCheck, 
  Award,
  Building,
  HandHeart,
  Scale,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Network,
  Bell,
  Phone,
  FileText,
  CheckCircle,
  Star,
  Globe,
  Handshake,
  ArrowLeft,
  Mail,
  Home,
  Target,
  Zap,
  Calendar,
  BookOpen
} from "lucide-react";

export default function LDOAIBenefits() {
  const { t } = useLanguage();

  const membershipBenefits = [
    {
      icon: Globe,
      title: "National Representation & Recognition",
      description: "Be part of a nationally recognized association with representation at all administrative levels",
      category: "Recognition",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Scale,
      title: "Access to Expert Panels & Legal Support",
      description: "Direct access to legal experts, advocates, and specialized advisory panels for all your needs",
      category: "Legal Support",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: GraduationCap,
      title: "Training Programs & Workshops",
      description: "Regular skill development programs, technical training, and capacity building workshops",
      category: "Education",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Network,
      title: "Networking Opportunities",
      description: "Connect with developers, government officials, investors, and industry leaders across India",
      category: "Networking",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Bell,
      title: "Real-time Policy Updates",
      description: "Stay updated with latest policies, regulations, and government notifications affecting your business",
      category: "Information",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Handshake,
      title: "Dispute Resolution & Recovery",
      description: "Professional assistance in resolving conflicts, NPA recovery, and payment collection",
      category: "Support",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: HandHeart,
      title: "Government Liaison Services",
      description: "Facilitated coordination with government bodies from Talathi to Town Planner level",
      category: "Government Relations",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: TrendingUp,
      title: "Business Growth Support",
      description: "Marketing assistance, property promotion, and business development guidance",
      category: "Business Development",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: Shield,
      title: "Property Security & Compliance",
      description: "Guidance on documentation, legal frameworks, and asset protection strategies",
      category: "Security",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: DollarSign,
      title: "Financial Advisory Services",
      description: "Access to chartered accountants, bank loan assistance, and financial planning",
      category: "Financial",
      color: "from-yellow-500 to-yellow-600"
    }
  ];

  const membershipTypes = [
    {
      type: "Land Owner",
      fee: "₹25,000",
      icon: Home,
      color: "from-green-500 to-emerald-500",
      benefits: [
        "Property Documentation Support",
        "Land Valuation Assistance",
        "Government Approval Guidance",
        "Legal Advisory for Land Matters",
        "Property Security & Compliance",
        "Agricultural Land Development Support",
        "Revenue Records Management",
        "Property Tax Optimization"
      ]
    },
    {
      type: "Developer",
      fee: "₹25,000",
      icon: Building,
      color: "from-blue-500 to-cyan-500",
      benefits: [
        "Project Approval Facilitation",
        "Construction License Support",
        "Building Plan Approval Assistance",
        "Contractor & Supplier Network",
        "Quality Control Guidance",
        "Safety Compliance Support",
        "Marketing & Sales Assistance",
        "Dispute Resolution Services"
      ]
    },
    {
      type: "Member",
      fee: "₹5000",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      benefits: [
        "Voting Rights in Association",
        "Access to All Training Programs",
        "Networking Events Participation",
        "Committee Position Eligibility",
        "Business Development Support",
        "Government Liaison Services",
        "Expert Panel Access",
        "Policy Update Notifications"
      ]
    }
  ];

  const keyFeatures = [
    {
      icon: Target,
      title: "Nationwide Network",
      description: "Access to 3M+ positions across 7 administrative levels"
    },
    {
      icon: Zap,
      title: "Instant Support",
      description: "24/7 member support and rapid response to queries"
    },
    {
      icon: Calendar,
      title: "Regular Events",
      description: "Monthly workshops, seminars, and networking events"
    },
    {
      icon: BookOpen,
      title: "Expert Resources",
      description: "Comprehensive library of resources and documentation"
    }
  ];

  const statistics = [
    { number: "3M+", label: "Available Positions", icon: Users },
    { number: "65", label: "Positions Filled", icon: CheckCircle },
    { number: "7", label: "Administrative Levels", icon: Building },
    { number: "₹5k+", label: "Starting Membership", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation Header */}
      <NavigationHeader currentPage="benefits" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/70 to-orange-700/70"></div>
        <div className="relative text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <Badge className="bg-white/20 backdrop-blur-sm text-amber-100 border border-white/30 text-lg px-6 py-2">
                  🌟 LDOIA Benefits
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Membership
                <span className="block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  Benefits & Advantages
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto animate-slide-up">
                Discover Exclusive Benefits and Opportunities with LDOIA Membership
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-bounce-in">
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                    <Users className="h-5 w-5 mr-2" />
                    Join LDOIA Today
                  </Button>
                </Link>
                <Link to="/ldoai/about">
                  <Button size="lg" variant="outline" className="text-amber-800 bg-white border-white hover:bg-amber-50 hover:text-amber-900 transform hover:scale-105 transition-all duration-300">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Statistics Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-amber-800 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12 animate-slide-up">
            🚀 Why Choose LDOIA Membership?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-amber-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comprehensive Benefits */}
        <section>
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12 animate-slide-up">
            ✨ Comprehensive Benefits Package
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membershipBenefits.map((benefit, index) => (
              <Card key={index} className="border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-lg flex items-center justify-center mb-4`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-amber-800">{benefit.title}</h3>
                    <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                      {benefit.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Membership Types */}
        <section>
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12 animate-slide-up">
            💼 Membership Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {membershipTypes.map((membership, index) => (
              <Card key={index} className="border-amber-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardHeader className="bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${membership.color} text-white shadow-lg`}>
                      <membership.icon className="h-8 w-8" />
                    </div>
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold">
                      {membership.fee}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl text-amber-800 text-center">{membership.type}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {membership.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Link to="/contact">
                      <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                        Apply for {membership.type}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <Card className="shadow-xl border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 animate-slide-up">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl flex items-center justify-center gap-3 text-amber-800">
                <Phone className="h-8 w-8" />
                📞 Get In Touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-amber-200">
                    <Mail className="h-6 w-6 text-amber-600" />
                    <div>
                      <div className="font-semibold text-amber-800">Email</div>
                      <div className="text-gray-600">ldoai.info1@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-amber-200">
                    <Phone className="h-6 w-6 text-amber-600" />
                    <div>
                      <div className="font-semibold text-amber-800">Phone</div>
                      <div className="text-gray-600">+91 9967477227</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-amber-200">
                    <Home className="h-6 w-6 text-amber-600" />
                    <div>
                      <div className="font-semibold text-amber-800">Head Office</div>
                      <div className="text-gray-600">Mumbai, Maharashtra</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-amber-200">
                    <Building className="h-6 w-6 text-amber-600" />
                    <div>
                      <div className="font-semibold text-amber-800">Coverage</div>
                      <div className="text-gray-600">Pan India Operations</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="shadow-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white animate-slide-up">
            <CardContent className="py-16">
              <h2 className="text-3xl font-bold mb-4">Ready to Join the Movement?</h2>
              <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
                Become part of India's largest land development association and unlock exclusive benefits and opportunities.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                    <Star className="h-5 w-5 mr-2" />
                    Apply for Membership
                  </Button>
                </Link>
                <Link to="/ldoai/about">
                  <Button size="lg" variant="outline" className="text-amber-800 bg-white border-white hover:bg-amber-50 hover:text-amber-900 transform hover:scale-105 transition-all duration-300">
                    <FileText className="h-5 w-5 mr-2" />
                    Learn More About LDOIA
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
