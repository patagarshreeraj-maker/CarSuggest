import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AiProcessingScreenProps {
  onComplete: () => void;
}

export const AiProcessingScreen: React.FC<AiProcessingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [activeCheckIndex, setActiveCheckIndex] = useState(0);

  const checks = [
    'Evaluating budget compatibility & variant pricing',
    'Analyzing family seating & boot volume requirements',
    'Matching driving patterns with powertrain efficiency',
    'Auditing 5-star BNCAP/GNCAP crash test ratings & ADAS',
    'Forecasting 5-year running & maintenance costs'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 18;
      });
    }, 280);

    const checkInterval = setInterval(() => {
      setActiveCheckIndex((prev) => {
        if (prev < checks.length - 1) return prev + 1;
        return prev;
      });
    }, 320);

    return () => {
      clearInterval(interval);
      clearInterval(checkInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F1F5F9]/95 backdrop-blur-xl">
      <div className="w-full max-w-md bg-white border border-emerald-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-emerald-500/10 space-y-6">
        {/* Animated Sparkle Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center relative">
          <Sparkles className="w-8 h-8 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 animate-ping" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 font-['Manrope'] mb-1.5">
            ✨ DriveAI is analyzing requirements
          </h3>
          <p className="text-xs text-slate-500">
            Running multi-factor automotive matching algorithm...
          </p>
        </div>

        {/* Dynamic Checklist */}
        <div className="space-y-2 text-left bg-white p-4 rounded-2xl border border-slate-200">
          {checks.map((item, idx) => {
            const isDone = idx <= activeCheckIndex;
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                  isDone ? 'text-emerald-600' : 'text-slate-500 opacity-40'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDone ? 'text-emerald-600' : 'text-slate-600'}`} />
                <span className="truncate">{item}</span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>24 Verified Vehicles Scanned</span>
            <span className="font-bold text-emerald-600 font-['Manrope']">{Math.min(100, progress)}%</span>
          </div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300 shadow-sm shadow-emerald-400"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
