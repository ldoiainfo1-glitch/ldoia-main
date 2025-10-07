import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import { 
  Building2, 
  Users, 
  Target, 
  Eye, 
  TreePine, 
  HandHeart, 
  Scale, 
  TrendingUp,
  Shield,
  FileText,
  Globe,
  MapPin,
  ArrowLeft,
  Star,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Home,
  Briefcase,
  BookOpen,
  Calendar
} from "lucide-react";

export default function LDOAIAbout() {
  const { t } = useLanguage();

  const missionPoints = [
    {
      icon: Building2,
      title: "Standardizing Development Practices",
      description: "Promote ethical, compliant, and innovative land and building development across all regions.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: HandHeart,
      title: "Strengthening Government Relations",
      description: "Facilitate seamless coordination with government bodies for timely approvals and policy alignment.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Amplifying Member Voices",
      description: "Represent developers and owners at every level through structured committees and strategic advocacy.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Scale,
      title: "Resolving Industry Challenges",
      description: "Provide expert solutions for disputes, payment delays, and legal complexities.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: TrendingUp,
      title: "Driving Growth & Education",
      description: "Expand membership and offer training programs to uplift the entire ecosystem.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Ensuring Property Security",
      description: "Safeguard member assets and promote best practices in legal frameworks.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const keyFeatures = [
    {
      icon: Award,
      title: "National Recognition",
      description: "Officially recognized organization with nationwide presence"
    },
    {
      icon: BookOpen,
      title: "Expert Guidance",
      description: "Access to industry experts and professional advisory panels"
    },
    {
      icon: Calendar,
      title: "Regular Programs",
      description: "Continuous training and development programs for members"
    },
    {
      icon: Briefcase,
      title: "Business Support",
      description: "Complete business support from legal to financial assistance"
    }
  ];

  const organizationLevels = [
    { level: "National", count: "1 Committee", color: "bg-red-100 text-red-800" },
    { level: "Zonal", count: "6 Committees", color: "bg-blue-100 text-blue-800" },
    { level: "State", count: "32 Committees", color: "bg-green-100 text-green-800" },
    { level: "Division", count: "120 Committees", color: "bg-purple-100 text-purple-800" },
    { level: "District", count: "650 Committees", color: "bg-orange-100 text-orange-800" },
    { level: "Tehsil", count: "5,000 Committees", color: "bg-pink-100 text-pink-800" },
    { level: "Pincode", count: "20,000 Committees", color: "bg-indigo-100 text-indigo-800" }
  ];

  const statistics = [
    { number: "3M+", label: "Available Positions", icon: Users },
    { number: "65", label: "Positions Filled", icon: CheckCircle },
    { number: "7", label: "Administrative Levels", icon: Building2 },
    { number: "25k+", label: "Membership Fee", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation Header */}
      <header className="border-b border-amber-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-800"><strong>LDOIA</strong></h1>
                <p className="text-xs text-amber-600"><strong>Land Developers & Owners India Association</strong></p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                Home
              </Link>
              <Link to="/ldoai/about" className="text-amber-900 border-b-2 border-amber-600 font-semibold">
                About
              </Link>
              <Link to="/ldoai/benefits" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                Benefits
              </Link>
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
        </div>
      </header>

      {/* Hero Section */}

      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/70 to-orange-700/70"></div>
        <div className="relative text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <Badge className="bg-white/20 backdrop-blur-sm text-amber-100 border border-white/30 text-lg px-6 py-2">
                  🏛️ LDOIA
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Land Developers & Owners
                <span className="block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  India Association
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto animate-slide-up">
                Empowering India's Land Development Ecosystem Through Unity, Innovation, and Excellence
              </p>
              <div className="flex flex-wrap gap-4 justify-center animate-bounce-in">
                <Link to="/ldoai/committee">
                  <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                    <Building2 className="h-5 w-5 mr-2" />
                    View Committee Structure
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-amber-800 bg-white border-white hover:bg-amber-50 hover:text-amber-900 transform hover:scale-105 transition-all duration-300">
                    <Phone className="h-5 w-5 mr-2" />
                    Get In Touch
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

        {/* About Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-up">
            <h2 className="text-4xl font-bold text-amber-900 mb-6">
              🇮🇳 About LDOIA
            </h2>
            <p className="text-lg leading-relaxed text-gray-700">
              The <strong className="text-amber-800">Land Developers & Owners Association of India (LDOIA)</strong> is a pioneering national organization 
              dedicated to uniting land developers, property owners, and stakeholders across India.
            </p>
            <p className="text-lg leading-relaxed text-gray-700">
              From village to national level, we streamline development practices, foster collaboration with government bodies, 
              and promote ethical, sustainable growth in the real estate and infrastructure sectors.
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-amber-100 text-amber-800">🏗️ Development</Badge>
              <Badge className="bg-orange-100 text-orange-800">🤝 Collaboration</Badge>
              <Badge className="bg-green-100 text-green-800">♻️ Sustainability</Badge>
              <Badge className="bg-blue-100 text-blue-800">📈 Growth</Badge>
            </div>
          </div>
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Modern Development"
              className="rounded-lg shadow-xl border border-amber-200"
            />
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="grid lg:grid-cols-2 gap-8">
          {/* Vision */}
          <Card className="shadow-xl border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 animate-slide-up">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-amber-800">
                🔮 Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-gray-700 text-center">
                To unify and empower land developers across India by fostering transparent practices, 
                strengthening institutional collaboration, and driving sustainable growth from village to national level.
              </p>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="shadow-xl border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 animate-slide-up" style={{animationDelay: '0.1s'}}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-orange-800">
                🎯 Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-gray-700 text-center">
                Ensuring every stakeholder contributes to building a progressive, well-planned, and prosperous India 
                through ethical development practices and strong government collaboration.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12 animate-slide-up">
            ✨ Why Choose LDOIA?
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

        {/* Mission Points */}
        <section>
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12 animate-slide-up">
            🚀 Our Commitment
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missionPoints.map((point, index) => (
              <Card key={index} className="border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${point.color} rounded-lg flex items-center justify-center mb-4`}>
                    <point.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-amber-800 mb-3">{point.title}</h3>
                  <p className="text-gray-600 text-sm">{point.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Organization Structure */}
        <section>
          <h2 className="text-4xl font-bold text-center text-amber-900 mb-12 animate-slide-up">
            🏛️ Our Structure
          </h2>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {organizationLevels.map((org, index) => (
              <div key={index} className="flex items-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <Card className="border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-3 text-center">
                    <h3 className="font-bold text-sm text-amber-800 mb-1">{org.level}</h3>
                    <Badge className={`${org.color} font-medium text-xs`}>{org.count}</Badge>
                  </CardContent>
                </Card>
                {index < organizationLevels.length - 1 && (
                  <div className="mx-2 text-amber-600 font-bold">→</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8 animate-slide-up">
            Each level operates with specialized committees ensuring efficient representation and governance across India.
          </p>
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
                    <Building2 className="h-6 w-6 text-amber-600" />
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
                Become part of India's largest land development association and help shape the future of our nation's infrastructure.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/ldoai/benefits">
                  <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                    <Star className="h-5 w-5 mr-2" />
                    Membership Benefits
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-amber-800 bg-white border-white hover:bg-amber-50 hover:text-amber-900 transform hover:scale-105 transition-all duration-300">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Us Today
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
