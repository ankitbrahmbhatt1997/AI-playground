import ErrorBoundary from '@/components/error-boundary/error-boundary';
import Playground from '@/components/playground/playground';

export default function Home() {
  return (
    <ErrorBoundary>
      <Playground />
    </ErrorBoundary>
  );
}
