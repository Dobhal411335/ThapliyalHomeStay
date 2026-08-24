"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { countryCodes } from "@/lib/countryCodes";

/* ── Validation schema ──────────────────────────────── */
const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  countryCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10,15}$/, "Enter a valid phone number (10–15 digits)"),
  guests: z.string().min(1, "Please select number of guests"),
  plan: z.string().optional(),
  startDate: z.string().optional(),
  hopes: z.string().optional(),
});

const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests", "5 guests", "6+ guests"];
const planOptions = [
  "3 Days & 2 Nights",
  "4 Days & 3 Nights",
  "5 Days & 4 Nights",
  "6 Days & 5 Nights",
  "7 Days & 6 Nights",
];

/* ── Shared field label ─────────────────────────────── */
function FieldLabel({ htmlFor, children, optional }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
    >
      {children}
      {optional && (
        <span className="ml-1 font-normal normal-case tracking-normal text-muted/70">
          (optional)
        </span>
      )}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-ui text-xs text-error" role="alert">
      {message}
    </p>
  );
}

/* ── Enquiry form ───────────────────────────────────── */
export function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guests: "1 guest",
      plan: "",
      startDate: "",
      countryCode: "+91",
      phone: "",
    },
  });

  async function onSubmit(data) {
    setSubmitError("");
    try {
      const response = await fetch("/api/contact-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send enquiry.");
      }
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <span className="font-heading text-5xl text-primary">✦</span>
        <h3 className="mt-6 font-heading text-3xl text-heading">
          We&apos;ve received your note.
        </h3>
        <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-foreground">
          We&apos;ll be in touch within 24 hours — no bots, no rush.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] bg-surface p-8 shadow-sm ring-1 ring-border/60 md:p-10">
      {/* Card header */}
      <div className="mb-8">
        <h2 className="font-heading text-3xl text-heading">
          Enquire about a stay
        </h2>
        <p className="mt-1.5 font-body text-sm text-muted">
          A few details and we&apos;ll take it from here.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-5">

          {/* Row 1 — Name + Email */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="c-name">Your name</FieldLabel>
              <Input
                id="c-name"
                placeholder="Enter Your Name"
                className="mt-1.5"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="c-email">Email</FieldLabel>
              <Input
                id="c-email"
                type="email"
                placeholder="you@example.com"
                className="mt-1.5"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              <FieldError message={errors.email?.message} />
            </div>
          </div>

          {/* Row 2 — Phone + Guests */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="c-phone">Phone</FieldLabel>
              <div
                className={cn(
                  "mt-1.5 flex rounded-button border bg-card",
                  errors.countryCode || errors.phone
                    ? "border-error"
                    : "border-border"
                )}
              >
                <Controller
                  name="countryCode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? "+91"} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-[110px] rounded-l-button rounded-r-none border-0 border-r border-border bg-transparent focus:ring-0"
                        aria-invalid={!!errors.countryCode}
                      >
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (
                          <SelectItem key={`${c.name}-${c.code}`} value={c.code}>
                            <div className="flex w-full items-center justify-between gap-4">
                              <span>{c.name}</span>
                              <span className="text-muted">{c.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  id="c-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98XXXXXXXX"
                  className="flex-1 rounded-l-none border-0 bg-transparent focus-visible:ring-0"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
              </div>
              <FieldError message={errors.countryCode?.message} />
              <FieldError message={errors.phone?.message} />
            </div>
            <div>
              <FieldLabel htmlFor="c-guests">Guests</FieldLabel>
              <Controller
                name="guests"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="c-guests" className="mt-1.5 w-full">
                      <SelectValue placeholder="1 guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {guestOptions.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Row 3 — Plan of interest + Start date */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="c-plan" optional>Plan of interest</FieldLabel>
              <Controller
                name="plan"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger id="c-plan" className="mt-1.5 w-full">
                      <SelectValue placeholder="Choose a retreat" />
                    </SelectTrigger>
                    <SelectContent>
                      {planOptions.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <FieldLabel htmlFor="c-date" optional>Preferred start date</FieldLabel>
              <div className="mt-1.5">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="c-date"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      disablePast
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Row 4 — Hopes textarea */}
          <div>
            <FieldLabel htmlFor="c-hopes" optional>What are you hoping for?</FieldLabel>
            <Textarea
              id="c-hopes"
              placeholder="A few lines about what you're looking for — rest, practice, transformation, or simply space to breathe."
              rows={4}
              className="mt-1.5 resize-y"
              {...register("hopes")}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-1">
            {submitError ? (
              <p className="font-ui text-sm text-error" role="alert">
                {submitError}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-7 font-body text-sm text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send enquiry
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>

              <a
                href="https://wa.me/+919762240419?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20stay."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] border border-border px-7 font-body text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp instead
              </a>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
