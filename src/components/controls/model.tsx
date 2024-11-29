import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { ModelType, Model } from '@/data/models';

interface ModelSelectorProps {
  types: ModelType[];
  models: Model[];
}

export function ModelSelector({ types, models }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<{
    value: string;
    label: string;
  }>(models[0]);

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedModel.label}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search model..." />
            <CommandEmpty>No model found.</CommandEmpty>
            {types.map((type) => (
              <CommandGroup key={type.value} heading={type.label}>
                {models
                  .filter((model) => model.type === type.value)
                  .map((model) => (
                    <CommandItem
                      key={model.value}
                      onSelect={() => {
                        setSelectedModel(model);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedModel.value === model.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {model.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
