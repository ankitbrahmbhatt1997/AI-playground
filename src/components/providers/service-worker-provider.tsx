'use client';

import { useEffect } from 'react';
import { register } from '@/service-worker/register';

export default function ServiceWorkerProvider() {
  useEffect(() => {
    register();
  }, []);

  return null;
}
