// ---------------------------
// Hotel Entity
// ---------------------------
export interface Hotel {
  id: string;
  name: string;
  description: string;
  stars: number;

  address: {
    country: string;
    city: string;
    street?: string;
  };

  propertyHighlights: string[];

  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };

  imageCover: string; // stored filename or URL
  images: string[]; // stored filenames or URLs

  // Virtuals
  imageCoverUrl?: string; // full URL returned from backend
  imagesUrls?: string[]; // full URLs returned from backend

  _optimistic?: boolean;
}

// ---------------------------
// Single Entity Response
// ---------------------------
export interface HotelResponse {
  data: Hotel;
}

// ---------------------------
// Pagination Metadata
// ---------------------------
export interface PaginationMeta {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  totalDocs: number;
  next: number | null;
  previous: number | null;
}

// ---------------------------
// Paginated Hotels Response
// ---------------------------
export interface PaginatedHotelsResponse {
  results: number;
  paginationResult: PaginationMeta;
  data: Hotel[];
}

// ---------------------------
// DTO for Creating a Hotel
// ---------------------------
export interface CreateHotelDto {
  name: string;
  description: string;
  stars: number;

  address: {
    country: string;
    city: string;
    street?: string;
  };

  propertyHighlights: string[];

  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };

  imageCover: File; // required
  images?: File[]; // optional, max 5
}

// ---------------------------
// DTO for Updating a Hotel
// ---------------------------
export interface UpdateHotelDto {
  name?: string;
  description?: string;
  stars?: number;

  address?: {
    country?: string;
    city?: string;
    street?: string;
  };

  propertyHighlights?: string[];

  location?: {
    type: 'Point';
    coordinates: [number, number];
  };

  imageCoverUrl?: string;
  imagesUrls?: string;

  imageCover?: File | null; // optional for update
  images?: File[] | null; // optional, max 5
}
