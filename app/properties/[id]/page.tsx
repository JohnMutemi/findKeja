import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import Map from '@/components/Map';
import InquiryForm from '@/components/InquiryForm';

interface PropertyPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const session = await getServerSession();

  const property = await prisma.property.findUnique({
    where: {
      id: params.id,
    },
    include: {
      location: true,
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const isOwner = session?.user?.id === property.ownerId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/properties/search"
            className="mb-4 inline-block text-blue-600 hover:text-blue-700"
          >
            ← Back to Search
          </Link>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="mt-2 text-gray-600">{property.location.address}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8 overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="relative aspect-video">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-2">
                  {property.images.slice(1).map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 2}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="mb-8 overflow-hidden rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-bold text-blue-600">
                    KSh {property.price.toLocaleString()}/month
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deposit</p>
                  <p className="text-lg font-bold">
                    KSh {property.deposit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-lg font-bold">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-lg font-bold">{property.bathrooms}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">Description</h2>
                <p className="text-gray-700">{property.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="mb-2 text-lg font-semibold">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-semibold">Location</h2>
                <div className="h-64 overflow-hidden rounded-lg">
                  <Map
                    latitude={property.location.latitude}
                    longitude={property.location.longitude}
                    markers={[
                      {
                        latitude: property.location.latitude,
                        longitude: property.location.longitude,
                        title: property.title,
                        price: property.price,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Owner Information */}
            <div className="sticky top-8 space-y-6">
              <div className="overflow-hidden rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                  {property.owner.image && (
                    <Image
                      src={property.owner.image}
                      alt={property.owner.name || ''}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">
                      {property.owner.name}
                    </h2>
                    <p className="text-gray-600">Property Owner</p>
                  </div>
                </div>

                {isOwner ? (
                  <div className="space-y-2">
                    <Link
                      href={`/properties/${property.id}/edit`}
                      className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700"
                    >
                      Edit Property
                    </Link>
                    <Link
                      href={`/properties/${property.id}/inquiries`}
                      className="block w-full rounded-md bg-gray-100 px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      View Inquiries
                    </Link>
                  </div>
                ) : (
                  <InquiryForm propertyId={property.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
