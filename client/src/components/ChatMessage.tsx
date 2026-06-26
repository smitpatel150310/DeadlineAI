import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { ChatMessage as ChatMessageType } from '../types';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gh-accent-blue/15 border border-gh-accent-blue/20' : 'bg-white/[0.04] border border-white/[0.06]'}`}>
          {isUser ? <User size={14} className="text-gh-accent-blue" /> : <Bot size={14} className="text-white/40" />}
        </div>
        
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-[11px] font-medium text-white/40">
              {isUser ? 'You' : 'DeadlineAI'}
            </span>
            <span className="text-[10px] text-white/20">
              {format(new Date(message.created_at), 'h:mm a')}
            </span>
          </div>
          
          <div className={`px-4 py-3 rounded-2xl ${isUser ? 'bg-gh-accent-blue/[0.08] border border-gh-accent-blue/15 text-white/85 rounded-br-md' : 'bg-white/[0.03] border border-white/[0.06] text-white/70 rounded-bl-md'} prose prose-invert prose-sm max-w-none`}>
            {isUser ? (
              <div className="whitespace-pre-wrap text-sm">{message.content}</div>
            ) : (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
