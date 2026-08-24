import { cn } from "@/lib/utils";

const spacingMap = {
  lg: "py-[var(--section-lg)]",
  md: "py-[var(--section-md)]",
  sm: "py-[var(--section-sm)]",
};

export function Section({
  as: Component = "section",
  spacing = "md",
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(spacingMap[spacing] || spacingMap.md, className)}
      {...props}
    >
      {children}
    </Component>
  );
}
