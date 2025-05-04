import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function PropertiesPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const properties = await prisma.property.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      location: true,
      inquiries: {
        select: {
          id: true,
          createdAt: true,
        },
      },
      _count: {
        select: {
          inquiries: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="mt-2 text-gray-600">
            Manage and update your property listings
          </p>
        </div>
        <Link
          href="/properties/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          List New Property
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <div className="relative aspect-video">
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="mb-2 text-xl font-semibold">{property.title}</h2>
              <p className="mb-4 text-gray-600">{property.location.address}</p>

              <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Price:</span> KSh{' '}
                  {property.price.toLocaleString()}/month
                </div>
                <div>
                  <span className="font-medium">Deposit:</span> KSh{' '}
                  {property.deposit.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Bedrooms:</span>{' '}
                  {property.bedrooms}
                </div>
                <div>
                  <span className="font-medium">Bathrooms:</span>{' '}
                  {property.bathrooms}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Recent Activity</h3>
                  <Link
                    href={`/properties/${property.id}/inquiries`}
                    className="text-sm text-blue-600 hover:text-blue-700">
                    View All →
                  </Link>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {property._count.inquiries} inquir
                  {property._count.inquiries === 1 ? 'y' : 'ies'} total
                </p>
                {property.inquiries.length > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    Latest inquiry:{' '}
                    {new Date(
                      property.inquiries[0].createdAt
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/properties/${property.id}`}
                  className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
                  View Details
                </Link>
                <Link
                  href={`/properties/${property.id}/edit`}
                  className="flex-1 rounded-md bg-blue-100 px-3 py-2 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed p-8 text-center">
            <p className="text-gray-600">
              You haven't listed any properties yet
            </p>
            <Link
              href="/properties/new"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
              List Your First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
