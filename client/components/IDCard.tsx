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
        scale: 4, // Higher quality for better resolution
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight,
      });

      // Create PDF - use landscape orientation with proper dimensions
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 4, canvas.height / 4], // Match canvas dimensions
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Add image to fill entire PDF page
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 4, canvas.height / 4);

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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full p-3 my-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-gray-900">Member ID Card</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 h-7 px-2"
          >
            ✕
          </Button>
        </div>

        {/* ID Card Design */}
        <div ref={cardRef} className="w-full bg-white">
          <div className="flex flex-row" style={{ minHeight: '420px', maxHeight: '525px' }}>
            {/* Left Side - Black */}
            <div className="w-1/2 bg-black text-white flex flex-col">
              {/* Top Section - Logo and Title */}
              <div className="flex flex-col items-center justify-center p-2 pt-3">
                <div className="text-center">
                  <img
                    src="/logo.png"
                    alt="LDOIA Logo"
                    className="w-16 h-16 mx-auto mb-1"
                  />
                  <h2 className="text-[10px] font-bold mb-0.5 leading-tight">LAND DEVELOPERS & OWNERS</h2>
                  <h3 className="text-[10px] font-semibold">INDIA ASSOCIATION</h3>
                </div>
              </div>

              {/* White Section - We Solve Problems */}
              <div className="bg-white text-black text-center py-1">
                <div className="text-[10px] font-bold">WE SOLVE PROBLEMS OF</div>
              </div>

              {/* Middle Section - Services */}
              <div className="flex flex-col items-center justify-center text-center space-y-0.5 py-2">
                <div className="text-sm font-bold">DEVELOPERS</div>
                <div className="text-sm font-bold">LAND OWNERS</div>
                <div className="text-sm font-bold">REAL ESTATE AGENTS</div>
              </div>

              {/* Red Badge */}
              <div className="px-2 pb-1.5">
                <div className="bg-white text-black px-1.5 py-1 rounded text-center">
                  <div className="bg-red-600 text-white font-bold text-[8px] py-0.5 px-1.5 rounded mb-0.5">EACH AREA HEAD HAVE 25 POST</div>
                  <p className="font-medium text-[7px]">We Are Appointing Sole Head</p>
                  <p className="text-[7px]">for India, Zone, State, Division,</p>
                  <p className="text-[7px]">District, Tehsil, Pincode, Village</p>
                </div>
              </div>

              {/* Bottom White Section - Contact Info */}
              <div className="bg-white text-black text-center py-1 border-t border-gray-300">
                <div className="text-[10px] font-bold">Mob: 9833752025</div>
                <div className="text-[8px]">Web: instantlly.com</div>
              </div>
            </div>

            {/* Right Side - Red */}
            <div className="w-1/2 bg-red-600 text-white p-2 flex flex-col">
              {/* Instantly Logo Header */}
              <div className="flex items-center justify-center mb-1.5">
                <img 
                  src="/instantllylogo.png" 
                  alt="Marketed By Instantly" 
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* Member Photo */}
              <div className="bg-white w-full h-28 mb-1.5 flex items-center justify-center overflow-hidden">
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
              <div className="space-y-1 flex-1 overflow-y-auto">
                <div>
                  <div className="text-xs font-bold">Name: {member.name || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-xs font-bold">Mob: {member.phone || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-xs font-bold mb-0.5">Area Head For</div>

                  {/* Location Fields with Highlighting */}
                  <div className="space-y-0.5">
                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('country')}`}>
                      <span className="font-semibold">Country:</span> {member.location?.country || 'India'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('zone')}`}>
                      <span className="font-semibold">Zone:</span> {member.location?.zone || '-'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('state')}`}>
                      <span className="font-semibold">State:</span> {member.location?.state || '-'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('division')}`}>
                      <span className="font-semibold">Division:</span> {member.location?.division || '-'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('district')}`}>
                      <span className="font-semibold">District:</span> {member.location?.district || '-'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('tehsil')}`}>
                      <span className="font-semibold">Taluka:</span> {member.location?.tehsil || '-'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('pincode')}`}>
                      <span className="font-semibold">Pincode:</span> {member.location?.pincode || '-'}
                    </div>

                    <div className={`px-1.5 py-0.5 rounded text-[8px] ${getFieldStyle('village')}`}>
                      <span className="font-semibold">Village:</span> {member.location?.village || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs h-8"
          >
            Close
          </Button>
          <Button
            onClick={downloadIDCard}
            className="flex-1 text-xs h-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            📥 Download ID Card
          </Button>
        </div>
      </div>
    </div>
  );
}
