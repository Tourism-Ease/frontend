// types/package.type.ts
// --- Pickup Location ---
export interface PickupLocation {
  city: string;
  place: string;
  time: string;
  priceAdjustment: number;
}

// --- Itinerary ---
export interface Itinerary {
  day: number;
  title: string;
  description: string;
}

// --- Package Transportation ---
export interface PackageTransportation {
  id: string;
  transportationId?: string;
  price: number;
  companyName?: string;
  type?: string;
  class?: string;
}

// --- Main Package Model ---
export interface Package {
  id: string;
  
  title: string;
  hotel: {
    id: string;
    name: string;
    stars: number;
    imageCover: string;
    location: string;
    propertyHighlights: string[];
  };
  destination: {
    id: string;
    name: string;
  };
  
  pickupLocations: PickupLocation[];
  durationDays: number;
  shortDesc: string;
  description: string;
  itinerary: Itinerary[];
  
  transportation: PackageTransportation;
  
  egyptianPrice: number;
  childrenPrice: number;
  foreignerPrice: number;
  
  capacity: number;
  availableSeats: number;
  departureDate: string;
  
  imageCover: string;
  images: string[];
  
  imageCoverUrl: string;
  imagesUrls: string[];
  
  createdAt: string;
  _optimistic?: boolean;
}

// --- API Responses ---
export interface PackageResponse {
  data: Package;
}

export interface PaginatedPackagesResponse {
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
    totalDocs: number;
    next: number | null;
    previous: number | null;
  };
  data: Package[];
}

// --- DTOs ---
export interface CreatePackageDto {
  title: string;
  hotel: string;
  destination: string;
  pickupLocations: PickupLocation[];
  durationDays: number;
  shortDesc: string;
  description: string;
  itinerary: Itinerary[];
  transportation: string;
  egyptianPrice: number;
  childrenPrice: number;
  foreignerPrice?: number;
  capacity: number;
  departureDate: string;
  imageCover: File | string;
  images?: (File | string)[];
}

export interface UpdatePackageDto {
  title?: string;
  hotel?: string;
  destination?: string;
  pickupLocations?: PickupLocation[];
  durationDays?: number;
  shortDesc?: string;
  description?: string;
  itinerary?: Itinerary[];
  transportation?: string;
  egyptianPrice?: number;
  childrenPrice?: number;
  foreignerPrice?: number;
  capacity?: number;
  departureDate?: string;
  imageCover?: File | string;
  images?: (File | string)[];
}

// --- Form Default Values ---
export interface PackageFormDefaultValues {
  title?: string;
  hotel?: string;
  destination?: string;
  pickupLocations?: PickupLocation[];
  durationDays?: number;
  shortDesc?: string;
  description?: string;
  itinerary?: Itinerary[];
  transportation?: string;
  egyptianPrice?: number;
  childrenPrice?: number;
  foreignerPrice?: number;
  capacity?: number;
  departureDate?: string;
  imageCoverUrl?: string;
  imagesUrls?: string[];
}