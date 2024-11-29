'use client';

import { useChat } from 'ai/react';
import { Separator } from '@/components/ui/separator';

import Messages from '@/components/messages';

const Playground = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-start justify-between py-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold">Playground</h2>
      </div>
      <Separator />
      <div className="flex-1 overflow-hidden pt-4">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="md:order-1">
            <Messages
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          {/* <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <ModelSelector types={types} models={models} />
            <TemperatureSelector defaultValue={[0.56]} />
            <MaxLengthSelector defaultValue={[256]} />
            <TopPSelector defaultValue={[0.9]} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Playground;
