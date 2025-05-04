import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface InquiriesPageProps {
  params: {
    id: string;
  };
}

export default async function InquiriesPage({ params }: InquiriesPageProps) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const property = await prisma.property.findUnique({
    where: {
      id: params.id,
      ownerId: session.user.id,
    },
    include: {
      inquiries: {
        include: {
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
      },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/properties/${property.id}`}
          className="mb-4 inline-block text-blue-600 hover:text-blue-700"
        >
          ← Back to Property
        </Link>
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <p className="mt-2 text-gray-600">Manage inquiries for this property</p>
      </div>

      <div className="space-y-6">
        {property.inquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {inquiry.user.image && (
                    <Image
                      src={inquiry.user.image}
                      alt={inquiry.user.name || ''}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{inquiry.user.name}</h2>
                    <p className="text-gray-600">{inquiry.user.email}</p>
                    {inquiry.user.phone && (
                      <p className="text-gray-600">{inquiry.user.phone}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">{inquiry.message}</p>
                {inquiry.preferredDate && (
                  <p className="mt-2 text-sm text-gray-600">
                    Preferred visit date:{' '}
                    {new Date(inquiry.preferredDate).toLocaleDateString()}
                    {inquiry.preferredTime && ` at ${inquiry.preferredTime}`}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`mailto:${inquiry.user.email}`}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Reply via Email
                </a>
                {inquiry.user.phone && (
                  <a
                    href={`tel:${inquiry.user.phone}`}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Call
                  </a>
                )}
                <button
                  onClick={() => {
                    // TODO: Implement mark as read functionality
                  }}
                  className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Mark as Read
                </button>
              </div>
            </div>
          </div>
        ))}

        {property.inquiries.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-gray-600">No inquiries yet for this property</p>
          </div>
        )}
      </div>
    </div>
  );
} 