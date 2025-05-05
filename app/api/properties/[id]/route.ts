import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import prisma from '@/lib/prisma';

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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to update a property' },
        { status: 401 }
      );
    }

    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
        ownerId: session.user.id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          error:
            'Property not found or you do not have permission to update it',
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    const updatedProperty = await prisma.property.update({
      where: {
        id: params.id,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        price: validatedData.price,
        deposit: validatedData.deposit,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        amenities: validatedData.amenities,
        images: validatedData.images,
        videoUrl: validatedData.videoUrl,
        location: {
          update: {
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

    return NextResponse.json(updatedProperty);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid property data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a property' },
        { status: 401 }
      );
    }

    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
        ownerId: session.user.id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          error:
            'Property not found or you do not have permission to delete it',
        },
        { status: 404 }
      );
    }

    await prisma.property.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
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

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
