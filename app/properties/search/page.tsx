import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import PropertySearch from '@/components/PropertySearch';
import PropertyCard from '@/components/PropertyCard';
import Map from '@/components/Map';

interface SearchPageProps {
  searchParams: {
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    city?: string;
    amenities?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const session = await getServerSession();

  const properties = await prisma.property.findMany({
    where: {
      ...(searchParams.type && { type: searchParams.type }),
      ...(searchParams.minPrice && {
        price: { gte: Number(searchParams.minPrice) },
      }),
      ...(searchParams.maxPrice && {
        price: { lte: Number(searchParams.maxPrice) },
      }),
      ...(searchParams.bedrooms && {
        bedrooms: Number(searchParams.bedrooms),
      }),
      ...(searchParams.city && {
        location: { city: searchParams.city },
      }),
      ...(searchParams.amenities && {
        amenities: {
          hasSome: searchParams.amenities.split(','),
        },
      }),
    },
    include: {
      location: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const cities = await prisma.location.findMany({
    select: {
      city: true,
    },
    distinct: ['city'],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Find Your Perfect Home</h1>
          <p className="mt-2 text-gray-600">
            Search through our available properties
          </p>
        </div>

        <div className="mb-8">
          <PropertySearch cities={cities.map((c) => c.city)} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}

              {properties.length === 0 && (
                <div className="col-span-full rounded-lg border border-dashed p-8 text-center">
                  <p className="text-gray-600">
                    No properties found matching your criteria
                  </p>
                  <Link
                    href="/properties/search"
                    className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                    Clear filters
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-8">
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="h-[calc(100vh-12rem)]">
                  <Map
                    latitude={-1.2921}
                    longitude={36.8219}
                    markers={properties.map((property) => ({
                      latitude: property.location.latitude,
                      longitude: property.location.longitude,
                      title: property.title,
                      price: property.price,
                      href: `/properties/${property.id}`,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
