'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative">
        <Home className="h-6 w-6 text-primary" />
        <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-primary" />
      </div>
      <span className="text-xl font-bold tracking-tight">
        find<span className="text-primary">Keja</span>
      </span>
    </Link>
  );
}
