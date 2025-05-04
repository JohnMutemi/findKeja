import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const propertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  type: z.enum(['APARTMENT', 'HOUSE', 'STUDIO', 'VILLA']),
  price: z.number().min(0),
  deposit: z.number().min(0),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  amenities: z.array(z.string()),
  images: z.array(z.string()).min(1),
  videoUrl: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to create a property' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        ownerId: session.user.id,
        location: {
          create: {
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            address: validatedData.address,
            city: validatedData.city,
            state: validatedData.state,
            country: validatedData.country,
          },
        },
      },
      include: {
        location: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid property data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        owner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
