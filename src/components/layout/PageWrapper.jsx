import { cn } from "@/lib/utils";

export function PageWrapper({ className, children }) {
  return (
    <div className={cn("min-h-[60vh] bg-background", className)}>
      {children}
    </div>
  );
}
