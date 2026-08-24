"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ButtonWrapper({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn("font-body", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
