// api/dropdown.api.ts
import http from "@/lib/axios";

// Types for dropdown options
export interface DropdownOption {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface HotelOption extends DropdownOption {
  stars: number;
  location: string;
  imageCover: string;
  propertyHighlights: string[];
}

export interface TransportationOption extends DropdownOption {
  companyName: string;
  type: string;
  class: string;
  description?: string;
}

// API calls
export const fetchHotels = async (): Promise<HotelOption[]> => {
  const { data } = await http.get('/hotels');
  return data.data || data;
};

export const fetchDestinations = async (): Promise<DropdownOption[]> => {
  const { data } = await http.get('/destinations');
  return data.data || data;
};

export const fetchTransportations = async (): Promise<TransportationOption[]> => {
  const { data } = await http.get('/transportations');
  return data.data || data;
};