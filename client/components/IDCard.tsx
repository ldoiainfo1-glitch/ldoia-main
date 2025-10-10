import { useRef } from 'react';
import { Button } from './ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface IDCardProps {
  member: {
    name: string;
    phone: string;
    photo?: string;
    appliedPost: string;
    location: {
      country?: string;
      zone?: string;
      state?: string;
      division?: string;
      district?: string;
      tehsil?: string;
      pincode?: string;
      village?: string;
    };
    applicationId?: string;
  };
  onClose: () => void;
}

export default function IDCard({ member, onClose }: IDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine which level to highlight based on applied position
  const getHighlightedLevel = () => {
    const position = member.appliedPost?.toLowerCase() || '';
    
    if (position.includes('india') || position.includes('president') || position.includes('secretary') || position.includes('treasurer') || position.includes('chairman')) {
      return 'country';
    }
    if (position.includes('zone')) return 'zone';
    if (position.includes('state')) return 'state';
    if (position.includes('division')) return 'division';
    if (position.includes('district')) return 'district';
    if (position.includes('tehsil') || position.includes('taluka')) return 'tehsil';
    if (position.includes('pincode')) return 'pincode';
    if (position.includes('village')) return 'village';
    
    return 'country'; // Default to country level
  };

  const highlightedLevel = getHighlightedLevel();

  const getFieldStyle = (level: string) => {
    return highlightedLevel === level
      ? 'bg-white text-black font-bold'
      : 'bg-red-600 text-white';
  };

  const downloadIDCard = async () => {
    if (!cardRef.current) return;

    try {
      // Capture the ID card as canvas with better quality
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Higher quality
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      // Create PDF - standard credit card size (85.60 × 53.98 mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98], // Credit card size
      });

      const pdfWidth = 85.6;
      const pdfHeight = 53.98;

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Download PDF
      const fileName = `LDOIA_ID_${member.name.replace(/\s+/g, '_')}_${member.applicationId || Date.now()}.pdf`;
      pdf.save(fileName);

      alert('✅ ID Card downloaded successfully!');
    } catch (error) {
      console.error('Error downloading ID card:', error);
      alert('❌ Error downloading ID card. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-start justify-center z-[1000] p-4 pt-8 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-xl w-full p-4 my-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-900">Member ID Card</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </Button>
        </div>

        {/* ID Card Design */}
        <div ref={cardRef} className="w-full bg-white">
          <div className="flex flex-col md:flex-row" style={{ minHeight: '420px' }}>
            {/* Left Side - Black */}
            <div className="w-full md:w-1/2 bg-black text-white flex flex-col">
              {/* Top Section - Logo and Title */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 pb-0">
                <div className="text-center mb-4">
                  <img
                    src="/logo.png"
                    alt="LDOIA Logo"
                    className="w-40 h-40 mx-auto mb-3"
                  />
                  <h2 className="text-xl font-bold mb-1 leading-tight">LAND DEVELOPERS & OWNERS</h2>
                  <h3 className="text-xl font-semibold">INDIA ASSOCIATION</h3>
                </div>
              </div>

              {/* White Section - We Solve Problems */}
              <div className="bg-white text-black text-center py-3">
                <div className="text-xl font-bold">WE SOLVE PROBLEMS OF</div>
              </div>

              {/* Middle Section - Services */}
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 py-4">
                <div className="text-3xl font-bold">DEVELOPERS</div>
                <div className="text-3xl font-bold">LAND OWNERS</div>
                <div className="text-3xl font-bold">REAL ESTATE AGENTS</div>
              </div>

              {/* Red Badge */}
              <div className="px-6 pb-4">
                <div className="bg-white text-black px-3 py-2 rounded-lg text-center">
                  <div className="bg-red-600 text-white font-bold text-xm py-2 px-3 rounded mb-2">EACH AREA HEAD HAVE 25 POST</div>
                  <p className="font-medium">We Are Appointing Sole Head</p>
                  <p>for India, Zone, State, Division,</p>
                  <p>District, Tehsil, Pincode, Village</p>
                </div>
              </div>


              {/* Bottom White Section - Contact Info */}
              <div className="bg-white text-black text-center py-3 border-t-2 border-gray-300">
                <div className="text-lg font-bold">Mob: 9833752025</div>
                <div className="text-sm">Web: instantlly.com</div>
              </div>
            </div>

            {/* Right Side - Red */}
            <div className="w-full md:w-1/2 bg-red-600 text-white p-6 flex flex-col">
              {/* Instantly Logo Header */}
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/instantllylogo.png" 
                  alt="Marketed By Instantly" 
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* Member Photo */}
              <div className="bg-white w-full h-48 mb-4 flex items-center justify-center">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('❌ ID Card: Failed to load photo:', member.photo);
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-5xl font-bold text-gray-400">Photo</div>';
                    }}
                    onLoad={() => {
                      console.log('✅ ID Card: Photo loaded successfully');
                    }}
                  />
                ) : (
                  <div className="text-5xl font-bold text-gray-400">Photo</div>
                )}
              </div>

              {/* Member Details */}
              <div className="space-y-3 flex-1">
                <div>
                  <div className="text-2xl font-bold mb-1">Name: {member.name || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-2xl font-bold mb-1">Mob: {member.phone || 'N/A'}</div>
                  
                </div>

                <div>
                  <div className="text-2xl font-bold mb-2">Area Head For</div>

                  {/* Location Fields with Highlighting */}
                  <div className="space-y-1.5">
                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('country')}`}>
                      <span className="font-semibold">Country:</span> {member.location?.country || 'India'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('zone')}`}>
                      <span className="font-semibold">Zone:</span> {member.location?.zone || '-'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('state')}`}>
                      <span className="font-semibold">State:</span> {member.location?.state || '-'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('division')}`}>
                      <span className="font-semibold">Division:</span> {member.location?.division || '-'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('district')}`}>
                      <span className="font-semibold">District:</span> {member.location?.district || '-'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('tehsil')}`}>
                      <span className="font-semibold">Taluka:</span> {member.location?.tehsil || '-'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('pincode')}`}>
                      <span className="font-semibold">Pincode:</span> {member.location?.pincode || '-'}
                    </div>

                    <div className={`px-3 py-2 rounded text-sm ${getFieldStyle('village')}`}>
                      <span className="font-semibold">Village:</span> {member.location?.village || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-sm"
          >
            Close
          </Button>
          <Button
            onClick={downloadIDCard}
            className="flex-1 text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            📥 Download ID Card
          </Button>
        </div>
      </div>
    </div>
  );
}
