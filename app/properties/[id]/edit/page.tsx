import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PropertyForm from '@/components/PropertyForm';

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
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
      location: true,
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <p className="mt-2 text-gray-600">
          Update your property listing information
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <PropertyForm
          property={{
            ...property,
            ...property.location,
          }}
          isEditing
        />
      </div>
    </div>
  );
} 