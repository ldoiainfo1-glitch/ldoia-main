import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelector from "../components/LanguageSelector";
import NavigationHeader from "../components/NavigationHeader";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Building2,
  ArrowLeft,
  Send,
  Clock,
  Users,
  MessageSquare
} from "lucide-react";

export default function ContactPage() {
  const { t } = useLanguage();

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.email'),
      value: "ldoai.info1@gmail.com",
      description: "General inquiries and support"
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: "+91 9967477227",
      description: "Call us during business hours"
    },
    {
      icon: Globe,
      title: t('contact.website'),
      value: "www.ldoai.org",
      description: "Visit our official website"
    },
    {
      icon: MapPin,
      title: t('contact.headOffice'),
      value: "Mumbai, Maharashtra",
      description: "India"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
    { day: "Sunday", time: "Closed" }
  ];

  const departments = [
    {
      name: "Membership Services",
      email: "ldoai.info1@gmail.com",
      phone: "+91 9967477227"
    },
    {
      name: "Committee Affairs",
      email: "ldoai.info1@gmail.com", 
      phone: "+91 9967477227"
    },
    {
      name: "Legal Advisory",
      email: "ldoai.info1@gmail.com",
      phone: "+91 9967477227"
    },
    {
      name: "Government Relations",
      email: "ldoai.info1@gmail.com",
      phone: "+91 9967477227"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Navigation Header */}
      <NavigationHeader currentPage="contact" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2374&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/70 to-orange-700/70"></div>
        <div className="relative text-white py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-6">
                <Badge className="bg-white/20 backdrop-blur-sm text-amber-100 border border-white/30 text-lg px-6 py-2">
                  📞 Contact LDOIA
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Get in Touch
                <span className="block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                  With Our Team
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-3xl mx-auto">
                We're here to help you with all your land development needs and questions
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50 transform hover:scale-105 transition-all duration-300">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now: +91 9967477227
                </Button>
                <Button size="lg" variant="outline" className="text-amber-800 bg-white border-white hover:bg-amber-50 hover:text-amber-900 transform hover:scale-105 transition-all duration-300">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Contact Information Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card key={index} className="shadow-xl border border-amber-200 bg-white hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="text-center bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
                  <info.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-amber-800">{info.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <p className="font-semibold text-gray-800 mb-2">{info.value}</p>
                <p className="text-sm text-gray-600">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form and Info Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl border border-amber-200 bg-white animate-slide-up">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
              <CardTitle className="text-2xl flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-amber-700" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Your first name" className="bg-amber-50 border-amber-200 focus:border-amber-400" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Your last name" className="bg-amber-50 border-amber-200 focus:border-amber-400" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" className="bg-amber-50 border-amber-200 focus:border-amber-400" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+91 9967477227" className="bg-amber-50 border-amber-200 focus:border-amber-400" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" className="bg-amber-50 border-amber-200 focus:border-amber-400" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your inquiry in detail..." 
                  rows={4}
                  className="bg-amber-50 border-amber-200 focus:border-amber-400"
                />
              </div>
              <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white transform hover:scale-105 transition-all duration-200">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="space-y-6">
            {/* Office Hours */}
            <Card className="shadow-xl border border-amber-200 bg-white animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-700" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-amber-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{schedule.day}</span>
                      <span className="text-amber-700">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Contacts */}
            <Card className="shadow-xl border border-amber-200 bg-white animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Users className="h-5 w-5 text-amber-700" />
                  Department Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="font-semibold text-gray-800 mb-2">{dept.name}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-amber-600" />
                          <span className="text-gray-600">{dept.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-amber-600" />
                          <span className="text-gray-600">{dept.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Offices */}
            <Card className="shadow-xl border border-amber-200 bg-white animate-slide-up">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-amber-700" />
                  {t('contact.regionalOffices')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium">North Region</p>
                      <p className="text-sm text-gray-600">Delhi, Punjab, Haryana</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium">South Region</p>
                      <p className="text-sm text-gray-600">Bangalore, Chennai, Hyderabad</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium">West Region</p>
                      <p className="text-sm text-gray-600">Mumbai, Pune, Ahmedabad</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium">East Region</p>
                      <p className="text-sm text-gray-600">Kolkata, Bhubaneswar</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="shadow-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white animate-slide-up">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
            <p className="text-xl mb-8 text-amber-100">
              For urgent matters, please call our 24/7 helpline
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-amber-700 hover:bg-amber-50">
                <Phone className="h-5 w-5 mr-2" />
                Call Now: +91 9967477227
              </Button>
              {/* <Link to="/ldoai/apply">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-amber-600">
                  Apply for Membership
                </Button>
              </Link> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
