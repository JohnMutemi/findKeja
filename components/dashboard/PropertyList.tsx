import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Property {
  id: string;
  title: string;
  price: number;
  images: string[];
  _count: {
    inquiries: number;
  };
}

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Properties</CardTitle>
        <CardDescription>
          Manage your property listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-sm text-gray-600">
                  KSh {property.price.toLocaleString()}/month
                </p>
                <p className="text-sm text-gray-600">
                  {property._count.inquiries} inquiries
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <Link href={`/properties/${property.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  asChild
                >
                  <Link href={`/properties/${property.id}/delete`}>
                    <Trash2 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <p className="text-center text-gray-600">
              You haven't listed any properties yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 