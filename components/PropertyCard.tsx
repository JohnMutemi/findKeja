import Image from 'next/image';
import Link from 'next/link';
import { Property, Location, User } from '@prisma/client';

interface PropertyCardProps {
  property: Property & {
    location: Location;
    owner: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/properties/${property.id}`}>
        <div className="relative aspect-video">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <div className="mb-2">
            <h2 className="text-lg font-semibold">{property.title}</h2>
            <p className="text-gray-600">{property.location.address}</p>
          </div>

          <div className="mb-4">
            <p className="text-xl font-bold text-blue-600">
              KSh {property.price.toLocaleString()}/month
            </p>
            <p className="text-sm text-gray-600">
              Deposit: KSh {property.deposit.toLocaleString()}
            </p>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Bedrooms:</span> {property.bedrooms}
            </div>
            <div>
              <span className="font-medium">Bathrooms:</span> {property.bathrooms}
            </div>
            <div className="col-span-2">
              <span className="font-medium">Type:</span>{' '}
              {property.type.replace('_', ' ')}
            </div>
          </div>

          {property.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                  >
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 border-t pt-4">
            {property.owner.image && (
              <Image
                src={property.owner.image}
                alt={property.owner.name || ''}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div className="text-sm">
              <p className="font-medium">{property.owner.name}</p>
              <p className="text-gray-600">
                Listed {new Date(property.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
