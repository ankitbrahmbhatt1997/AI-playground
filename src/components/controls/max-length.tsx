import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface MaxLengthSelectorProps {
  defaultValue: [number];
}

export function MaxLengthSelector({ defaultValue }: MaxLengthSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="maxLength">Maximum Length</Label>
      <Slider
        id="maxLength"
        max={4000}
        defaultValue={defaultValue}
        step={10}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
      />
    </div>
  );
}
