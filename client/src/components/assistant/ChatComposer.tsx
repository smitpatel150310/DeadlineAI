import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Mic } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatComposerProps {
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isSending: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ input, setInput, onSend, isSending }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = React.useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim().length > 0 && !isSending) {
        onSend();
      }
    }
  };

  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice input is not supported in this browser.', { icon: '🎤' });
      return;
    }

    if (isRecording) return; // Handled by onend if we want to stop it, but here it's one-shot

    setIsRecording(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(input ? `${input} ${transcript}` : transcript);
    };
    
    recognition.onerror = (event: any) => {
      toast.error('Microphone error: ' + event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.start();
  };

  const hasContent = input.trim().length > 0;

  return (
    <div className="w-full bg-[#050814]/90 backdrop-blur-xl border-t border-gh-border/40 pt-4 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-gh-accent-purple/10 via-gh-accent-blue/10 to-transparent rounded-3xl blur-xl pointer-events-none" />
        <div className="relative bg-[#0a0f1c]/90 backdrop-blur-xl border border-gh-border/80 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] p-2 flex items-end gap-2 focus-within:border-gh-accent-purple/50 focus-within:ring-1 focus-within:ring-gh-accent-purple/50 transition-all duration-300">
          
          <button 
            onClick={toggleRecording}
            disabled={isSending}
            className={`p-3 rounded-xl shrink-0 transition-colors flex items-center justify-center relative
              ${isRecording ? 'text-gh-accent-purple bg-gh-accent-purple/20' : 'text-gh-text-tertiary hover:text-gh-text hover:bg-[#1e293b]'}`}
            title="Voice Input"
          >
            {isRecording && <div className="absolute inset-0 bg-gh-accent-purple/30 blur-sm rounded-xl animate-pulse" />}
            <Mic className="w-5 h-5 relative z-10" />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot to strategize your next move..."
            className="w-full bg-transparent resize-none outline-none max-h-48 py-3 px-2 text-gh-text placeholder-gh-text-tertiary text-sm sm:text-base scrollbar-thin scrollbar-thumb-gh-border"
            rows={1}
            disabled={isSending}
          />
          
          <button 
            onClick={onSend} 
            disabled={!hasContent || isSending}
            className={`p-3 rounded-xl shrink-0 transition-all duration-300 flex items-center justify-center min-w-[48px] min-h-[48px]
              ${hasContent && !isSending 
                ? 'bg-gradient-to-r from-gh-accent-purple to-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105' 
                : 'bg-[#1e293b] text-gh-text-tertiary'}`}
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="text-center mt-4 text-[11px] text-gh-text-tertiary tracking-wide uppercase font-medium opacity-60">
          AI generated strategy. Verify important deadlines.
        </div>
      </div>
    </div>
  );
};
