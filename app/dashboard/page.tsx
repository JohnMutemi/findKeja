import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PropertyList from '@/components/dashboard/PropertyList';
import InquiryList from '@/components/dashboard/InquiryList';
import Pagination from '@/components/Pagination';
import SortSelect from '@/components/dashboard/SortSelect';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import NotificationBell from '@/components/NotificationBell';

interface DashboardPageProps {
  searchParams: {
    page?: string;
    propertyPage?: string;
    inquiryPage?: string;
    propertySort?: string;
    inquirySort?: string;
    propertySearch?: string;
    propertyType?: string;
    propertyStatus?: string;
    inquirySearch?: string;
    inquiryStatus?: string;
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  const propertyPage = Number(searchParams.propertyPage) || 1;
  const inquiryPage = Number(searchParams.inquiryPage) || 1;
  const itemsPerPage = 5;

  const propertySort = searchParams.propertySort || 'newest';
  const inquirySort = searchParams.inquirySort || 'newest';

  const getPropertyOrderBy = () => {
    switch (propertySort) {
      case 'oldest':
        return { createdAt: 'asc' as const };
      case 'price-asc':
        return { price: 'asc' as const };
      case 'price-desc':
        return { price: 'desc' as const };
      case 'inquiries':
        return { inquiries: { _count: 'desc' as const } };
      default:
        return { createdAt: 'desc' as const };
    }
  };

  const getInquiryOrderBy = () => {
    switch (inquirySort) {
      case 'oldest':
        return { createdAt: 'asc' as const };
      default:
        return { createdAt: 'desc' as const };
    }
  };

  const getPropertyWhere = () => {
    const where: any = {
      ownerId: session.user.id,
    };

    if (searchParams.propertySearch) {
      where.OR = [
        {
          title: { contains: searchParams.propertySearch, mode: 'insensitive' },
        },
        {
          description: {
            contains: searchParams.propertySearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (searchParams.propertyType && searchParams.propertyType !== 'all') {
      where.type = searchParams.propertyType;
    }

    if (searchParams.propertyStatus && searchParams.propertyStatus !== 'all') {
      where.status = searchParams.propertyStatus;
    }

    return where;
  };

  const getInquiryWhere = () => {
    const where: any = {
      property: {
        ownerId: session.user.id,
      },
    };

    if (searchParams.inquirySearch) {
      where.OR = [
        { name: { contains: searchParams.inquirySearch, mode: 'insensitive' } },
        {
          message: {
            contains: searchParams.inquirySearch,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (searchParams.inquiryStatus && searchParams.inquiryStatus !== 'all') {
      where.status = searchParams.inquiryStatus;
    }

    return where;
  };

  const [properties, propertyCount] = await Promise.all([
    prisma.property.findMany({
      where: getPropertyWhere(),
      include: {
        _count: {
          select: {
            inquiries: true,
          },
        },
      },
      orderBy: getPropertyOrderBy(),
      skip: (propertyPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.property.count({
      where: getPropertyWhere(),
    }),
  ]);

  const [inquiries, inquiryCount] = await Promise.all([
    prisma.inquiry.findMany({
      where: getInquiryWhere(),
      include: {
        property: {
          select: {
            title: true,
            images: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: getInquiryOrderBy(),
      skip: (inquiryPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    prisma.inquiry.count({
      where: getInquiryWhere(),
    }),
  ]);

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <DashboardHeader />
        <NotificationBell
          notifications={notifications}
          onMarkAsRead={async (id) => {
            'use server';
            await prisma.notification.update({
              where: { id },
              data: { read: true },
            });
          }}
        />
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <div className="mb-4 space-y-4">
            <div className="flex justify-end">
              <SortSelect
                options={[
                  { label: 'Newest First', value: 'newest' },
                  { label: 'Oldest First', value: 'oldest' },
                  { label: 'Price: Low to High', value: 'price-asc' },
                  { label: 'Price: High to Low', value: 'price-desc' },
                  { label: 'Most Inquiries', value: 'inquiries' },
                ]}
                paramName="propertySort"
              />
            </div>
            <DashboardFilters type="property" />
          </div>
          <PropertyList properties={properties} />
          <div className="mt-4">
            <Pagination
              currentPage={propertyPage}
              totalItems={propertyCount}
              itemsPerPage={itemsPerPage}
              baseUrl="/dashboard"
              pageParam="propertyPage"
            />
          </div>
        </div>
        <div>
          <div className="mb-4 space-y-4">
            <div className="flex justify-end">
              <SortSelect
                options={[
                  { label: 'Newest First', value: 'newest' },
                  { label: 'Oldest First', value: 'oldest' },
                ]}
                paramName="inquirySort"
              />
            </div>
            <DashboardFilters type="inquiry" />
          </div>
          <InquiryList inquiries={inquiries} />
          <div className="mt-4">
            <Pagination
              currentPage={inquiryPage}
              totalItems={inquiryCount}
              itemsPerPage={itemsPerPage}
              baseUrl="/dashboard"
              pageParam="inquiryPage"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
