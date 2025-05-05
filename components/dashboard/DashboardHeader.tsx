import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your properties and inquiries
        </p>
      </div>
      <Button asChild>
        <Link href="/properties/new">
          <Plus className="mr-2 h-4 w-4" />
          List New Property
        </Link>
      </Button>
    </div>
  );
} 