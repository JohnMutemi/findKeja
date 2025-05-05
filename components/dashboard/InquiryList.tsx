'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatInquiryForExport, exportToCSV } from '@/lib/export';
import BulkActions from './BulkActions';
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? inquiries.map((i) => i.id) : []);
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleDelete = async (ids: string[]) => {
    const response = await fetch('/api/inquiries/bulk', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete inquiries');
    }

    // Refresh the page to show updated list
    window.location.reload();
  };

  const handleStatusChange = async (ids: string[], status: string) => {
    const response = await fetch('/api/inquiries/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update inquiries');
    }

    // Refresh the page to show updated list
    window.location.reload();
  };

  const handleExport = async (ids: string[]) => {
    const selectedInquiries = inquiries.filter((i) => ids.includes(i.id));
    const formattedData = selectedInquiries.map(formatInquiryForExport);
    exportToCSV(formattedData, 'inquiries');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Inquiries</CardTitle>
        <CardDescription>View and manage property inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.length === inquiries.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-500">
                Select all ({inquiries.length})
              </span>
            </div>
            <BulkActions
              type="inquiry"
              selectedIds={selectedIds}
              onDelete={handleDelete}
              onExport={handleExport}
              onStatusChange={handleStatusChange}
            />
          </div>
          <div className="rounded-lg border bg-white">
            <div className="grid grid-cols-12 gap-4 border-b p-4 text-sm font-medium text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-3">Property</div>
              <div className="col-span-2">From</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Message</div>
            </div>
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedIds.includes(inquiry.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(inquiry.id, checked as boolean)
                    }
                  />
                </div>
                <div className="col-span-3 font-medium">
                  {inquiry.property.title}
                </div>
                <div className="col-span-2">{inquiry.name}</div>
                <div className="col-span-2 capitalize">{inquiry.status}</div>
                <div className="col-span-2">
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-2 truncate">{inquiry.message}</div>
              </div>
            ))}
          </div>
          {inquiries.length === 0 && (
            <p className="text-center text-gray-600">No inquiries yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
