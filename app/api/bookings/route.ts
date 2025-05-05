import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const bookingSchema = z.object({
  propertyId: z.string(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { propertyId, startDate, endDate } = bookingSchema.parse(body);

    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    if (property.status !== 'AVAILABLE') {
      return new NextResponse('Property is not available', { status: 400 });
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: 'CONFIRMED',
        OR: [
          {
            AND: [
              { startDate: { lte: startDate } },
              { endDate: { gte: startDate } },
            ],
          },
          {
            AND: [
              { startDate: { lte: endDate } },
              { endDate: { gte: endDate } },
            ],
          },
        ],
      },
    });

    if (overlappingBooking) {
      return new NextResponse('Property is already booked for these dates', { status: 400 });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        tenantId: session.user.id,
        startDate,
        endDate,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('[BOOKINGS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    const bookings = await prisma.booking.findMany({
      where: {
        ...(propertyId ? { propertyId } : {}),
        ...(status ? { status: status as any } : {}),
        OR: [
          { tenantId: session.user.id },
          { property: { ownerId: session.user.id } },
        ],
      },
      include: {
        property: true,
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('[BOOKINGS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 