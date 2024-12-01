import ErrorBoundary from '@/components/error-boundary/error-boundary';
import Playground from '@/components/playground/playground';
import ErrorTest from '@/components/error-boundary/error-test';

export default function Home() {
  return (
    <ErrorBoundary>
      <ErrorTest />
      {/* <Playground /> */}
    </ErrorBoundary>
  );
}
