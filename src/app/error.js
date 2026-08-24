"use client";

import { useEffect } from "react";

import { ButtonWrapper } from "@/components/common/ButtonWrapper";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <h1 className="font-heading text-5xl text-heading">Something went wrong</h1>
        <p className="mt-4 text-lg leading-8 text-foreground">
          Please try again in a moment.
        </p>
        <ButtonWrapper className="mt-8" onClick={() => reset()}>
          Try again
        </ButtonWrapper>
      </div>
    </main>
  );
}
