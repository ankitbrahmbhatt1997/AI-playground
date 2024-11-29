import { useEffect, useState } from 'react';

interface MetricsProps {
  isStreaming: boolean;
  startTime?: number;
  tokenCount: number;
}

const Metrics = ({ isStreaming, startTime, tokenCount }: MetricsProps) => {
  const [tokensPerSecond, setTokensPerSecond] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isStreaming && startTime) {
      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = (currentTime - startTime) / 1000;
        setElapsedTime(elapsed);
        setTokensPerSecond(tokenCount / elapsed);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isStreaming, startTime, tokenCount]);

  return (
    <div className="flex items-center divide-x divide-border">
      <div className="min-w-[150px] px-4 text-xs text-muted-foreground">Tokens: {tokenCount}</div>
      <div className="min-w-[150px] px-4 text-xs text-muted-foreground">
        Speed: {tokensPerSecond.toFixed(1)} t/s
      </div>
      <div className="min-w-[150px] px-4 text-xs text-muted-foreground">
        Time: {elapsedTime.toFixed(1)}s
      </div>
    </div>
  );
};

export default Metrics;
