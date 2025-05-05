'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            defaultValue={searchParams.get('q') ?? ''}
            onChange={(e) => {
              router.push(
                `/?${createQueryString('q', e.target.value)}`,
                { scroll: false }
              );
            }}
          />
        </div>
        <Select
          defaultValue={searchParams.get('type') ?? 'all'}
          onValueChange={(value) => {
            router.push(
              `/?${createQueryString('type', value)}`,
              { scroll: false }
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams.get('price') ?? 'all'}
          onValueChange={(value) => {
            router.push(
              `/?${createQueryString('price', value)}`,
              { scroll: false }
            );
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-20000">0 - 20,000 KSh</SelectItem>
            <SelectItem value="20000-50000">20,000 - 50,000 KSh</SelectItem>
            <SelectItem value="50000-100000">50,000 - 100,000 KSh</SelectItem>
            <SelectItem value="100000+">100,000+ KSh</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            router.push('/');
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
} 