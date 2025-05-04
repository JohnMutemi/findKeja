import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export default async function DashboardPage() {
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
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link
          href="/properties/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          List New Property
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm"
          >
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
                  <span className="font-medium">Price:</span>{' '}
                  KSh {property.price.toLocaleString()}/month
                </div>
                <div>
                  <span className="font-medium">Deposit:</span>{' '}
                  KSh {property.deposit.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Bedrooms:</span> {property.bedrooms}
                </div>
                <div>
                  <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="mb-2 font-medium">Recent Inquiries</h3>
                {property.inquiries.length > 0 ? (
                  <div className="space-y-2">
                    {property.inquiries.slice(0, 2).map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-center gap-2 rounded-md bg-gray-50 p-2"
                      >
                        {inquiry.user.image && (
                          <Image
                            src={inquiry.user.image}
                            alt={inquiry.user.name || ''}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {inquiry.user.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No inquiries yet</p>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/properties/${property.id}`}
                  className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  View Details
                </Link>
                <Link
                  href={`/properties/${property.id}/edit`}
                  className="flex-1 rounded-md bg-blue-100 px-3 py-2 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="mt-8 text-center">
          <p className="mb-4 text-gray-600">You haven't listed any properties yet.</p>
          <Link
            href="/properties/new"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            List Your First Property
          </Link>
        </div>
      )}
    </div>
  );
}
