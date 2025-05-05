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

    await prisma.property.deleteMany({
      where: {
        id: { in: ids },
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ message: 'Properties deleted successfully' });
  } catch (error) {
    console.error('Error deleting properties:', error);
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

    await prisma.property.updateMany({
      where: {
        id: { in: ids },
        ownerId: session.user.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ message: 'Properties updated successfully' });
  } catch (error) {
    console.error('Error updating properties:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 