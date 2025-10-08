import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface PromotionRecord {
  _id: string;
  name: string;
  phone: string;
  date: string;
  photo?: string;
  location?: any;
  availableLanguages: {
    hindi: boolean;
    english: boolean;
    marathi: boolean;
    gujarati: boolean;
    tamil: boolean;
    telugu: boolean;
    kannada: boolean;
    bengali: boolean;
    odia: boolean;
    urdu: boolean;
  };
}

interface PromotionImage {
  language: string;
  imageUrl: string;
  uploadDate: string;
}

const LANGUAGES = [
  { key: 'hindi', label: 'Hindi' },
  { key: 'english', label: 'English' },
  { key: 'marathi', label: 'Marathi' },
  { key: 'gujarati', label: 'Gujarati' },
  { key: 'tamil', label: 'Tamil' },
  { key: 'telugu', label: 'Telugu' },
  { key: 'kannada', label: 'Kannada' },
  { key: 'bengali', label: 'Bengali' },
  { key: 'odia', label: 'Odia' },
  { key: 'urdu', label: 'Urdu' },
];

export default function PromotionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const memberId = searchParams.get('memberId'); // Get member ID from URL
  
  const [promotionRecords, setPromotionRecords] = useState<PromotionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string>('');

  useEffect(() => {
    fetchPromotionRecords();
  }, [memberId]);

  const fetchPromotionRecords = async () => {
    try {
      setIsLoading(true);
      const baseUrl = import.meta.env.VITE_BACKEND_API_URL || '/api';
      const response = await fetch(`${baseUrl}/promotions/records`);
      const data = await response.json();
      
      console.log('📊 Fetched promotion data:', data);
      console.log('🔍 Looking for memberId:', memberId);
      console.log('🔍 memberId type:', typeof memberId);
      
      if (data.success) {
        // Filter to show only the specific member's record if memberId is provided
        let filteredRecords = data.records;
        if (memberId) {
          console.log('📝 All records:', filteredRecords.map((r: PromotionRecord) => ({ id: r._id, name: r.name, idType: typeof r._id })));
          filteredRecords = data.records.filter((record: PromotionRecord) => {
            console.log(`Comparing: "${record._id}" === "${memberId}"`, record._id === memberId);
            return record._id === memberId;
          });
          console.log('✅ Filtered records:', filteredRecords);
          
          // If no match found, show all records for debugging
          if (filteredRecords.length === 0) {
            console.warn('⚠️ No match found! Showing all records instead.');
            alert(`No match found for memberId: ${memberId}. Check console for details.`);
          }
        }
        setPromotionRecords(filteredRecords);
      } else {
        console.error('Failed to fetch promotion records:', data.error);
      }
    } catch (error) {
      console.error('Error fetching promotion records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPromotion = async (
    member: PromotionRecord,
    language: string
  ) => {
    const downloadKey = `${member._id}-${language}`;
    setIsDownloading(downloadKey);

    try {
      // Fetch the promotion template for this language and date
      const response = await fetch(
        `/api/promotions/generate?memberId=${member._id}&language=${language}&date=${member.date}`
      );

      if (!response.ok) {
        throw new Error('Failed to generate promotion card');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Promotion_${member.name.replace(/\s+/g, '_')}_${language}_${member.date}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      alert(`✅ Promotion card downloaded successfully!`);
    } catch (error) {
      console.error('Error downloading promotion card:', error);
      alert('❌ Error downloading promotion card. Please try again.');
    } finally {
      setIsDownloading('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
              {memberId && promotionRecords.length > 0 
                ? `My Promotion Cards - ${promotionRecords[0].name}` 
                : memberId && promotionRecords.length === 0
                ? 'My Promotion Cards'
                : 'Promotion Records'}
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          
          {memberId && promotionRecords.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-200">
              <p className="text-sm text-amber-900">
                <strong>👋 Welcome!</strong> Download your personalized promotion cards in different languages. 
                Green buttons indicate available templates.
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading promotion records...</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Sr.No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Mobile No</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    {LANGUAGES.map((lang) => (
                      <th
                        key={lang.key}
                        className="px-4 py-3 text-center text-sm font-semibold"
                      >
                        {lang.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {promotionRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4 + LANGUAGES.length}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        {memberId 
                          ? "No promotion records found for your account. Please contact admin if your application is approved."
                          : "No promotion records found"}
                      </td>
                    </tr>
                  ) : (
                    promotionRecords.map((record, index) => (
                      <tr
                        key={record._id}
                        className="hover:bg-amber-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {record.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.phone}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('en-IN')}
                        </td>
                        {LANGUAGES.map((lang) => (
                          <td
                            key={lang.key}
                            className="px-4 py-3 text-center"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className={
                                record.availableLanguages[lang.key as keyof typeof record.availableLanguages]
                                  ? "bg-green-50 hover:bg-green-100 border-green-300 text-green-700 gap-1"
                                  : "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700 gap-1"
                              }
                              onClick={() =>
                                handleDownloadPromotion(record, lang.key)
                              }
                              disabled={
                                isDownloading === `${record._id}-${lang.key}`
                              }
                            >
                              {isDownloading === `${record._id}-${lang.key}` ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                              ) : (
                                <>
                                  <Download className="h-3 w-3" />
                                  <span className="hidden sm:inline">Download</span>
                                </>
                              )}
                            </Button>
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
