import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = React.ComponentPropsWithoutRef<"input"> & {
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
};

export function Switch({ className, onCheckedChange, defaultChecked, disabled, ...props }: SwitchProps) {
  const [internal, setInternal] = React.useState<boolean>(!!defaultChecked);
  const isControlled = props.checked !== undefined;
  const checked = isControlled ? (props as any).checked : internal;

  const toggle = (next?: boolean) => {
    const nextVal = next ?? !checked;
    if (!isControlled) setInternal(nextVal);
    onCheckedChange?.(nextVal);
  };

  return (
    <label className={cn("inline-flex relative items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only peer"
        aria-checked={checked}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => toggle(e.target.checked)}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none transition-colors peer-checked:bg-primary peer-checked:after:translate-x-5 peer-checked:after:border-white",
          "after:content-[''] after:block after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-sm after:transform after:transition-transform after:translate-x-0 after:border after:border-gray-200",
          disabled ? "opacity-50 cursor-not-allowed" : "",
        )}
      />
    </label>
  );
}

export default Switch;
