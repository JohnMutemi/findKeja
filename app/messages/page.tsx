'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Send } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';

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
  lastMessage?: Message;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    // Fetch conversations
    fetchConversations();
  }, [session]);

  useEffect(() => {
    if (selectedConversation) {
      // Fetch messages for selected conversation
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedConversation);
        fetchConversations(); // Update conversation list with new message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="grid h-[calc(100vh-12rem)] gap-4 md:grid-cols-2">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>
              Select a conversation to view messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(
                    (p) => p.id !== session.user.id
                  );
                  return (
                    <div
                      key={conversation.id}
                      className={`cursor-pointer rounded-lg p-4 transition-colors ${
                        selectedConversation === conversation.id
                          ? 'bg-primary/10'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {otherParticipant?.name}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              conversation.lastMessage.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              {selectedConversation
                ? 'View and send messages'
                : 'Select a conversation to start messaging'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            {selectedConversation ? (
              <>
                <ScrollArea className="flex-1">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === session.user.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.senderId === session.user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className="mt-1 text-xs opacity-70">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator className="my-4" />
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
