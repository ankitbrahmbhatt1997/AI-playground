import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TemperatureSelectorProps {
  defaultValue: [number];
}

export function TemperatureSelector({ defaultValue }: TemperatureSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="temperature">Temperature</Label>
      <Slider
        id="temperature"
        max={1}
        defaultValue={defaultValue}
        step={0.1}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
      />
    </div>
  );
}
