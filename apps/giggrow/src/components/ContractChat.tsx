import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Loader2 } from 'lucide-react';
import socket from '../lib/socket';
import { apiFetch } from '../lib/api';

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

interface ContractChatProps {
  contractId: string;
  currentUserId: string;
}

export const ContractChat: React.FC<ContractChatProps> = ({ contractId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await apiFetch(`/api/chat/${contractId}`);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Join contract room
    socket.emit('chat:join', contractId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('chat:message', handleNewMessage);

    return () => {
      socket.off('chat:message', handleNewMessage);
    };
  }, [contractId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const savedMessage = await apiFetch(`/api/chat/${contractId}`, {
        method: 'POST',
        body: JSON.stringify({ content: newMessage })
      });

      // Emit message to other users in the room
      socket.emit('chat:message', { contractId, message: savedMessage });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00f0ff]" />
      </div>
    );
  }

  return (
    <div className="flex h-[500px] flex-col rounded-xl border border-white/10 bg-[#0a0a1f]/60 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-bottom border-white/10 p-4">
        <MessageSquare className="h-5 w-5 text-[#00f0ff]" />
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Contract Communications</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-white/40">
            <MessageSquare className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-xs uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-black uppercase tracking-tighter text-white/40">
                  {msg.senderId === currentUserId ? 'YOU' : msg.sender.email.split('@')[0]}
                </span>
                <span className="text-[8px] text-white/20">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                  msg.senderId === currentUserId
                    ? 'bg-[#00f0ff]/10 text-white border border-[#00f0ff]/20'
                    : 'bg-white/5 text-white/80 border border-white/10'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-top border-white/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-md border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-[#00f0ff] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="rounded-md bg-[#00f0ff] p-2 text-[#0a0a1f] transition hover:bg-[#00d0ff] disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
