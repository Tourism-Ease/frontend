import type { Hotel } from "../../Hotel/api/hotel.api";

export interface PackageType {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  durationDays: number;
  imageCover: string;
  imageCoverUrl: string;
  images?: string[];
  imagesUrls?: string[];
  hotel: Hotel;
  destination: Destination;
  pickupLocations: PickupLocation[];
  itinerary: ItineraryItem[];
  transportation: string;
  prices: Prices;
  capacity: number;
  departureDate: string;
  availableSeats: number;
}

export interface Destination {
  id: string;
  name: string;
}

export interface PickupLocation {
  city: string;
  place: string;
  time: string;
  priceAdjustment: number;
}

export interface Prices {
  egyptianPrice: number;
  childrenPrice: number;
  foreignerPrice: number;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}
