'use client';

import { useState } from 'react';
import { Check, Download, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface BulkActionsProps {
  type: 'property' | 'inquiry';
  selectedIds: string[];
  onDelete: (ids: string[]) => Promise<void>;
  onExport: (ids: string[]) => Promise<void>;
  onStatusChange?: (ids: string[], status: string) => Promise<void>;
}

export default function BulkActions({
  type,
  selectedIds,
  onDelete,
  onExport,
  onStatusChange,
}: BulkActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'delete' | 'export' | string) => {
    if (selectedIds.length === 0) return;
    setIsLoading(true);

    try {
      switch (action) {
        case 'delete':
          await onDelete(selectedIds);
          toast.success(`${type}s deleted successfully`);
          break;
        case 'export':
          await onExport(selectedIds);
          toast.success(`${type}s exported successfully`);
          break;
        default:
          if (onStatusChange) {
            await onStatusChange(selectedIds, action);
            toast.success(`Status updated successfully`);
          }
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">
        {selectedIds.length} selected
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.length === 0 || isLoading}>
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {type === 'property' && onStatusChange && (
            <>
              <DropdownMenuItem
                onClick={() => handleAction('active')}
                disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction('inactive')}
                disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Inactive
              </DropdownMenuItem>
            </>
          )}
          {type === 'inquiry' && onStatusChange && (
            <>
              <DropdownMenuItem
                onClick={() => handleAction('read')}
                disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction('replied')}
                disabled={isLoading}>
                <Check className="mr-2 h-4 w-4" />
                Mark as Replied
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={() => handleAction('export')}
            disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleAction('delete')}
            disabled={isLoading}
            className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
