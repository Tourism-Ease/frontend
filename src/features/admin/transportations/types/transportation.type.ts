export interface Transportation {
  id: string;
  companyName: string;
  type: 'bus' | 'hiAce';
  class: 'Economy' | 'VIP';
  description?: string;
  createdAt: string;
  updatedAt: string;
  _optimistic?: boolean;
}

export interface CreateTransportationDto {
  companyName: string;
  type: 'bus' | 'hiAce';
  class?: 'Economy' | 'VIP';
  description?: string;
}

export interface UpdateTransportationDto {
  companyName?: string;
  type?: 'bus' | 'hiAce';
  class?: 'Economy' | 'VIP';
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

export interface PaginatedTransportationsResponse {
  results: number;
  paginationResult: PaginationMeta;
  data: Transportation[];
}

export interface TransportationResponse {
  data: Transportation;
}
