import { useState, useEffect, useRef } from 'react';
import { useGetMessages, useSendMessage } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface MessageThreadProps {
  requestId: bigint;
  senderName: string;
}

export default function MessageThread({ requestId, senderName }: MessageThreadProps) {
  const [message, setMessage] = useState('');
  const { data: messages = [], isLoading } = useGetMessages(requestId);
  const sendMessageMutation = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        requestId,
        sender: senderName,
        message: message.trim(),
      });
      setMessage('');
    } catch (error: any) {
      toast.error('Failed to send message', {
        description: error.message || 'Please try again',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-police" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground">Start the conversation below</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.slice().reverse().map((msg, index) => {
                const isOwnMessage = msg.sender === senderName;
                return (
                  <div
                    key={index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-police text-police-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            className="resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={sendMessageMutation.isPending || !message.trim()}
            className="bg-police hover:bg-police/90 text-police-foreground"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
