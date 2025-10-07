import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface NavigationHeaderProps {
  currentPage?: string;
}

export default function NavigationHeader({ currentPage = "home" }: NavigationHeaderProps) {
  return (
    <header className="border-b border-amber-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-800"><strong>LDOIA</strong></h1>
              <p className="text-xs text-amber-600"><strong>Land Developers & Owners India Association</strong></p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link 
              to="/" 
              className={`${currentPage === "home" ? "text-amber-900 border-b-2 border-amber-600 font-semibold" : "text-amber-700 hover:text-amber-900 transition-colors font-medium"}`}
            >
              Home
            </Link>
            <Link 
              to="/ldoai/about" 
              className={`${currentPage === "about" ? "text-amber-900 border-b-2 border-amber-600 font-semibold" : "text-amber-700 hover:text-amber-900 transition-colors font-medium"}`}
            >
              About
            </Link>
            <Link 
              to="/ldoai/benefits" 
              className={`${currentPage === "benefits" ? "text-amber-900 border-b-2 border-amber-600 font-semibold" : "text-amber-700 hover:text-amber-900 transition-colors font-medium"}`}
            >
              Benefits
            </Link>
            <Link 
              to="/gallery" 
              className={`${currentPage === "gallery" ? "text-amber-900 border-b-2 border-amber-600 font-semibold" : "text-amber-700 hover:text-amber-900 transition-colors font-medium"}`}
            >
              Gallery
            </Link>
            {currentPage === "home" && (
              <a href="#positions" className="text-amber-700 hover:text-amber-900 transition-colors font-medium">
                Positions
              </a>
            )}
            <Link 
              to="/contact" 
              className={`${currentPage === "contact" ? "text-amber-900 border-b-2 border-amber-600 font-semibold" : "text-amber-700 hover:text-amber-900 transition-colors font-medium"}`}
            >
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
            <Link 
              to="/" 
              className={`${currentPage === "home" ? "text-amber-900 border-b-2 border-amber-600 font-semibold text-sm" : "text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm"}`}
            >
              Home
            </Link>
            <Link 
              to="/ldoai/about" 
              className={`${currentPage === "about" ? "text-amber-900 border-b-2 border-amber-600 font-semibold text-sm" : "text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm"}`}
            >
              About
            </Link>
            <Link 
              to="/ldoai/benefits" 
              className={`${currentPage === "benefits" ? "text-amber-900 border-b-2 border-amber-600 font-semibold text-sm" : "text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm"}`}
            >
              Benefits
            </Link>
            <Link 
              to="/gallery" 
              className={`${currentPage === "gallery" ? "text-amber-900 border-b-2 border-amber-600 font-semibold text-sm" : "text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm"}`}
            >
              Gallery
            </Link>
            {currentPage === "home" && (
              <a href="#positions" className="text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm">
                Positions
              </a>
            )}
            <Link 
              to="/contact" 
              className={`${currentPage === "contact" ? "text-amber-900 border-b-2 border-amber-600 font-semibold text-sm" : "text-amber-700 hover:text-amber-900 transition-colors font-medium text-sm"}`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
