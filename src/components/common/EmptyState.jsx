import Link from "next/link";
import { FileQuestion } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";

export function EmptyState({
  title = "Nothing here yet",
  description,
  actionLabel = "Return home",
  actionHref = "/",
  className,
  children,
}) {
  return (
    <Container
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center py-24 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-surface text-primary">
        <FileQuestion className="size-8" aria-hidden="true" />
      </div>
      <h1 className="mt-8 font-heading text-4xl text-heading">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-lg text-lg leading-8 text-foreground">
          {description}
        </p>
      ) : null}
      {children}
      {actionLabel ? (
        <Link
          href={actionHref}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-primary px-6 font-body text-sm text-primary-foreground transition hover:bg-primary-hover"
        >
          {actionLabel}
        </Link>
      ) : null}
    </Container>
  );
}
