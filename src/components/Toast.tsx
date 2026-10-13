import React from 'react';
import { ToastMessage } from '../types';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => {
        let Icon = Info;
        let colorClasses = 'bg-white/90 border-stone-200/70 text-stone-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)]';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClasses = 'bg-emerald-50/95 border-emerald-200/80 text-emerald-900 shadow-[0_8px_30px_rgba(16,185,129,0.08)]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'bg-rose-50/95 border-rose-200/80 text-rose-900 shadow-[0_8px_30px_rgba(244,63,94,0.08)]';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          colorClasses = 'bg-amber-50/95 border-amber-200/80 text-amber-900 shadow-[0_8px_30px_rgba(245,158,11,0.08)]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-2xl transition-all animate-in slide-in-from-right duration-200 ${colorClasses}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-4 h-4 shrink-0" />
              <p className="text-xs font-semibold leading-relaxed truncate">{toast.text}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
