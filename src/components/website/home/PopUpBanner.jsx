"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";

export default function PopUpBanner() {
  const [banner, setBanner] = useState(null);
  const [open, setOpen] = useState(false);
  const [showAnim, setShowAnim] = useState(false);

  const handleClose = useCallback(() => {
    setShowAnim(false);
    setTimeout(() => setOpen(false), 300);
  }, []);

  useEffect(() => {
    fetch("/api/popupBanner")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanner(data[0]);
        }
      })
      .catch(() => {
        setBanner(null);
      });
  }, []);

  useEffect(() => {
    if (!banner) return;

    const timer = setTimeout(() => {
      setOpen(true);
      requestAnimationFrame(() => setShowAnim(true));
    }, 2000);

    return () => clearTimeout(timer);
  }, [banner]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event) {
      if (event.key === "Escape") handleClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  if (!banner || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-banner-title"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-image-dark/50 transition-opacity duration-[var(--duration-medium)] ease-[var(--ease-smooth)] ${showAnim ? "opacity-100" : "opacity-0"
          }`}
        aria-label="Close popup"
        onClick={handleClose}
      />

      <div
        className={`relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-dialog)] border border-border bg-surface shadow-sm transition-all duration-[var(--duration-slow)] ease-[var(--ease-smooth)] md:flex-row ${showAnim
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
          }`}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full border border-border bg-surface/90 text-heading transition-colors duration-[var(--duration-fast)] hover:bg-background"
          aria-label="Close popup"
        >
          <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="relative h-52 w-full shrink-0 bg-border md:h-auto md:min-h-[380px] md:w-1/2">
          <Image
            src={banner.image?.url || " "}
            alt={banner.heading || "Announcement"}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex w-full items-center justify-center p-7 md:w-1/2 md:p-10">
          <div className="w-full max-w-sm text-center md:text-left">
            <p className="font-ui text-xs uppercase tracking-[0.25em] text-muted">
              A quiet invitation
            </p>

            {banner.heading ? (
              <h2
                id="popup-banner-title"
                className="mt-4 font-heading text-2xl leading-snug text-heading md:text-3xl"
              >
                {banner.heading}
              </h2>
            ) : null}

            {banner.paragraph ? (
              <p className="mt-4 font-body text-sm leading-[1.9] text-foreground">
                {banner.paragraph}
              </p>
            ) : null}

            {banner.buttonLink ? (
              <a
                href={banner.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-7 font-body text-sm text-primary-foreground transition-colors duration-[var(--duration-fast)] hover:bg-primary-hover md:w-auto"
              >
                Explore
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
