'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
  pageParam: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  baseUrl,
  pageParam,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createQueryString = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, page.toString());
    return params.toString();
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (currentPage > 1) {
            router.push(
              `${baseUrl}?${createQueryString(currentPage - 1)}`,
              { scroll: false }
            );
          }
        }}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => {
              router.push(
                `${baseUrl}?${createQueryString(page)}`,
                { scroll: false }
              );
            }}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          if (currentPage < totalPages) {
            router.push(
              `${baseUrl}?${createQueryString(currentPage + 1)}`,
              { scroll: false }
            );
          }
        }}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 