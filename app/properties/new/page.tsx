import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import PropertyForm from '@/components/PropertyForm';

export default async function NewPropertyPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">List a New Property</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to list your property
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <PropertyForm />
      </div>
    </div>
  );
}
