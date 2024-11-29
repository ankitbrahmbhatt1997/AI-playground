'use client';

import { useChat } from 'ai/react';
import { Separator } from '@/components/ui/separator';
import { ModelSelector } from '@/components/model-selector';
import { TemperatureSelector } from '@/components/temperature-selector';
import { MaxLengthSelector } from '@/components/maxlength-selector';
import { TopPSelector } from '@/components/top-p-selector';
import { PresetActions } from '@/components/preset-actions';
import { PresetSave } from '@/components/preset-save';
import { PresetSelector } from '@/components/preset-selector';
import { models, types } from '@/data/models';
import { presets } from '@/data/presets';
import { ChatContainer } from '@/components/chat/chat-container';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-start justify-between py-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold">Playground</h2>
        <div className="ml-auto flex w-full space-x-2 sm:justify-end">
          <PresetSelector presets={presets} />
          <PresetSave />
          <PresetActions />
        </div>
      </div>
      <Separator />
      <div className="flex-1 overflow-hidden pt-4">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="md:order-1">
            <ChatContainer
              messages={messages}
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          <div className="hidden flex-col space-y-4 sm:flex md:order-2">
            <ModelSelector types={types} models={models} />
            <TemperatureSelector defaultValue={[0.56]} />
            <MaxLengthSelector defaultValue={[256]} />
            <TopPSelector defaultValue={[0.9]} />
          </div>
        </div>
      </div>
    </div>
  );
}
