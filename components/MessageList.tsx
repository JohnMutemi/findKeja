'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { MessageSquare, Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: {
    name: string;
  };
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
  }[];
  messages: Message[];
}

export default function MessageList({
  conversation,
}: {
  conversation: Conversation;
}) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      socketInstance.emit('join-conversation', conversation.id);
    });

    socketInstance.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      playNotificationSound();
      showNotification(message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [conversation.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch((error) => {
      console.error('Error playing notification sound:', error);
    });
  };

  const showNotification = (message: Message) => {
    if (document.hidden) {
      toast({
        title: 'New Message',
        description: `${message.sender.name}: ${message.content}`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.focus()}>
            View
          </Button>
        ),
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          conversationId: conversation.id,
          receiverId: conversation.participants.find(
            (p) => p.id !== session?.user?.id
          )?.id,
        }),
      });

      if (response.ok) {
        const message = await response.json();
        socket.emit('send-message', {
          conversationId: conversation.id,
          message,
        });
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>
          Chat with{' '}
          {conversation.participants
            .find((p) => p.id !== session?.user?.id)
            ?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === session?.user?.id
                    ? 'justify-end'
                    : 'justify-start'
                }`}>
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.senderId === session?.user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">
            <MessageSquare className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 