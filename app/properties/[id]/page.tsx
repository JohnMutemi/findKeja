'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/properties/BookingForm';
import ReviewList from '@/components/properties/ReviewList';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Edit,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  state: string;
  country: string;
  images: string[];
  amenities: string[];
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function PropertyDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Property deleted successfully',
        });
        router.push('/properties');
      } else {
        throw new Error('Failed to delete property');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete property',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-96 w-full rounded-lg bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <p className="mt-2 text-muted-foreground">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-4" onClick={() => router.push('/properties')}>
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === property.owner.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{property.title}</h1>
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={property.images[selectedImage] || '/placeholder.jpg'}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {property.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">${property.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">{property.bedrooms} beds</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">
                  {property.bathrooms} baths
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500">{property.area}m²</span>
              </div>
            </div>

            <p className="text-gray-600">{property.description}</p>

            <div>
              <h2 className="text-xl font-semibold mb-2">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p className="text-gray-600">
                {property.address}, {property.city}, {property.state},{' '}
                {property.country}
              </p>
            </div>
          </div>
        </div>

        {/* Booking and Reviews */}
        <div className="space-y-6">
          {session?.user && property.status === 'AVAILABLE' && (
            <div className="sticky top-4">
              <BookingForm propertyId={property.id} />
            </div>
          )}

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="reviews">
              <ReviewList propertyId={property.id} />
            </TabsContent>
            <TabsContent value="details">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Property Type</h3>
                  <p className="text-gray-600 capitalize">{property.type}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p className="text-gray-600 capitalize">{property.status}</p>
                </div>
                <div>
                  <h3 className="font-medium">Size</h3>
                  <p className="text-gray-600">{property.area} square meters</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isOwner && (
        <div className="mt-8 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/properties/${property.id}/edit`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Property</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this property? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
