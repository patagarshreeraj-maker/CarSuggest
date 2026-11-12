import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  RotateCcw,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
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
  initialPrompt,
  onViewCarDetails
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm DriveAI, your automotive advisor. Ask me anything about car comparisons, real-world mileage, 5-star safety ratings, or 5-year ownership costs in India.",
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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 font-['Manrope'] flex items-center gap-1.5">
              DriveAI Consultant
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-500">Powered by Gemini 2.5 Flash</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-500 text-black font-semibold rounded-br-none shadow-md'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-[9px] mt-1.5 ${isUser ? 'text-black/60' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 items-center text-xs text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-600 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] text-slate-500 ml-1">Consulting car database...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Prompts (if few messages) */}
      {messages.length <= 2 && (
        <div className="p-3 border-t border-slate-200 bg-white/40 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Suggested Inquiries</div>
          <div className="flex flex-col gap-1">
            {sampleQuestions.slice(0, 2).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-left text-[11px] text-slate-600 hover:text-emerald-600 bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200 transition-all truncate"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Box */}
      <div className="p-3.5 border-t border-slate-200 bg-white">
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
            className="flex-1 bg-white border border-slate-200 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              inputText.trim() && !isTyping
                ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-50 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
