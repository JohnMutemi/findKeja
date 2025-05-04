import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Properties', href: '/dashboard/properties' },
  { name: 'Inquiries', href: '/dashboard/inquiries' },
  { name: 'Profile', href: '/dashboard/profile' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/" className="text-xl font-bold text-blue-600">
                  findKeja
                </Link>
              </div>
              <div className="ml-6 flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                      pathname === item.href
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center">
              <div className="relative ml-3">
                <div className="flex items-center gap-4">
                  <Link
                    href="/properties/new"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    List Property
                  </Link>

                  <div className="flex items-center gap-2">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="text-sm">
                      <p className="font-medium text-gray-700">
                        {session.user?.name}
                      </p>
                      <button
                        onClick={() => signOut()}
                        className="text-gray-500 hover:text-gray-700">
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
