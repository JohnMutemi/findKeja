import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  property: {
    title: string;
    images: string[];
  };
}

interface InquiryListProps {
  inquiries: Inquiry[];
}

export default function InquiryList({ inquiries }: InquiryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Inquiries</CardTitle>
        <CardDescription>View and manage property inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="rounded-lg border p-4">
              <div className="mb-4 flex items-start gap-4">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={inquiry.property.images[0]}
                    alt={inquiry.property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{inquiry.property.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(inquiry.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm">{inquiry.message}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{inquiry.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{inquiry.phone}</span>
                </div>
              </div>
            </div>
          ))}
          {inquiries.length === 0 && (
            <p className="text-center text-gray-600">No inquiries yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
