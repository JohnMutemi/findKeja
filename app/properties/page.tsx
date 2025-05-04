'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Home,
  Navigation,
  Car,
  Walk,
  Bike,
  Train,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import DirectionsModal from '@/components/DirectionsModal';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'AVAILABLE' | 'RENTED' | 'PENDING';
  type: 'APARTMENT' | 'HOUSE' | 'STUDIO' | 'VILLA' | 'TOWNHOUSE' | 'PENTHOUSE';
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  owner: {
    name: string;
  };
  createdAt: string;
}

export default function PropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [status, setStatus] = useState<string>('ALL');
  const [type, setType] = useState<string>('ALL');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [startingLocation, setStartingLocation] = useState('');
  const [transportMode, setTransportMode] = useState('driving');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesStatus = status === 'ALL' || property.status === status;
    const matchesType = type === 'ALL' || property.type === type;
    const matchesBedrooms = bedrooms === 0 || property.bedrooms >= bedrooms;

    return (
      matchesSearch &&
      matchesPrice &&
      matchesStatus &&
      matchesType &&
      matchesBedrooms
    );
  });

  const handleContact = async (propertyId: string) => {
    if (!session) {
      // Redirect to login or show login modal
      return;
    }

    try {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
        }),
      });

      if (response.ok) {
        // Redirect to messages page
        window.location.href = '/messages';
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleGetDirections = (property: Property) => {
    setSelectedProperty(property);
    setIsDirectionsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Find Your Perfect Home</CardTitle>
            <CardDescription>
              Browse through our available properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="APARTMENT">Apartment</SelectItem>
                  <SelectItem value="HOUSE">House</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                  <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={bedrooms.toString()}
                onValueChange={(value) => setBedrooms(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span>Price Range</span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={0}
                  max={100000}
                  step={1000}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>KSh {priceRange[0].toLocaleString()}</span>
                  <span>KSh {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id}>
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={property.images[0] || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={
                      property.status === 'AVAILABLE'
                        ? 'default'
                        : property.status === 'PENDING'
                        ? 'secondary'
                        : 'destructive'
                    }>
                    {property.status}
                  </Badge>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{property.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {property.city}, {property.state}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{property.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.bathrooms} baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{property.area}m²</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {property.description}
                </p>
                <p className="text-2xl font-bold mb-4">
                  KSh {property.price.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{property.title}</DialogTitle>
                        <DialogDescription>
                          {property.address}, {property.city}, {property.state}
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="images">
                        <TabsList>
                          <TabsTrigger value="images">Images</TabsTrigger>
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="map">Map</TabsTrigger>
                        </TabsList>
                        <TabsContent value="images" className="mt-4">
                          <ScrollArea className="h-[400px]">
                            <div className="grid grid-cols-2 gap-4">
                              {property.images.map((image, index) => (
                                <div key={index} className="relative h-64">
                                  <Image
                                    src={image}
                                    alt={`${property.title} - Image ${
                                      index + 1
                                    }`}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="details" className="mt-4">
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">
                                  Property Details
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Type
                                    </span>
                                    <span>{property.type}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Bedrooms
                                    </span>
                                    <span>{property.bedrooms}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Bathrooms
                                    </span>
                                    <span>{property.bathrooms}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Area
                                    </span>
                                    <span>{property.area}m²</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Amenities</h4>
                                <div className="flex flex-wrap gap-2">
                                  {property.amenities.map((amenity, index) => (
                                    <Badge key={index} variant="secondary">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-medium mb-2">Description</h4>
                              <p className="text-muted-foreground">
                                {property.description}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="map" className="mt-4">
                          <div className="space-y-4">
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => handleGetDirections(property)}>
                                <Navigation className="h-4 w-4" />
                                Get Directions
                              </Button>
                            </div>
                            <div className="h-[400px] rounded-lg overflow-hidden">
                              <iframe
                                src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${property.longitude},${property.latitude})/${property.longitude},${property.latitude},14,0/600x400?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                  <Button
                    className="flex-1"
                    onClick={() => handleContact(property.id)}>
                    Contact Owner
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No properties found matching your criteria
            </p>
          </div>
        )}
      </div>

      {selectedProperty && (
        <DirectionsModal
          isOpen={isDirectionsOpen}
          onClose={() => {
            setIsDirectionsOpen(false);
            setSelectedProperty(null);
          }}
          destination={{
            latitude: selectedProperty.latitude,
            longitude: selectedProperty.longitude,
            address: `${selectedProperty.address}, ${selectedProperty.city}, ${selectedProperty.state}`,
          }}
        />
      )}
    </div>
  );
}
