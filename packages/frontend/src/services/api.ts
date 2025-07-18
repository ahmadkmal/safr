import axios from 'axios';
import { IAirportAndCity, IFlightOffer } from '../types/flightTypes';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  getFlightOffers: (origin: string, departureDate: string) => api.get(`/amadeus/flight-inspiration?origin=${origin}&departureDate=${departureDate}`).then(response => response.data) as Promise<{data:IFlightOffer[], meta: any}>,
  searchAirportsAndCities: (keyword: string) => api.get(`/amadeus/search-locations`, { params: { keyword } }).then(response => response.data) as Promise<{data:IAirportAndCity[], meta: any}>,
};

export default api; 