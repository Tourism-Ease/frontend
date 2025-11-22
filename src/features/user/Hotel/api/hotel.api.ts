import http from "../../../../lib/axios";

export interface Address {
  country: string;
  city: string;
}

export interface Location {
  type: string;
  coordinates: number[];
}

export interface Hotel {
  id: string;
  name: string;
  address: Address;
  Description: string;
  stars: number;
  averageRating: number;
  numberOfRatings: number;
  imageCoverUrl: string;
  imagesUrls: string[];
  location: Location;
}

export const getHotelById = async (id: string): Promise<Hotel> => {
  const response = await http.get(`hotels/${id}`);
  return response.data.data;
};
