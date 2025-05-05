'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatPropertyForExport, exportToCSV } from '@/lib/export';
import BulkActions from './BulkActions';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Property {
  id: string;
  title: string;
  type: string;
  status: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    inquiries: number;
  };
}

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? properties.map((p) => p.id) : []);
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleDelete = async (ids: string[]) => {
    const response = await fetch('/api/properties/bulk', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete properties');
    }

    // Refresh the page to show updated list
    window.location.reload();
  };

  const handleStatusChange = async (ids: string[], status: string) => {
    const response = await fetch('/api/properties/bulk', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update properties');
    }

    // Refresh the page to show updated list
    window.location.reload();
  };

  const handleExport = async (ids: string[]) => {
    const selectedProperties = properties.filter((p) => ids.includes(p.id));
    const formattedData = selectedProperties.map(formatPropertyForExport);
    exportToCSV(formattedData, 'properties');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Properties</CardTitle>
        <CardDescription>Manage your property listings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedIds.length === properties.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-500">
                Select all ({properties.length})
              </span>
            </div>
            <BulkActions
              type="property"
              selectedIds={selectedIds}
              onDelete={handleDelete}
              onExport={handleExport}
              onStatusChange={handleStatusChange}
            />
          </div>
          <div className="rounded-lg border bg-white">
            <div className="grid grid-cols-12 gap-4 border-b p-4 text-sm font-medium text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-3">Title</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Inquiries</div>
            </div>
            {properties.map((property) => (
              <div
                key={property.id}
                className="grid grid-cols-12 gap-4 border-b p-4 text-sm last:border-0">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedIds.includes(property.id)}
                    onCheckedChange={(checked) =>
                      handleSelect(property.id, checked as boolean)
                    }
                  />
                </div>
                <div className="col-span-3 font-medium">{property.title}</div>
                <div className="col-span-2 capitalize">{property.type}</div>
                <div className="col-span-2 capitalize">{property.status}</div>
                <div className="col-span-2">
                  ${property.price.toLocaleString()}
                </div>
                <div className="col-span-2">{property._count.inquiries}</div>
              </div>
            ))}
          </div>
          {properties.length === 0 && (
            <p className="text-center text-gray-600">
              You haven't listed any properties yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
