'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

export default function PropertyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        throw new Error('Failed to fetch property');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load property details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`, {
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
    <div className="container py-8">
      {/* Image Gallery */}
      <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={property.images[selectedImage] || '/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{property.title}</h1>
                <p className="mt-2 text-2xl font-semibold text-primary">
                  KSh {property.price.toLocaleString()}
                </p>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      router.push(`/properties/${property.id}/edit`)
                    }>
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
                          Are you sure you want to delete this property? This
                          action cannot be undone.
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
            <div className="mt-4 flex items-center text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              <span>
                {property.address}, {property.city}, {property.state},{' '}
                {property.country}
              </span>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-4 rounded-lg border p-4">
            <div className="flex items-center">
              <Bed className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center">
              <Bath className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center">
              <Square className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{property.area}m²</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Description</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {property.description}
            </p>
          </div>

          {property.amenities.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-muted px-3 py-1 text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{property.owner.name}</p>
              <p className="text-sm text-muted-foreground">Property Owner</p>
            </div>
            {property.owner.phone && (
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${property.owner.phone}`}
                  className="text-sm hover:underline">
                  {property.owner.phone}
                </a>
              </div>
            )}
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${property.owner.email}`}
                className="text-sm hover:underline">
                {property.owner.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
