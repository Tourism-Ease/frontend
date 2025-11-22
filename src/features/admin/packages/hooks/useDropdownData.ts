// hooks/useDropdownData.ts
import { useQuery } from '@tanstack/react-query';
import {
  fetchHotels,
  fetchDestinations,
  fetchTransportations,
  type HotelOption,
  type DropdownOption,
  type TransportationOption,
} from '../api/dropdown.api';

export const useHotelsQuery = () => {
  return useQuery<HotelOption[]>({
    queryKey: ['hotels'],
    queryFn: fetchHotels,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDestinationsQuery = () => {
  return useQuery<DropdownOption[]>({
    queryKey: ['destinations'],
    queryFn: fetchDestinations,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransportationsQuery = () => {
  return useQuery<TransportationOption[]>({
    queryKey: ['transportations'],
    queryFn: fetchTransportations,
    staleTime: 5 * 60 * 1000,
  });
};