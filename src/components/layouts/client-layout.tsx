'use client';

import { ToastProvider, OnlineStatusProvider } from '@/context';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <OnlineStatusProvider>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">{children}</main>
      </OnlineStatusProvider>
    </ToastProvider>
  );
}
