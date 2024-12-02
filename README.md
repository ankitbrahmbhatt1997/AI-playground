# AI Playground

A real-time AI chat interface built with Next.js 14, featuring streaming responses, offline support, and persistent storage.

## Demo

- **Live Demo**: [v0-ai-chat.vercel.app](http://v0-ai-chat-zdcvrk2omjc.vercel.app/)

- **Demo Video(Pro-tip: Watch in 1.5x 😉)**: [Watch on Google Drive](https://drive.google.com/file/d/1pP9eir5JloYe5w3_sIIPtohqMb7pDvZv/view)

## Features

- 🚀 **Real-time Streaming**: Token-by-token AI response streaming
- 💾 **Offline Support**: Continue chatting even when offline
- 📱 **Responsive Design**: Works seamlessly across all devices
- 💪 **TypeScript**: Full type safety throughout the application
- 🔄 **Background Sync**: Automatically syncs messages when back online
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context + Custom Hooks
- **Storage**: IndexedDB (idb)
- **Testing**: Jest, React Testing Library, Cypress
- **AI Integration**: Vercel AI SDK

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-playground.git
cd ai-playground
```

2. Install dependencies:

```bash
yarn
```

3. Create a `.env.local` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
yarn dev
```

## Architecture Decisions

### 1. Offline-First Approach

- Uses Service Workers for offline functionality
- IndexedDB for message persistence
- Background sync when coming back online

### 2. State Management

- React Context for global states (Toast, Online Status)
- Custom hooks for specific features:
  - `useStream`: Handles message streaming
  - `usePersistedChat`: Manages chat persistence
  - `useOnlineStatus`: Tracks online/offline state

### 3. Error Handling Strategy

- **Targeted Error Boundaries**

We implemented a targeted error boundary approach to handle failures gracefully without breaking the entire UI:

```typescript
      // ✅ Reusable Error Boundary with Type-based Rendering
      interface ErrorBoundaryProps {
        type: 'messages' | 'input' | 'stream';
        children: React.ReactNode;
      }

      const ErrorBoundary = ({ type, children }: ErrorBoundaryProps) => {
        const renderError = (error: Error) => {
          switch (type) {
            case 'messages':
              return (
                <div className="flex h-full items-center justify-center">
                  <p>Failed to load messages: {error.message}</p>
                </div>
              );
            case 'stream':
              return (
                <div className="mt-4 rounded-lg border border-red-200 p-4">
                  <p>Stream error: {error.message}</p>
                </div>
              );
            case 'input':
              return (
                <div className="p-4">
                  <p>Input error: Try refreshing the page</p>
                </div>
              );
          }
        };

        return (
          <ReactErrorBoundary
            fallback={renderError}
            onError={(error) => {
              console.error(`${type} error:`, error);
            }}
          >
            {children}
          </ReactErrorBoundary>
        );
      };
```

Implementation in Components:

```typescript
// Messages component with targeted error boundaries
const Messages = ({ messages, input, ...props }) => {
  return (
    <div className="flex flex-col">
      <ErrorBoundary type="messages">
        <MessageList messages={messages} />
      </ErrorBoundary>

      <ErrorBoundary type="stream">
        <StreamingIndicator />
      </ErrorBoundary>

      <ErrorBoundary type="input">
        <Input value={input} {...props} />
      </ErrorBoundary>
    </div>
  );
};
```

**Why This Matters:**

- **Granular Error Handling**: Each component section has its own error boundary
- **Targeted Recovery**: Errors in one section don't affect others
- **Better UX**: Users can continue using unaffected parts of the app
- **Maintainable Code**: Error handling logic is centralized and reusable
- **Type Safety**: TypeScript ensures correct error boundary types

For example, if message loading fails:

- Chat input remains functional
- Users can still type and send new messages
- Only the message list shows an error state

### 4. Testing Strategy

- **Unit Tests**: Jest + React Testing Library

  - Database Operations
    - Message saving and retrieval
    - Message validation
    - Error handling
  - Stream Utils
    - Message creation
    - Stream chunk processing
    - Message format validation
  - Hooks
    - useOnlineStatus (online/offline transitions)
    - usePersistedChat (message persistence)
    - useStream (basic streaming functionality)
  - Context
    - ToastContext (notifications)
    - OnlineContext (connection status)

- **Integration Tests & E2E Tests**: Cypress

  - Chat Flow
    - Message sending and receiving
    - Message persistence across reloads
    - Offline mode handling
  - UI Responsiveness
    - Mobile viewport (iPhone 6)
    - Tablet viewport (iPad 2)
    - Desktop viewport (1024x768)
    - Text overflow handling
  - Performance
    - Initial page load time (< 3s)
    - Rapid message sending
    - Large conversation handling
    - Scroll performance

### 5. Special Mentions

- **Why No Context API for Streaming**

We deliberately avoided using Context API for streaming messages to prevent performance issues:

```typescript
// ❌ Problematic Approach with Context
const ChatContext = createContext<{
  messages: Message[];
  appendMessage: (message: Message) => void;
}>(null);

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  // Every message update would trigger a re-render of all consumers

  return (
    <ChatContext.Provider value={{ messages, appendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
```

Instead, we use local state in `useStream` and pass messages directly:

```typescript
// ✅ Our Approach: Local State with Props
const useStream = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Stream updates only affect components that actually need the messages
  const processStream = useCallback((chunk) => {
    setMessages((prev) => [...prev, processChunk(chunk)]);
  }, []);

  return { messages, processStream };
};
```

**Why This Matters:**

- Context triggers re-renders of all consumers on every message update
- With streaming, we get many rapid updates (token by token)
- Large chat histories would cause performance issues
- Our approach localizes updates to only the necessary components

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── context/            # Global context providers
├── hooks/              # Custom React hooks
├── lib/                # Utilities and database
├── types/              # TypeScript types
└── utils/              # Helper functions
```

## Testing

Run unit tests:

```bash
yarn test               # Run all tests
yarn test:watch        # Watch mode
```

Run Cypress tests:

```bash
yarn cypress:open      # Open Cypress UI
yarn cypress:run       # Run in terminal
```

## Performance Considerations

- Aggressive component memoization
- Service worker for offline caching
- Optimistic UI updates

## Known Limitations

- No multi-user support
- Limited to single chat thread
- Message history limited by IndexedDB storage
- Offline mode is not that robust
- Plus many more 😵

## Future Improvements

Phase 1 was done with extremely limited time. Here are some improvements that can be made to the project:

### Code Improvements

**Performance Optimization**

- Implement virtualized list for large chat histories
- Use a custom solution instead of `react-window` or `react-virtualized` for efficient rendering (Too much customization needed for these to work)

**Code Organization & Improvements**

- Centralize types and utilities in a shared directory
- Create a `@/shared` directory for common types, utils, and constants
- Service worker setup is kinda messy, needs to be refactored

Example structure:

```
src/shared/
├── types/          # All TypeScript interfaces/types
├── utils/          # Shared utility functions
└── constants/      # App-wide constants
```

**Better Modularization**

- Break down large components into smaller, focused ones
- Example: Split Messages component into:

```typescript
src/components/messages/
├── message-item.tsx      # Single message
├── message-list.tsx      # List container
├── message-actions.tsx   # Message actions
└── message-input.tsx     # Input handling
```

**More comments supporting jsdoc**

- Add more comments to support jsdoc documentation generation
- Currently only hooks, utils and context provider are covered

**Enhanced Error Handling**

- Implement retry mechanisms with exponential backoff
- Add specific error recovery strategies:

```typescript
switch (error.code) {
  case 'STREAM_FAILED':
    return retryStreamWithBackoff();
  case 'DB_ERROR':
    return attemptDBRecovery();
}
```

**Hook Refactoring**

Break down `useStream` into smaller, focused hooks or similar util functions instead.

- **useStreamProcessor**: Handle stream reading and chunk processing
- **useStreamState**: Manage loading states and abort controller
- **useStreamInput**: Handle input state and validation
- **useStreamError**: Centralize error handling and recovery
- **useStreamMetrics**: Track token count and streaming metrics
- **useStreamCache**: Handle message caching and retrieval

Benefits:

- Better separation of concerns
- Easier testing of individual stream features
- More reusable stream-related logic
- Simpler maintenance and debugging

**Accessibility Improvements**

- The only supported action right now is pressing Enter to send 😢
- Add ARIA labels and roles
- Implement keyboard navigation

Example:

```typescript
<div
  role="log"
  aria-label="Chat messages"
  aria-live="polite"
>
  {messages}
</div>
```

**Test Coverage**

- Add more integration tests for offline scenarios
- Add performance testing with Lighthouse
- Add visual regression testing
- Current test coverage is superficial and needs significant improvement:

**Unit Tests**

- Need error cases for database corruption
- Test concurrent write scenarios
- Test large message handling

**Stream Processing**

- Test partial message chunks
- Test malformed stream data
- Test stream interruptions
- Test memory usage with large streams

**Integration Tests**

- Test offline -> online transitions thoroughly
- Test message queue ordering
- Test IndexedDB limits
- Test service worker update scenarios

**Edge Cases**

- Network throttling scenarios
- Browser storage limits
- Race conditions in message processing
- Memory leaks in long conversations

**Performance Tests**

- Add Lighthouse CI integration
- Test with large message histories
- Measure re-render performance
- Profile memory usage

### Feature Improvements

**Chat Sessions**

- Implement multiple chat threads
- Add session management and switching
- Persist session state

**Message Search**

- Full-text search across messages
- Filter by date/type

**File Attachments**

- Support image/document uploads
- Preview attachments inline

**Message Formatting**

- Rich text editing
- Code block formatting
- Markdown support

**Different LLM Models**

- Support different LLM models
- Allow switching models in the UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
