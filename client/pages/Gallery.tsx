import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, X, ChevronLeft, ChevronRight, Award, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSelector from "../components/LanguageSelector";
import { galleryConfig, fallbackImages } from "../data/galleryData";

interface Photo {
  id: number;
  src: string;
  title: string;
  description: string;
  date?: string;
}

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("exhibition");
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentPhotos = activeTab === "exhibition" ? galleryConfig.exhibition : galleryConfig.awards;

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedImage(photo);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % currentPhotos.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(currentPhotos[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + currentPhotos.length) % currentPhotos.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(currentPhotos[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation Header */}
      <header className="border-b border-amber-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-amber-800"><strong>LDOIA</strong></h1>
                <p className="text-xs text-amber-600"><strong>Land Developers & Owners India Association</strong></p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                Home
              </Link>
              <Link to="/ldoai/about" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                About
              </Link>
              <Link to="/ldoai/benefits" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                Benefits
              </Link>
              <a href="#positions" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">Positions</a>
              <Link to="/gallery" className="text-amber-900 border-b-2 border-amber-600 font-semibold">
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
              <Link to="/" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                Home
              </Link>
              <Link to="/ldoai/about" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                About
              </Link>
              <Link to="/ldoai/benefits" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                Benefits
              </Link>
              <a href="#positions" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">Positions</a>
              <Link to="/gallery" className="text-amber-900 border-b-2 border-amber-600 font-semibold text-sm">
                Gallery
              </Link>
              <Link to="/contact" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-[40vh]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.6), rgba(160, 82, 45, 0.5)), url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        ></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16 flex items-center h-[40vh]">
          <div className="text-center max-w-4xl mx-auto text-white">
            <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-amber-100 border border-white/30">
              <Camera className="w-4 h-4 mr-2" />
              LDOIA Gallery
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Memories & Achievements
              </span>
            </h1>
            <p className="text-lg md:text-xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Explore our collection of exhibitions, awards, and memorable moments from LDOIA events and celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-7xl mx-auto border-amber-200 bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="flex items-center text-2xl md:text-3xl text-amber-800">
                <Camera className="w-6 h-6 mr-3 text-amber-600" />
                LDOIA Gallery
              </CardTitle>
              <CardDescription className="text-amber-700">
                Browse through our exhibitions and award ceremonies
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-8 bg-amber-100 p-1 rounded-lg w-fit mx-auto">
                <button
                  onClick={() => setActiveTab("exhibition")}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === "exhibition"
                      ? "bg-white text-amber-800 shadow-md"
                      : "text-amber-600 hover:text-amber-800"
                  }`}
                >
                  <Camera className="w-4 h-4 mr-2 inline" />
                  Exhibition
                </button>
                <button
                  onClick={() => setActiveTab("awards")}
                  className={`px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === "awards"
                      ? "bg-white text-amber-800 shadow-md"
                      : "text-amber-600 hover:text-amber-800"
                  }`}
                >
                  <Award className="w-4 h-4 mr-2 inline" />
                  Award Function
                </button>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => openLightbox(photo, index)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          const fallbackIndex = index % fallbackImages[activeTab].length;
                          target.src = fallbackImages[activeTab][fallbackIndex];
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                          <p className="text-sm text-white/80">{photo.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {currentPhotos.length === 0 && (
                <div className="text-center py-16">
                  <Camera className="w-16 h-16 mx-auto text-amber-300 mb-4" />
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">No Photos Available</h3>
                  <p className="text-amber-600">Photos will be added soon for this section.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-12 right-0 text-white hover:text-amber-200 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-200 transition-colors bg-black/50 rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-200 transition-colors bg-black/50 rounded-full p-2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                const fallbackIndex = currentImageIndex % fallbackImages[activeTab].length;
                target.src = fallbackImages[activeTab][fallbackIndex];
              }}
            />

            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-white/80 mb-1">{selectedImage.description}</p>
              {selectedImage.date && (
                <p className="text-sm text-amber-200 mb-2">{selectedImage.date}</p>
              )}
              <p className="text-sm text-white/60">
                {currentImageIndex + 1} of {currentPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
