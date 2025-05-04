'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

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

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'AVAILABLE' | 'RENTED' | 'PENDING';
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
  const [isLoading, setIsLoading] = useState(true);

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

    return matchesSearch && matchesPrice && matchesStatus;
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
              <div className="col-span-2">
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
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{property.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Kitengela
                      </div>
                    </CardDescription>
                  </div>
                  <Badge
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
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {property.description}
                </p>
                <p className="mt-4 text-2xl font-bold">
                  KSh {property.price.toLocaleString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleContact(property.id)}>
                  Contact Owner
                </Button>
              </CardFooter>
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
    </div>
  );
}
