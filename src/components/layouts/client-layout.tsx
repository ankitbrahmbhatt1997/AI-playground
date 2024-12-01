'use client';

import ServiceWorkerProvider from '@/components/providers/service-worker-provider';
import { ToastProvider } from '@/components/providers/toast-provider';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ServiceWorkerProvider />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">{children}</main>
    </ToastProvider>
  );
}
