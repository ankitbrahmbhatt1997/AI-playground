import * as React from 'react';

interface LoaderDotsProps {
  text?: string;
}

const LoaderDots = ({ text = 'AI is generating' }: LoaderDotsProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <span>{text}</span>
      <span className="flex gap-0.5">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>
          .
        </span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>
          .
        </span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>
          .
        </span>
      </span>
    </div>
  );
};

export default LoaderDots;
