"use client";

import { Toaster } from "react-hot-toast";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "font-ui bg-surface text-foreground border-border",
        },
      }}
    />
  );
}
