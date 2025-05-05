import { Property, Inquiry } from '@prisma/client';

export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value).includes(',') ? `"${value}"` : value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatPropertyForExport(property: Property) {
  return {
    ID: property.id,
    Title: property.title,
    Type: property.type,
    Status: property.status,
    Price: property.price,
    Location: property.location,
    Bedrooms: property.bedrooms,
    Bathrooms: property.bathrooms,
    Area: property.area,
    Description: property.description,
    Created: property.createdAt,
    Updated: property.updatedAt,
  };
}

export function formatInquiryForExport(
  inquiry: Inquiry & {
    property: { title: string };
    user: { name: string; email: string };
  }
) {
  return {
    ID: inquiry.id,
    Property: inquiry.property.title,
    From: inquiry.user.name,
    Email: inquiry.user.email,
    Message: inquiry.message,
    Status: inquiry.status,
    Created: inquiry.createdAt,
    Updated: inquiry.updatedAt,
  };
}
