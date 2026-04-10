import { useEffect } from 'react';
import { X } from 'lucide-react';
import { getColorsForStage } from '../colors';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const colors = getColorsForStage('Acquisition');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-4 ${colors.badge}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-900 mb-3">What is this?</h2>
        <p className="text-slate-600 leading-relaxed">
          This is a learning demo to showcase how a growth funnel might look like. 
          Use the controls on the left to adjust different growth levers and see how they impact user conversion through the AARRR framework.
        </p>
      </div>
    </div>
  );
}
