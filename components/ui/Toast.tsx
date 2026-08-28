'use client';

import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  const bg = isSuccess
    ? 'bg-[#1b432a] border-[#2e7d4f]'
    : isError
    ? 'bg-[#4a1818] border-[#9e2a2a]'
    : 'bg-[#2b2823] border-[#736858]';

  const icon = isSuccess ? '✅' : isError ? '❌' : 'ℹ️';

  return (
    <div
      className={`toast-enter pointer-events-auto flex items-start gap-3 rounded-xl border p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${bg}`}
      role="alert"
    >
      <span className="text-lg leading-none mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
        <p className="mt-1 text-xs opacity-85 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-xs opacity-50 hover:opacity-100 p-0.5 font-bold shrink-0"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
