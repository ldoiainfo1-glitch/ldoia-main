/**
 * Promotion API Service
 * Handles fetching promotion records and generating promotion cards
 */

export interface PromotionRecord {
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

export interface PromotionImage {
  _id: string;
  language: string;
  imageUrl: string;
  uploadDate: string;
}

/**
 * Fetch all promotion records with their available languages
 */
export async function fetchPromotionRecords(): Promise<{
  success: boolean;
  records?: PromotionRecord[];
  error?: string;
}> {
  try {
    const response = await fetch('/api/promotions/records');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching promotion records:', error);
    return {
      success: false,
      error: 'Failed to fetch promotion records',
    };
  }
}

/**
 * Generate and download a promotion card
 */
export async function generatePromotionCard(
  memberId: string,
  language: string,
  date: string
): Promise<Blob> {
  const response = await fetch(
    `/api/promotions/generate?memberId=${memberId}&language=${language}&date=${date}`
  );

  if (!response.ok) {
    throw new Error('Failed to generate promotion card');
  }

  return await response.blob();
}

/**
 * Check if a promotion image exists for a specific language and date
 */
export async function checkPromotionImageAvailability(
  language: string,
  date: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/promotions/check-image?language=${language}&date=${date}`
    );
    const data = await response.json();
    return data.available || false;
  } catch (error) {
    console.error('Error checking promotion image:', error);
    return false;
  }
}
