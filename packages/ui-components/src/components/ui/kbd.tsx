import { cn } from "../../libs/utils";
import { PropsWithChildren } from "react";

export const Kbd = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  return (
    <span
      className={cn(
        "border rounded-sm flex items-center justify-center size-[18px] text-xs text-primary",
        className
      )}
    >
      <kbd>{children}</kbd>
    </span>
  );
};
