import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Trash2, Calendar, Globe } from 'lucide-react';

interface PromotionImage {
  _id: string;
  language: string;
  uploadDate: string;
  mimetype: string;
  createdAt: string;
  updatedAt: string;
  size: number;
}

const LANGUAGES = [
  { key: 'hindi', label: 'Hindi', flag: '🇮🇳' },
  { key: 'english', label: 'English', flag: '🇬🇧' },
  { key: 'marathi', label: 'Marathi', flag: '🇮🇳' },
  { key: 'gujarati', label: 'Gujarati', flag: '🇮🇳' },
  { key: 'tamil', label: 'Tamil', flag: '🇮🇳' },
  { key: 'telugu', label: 'Telugu', flag: '🇮🇳' },
  { key: 'kannada', label: 'Kannada', flag: '🇮🇳' },
  { key: 'bengali', label: 'Bengali', flag: '🇮🇳' },
  { key: 'odia', label: 'Odia', flag: '🇮🇳' },
  { key: 'urdu', label: 'Urdu', flag: '🇮🇳' },
];

export default function PromotionImagesAdmin() {
  const [images, setImages] = useState<PromotionImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [selectedDate, setSelectedDate] = useState('2025-10-07');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/promotions/images`);
      const data = await response.json();

      if (data.success) {
        setImages(data.images);
      } else {
        console.error('Failed to fetch images:', data.error);
      }
    } catch (error) {
      console.error('Error fetching promotion images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    if (!selectedLanguage || !selectedDate) {
      alert('Please select language and date');
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('language', selectedLanguage);
      formData.append('date', selectedDate);

      const response = await fetch(`${API_BASE_URL}/promotions/upload-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Promotion image uploaded successfully!');
        setSelectedFile(null);
        setPreviewUrl('');
        fetchImages();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this promotion image?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/promotions/images/${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Promotion image deleted successfully!');
        fetchImages();
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('❌ Error deleting image. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Upload Promotion Template
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Globe className="inline h-4 w-4 mr-1" />
              Select Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.key} value={lang.key}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* File Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Template Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
            />
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preview
            </label>
            <div className="bg-white p-4 rounded-lg border-2 border-amber-300">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-96 mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6">
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 text-lg"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="inline h-5 w-5 mr-2" />
                Upload Template
              </>
            )}
          </Button>
        </div>

        <p className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <strong>💡 Tip:</strong> Upload promotion templates for each language. Members will see download buttons for languages/dates that have templates uploaded.
        </p>
      </Card>

      {/* Uploaded Images List */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Uploaded Promotion Templates</h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading promotion images...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No promotion templates uploaded yet</p>
            <p className="text-gray-400 text-sm mt-2">Upload your first template above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Language</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Upload Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">File Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Created At</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {images.map((image) => {
                  const lang = LANGUAGES.find((l) => l.key === image.language);
                  return (
                    <tr key={image._id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {lang ? `${lang.flag} ${lang.label}` : image.language}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(image.uploadDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatFileSize(image.size)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {image.mimetype}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(image.createdAt).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(image._id)}
                          className="bg-red-50 hover:bg-red-100 border-red-300 text-red-700 gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
