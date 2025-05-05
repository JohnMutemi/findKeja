'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  booking: {
    tenant: {
      name: string;
    };
  };
}

interface ReviewListProps {
  propertyId: string;
}

export default function ReviewList({ propertyId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews?propertyId=${propertyId}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [propertyId]);

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center py-4">No reviews yet</div>;
  }

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
          <span className="ml-2 text-2xl font-bold">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Based on {reviews.length}{' '}
          {reviews.length === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {review.booking.tenant.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(review.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
