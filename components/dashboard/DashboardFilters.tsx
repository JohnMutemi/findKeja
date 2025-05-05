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

interface DashboardFiltersProps {
  type: 'property' | 'inquiry';
}

export default function DashboardFilters({ type }: DashboardFiltersProps) {
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

  const propertyFilters = (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search properties..."
          className="pl-9"
          defaultValue={searchParams.get('propertySearch') ?? ''}
          onChange={(e) => {
            router.push(
              `?${createQueryString('propertySearch', e.target.value)}`,
              { scroll: false }
            );
          }}
        />
      </div>
      <Select
        defaultValue={searchParams.get('propertyType') ?? 'all'}
        onValueChange={(value) => {
          router.push(`?${createQueryString('propertyType', value)}`, {
            scroll: false,
          });
        }}>
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
        defaultValue={searchParams.get('propertyStatus') ?? 'all'}
        onValueChange={(value) => {
          router.push(`?${createQueryString('propertyStatus', value)}`, {
            scroll: false,
          });
        }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  const inquiryFilters = (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search inquiries..."
          className="pl-9"
          defaultValue={searchParams.get('inquirySearch') ?? ''}
          onChange={(e) => {
            router.push(
              `?${createQueryString('inquirySearch', e.target.value)}`,
              { scroll: false }
            );
          }}
        />
      </div>
      <Select
        defaultValue={searchParams.get('inquiryStatus') ?? 'all'}
        onValueChange={(value) => {
          router.push(`?${createQueryString('inquiryStatus', value)}`, {
            scroll: false,
          });
        }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="replied">Replied</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        {type === 'property' ? propertyFilters : inquiryFilters}
        <Button
          variant="outline"
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            if (type === 'property') {
              params.delete('propertySearch');
              params.delete('propertyType');
              params.delete('propertyStatus');
            } else {
              params.delete('inquirySearch');
              params.delete('inquiryStatus');
            }
            router.push(`?${params.toString()}`);
          }}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
