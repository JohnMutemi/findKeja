'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortSelectProps {
  options: Array<{
    label: string;
    value: string;
  }>;
  paramName: string;
  defaultValue?: string;
}

export default function SortSelect({
  options,
  paramName,
  defaultValue = options[0].value,
}: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, value);
      return params.toString();
    },
    [searchParams, paramName]
  );

  return (
    <Select
      defaultValue={searchParams.get(paramName) ?? defaultValue}
      onValueChange={(value) => {
        router.push(
          `?${createQueryString(value)}`,
          { scroll: false }
        );
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 