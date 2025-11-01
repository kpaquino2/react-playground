import { useDebouncedCallback } from "use-debounce";
import { InputGroupButton } from "../ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Colorful from "@uiw/react-color-colorful";
import { useState } from "react";

interface ColorPickerPopoverProps {
  value: string;
  onChange: (c: string) => void;
}

export function ColorPickerPopover({
  value,
  onChange,
}: ColorPickerPopoverProps) {
  const [color, setColor] = useState(value);
  const debounced = useDebouncedCallback(onChange, 1000);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroupButton variant="secondary" size="icon-sm">
          <div className="size-6 rounded" style={{ backgroundColor: value }} />
        </InputGroupButton>
      </PopoverTrigger>
      <PopoverContent className="h-min w-min p-3" align="end">
        <Colorful
          disableAlpha
          color={color}
          onChange={(color) => {
            setColor(color.hex);
            debounced(color.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
