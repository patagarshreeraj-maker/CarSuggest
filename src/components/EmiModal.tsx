import React from 'react';
import { X, Calculator } from 'lucide-react';
import { EmiCalculatorWidget } from './EmiCalculatorWidget';

interface EmiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPriceLakh?: number;
  carName?: string;
}

export const EmiModal: React.FC<EmiModalProps> = ({
  isOpen,
  onClose,
  initialPriceLakh = 12.0,
  carName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1 sm:p-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <EmiCalculatorWidget
          initialPriceLakh={initialPriceLakh}
          carName={carName}
          className="border-none shadow-none"
        />
      </div>
    </div>
  );
};
