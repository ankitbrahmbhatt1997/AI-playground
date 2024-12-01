'use client';

import * as Sentry from '@sentry/nextjs';
import React, { Component, ReactNode } from 'react';
import { ExclamationTriangleIcon, ChevronDownIcon } from '@radix-ui/react-icons';

export type ErrorBoundaryType = 'global' | 'messages' | 'input' | 'stream';

interface Props {
  type?: ErrorBoundaryType;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  showDetails: boolean;
}

// Different messages for different parts of the app that might break
const ERROR_MESSAGES: Record<ErrorBoundaryType, { title: string; action: string }> = {
  global: {
    title: 'Something went wrong',
    action: 'Please refresh the page and try again',
  },
  messages: {
    title: 'Failed to load the message container',
    action: 'Check your connection and try again',
  },
  input: {
    title: 'Unable to process your input',
    action: 'Please try typing your message again',
  },
  stream: {
    title: 'Unable to stream the messages',
    action: 'Check your internet and try again',
  },
};

class ErrorBoundary extends Component<Props, State> {
  // If no type is provided, assume it's a global error
  public static defaultProps = {
    type: 'global' as ErrorBoundaryType,
  };

  // Start with no errors
  public state: State = {
    hasError: false,
    showDetails: false,
  };

  // React calls this when something breaks
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, showDetails: false };
  }

  private getErrorMessage(): { title: string; action: string } {
    const { type = 'global' } = this.props;
    const error = this.state.error;

    if (error) {
      Sentry.captureException(error);
    }

    if (error?.message.includes('IndexedDB')) {
      return {
        title: 'Database Error',
        action: 'Clear browser data and reload',
      };
    }

    return ERROR_MESSAGES[type];
  }

  public render() {
    // Only show error UI if something went wrong
    if (this.state.hasError) {
      const { title, action } = this.getErrorMessage();
      const error = this.state.error;

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <ExclamationTriangleIcon className="mb-4 h-12 w-12 text-destructive" />
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">{title}</div>
            <div className="text-sm text-muted-foreground">{action}</div>
          </div>
          <button
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>

          {/* Error Details Section */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 w-full max-w-md">
              <button
                className="flex w-full items-center justify-between rounded-md border bg-muted px-4 py-2 text-xs text-muted-foreground hover:bg-muted/80"
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
              >
                <span>Error Details</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${
                    this.state.showDetails ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {this.state.showDetails && (
                <div className="mt-2 max-h-[300px] overflow-y-auto rounded-md border bg-muted/50 p-4">
                  <div className="space-y-2 text-left text-xs">
                    <div className="font-medium">Error Name:</div>
                    <div className="font-mono text-destructive">{error?.name}</div>
                    <div className="font-medium">Error Message:</div>
                    <div className="font-mono text-destructive">{error?.message}</div>
                    <div className="font-medium">Stack Trace:</div>
                    <pre className="overflow-auto whitespace-pre-wrap text-[10px] text-destructive">
                      {error?.stack}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // If everything's fine, show the app
    return this.props.children;
  }
}

export default ErrorBoundary;
