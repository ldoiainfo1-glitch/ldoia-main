import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface PromotionRecord {
  srNo: number;
  date: string;
  displayDate: string;
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
  imageIds: {
    [key: string]: string;
  };
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
  const memberId = searchParams.get('memberId');
  const memberName = searchParams.get('name');
  const memberPhone = searchParams.get('phone');
  
  const [promotionRecords, setPromotionRecords] = useState<PromotionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string>('');

  useEffect(() => {
    fetchPromotionRecords();
  }, []);

  const fetchPromotionRecords = async () => {
    try {
      setIsLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_API_URL || '/api';
      console.log('📡 Fetching promotion records from:', `${backendUrl}/promotions/records`);
      const response = await fetch(`${backendUrl}/promotions/records`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📊 Fetched promotion data:', data);
      
      if (data.success) {
        setPromotionRecords(data.records);
      } else {
        console.error('Failed to fetch promotion records:', data.error);
        alert('Failed to load promotion records. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error fetching promotion records:', error);
      alert('Error loading promotion records. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPromotion = async (
    date: string,
    language: string
  ) => {
    if (!memberId) {
      alert('⚠️ Member ID is required to download promotion card.');
      return;
    }

    const downloadKey = `${date}-${language}`;
    setIsDownloading(downloadKey);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_API_URL || '/api';
      // Fetch the promotion card for this member, language, and date
      const response = await fetch(
        `${backendUrl}/promotions/generate?memberId=${memberId}&language=${language}&date=${date}`
      );

      if (!response.ok) {
        throw new Error('Failed to generate promotion card');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Promotion_${memberName || 'Member'}_${language}_${date}.jpg`;
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
              {memberId && memberName 
                ? `My Promotion Cards - ${memberName}` 
                : 'My Promotion Cards'}
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          
          {memberId && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-200">
              <p className="text-sm text-amber-900 mb-2">
                <strong>👋 Welcome{memberName ? ` ${memberName}` : ''}!</strong> Download your personalized promotion cards in different languages.
              </p>
              <p className="text-xs text-amber-800">
                Each row represents a promotion template upload date. Green buttons indicate available languages for that date.
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
                    <th className="px-4 py-3 text-left text-sm font-semibold">{memberId ? 'Name' : 'Upload Date'}</th>
                    {memberId && <th className="px-4 py-3 text-left text-sm font-semibold">Mobile No</th>}
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
                        colSpan={4 + LANGUAGES.length + (memberId ? 1 : 0)}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No promotion templates have been uploaded yet. Please contact admin.
                      </td>
                    </tr>
                  ) : (
                    promotionRecords.map((record) => (
                      <tr
                        key={record.date}
                        className="hover:bg-amber-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.srNo}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {memberId ? memberName || 'Member' : record.displayDate}
                        </td>
                        {memberId && (
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {memberPhone || '-'}
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {record.displayDate}
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
                                  : "bg-gray-50 border-gray-300 text-gray-400 gap-1 cursor-not-allowed opacity-50"
                              }
                              onClick={() =>
                                record.availableLanguages[lang.key as keyof typeof record.availableLanguages] &&
                                handleDownloadPromotion(record.date, lang.key)
                              }
                              disabled={
                                !memberId || 
                                !record.availableLanguages[lang.key as keyof typeof record.availableLanguages] ||
                                isDownloading === `${record.date}-${lang.key}`
                              }
                            >
                              {isDownloading === `${record.date}-${lang.key}` ? (
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

        {/* Info Box */}
        {!isLoading && !memberId && promotionRecords.length > 0 && (
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Note:</strong> This page shows all promotion template upload dates. 
              To download cards, please access this page through the "Actions" → "Promotion" button from the main dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
