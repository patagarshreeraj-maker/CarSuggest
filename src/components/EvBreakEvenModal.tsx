import React from 'react';
import { X } from 'lucide-react';
import { EvBreakEvenSimulator } from './EvBreakEvenSimulator';

interface EvBreakEvenModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvPriceLakh?: number;
  initialIcePriceLakh?: number;
  evName?: string;
  iceName?: string;
}

export const EvBreakEvenModal: React.FC<EvBreakEvenModalProps> = ({
  isOpen,
  onClose,
  initialEvPriceLakh = 14.5,
  initialIcePriceLakh = 11.5,
  evName,
  iceName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1 sm:p-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <EvBreakEvenSimulator
          initialEvPriceLakh={initialEvPriceLakh}
          initialIcePriceLakh={initialIcePriceLakh}
          evName={evName}
          iceName={iceName}
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
};
