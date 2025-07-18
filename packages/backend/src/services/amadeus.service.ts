import axios from 'axios';

export interface AmadeusTokenResponse {
  type: string;
  username: string;
  application_name: string;
  client_id: string;
  token_type: string;
  access_token: string;
  expires_in: number;
  state: string;
  scope: string;
}

export interface AmadeusConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

export class AmadeusService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  private get amadeusConfig(): AmadeusConfig {
    return {
      baseUrl: process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com',
      clientId: process.env.AMADEUS_CLIENT_ID || '',
      clientSecret: process.env.AMADEUS_CLIENT_SECRET || '',
    };
  }

  private get clientId(): string {
    return this.amadeusConfig?.clientId;
  }

  private get clientSecret(): string {
    return this.amadeusConfig?.clientSecret;
  }

  private get baseUrl(): string {
    return this.amadeusConfig?.baseUrl;
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }

    return Date.now() < (this.tokenExpiry - 5 * 60 * 1000);
  }

  async getAccessToken(): Promise<string> {
    if (this.isTokenValid()) {
      return this.accessToken;
    }

    try {
      console.log('Requesting new Amadeus access token...');
      
      const response = await axios.post<AmadeusTokenResponse>(
        `${this.baseUrl}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in } = response.data as AmadeusTokenResponse;
      this.accessToken = access_token;
      this.tokenExpiry = Date.now() + (expires_in * 1000);
      
      console.log('Successfully obtained Amadeus access token');
      return this.accessToken;
    } catch (error) {
      console.error('Failed to obtain Amadeus access token', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  async makeAuthenticatedRequest(endpoint: string, params?: Record<string, any>) {
    const token = await this.getAccessToken();
    
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params,
      });
      
      return response.data;
    } catch (error) {
      console.error(`Amadeus API request failed for ${endpoint}`, JSON.stringify(error.response?.data) || JSON.stringify(error.message), error.response?.status);
      throw new Error(`Amadeus API request failed: ${error.response?.data?.errors?.[0]?.detail || error.message}`);
    }
  }

  /**
   * Flight Inspiration Search API
   * @param origin - Origin city IATA code (e.g., 'NYC', 'LON')
   * @param departureDate - Departure date in YYYY-MM-DD format
   */
  async getFlightInspiration(
    origin: string,
    departureDate: string,
  ) {
    const params: Record<string, any> = {
      origin,
      departureDate,
    };

    return this.makeAuthenticatedRequest('/v1/shopping/flight-destinations', params);
  }

  /**
   * Search for airports and cities by keyword
   * @param keyword - City or airport name (e.g., "New York", "London", "Paris")
   * @param subType - Filter by type: AIRPORT, CITY, or POINT_OF_INTEREST
   * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., "US", "GB")
   * @param page - Page number for pagination
   */
  async searchAirportsAndCities(
    keyword: string,
    options?: {
      subType?: 'AIRPORT' | 'CITY' | 'POINT_OF_INTEREST';
      countryCode?: string;
      page?: number;
    }
  ) {
    const params: Record<string, any> = {
      keyword,
      subType: 'CITY,AIRPORT',
    };

    if (options?.subType) params.subType = options.subType;
    if (options?.countryCode) params.countryCode = options.countryCode;
    if (options?.page) params.page = options.page;

    return this.makeAuthenticatedRequest('/v1/reference-data/locations', params);
  }
} 