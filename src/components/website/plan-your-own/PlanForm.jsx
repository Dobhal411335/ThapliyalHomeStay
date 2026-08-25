"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";

/* ── Validation schema ─────────────────────────────── */
const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  countryCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10,15}$/, "Enter a valid phone number (10–15 digits)"),
  guests: z.string().min(1, "Please select number of guests"),
  dates: z.string().optional(),
  experiences: z.array(z.string()).optional(),
  accommodation: z.string().optional(),
  dietary: z.string().optional(),
  budget: z.string().optional(),
  hopes: z.string().optional(),
});

/* ── Experience options ─────────────────────────────── */
const experiences = [
  ["Daily yoga & pranayama", "Meditation & silence"],
  ["Ganga Aarti at Parmarth", "Sunrise hike (Kunjapuri)"],
  ["Neelkanth Mahadev temple", "Beatles Ashram visit"],
  ["River rafting / nature walk", "Ayurvedic consult / therapy"],
  ["Sound healing", "Cooking class (sattvic)"],
  ["Vedic chanting & philosophy", "Journaling & solo time"],
];

const guestOptions = ["1 guest", "2 guests", "3 guests", "4 guests", "5 guests", "6+ guests"];
const accommodationOptions = [
  "1 room - single occupancy",
  "2 rooms - single occupancy",
  "1 room - double occupancy",
  "2 rooms - double occupancy",
];
/* ── Field label component ─────────────────────────── */
function FieldLabel({ htmlFor, children, optional }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-black"
    >
      {children}
      {optional && (
        <span className="ml-1 font-normal normal-case tracking-normal text-black/70">
          (optional)
        </span>
      )}
    </label>
  );
}

/* ── Field error message ───────────────────────────── */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-ui text-xs text-error" role="alert">
      {message}
    </p>
  );
}

/* ── Main form ─────────────────────────────────────── */
export function PlanForm() {
  const companyInfo = useCompanyBasicInfo();
  const whatsappNumber = (companyInfo?.whatsappNumber || companyInfo?.contactNumbers?.[0] || "").replace(/\D/g, "");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      guests: "1 guest",
      accommodation: "",
      experiences: [],
      countryCode: "+91",
      phone: "",
    },
  });

  const selectedExperiences = watch("experiences") ?? [];

  function toggleExperience(exp) {
    if (selectedExperiences.includes(exp)) {
      setValue(
        "experiences",
        selectedExperiences.filter((e) => e !== exp),
      );
    } else {
      setValue("experiences", [...selectedExperiences, exp]);
    }
  }

  async function onSubmit(data) {
    setSubmitError("");
    try {
      const response = await fetch("/api/enquiry-page", {
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

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <span className="font-heading text-5xl text-black">✦</span>
        <h2 className="mt-6 font-heading text-4xl text-heading">
          We&apos;ve received your sketch.
        </h2>
        <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-black">
          We&apos;ll reach out within 24 hours with a quiet itinerary crafted
          just for you.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-background py-16">
      <div className="container">
        <div className="mx-auto max-w-5xl rounded-[var(--radius-card)] bg-[#f3efe6] p-4 md:p-12 border border-gray-600">

          {/* Card header */}
          <div className="mb-10">
            <h2 className="font-heading text-4xl text-heading">
              Sketch your stay
            </h2>
            <p className="mt-2 font-body text-sm text-black">
              Fill what you know. Leave the rest to us.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-6 font-medium">

              {/* Row 1 — Name + Email */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="name" >Your name</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Enter Your Name"
                    className="mt-2"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                  />
                  <FieldError message={errors.name?.message} />
                </div>
                <div>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              {/* Row 2 — Phone + Guests */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <div
                    className={cn(
                      "mt-2 flex rounded-button border bg-card",
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
                                  <span className="text-black">{c.code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Input
                      id="phone"
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
                  <FieldLabel htmlFor="guests">Guests</FieldLabel>
                  <Controller
                    name="guests"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? "1 guest"} onValueChange={field.onChange}>
                        <SelectTrigger id="guests" className="mt-2 w-full">
                          <SelectValue placeholder="1 guest" />
                        </SelectTrigger>
                        <SelectContent>
                          {guestOptions.map((opt, index) => (
                            <SelectItem key={opt + index} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Row 3 — Preferred Dates */}
              <div>
                <FieldLabel htmlFor="dates" optional>Preferred dates</FieldLabel>
                <div className="mt-2">
                  <Controller
                    name="dates"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="dates"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick a preferred date"
                        disablePast
                      />
                    )}
                  />
                </div>
              </div>

              {/* Row 4 — Experience checkboxes */}
              <div>
                <FieldLabel>What would you like to weave in?</FieldLabel>
                <p className="mt-1 font-body text-xs text-black">
                  Pick as few or as many as you&apos;d like.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {experiences.flat().map((exp) => (
                    <label
                      key={exp}
                      className="flex cursor-pointer items-center gap-3 font-body text-sm text-black"
                    >
                      <Checkbox
                        checked={selectedExperiences.includes(exp)}
                        onCheckedChange={() => toggleExperience(exp)}
                        className="rounded-full border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      {exp}
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 5 — Accommodation + Dietary + Budget */}
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <FieldLabel htmlFor="accommodation" optional>Accommodation</FieldLabel>
                  <Controller
                    name="accommodation"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger id="accommodation" className="mt-2 w-full">
                          <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent>
                          {accommodationOptions.map((opt, index) => (
                            <SelectItem key={opt + index} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="dietary" optional>Dietary notes</FieldLabel>
                  <Input
                    id="dietary"
                    placeholder="e.g. vegan, gluten-free"
                    className="mt-2"
                    {...register("dietary")}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="budget" optional>Budget / person</FieldLabel>
                  <Input
                    id="budget"
                    placeholder="Optional"
                    className="mt-2"
                    {...register("budget")}
                  />
                </div>
              </div>

              {/* Row 6 — Hopes textarea */}
              <div>
                <FieldLabel htmlFor="hopes" optional>A note about your hopes</FieldLabel>
                <Textarea
                  id="hopes"
                  placeholder="A few lines about what you're hoping for — pace, intention, any constraints we should know."
                  rows={4}
                  className="mt-2 resize-y text-black placeholder:text-black/70"
                  {...register("hopes")}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                {submitError ? (
                  <p className="font-ui text-sm text-error" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] bg-primary px-7 font-body text-sm text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60",
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send my plan
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27d%20like%20to%20plan%20a%20retreat.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-button)] border border-black text-black px-7 font-body text-sm transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp instead
                  </a>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
