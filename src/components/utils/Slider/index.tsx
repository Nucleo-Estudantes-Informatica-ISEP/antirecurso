'use client';

import { Slider as ShadSlider } from '@/components/ui/slider';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, value, onChange }) => {
  return (
    <div className="w-full relative">
      <ShadSlider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      />
    </div>
  );
};

export default Slider;
