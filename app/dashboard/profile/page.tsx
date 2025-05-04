import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      role: true,
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded-lg border bg-white p-6">
            <div className="text-center">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || ''}
                  width={96}
                  height={96}
                  className="mx-auto rounded-full"
                />
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
              )}
              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-2 text-sm text-gray-500">
                {user.role === 'LANDLORD' ? 'Property Owner' : 'Renter'}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-lg border bg-white p-6">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
} 