import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TopPSelectorProps {
  defaultValue: [number];
}

export function TopPSelector({ defaultValue }: TopPSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="topP">Top P</Label>
      <Slider
        id="topP"
        max={1}
        defaultValue={defaultValue}
        step={0.1}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
      />
    </div>
  );
}
