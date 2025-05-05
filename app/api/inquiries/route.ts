import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { sendInquiryNotification } from '@/lib/email';

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10),
  propertyId: z.string(),
  propertyTitle: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: 'You must be logged in to send an inquiry' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = inquirySchema.parse(body);

    // Get property owner's email
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: 'Property not found' },
        { status: 404 }
      );
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        propertyId: validatedData.propertyId,
        propertyTitle: validatedData.propertyTitle,
        userId: session.user.id,
      },
    });

    // Send email notification to property owner
    await sendInquiryNotification({
      to: property.owner.email,
      propertyTitle: validatedData.propertyTitle,
      inquiry: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      );
    }

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
