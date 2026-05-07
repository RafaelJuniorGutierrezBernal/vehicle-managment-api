import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

const iconMap: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const colorMap: Record<ToastType, string> = {
  success: 'bg-[var(--accent-success)] text-white',
  error:   'bg-[var(--accent-danger)] text-white',
  info:    'bg-[var(--accent-primary)] text-white',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-medium
                pointer-events-auto animate-[slideIn_0.3s_ease]
                ${colorMap[toast.type]}
              `}
              style={{
                animation: 'slideIn 0.3s ease',
              }}
            >
              <span className="text-lg font-bold">{iconMap[toast.type]}</span>
              <span className="text-sm">{toast.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
