/**
 * Location API Service
 * Fetches hierarchical location data from backend API
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001/api';

export interface LocationHierarchy {
  combine?: string;
  country_id?: number;
  country: string;
  zone_id?: number;
  zone: string;
  state_id?: number;
  state: string;
  division?: string;
  district_id?: number;
  district?: string;
  taluka?: string;
  city_id?: number;
  city?: string;
  pincode?: string;
  postOffice?: string;
}

/**
 * Fetch all countries
 */
export async function getCountries(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/countries`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch countries');
    }
    
    return data.countries || [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return ['India']; // Fallback to India only
  }
}

/**
 * Fetch zones by country
 */
export async function getZones(country: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/zones?country=${encodeURIComponent(country)}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch zones');
    }
    
    return data.zones || [];
  } catch (error) {
    console.error('Error fetching zones:', error);
    return [];
  }
}

/**
 * Fetch states by country and zone
 */
export async function getStates(country: string, zone?: string): Promise<string[]> {
  try {
    let url = `${API_BASE_URL}/locations/states?country=${encodeURIComponent(country)}`;
    if (zone) {
      url += `&zone=${encodeURIComponent(zone)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch states');
    }
    
    return data.states || [];
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}

/**
 * Fetch divisions by country and state (or all divisions if no state)
 */
export async function getDivisions(country: string, state?: string): Promise<string[]> {
  try {
    let url = `${API_BASE_URL}/locations/divisions?country=${encodeURIComponent(country)}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch divisions');
    }
    
    return data.divisions || [];
  } catch (error) {
    console.error('Error fetching divisions:', error);
    return [];
  }
}

/**
 * Fetch districts by country (optionally filtered by state/division/zone)
 */
export async function getDistricts(country: string, state?: string, division?: string, zone?: string): Promise<string[]> {
  try {
    let url = `${API_BASE_URL}/locations/districts?country=${encodeURIComponent(country)}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    if (division) {
      url += `&division=${encodeURIComponent(division)}`;
    }
    if (zone) {
      url += `&zone=${encodeURIComponent(zone)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch districts');
    }
    
    return data.districts || [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
}

/**
 * Fetch talukas by country (optionally filtered by state/district)
 */
export async function getTalukas(country: string, state?: string, district?: string): Promise<string[]> {
  try {
    let url = `${API_BASE_URL}/locations/talukas?country=${encodeURIComponent(country)}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    if (district) {
      url += `&district=${encodeURIComponent(district)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch talukas');
    }
    
    return data.talukas || [];
  } catch (error) {
    console.error('Error fetching talukas:', error);
    return [];
  }
}

/**
 * Fetch pincodes by country (optionally filtered by state/district/taluka)
 */
export async function getPincodes(country: string, state?: string, district?: string, taluka?: string): Promise<string[]> {
  try {
    let url = `${API_BASE_URL}/locations/pincodes?country=${encodeURIComponent(country)}`;
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    if (district) {
      url += `&district=${encodeURIComponent(district)}`;
    }
    if (taluka) {
      url += `&taluka=${encodeURIComponent(taluka)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch pincodes');
    }
    
    return data.pincodes || [];
  } catch (error) {
    console.error('Error fetching pincodes:', error);
    return [];
  }
}

/**
 * Fetch post offices by pincode
 */
export async function getPostOffices(pincode: string): Promise<string[]> {
  try {
    const url = `${API_BASE_URL}/locations/post-offices?pincode=${encodeURIComponent(pincode)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch post offices');
    }
    
    return data.postOffices || [];
  } catch (error) {
    console.error('Error fetching post offices:', error);
    return [];
  }
}

/**
 * Get complete location hierarchy
 */
export async function getLocationHierarchy(filters: {
  country?: string;
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  taluka?: string;
  city?: string;
  pincode?: string;
}): Promise<LocationHierarchy[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters.country) params.append('country', filters.country);
    if (filters.zone) params.append('zone', filters.zone);
    if (filters.state) params.append('state', filters.state);
    if (filters.division) params.append('division', filters.division);
    if (filters.district) params.append('district', filters.district);
    if (filters.taluka) params.append('taluka', filters.taluka);
    if (filters.city) params.append('city', filters.city);
    if (filters.pincode) params.append('pincode', filters.pincode);
    
    const url = `${API_BASE_URL}/locations/hierarchy?${params.toString()}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch location hierarchy');
    }
    
    return data.locations || [];
  } catch (error) {
    console.error('Error fetching location hierarchy:', error);
    return [];
  }
}

/**
 * Reverse lookup: Get parent locations from a child selection
 * For example, if user selects pincode 400011, get zone, state, division, district, taluka
 */
export async function getParentLocations(filters: {
  country?: string;
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  taluka?: string;
  pincode?: string;
}): Promise<{
  zone?: string;
  state?: string;
  division?: string;
  district?: string;
  taluka?: string;
  pincode?: string;
} | null> {
  try {
    const locations = await getLocationHierarchy(filters);
    
    if (locations.length === 0) {
      return null;
    }
    
    // Take first match (they should all have same parent hierarchy)
    const location = locations[0];
    
    return {
      zone: location.zone,
      state: location.state,
      division: location.division,
      district: location.district,
      taluka: location.taluka,
      pincode: location.pincode
    };
  } catch (error) {
    console.error('Error getting parent locations:', error);
    return null;
  }
}

/**
 * Bulk import location data from Excel
 */
export async function bulkImportLocations(data: LocationHierarchy[]): Promise<{
  success: boolean;
  insertedCount?: number;
  error?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/bulk-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error importing locations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import locations',
    };
  }
}

export default {
  getCountries,
  getZones,
  getStates,
  getDivisions,
  getDistricts,
  getTalukas,
  getPincodes,
  getPostOffices,
  getLocationHierarchy,
  getParentLocations,
  bulkImportLocations,
};
