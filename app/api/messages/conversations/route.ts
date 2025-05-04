import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            sender: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform the data to match the frontend interface
    const transformedConversations = conversations.map((conversation) => ({
      id: conversation.id,
      participants: conversation.participants,
      lastMessage: conversation.messages[0] || undefined,
    }));

    return NextResponse.json(transformedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
} 