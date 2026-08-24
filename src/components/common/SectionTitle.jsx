import { cn } from "@/lib/utils";

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  className,
}) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="font-heading text-4xl leading-tight text-heading md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
