import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AmadeusService } from '../services/amadeus.service';

const amadeusService = new AmadeusService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
    'Access-Control-Allow-Credentials': 'true',
  };

  try {
    const path = event.path;
    const queryParams = event.queryStringParameters || {};


    if (path.includes('/amadeus/token')) {
      return await handleGetToken(headers);
    } else if (path.includes('/amadeus/flight-inspiration')) {
      return await handleFlightInspiration(queryParams, headers);
    } else if (path.includes('/amadeus/search-locations')) {
      return await handleSearchLocations(queryParams, headers);
    } else {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Endpoint not found',
        }),
      };
    }
  } catch (error) {
    console.error('Amadeus handler error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
      }),
    };
  }
};

async function handleGetToken(headers: Record<string, string>): Promise<APIGatewayProxyResult> {
  try {
    const token = await amadeusService.getAccessToken();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Token obtained successfully',
        token: token.substring(0, 20) + '...',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to obtain token',
        error: error.message,
      }),
    };
  }
}

async function handleFlightInspiration(
  queryParams: Record<string, string>,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const { origin, departureDate } = queryParams;

  if (!origin || !departureDate) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Origin and departureDate are required',
      }),
    };
  }

  try {
    const data = await amadeusService.getFlightInspiration(origin, departureDate);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch flight inspiration',
        error: error.message,
      }),
    };
  }
}

async function handleSearchLocations(
  queryParams: Record<string, string>,
  headers: Record<string, string>
): Promise<APIGatewayProxyResult> {
  const { keyword, subType, countryCode, page } = queryParams;

  if (!keyword) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Keyword is required',
      }),
    };
  }

  try {
    const options = {
      subType: subType as 'AIRPORT' | 'CITY' | 'POINT_OF_INTEREST' | undefined,
      countryCode,
      page: page ? parseInt(page, 10) : undefined,
    };

    const data = await amadeusService.searchAirportsAndCities(keyword, options);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to search locations',
        error: error.message,
      }),
    };
  }
} 