// --- Transportation inside Trip ---
export interface TripTransportation {
  transportationId: string;
  price: number;
}

// --- Main Trip Model ---
export interface Trip {
  id: string;

  transportation: TripTransportation;

  title: string;
  destination: string;

  price: number;
  duration: string;
  pickUp: string;

  overview: string;

  highlights: string[];
  whatToBring: string[];

  imageCover: string;
  images: string[];

  imageCoverUrl: string;
  imagesUrls: string[];

  createdAt: string;

  _optimistic: true;
}

// --- API: Single Trip Response ---
export interface TripResponse {
  data: Trip;
}

// --- Pagination Metadata (same as hotels & transportations) ---
export interface PaginationMeta {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  totalDocs: number;
  next: number | null;
  previous: number | null;
}

// --- API: Paginated Trips Response ---
export interface PaginatedTripsResponse {
  results: number;
  paginationResult: PaginationMeta;
  data: Trip[];
}

export interface CreateTripDto {
  transportation: {
    transportationId: string;
    price: number;
  };

  title: string;
  destination: string;

  price: number;
  duration: string;
  pickUp: string;

  overview: string;

  highlights: string[];
  whatToBring: string[];

  imageCover: File;
  images?: File[];
}

export interface UpdateTripDto {
  transportation?: {
    transportationId?: string;
    price?: number;
  };

  title?: string;
  destination?: string;

  price?: number;
  duration?: string;
  pickUp?: string;

  overview?: string;

  highlights?: string[];
  whatToBring?: string[];

  imageCover?: File | null;
  images?: File[] | null;
}
