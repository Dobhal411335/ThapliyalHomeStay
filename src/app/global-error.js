"use client";

import { useEffect } from "react";

import "./globals.css";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <h1 className="font-heading text-5xl text-heading">
              We need a quiet reset
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground">
              The application could not continue safely.
            </p>
            <button
              className="mt-8 inline-flex h-11 items-center justify-center rounded-[var(--radius-button)] bg-primary px-6 font-ui text-sm text-primary-foreground transition hover:bg-primary-hover"
              type="button"
              onClick={() => reset()}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
