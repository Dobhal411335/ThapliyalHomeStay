"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/common/Container";

export function Loader({ label = "Loading", className }) {
  return (
    <Container
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-4 py-24",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className="size-8 animate-spin text-primary"
        aria-hidden="true"
      />
      <p className="font-ui text-sm text-muted">{label}</p>
    </Container>
  );
}
