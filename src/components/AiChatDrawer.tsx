import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { ChatMessage, Car } from '../types';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allCars: Car[];
  initialPrompt?: string;
  onViewCarDetails: (car: Car) => void;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  allCars,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm CarSuggest AI, your automotive advisor. Ask me anything about car comparisons, real-world mileage, 5-star safety ratings, or 5-year ownership costs in India.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Should I buy Grand Vitara Hybrid or Creta Petrol?',
    'Best 7-seater SUV under 20 Lakhs with high safety?',
    'Is Tata Nexon EV practical for daily 60km city commute?',
    'Which car under 15 Lakhs has best rear seat comfort for elderly parents?'
  ];

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build conversation history for API
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory,
          availableCars: allCars
        })
      });

      if (!res.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || "I couldn't process that query right now, but feel free to ask another question about any vehicle!",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback helpful reply
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `Based on verified Indian market data:
- If your monthly usage exceeds 1,200 km, Strong Hybrids (like Maruti Grand Vitara / Toyota Hyryder at 27.9 km/l) or Electric SUVs (Tata Nexon.ev at ₹1.1/km) will save you substantial money.
- For high-speed highway stability and adult occupant crash safety, 5-Star BNCAP vehicles like Tata Safari/Harrier, Mahindra XUV700, and Skoda Slavia lead the segment.

Would you like me to compare specific trims or calculate exact 5-year loan EMIs for you?`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] flex flex-col justify-between bg-[#f8fafc] dark:bg-[#0b1120] border-l border-[#101624]/10 dark:border-white/10 shadow-[-24px_0_60px_-24px_rgba(16,22,36,0.45)] text-[#101624] dark:text-[#eef2fb] font-['Hanken_Grotesk',system-ui,sans-serif] overflow-hidden">
      {/* Top Header */}
      <div className="shrink-0 px-4 py-3.5 border-b border-[#101624]/10 dark:border-white/10 bg-white/85 dark:bg-[#0e1424]/85 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#ff5a1f]/12 dark:bg-[#ff5a1f]/20 border border-[#ff5a1f]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#ff5a1f]" />
            </div>
            <div className="min-w-0">
              <div className="font-['Unbounded',sans-serif] text-[13px] font-bold tracking-tight flex items-center gap-2 truncate">
                CarSuggest AI
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-pulse shrink-0" />
              </div>
              <div className="text-[10px] text-[#556078] dark:text-[#9aa6c0] tracking-wide">
                Verified Indian market specs
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close chat"
            className="p-1.5 rounded-lg text-[#556078] dark:text-[#9aa6c0] hover:text-[#101624] dark:hover:text-white hover:bg-[#101624]/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-[#ff5a1f]/12 dark:bg-[#ff5a1f]/20 border border-[#ff5a1f]/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#ff5a1f]" />
                </div>
              )}

              <div
                className={`max-w-[85%] px-3.5 py-3 rounded-2xl text-[12.5px] leading-relaxed ${
                  isUser
                    ? 'bg-[#101624] dark:bg-[#eef2fb] text-white dark:text-[#101624] font-medium rounded-br-md shadow-sm'
                    : 'bg-white dark:bg-white/[0.06] border border-[#101624]/10 dark:border-white/10 text-[#101624] dark:text-[#eef2fb] rounded-bl-md shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] mt-1.5 tracking-wide ${
                    isUser
                      ? 'text-white/55 dark:text-[#101624]/55'
                      : 'text-[#556078] dark:text-[#9aa6c0]'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-[#101624] dark:bg-[#eef2fb] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white dark:text-[#101624]" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-lg bg-[#ff5a1f]/12 dark:bg-[#ff5a1f]/20 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-[#ff5a1f] animate-spin" />
            </div>
            <div className="px-3.5 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-white/[0.06] border border-[#101624]/10 dark:border-white/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] text-[#556078] dark:text-[#9aa6c0] ml-1">Consulting car database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts (if few messages) */}
      {messages.length <= 2 && (
        <div className="shrink-0 px-3.5 py-3 border-t border-[#101624]/10 dark:border-white/10 space-y-1.5">
          <div className="font-['Unbounded',sans-serif] text-[9px] font-bold text-[#556078] dark:text-[#9aa6c0] uppercase tracking-[0.16em]">
            Suggested inquiries
          </div>
          <div className="flex flex-col gap-1.5">
            {sampleQuestions.slice(0, 2).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-left text-[11px] text-[#101624] dark:text-[#eef2fb] bg-white dark:bg-white/[0.06] hover:bg-[#ff5a1f]/10 dark:hover:bg-[#ff5a1f]/15 hover:border-[#ff5a1f]/40 hover:text-[#ff5a1f] p-2.5 rounded-xl border border-[#101624]/10 dark:border-white/10 transition-colors truncate cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Box */}
      <div className="shrink-0 p-3.5 border-t border-[#101624]/10 dark:border-white/10 bg-white/85 dark:bg-[#0e1424]/85 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about mileage, safety, EMI, variants..."
            className="flex-1 min-w-0 bg-[#f8fafc] dark:bg-white/[0.06] border border-[#101624]/12 dark:border-white/12 focus:border-[#ff5a1f]/60 dark:focus:border-[#ff5a1f]/60 rounded-full px-4 py-2.5 text-xs text-[#101624] dark:text-white placeholder-[#556078] dark:placeholder-[#9aa6c0] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            aria-label="Send message"
            className={`p-2.5 rounded-full transition-all ${
              inputText.trim() && !isTyping
                ? 'bg-[#ff5a1f] text-white hover:bg-[#e64a12] shadow-lg shadow-[#ff5a1f]/25 cursor-pointer'
                : 'bg-[#101624]/8 dark:bg-white/10 text-[#556078] dark:text-[#9aa6c0] cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
