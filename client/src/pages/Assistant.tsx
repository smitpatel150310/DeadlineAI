import React, { useState, useEffect, useRef } from 'react';
import { Menu, PlusCircle, Bot } from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { ChatSession, ChatMessage as ChatMessageType } from '../types';
import { ChatMessage } from '../components/ChatMessage';

import { AssistantWelcome } from '../components/assistant/AssistantWelcome';
import { ChatComposer } from '../components/assistant/ChatComposer';
import { ChatHistoryPanel } from '../components/assistant/ChatHistoryPanel';
import { LocalModeBanner } from '../components/assistant/LocalModeBanner';

export default function Assistant() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load sessions
  useEffect(() => {
    let mounted = true;
    
    const loadSessions = async () => {
      setSessionsLoading(true);
      try {
        if (!user || !supabase) throw new Error('No user or Supabase not configured');
        
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        if (mounted) {
          setSessions(data || []);
          setIsLocalMode(false);
        }
      } catch (err) {
        console.warn('[Local Mode] Failed to load sessions from Supabase, falling back to localStorage.', err);
        if (mounted) {
          setIsLocalMode(true);
          const localSessions = JSON.parse(localStorage.getItem('deadline_ai_sessions') || '[]');
          setSessions(localSessions);
        }
      } finally {
        if (mounted) setSessionsLoading(false);
      }
    };
    
    loadSessions();
    return () => { mounted = false; };
  }, [user]);

  // Load messages when session changes
  useEffect(() => {
    let mounted = true;
    
    if (!activeSession) {
      setMessages([]);
      return;
    }
    
    const loadMessages = async () => {
      try {
        if (isLocalMode) {
          const localMessages = JSON.parse(localStorage.getItem(`deadline_ai_msgs_${activeSession.id}`) || '[]');
          if (mounted) setMessages(localMessages);
          return;
        }
        
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', activeSession.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (mounted) setMessages(data || []);
      } catch (err) {
        console.warn('[Local Mode] Failed to load messages, using local.', err);
        const localMessages = JSON.parse(localStorage.getItem(`deadline_ai_msgs_${activeSession.id}`) || '[]');
        if (mounted) setMessages(localMessages);
      }
    };
    
    loadMessages();
    return () => { mounted = false; };
  }, [activeSession, isLocalMode]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleNewChat = () => {
    setActiveSession(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleSend = async (text: string = input) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setInput('');
    setIsSending(true);

    try {
      let currentSession = activeSession;
      const title = trimmed.substring(0, 30) + '...';
      const now = new Date().toISOString();
      const fallbackUserId = user?.id || 'local-user';

      // 1. Create session if needed
      if (!currentSession) {
        if (isLocalMode) {
          currentSession = { id: uuidv4(), user_id: fallbackUserId, title, created_at: now, updated_at: now };
          const updatedSessions = [currentSession, ...sessions];
          setSessions(updatedSessions);
          localStorage.setItem('deadline_ai_sessions', JSON.stringify(updatedSessions));
        } else {
          const { data: newSession, error: sessionErr } = await supabase
            .from('chat_sessions')
            .insert({ user_id: fallbackUserId, title })
            .select()
            .single();
            
          if (sessionErr) throw sessionErr;
          currentSession = newSession;
          setSessions(prev => [newSession, ...prev]);
        }
        setActiveSession(currentSession);
      }

      // 2. Add optimistic user message
      const userMsgId = uuidv4();
      const newUserMsg: ChatMessageType = {
        id: userMsgId,
        session_id: currentSession!.id,
        user_id: fallbackUserId,
        role: 'user',
        content: trimmed,
        created_at: new Date().toISOString()
      };
      
      const newMessages = [...messages, newUserMsg];
      setMessages(newMessages);

      // 3. Persist user message
      if (isLocalMode) {
        localStorage.setItem(`deadline_ai_msgs_${currentSession!.id}`, JSON.stringify(newMessages));
        const updatedSessions = sessions.map(s => s.id === currentSession!.id ? { ...s, updated_at: now } : s);
        if (!sessions.find(s => s.id === currentSession!.id)) updatedSessions.unshift({ ...currentSession!, updated_at: now });
        setSessions(updatedSessions);
        localStorage.setItem('deadline_ai_sessions', JSON.stringify(updatedSessions));
      } else {
        const { error: msgErr } = await supabase.from('chat_messages').insert({
          session_id: currentSession!.id,
          user_id: fallbackUserId,
          role: 'user',
          content: trimmed
        });
        if (msgErr) console.warn('Supabase insert failed', msgErr);
      }

      // 4. Call API
      const activeTasks = tasks.filter(t => t.status === 'active');
      const contextStr = activeTasks.length > 0 
        ? `User's active tasks: ${JSON.stringify(activeTasks.map(t => ({ title: t.title, due_date: t.due_date, priority: t.priority })))}`
        : 'User has no active tasks currently.';

      const { response } = await api.chat(trimmed, contextStr);

      // 5. Add assistant message
      const asstMsgId = uuidv4();
      const newAsstMsg: ChatMessageType = {
        id: asstMsgId,
        session_id: currentSession!.id,
        user_id: fallbackUserId,
        role: 'assistant',
        content: response,
        created_at: new Date().toISOString()
      };
      
      const finalMessages = [...newMessages, newAsstMsg];
      setMessages(finalMessages);

      // 6. Persist assistant message
      if (isLocalMode) {
        localStorage.setItem(`deadline_ai_msgs_${currentSession!.id}`, JSON.stringify(finalMessages));
      } else {
        const { error: astErr } = await supabase.from('chat_messages').insert({
          session_id: currentSession!.id,
          user_id: fallbackUserId,
          role: 'assistant',
          content: response
        });
        if (astErr) console.warn('Supabase insert failed', astErr);
        
        const { error: updateErr } = await supabase.from('chat_sessions')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentSession!.id);
        if (updateErr) console.warn('Supabase update failed', updateErr);
      }

    } catch (err: any) {
      toast.error('Failed to send message: ' + (err.message || 'Unknown error'));
      if (!isLocalMode) {
        setIsLocalMode(true);
        toast('Switched to local demo mode due to connection error', { icon: '⚠️' });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      if (isLocalMode) {
        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(updatedSessions);
        localStorage.setItem('deadline_ai_sessions', JSON.stringify(updatedSessions));
        localStorage.removeItem(`deadline_ai_msgs_${sessionId}`);
      } else {
        const { error } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
        if (error) throw error;
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      }
      
      toast.success('Conversation deleted.');
      
      if (activeSession?.id === sessionId) {
        handleNewChat();
      }
    } catch (err: any) {
      toast.error('Failed to delete chat: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] md:h-full w-full overflow-hidden bg-gh-bg">
      <LocalModeBanner isLocalMode={isLocalMode} />
      
      <div className="flex flex-1 overflow-hidden relative min-h-0 min-w-0">
        <ChatHistoryPanel 
          sessions={sessions}
          activeSessionId={activeSession?.id || null}
          onSelectSession={(s) => { setActiveSession(s); setIsSidebarOpen(false); }}
          onNewChat={handleNewChat}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          loading={sessionsLoading}
          onDeleteSession={handleDeleteSession}
        />

        {/* Main Chat Area */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#090c10]">
          
          {/* Mobile Header */}
          <div className="shrink-0 p-3 border-b border-gh-border flex items-center justify-between bg-gh-canvas/80 backdrop-blur-md md:hidden z-10">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gh-text-secondary hover:text-gh-text rounded-lg hover:bg-gh-btn-bg">
              <Menu size={20} />
            </button>
            <span className="font-semibold text-sm">DeadlineAI</span>
            <button onClick={handleNewChat} className="p-2 -mr-2 text-gh-accent-blue hover:bg-gh-accent-blue/10 rounded-lg">
              <PlusCircle size={20} />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gh-border relative">
            {messages.length === 0 ? (
              <div className="min-h-full">
                <AssistantWelcome onSelectPrompt={(prompt) => handleSend(prompt)} />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto p-4 md:p-6 pb-6">
                <div className="space-y-6">
                  {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                  
                  {isSending && (
                    <div className="flex w-full justify-start animate-in fade-in zoom-in duration-300">
                      <div className="flex items-end gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-[#0d1117] border border-gh-border text-gh-text-secondary flex items-center justify-center shadow-sm relative shrink-0">
                          <Bot size={16} className="text-gh-accent-blue relative z-10" />
                          <div className="absolute inset-0 bg-gh-accent-blue/20 blur-sm rounded-full animate-pulse" />
                        </div>
                        <div className="px-5 py-4 rounded-2xl bg-[#0d1117] border border-gh-border rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                          <div className="w-2 h-2 bg-gh-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gh-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gh-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Composer anchored at bottom */}
          <div className="shrink-0 w-full z-10">
            <ChatComposer 
              input={input}
              setInput={setInput}
              onSend={() => handleSend()}
              isSending={isSending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
