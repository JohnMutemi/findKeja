'use client';

import { useState, useEffect } from 'react';
import {
  Car,
  FootprintsIcon as Walk,
  Bike,
  Train,
  Navigation,
  Star,
  MapPin,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export default function DirectionsModal({
  isOpen,
  onClose,
  destination,
}: DirectionsModalProps) {
  const { data: session } = useSession();
  const [startingLocation, setStartingLocation] = useState('');
  const [transportMode, setTransportMode] = useState('driving');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  useEffect(() => {
    if (session) {
      // Load favorite locations from localStorage
      const savedLocations = localStorage.getItem('favoriteLocations');
      if (savedLocations) {
        setFavoriteLocations(JSON.parse(savedLocations));
      }
    }
  }, [session]);

  const handleLocationSearch = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&country=ke`
      );
      const data = await response.json();
      setSuggestions(data.features);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocode the coordinates
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
              const location = data.features[0];
              setStartingLocation(location.place_name);
              setSelectedLocation({
                id: location.id,
                name: location.text,
                address: location.place_name,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              calculateRoute(
                position.coords.longitude,
                position.coords.latitude
              );
            }
          } catch (error) {
            console.error('Error getting current location:', error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  const handleLocationSelect = (suggestion: any) => {
    setStartingLocation(suggestion.place_name);
    setSelectedLocation({
      id: suggestion.id,
      name: suggestion.text,
      address: suggestion.place_name,
      latitude: suggestion.center[1],
      longitude: suggestion.center[0],
    });
    setSuggestions([]);
    calculateRoute(suggestion.center[0], suggestion.center[1]);
  };

  const calculateRoute = async (startLng: number, startLat: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${startLng},${startLat};${destination.longitude},${destination.latitude}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1) + ' km',
          duration: Math.round(route.duration / 60) + ' mins',
        });
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      const newLocation = {
        ...selectedLocation,
        id: Date.now().toString(), // Generate a unique ID
      };
      const updatedLocations = [...favoriteLocations, newLocation];
      setFavoriteLocations(updatedLocations);
      localStorage.setItem(
        'favoriteLocations',
        JSON.stringify(updatedLocations)
      );
    }
  };

  const handleRemoveFavorite = (locationId: string) => {
    const updatedLocations = favoriteLocations.filter(
      (loc) => loc.id !== locationId
    );
    setFavoriteLocations(updatedLocations);
    localStorage.setItem(
      'favoriteLocations',
      JSON.stringify(updatedLocations)
    );
  };

  const handleGetDirections = () => {
    if (!selectedLocation) return;

    const encodedStart = encodeURIComponent(selectedLocation.address);
    const encodedEnd = `${destination.longitude},${destination.latitude}`;
    window.open(
      `https://www.mapbox.com/directions/${transportMode}/${encodedStart}/${encodedEnd}`,
      '_blank'
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Directions</DialogTitle>
          <DialogDescription>
            Enter your starting location to get directions to this property
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Starting Location</label>
            <div className="relative">
              <Input
                placeholder="Enter your address or location"
                value={startingLocation}
                onChange={(e) => {
                  setStartingLocation(e.target.value);
                  handleLocationSearch(e.target.value);
                }}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  <ScrollArea className="h-[200px]">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleLocationSelect(suggestion)}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{suggestion.place_name}</span>
                        </div>
                      </button>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={handleUseCurrentLocation}
              disabled={isLoading}>
              <Navigation className="h-4 w-4 mr-2" />
              {isLoading ? 'Getting Location...' : 'Use Current Location'}
            </Button>
          </div>

          {session && favoriteLocations.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Favorite Locations</label>
              <ScrollArea className="h-[100px]">
                <div className="space-y-2">
                  {favoriteLocations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <button
                        className="flex-1 text-left"
                        onClick={() => handleLocationSelect(location)}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{location.name}</span>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(location.id)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Transportation Mode</label>
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant={transportMode === 'driving' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => setTransportMode('driving')}>
                <Car className="h-4 w-4" />
                <span className="text-xs">Driving</span>
              </Button>
              <Button
                variant={transportMode === 'walking' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => setTransportMode('walking')}>
                <Walk className="h-4 w-4" />
                <span className="text-xs">Walking</span>
              </Button>
              <Button
                variant={transportMode === 'cycling' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => setTransportMode('cycling')}>
                <Bike className="h-4 w-4" />
                <span className="text-xs">Cycling</span>
              </Button>
              <Button
                variant={transportMode === 'transit' ? 'default' : 'outline'}
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => setTransportMode('transit')}>
                <Train className="h-4 w-4" />
                <span className="text-xs">Transit</span>
              </Button>
            </div>
          </div>

          {routeInfo && (
            <div className="space-y-2">
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Estimated Route</p>
                  <p className="text-sm text-muted-foreground">
                    {routeInfo.distance} • {routeInfo.duration}
                  </p>
                </div>
                {selectedLocation && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveLocation}>
                    <Star className="h-4 w-4 mr-2" />
                    Save Location
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGetDirections}
            disabled={!selectedLocation || !routeInfo}>
            Get Directions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 