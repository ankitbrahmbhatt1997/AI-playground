'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error');
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-lg font-semibold">Error Boundary Test</h2>
      <Button variant="destructive" onClick={() => setShouldError(true)}>
        Trigger Error
      </Button>
    </div>
  );
};

export default ErrorTest;
