import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { ids } = await request.json();

    await prisma.inquiry.deleteMany({
      where: {
        id: { in: ids },
        OR: [
          { userId: session.user.id },
          {
            property: {
              ownerId: session.user.id,
            },
          },
        ],
      },
    });

    return NextResponse.json({ message: 'Inquiries deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiries:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { ids, status } = await request.json();

    await prisma.inquiry.updateMany({
      where: {
        id: { in: ids },
        property: {
          ownerId: session.user.id,
        },
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ message: 'Inquiries updated successfully' });
  } catch (error) {
    console.error('Error updating inquiries:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 