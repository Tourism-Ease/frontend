import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useLoadScript, StandaloneSearchBox, type Libraries } from '@react-google-maps/api';

interface LocationAutocompleteProps {
  location: { lat: number; lng: number } | null;
  setLocation: (loc: { lat: number; lng: number }) => void;
}

const libraries: Libraries = ['places'];

export function LocationAutocomplete({ location, setLocation }: LocationAutocompleteProps) {
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [inputValue, setInputValue] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Reverse geocode coordinates on edit
  useEffect(() => {
    if (!isLoaded || !location) return;

    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: location.lat, lng: location.lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setInputValue(results[0].formatted_address);
      }
    });
  }, [isLoaded, location]);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  const onPlacesChanged = () => {
    if (!searchBox) return;
    const places = searchBox.getPlaces();
    if (places && places.length > 0 && places[0].geometry?.location) {
      const coords = {
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng(),
      };
      setLocation(coords);
      setInputValue(places[0].formatted_address || '');
    }
  };

  return (
    <StandaloneSearchBox
      onLoad={(ref) => setSearchBox(ref)}
      onPlacesChanged={onPlacesChanged}
    >
      <Input
        placeholder="Search for a hotel location"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </StandaloneSearchBox>
  );
}
