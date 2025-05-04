import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const inquirySchema = z.object({
  message: z.string().min(10),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  propertyId: z.string(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = inquirySchema.parse(body);

    // Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        message: validatedData.message,
        propertyId: validatedData.propertyId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(inquiry);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Inquiry creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
