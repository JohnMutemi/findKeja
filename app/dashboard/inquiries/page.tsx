import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function AllInquiriesPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const inquiries = await prisma.inquiry.findMany({
    where: {
      property: {
        ownerId: session.user.id,
      },
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          images: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Group inquiries by property
  const inquiriesByProperty = inquiries.reduce((acc, inquiry) => {
    const propertyId = inquiry.property.id;
    if (!acc[propertyId]) {
      acc[propertyId] = {
        property: inquiry.property,
        inquiries: [],
      };
    }
    acc[propertyId].inquiries.push(inquiry);
    return acc;
  }, {} as Record<string, { property: typeof inquiries[0]['property']; inquiries: typeof inquiries }>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">All Inquiries</h1>
        <p className="mt-2 text-gray-600">
          Manage inquiries across all your properties
        </p>
      </div>

      <div className="space-y-8">
        {Object.values(inquiriesByProperty).map(({ property, inquiries }) => (
          <div key={property.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/properties/${property.id}`}
                    className="text-lg font-semibold hover:text-blue-600"
                  >
                    {property.title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {inquiries.length} inquir{inquiries.length === 1 ? 'y' : 'ies'}
                  </p>
                </div>
              </div>
              <Link
                href={`/properties/${property.id}/inquiries`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {inquiries.slice(0, 3).map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="overflow-hidden rounded-lg border bg-white shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {inquiry.user.image && (
                          <Image
                            src={inquiry.user.image}
                            alt={inquiry.user.name || ''}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{inquiry.user.name}</h3>
                          <p className="text-sm text-gray-600">
                            {inquiry.user.email}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="mt-3">
                      <p className="text-gray-700">{inquiry.message}</p>
                      {inquiry.preferredDate && (
                        <p className="mt-2 text-sm text-gray-600">
                          Preferred visit date:{' '}
                          {new Date(inquiry.preferredDate).toLocaleDateString()}
                          {inquiry.preferredTime && ` at ${inquiry.preferredTime}`}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <a
                        href={`mailto:${inquiry.user.email}`}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Reply via Email
                      </a>
                      {inquiry.user.phone && (
                        <a
                          href={`tel:${inquiry.user.phone}`}
                          className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {inquiries.length > 3 && (
                <Link
                  href={`/properties/${property.id}/inquiries`}
                  className="block rounded-lg border border-dashed p-4 text-center text-gray-600 hover:border-gray-400 hover:text-gray-700"
                >
                  View {inquiries.length - 3} more inquiries →
                </Link>
              )}
            </div>
          </div>
        ))}

        {Object.keys(inquiriesByProperty).length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-gray-600">No inquiries yet</p>
            <Link
              href="/properties/new"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              List Your First Property
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
