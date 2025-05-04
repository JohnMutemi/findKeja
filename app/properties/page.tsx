import { Suspense } from 'react';
import PropertyCard from '@/components/PropertyCard';
import PropertySearch from '@/components/PropertySearch';
import { prisma } from '@/lib/prisma';

async function getProperties() {
  const properties = await prisma.property.findMany({
    include: {
      location: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return properties;
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Find Your Perfect Home</h1>

      <div className="mb-8">
        <PropertySearch
          onSearch={async (filters) => {
            'use server';
            // Implement search logic here
          }}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Suspense fallback={<div>Loading properties...</div>}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </Suspense>
      </div>
    </main>
  );
}
