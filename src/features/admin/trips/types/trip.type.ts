// --- Pickup type ---
export type TripPickUp = { time: string; place: string };

// --- Main Trip Model ---
export interface Trip {
  id: string;

  title: string;
  destination: { id: string; name: string }; // usually an ID string

  egyptianPrice: number;
  childrenPrice?: number;
  foreignerPrice?: number;

  duration: string;
  pickUp: TripPickUp;

  overview: string;

  highlights: string[];
  whatToBring: string[];

  imageCover: string;
  images: string[];

  imageCoverUrl: string;
  imagesUrls: string[];

  createdAt: string;
  updatedAt?: string;

  _optimistic?: boolean;
}

// --- API: Single Trip Response ---
export interface TripResponse {
  data: Trip;
}

// --- Pagination Metadata ---
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

// --- DTOs for creating/updating trips ---
export interface CreateTripDto {
  title: string;
  destination: string;

  egyptianPrice: number;
  childrenPrice?: number;
  foreignerPrice?: number;

  duration: string;
  pickUp: TripPickUp;

  overview: string;

  highlights: string[];
  whatToBring: string[];

  imageCover: File;
  images?: File[];
}

export interface UpdateTripDto {
  title?: string;
  destination?: string;

  egyptianPrice?: number;
  childrenPrice?: number;
  foreignerPrice?: number;

  duration?: string;
  pickUp?: TripPickUp;

  overview?: string;

  highlights?: string[];
  whatToBring?: string[];

  imageCover?: File | null;
  images?: File[] | null;
}
