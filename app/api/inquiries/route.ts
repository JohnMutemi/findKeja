import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendInquiryNotification } from '@/lib/email';
import { pusherServer } from '@/lib/pusher';

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10),
  propertyId: z.string(),
  propertyTitle: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { propertyId, message } = await request.json();

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { owner: true },
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        message,
        propertyId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // Create notification for property owner
    const notification = await prisma.notification.create({
      data: {
        type: 'inquiry',
        title: 'New Inquiry',
        message: `${inquiry.user.name} sent an inquiry about ${property.title}`,
        userId: property.ownerId,
      },
    });

    // Trigger real-time notification
    await pusherServer.trigger(
      `user-${property.ownerId}`,
      'notification',
      notification
    );

    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    const inquiries = await prisma.inquiry.findMany({
      where: {
        ...(propertyId ? { propertyId } : {}),
        OR: [
          { userId: session.user.id },
          {
            property: {
              ownerId: session.user.id,
            },
          },
        ],
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Inquiry fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
