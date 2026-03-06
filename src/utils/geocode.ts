/**
 * Geocoding utility using OpenStreetMap Nominatim API
 * 
 * This utility automatically geocodes addresses to get latitude and longitude coordinates.
 * Uses OpenStreetMap's Nominatim service which is free and doesn't require an API key.
 * 
 * Note: Please respect the usage policy: https://operations.osmfoundation.org/policies/nominatim/
 * - Maximum 1 request per second
 * - Include a User-Agent header
 */

interface GeocodeResult {
  latitude: number | null;
  longitude: number | null;
  success: boolean;
  error?: string;
}

// Rate limiting: Track last request time to respect 1 request/second limit
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // 1.1 seconds to be safe

/**
 * Wait if necessary to respect rate limits
 */
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Geocode an address to get coordinates
 * @param address - The address string to geocode
 * @returns Promise with latitude and longitude, or null if geocoding fails
 */
export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  try {
    // Wait to respect rate limits
    await waitForRateLimit();

    // Construct the full address string
    const query = encodeURIComponent(address);
    
    // Use Nominatim API (OpenStreetMap's geocoding service)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&addressdetails=1`;
    
    // Make request with proper headers (User-Agent is required by Nominatim)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'InfiniteProperties/1.0 (Real Estate Website)', // Required by Nominatim
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocoding API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return {
        latitude: null,
        longitude: null,
        success: false,
        error: 'No results found for the given address',
      };
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return {
        latitude: null,
        longitude: null,
        success: false,
        error: 'Invalid coordinates returned',
      };
    }

    return {
      latitude: lat,
      longitude: lon,
      success: true,
    };
  } catch (error: any) {
    console.error('Geocoding error:', error.message);
    return {
      latitude: null,
      longitude: null,
      success: false,
      error: error.message || 'Geocoding failed',
    };
  }
}

/**
 * Geocode a location object with address components
 * @param location - Location object with address components
 * @returns Promise with latitude and longitude, or null if geocoding fails
 */
export async function geocodeLocation(location: {
  exactLocation?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}): Promise<GeocodeResult> {
  try {
    // Build address string from components
    // Order matters: exactLocation, pincode, city, state, country
    const addressParts: string[] = [];
    
    if (location.exactLocation) {
      addressParts.push(location.exactLocation);
    }
    // Add pincode early in the address string for better accuracy
    if (location.pincode) {
      addressParts.push(location.pincode);
    }
    if (location.city) {
      addressParts.push(location.city);
    }
    if (location.state) {
      addressParts.push(location.state);
    }
    if (location.country) {
      addressParts.push(location.country);
    }

    if (addressParts.length === 0) {
      return {
        latitude: null,
        longitude: null,
        success: false,
        error: 'No address information provided',
      };
    }

    const fullAddress = addressParts.join(', ');
    return await geocodeAddress(fullAddress);
  } catch (error: any) {
    console.error('Geocoding error:', error.message);
    return {
      latitude: null,
      longitude: null,
      success: false,
      error: error.message || 'Geocoding failed',
    };
  }
}

/**
 * Reverse geocode coordinates to get address
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise with address information
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<{ address: string; success: boolean; error?: string }> {
  try {
    // Wait to respect rate limits
    await waitForRateLimit();

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'InfiniteProperties/1.0 (Real Estate Website)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding API returned status ${response.status}`);
    }

    const data: any = await response.json();

    if (!data || !data.display_name) {
      return {
        address: '',
        success: false,
        error: 'No address found for the given coordinates',
      };
    }

    return {
      address: data.display_name as string,
      success: true,
    };
  } catch (error: any) {
    console.error('Reverse geocoding error:', error.message);
    return {
      address: '',
      success: false,
      error: error.message || 'Reverse geocoding failed',
    };
  }
}
