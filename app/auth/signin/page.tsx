import { getProviders } from 'next-auth/react';
import SignInForm from '@/components/auth/SignInForm';

export default async function SignInPage() {
  const providers = await getProviders();

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to findKeja</h1>
          <p className="mt-2 text-gray-600">Sign in to find your perfect home</p>
        </div>

        <SignInForm providers={providers} />
      </div>
    </div>
  );
} 