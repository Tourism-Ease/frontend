export interface Destination {
  id: string;
  name: string;
  country: string;
  city: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  _optimistic?: boolean;
}

export interface CreateDestinationDto {
  name: string;
  country: string;
  city: string;
  description: string;
}

export interface UpdateDestinationDto {
  name?: string;
  country?: string;
  city?: string;
  description?: string;
}

export interface PaginationMeta {
  currentPage: number;
  limit: number;
  numberOfPages: number;
  totalDocs: number;
  next: number | null;
  previous: number | null;
}

export interface PaginatedDestinationsResponse {
  results: number;
  paginationResult: PaginationMeta;
  data: Destination[];
}

export interface DestinationResponse {
  data: Destination;
}
