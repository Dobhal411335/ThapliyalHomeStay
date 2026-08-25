"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  ArrowUpRight,
  Loader2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { countryCodes } from "@/lib/countryCodes";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";

const schema = z.object({
  packageName: z.string().min(1),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  countryCode: z.string().min(1, "Country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10,15}$/, "Enter a valid phone number (10–15 digits)"),
  guests: z.string().min(1, "Please select number of guests"),
  dates: z.string().optional(),
  accommodation: z.string().optional(),
  hopes: z.string().optional(),
});

const guestOptions = [
  "1 guest",
  "2 guests",
  "3 guests",
  "4 guests",
  "5 guests",
  "6+ guests",
];

const accommodationOptions = [
  "1 room - single occupancy",
  "2 rooms - single occupancy",
  "1 room - double occupancy",
  "2 rooms - double occupancy",
];


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

export default function PackageEnquiryModal({
  open,
  onOpenChange,
  packageDetails,
}) {
  const companyInfo = useCompanyBasicInfo();
  const whatsappNumber = (companyInfo?.whatsappNumber || companyInfo?.contactNumbers?.[0] || "").replace(/\D/g, "");
  const [submitted, setSubmitted] = useState(false);

  const packageName = packageDetails?.packageName || "";
  const packageImage =  
    packageDetails?.basicDetails?.thumbnail?.url ||
    packageDetails?.gallery?.[0]?.url ||
    packageDetails?.basicDetails?.imageBanner?.url ||
    "";
  const location = packageDetails?.basicDetails?.location || "";
  const duration = packageDetails?.basicDetails?.duration;
  const tourType = packageDetails?.basicDetails?.tourType || "";
  const price = packageDetails?.price;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      packageName,
      countryCode: "+91",
      phone: "",
      guests: "1 guest",
      accommodation: "",
    },
  });

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      reset({
        packageName,
        name: "",
        email: "",
        countryCode: "+91",
        phone: "",
        guests: "1 guest",
        dates: "",
        accommodation: "",
        hopes: "",
      });
    }
  }, [open, packageName, reset]);

  async function onSubmit(data) {
    try {
      if (!packageDetails?._id) {
        toast.error("Package information is missing.");
        return;
      }

      const response = await fetch("/api/package-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: packageDetails._id,
          packageName: data.packageName || packageName,
          packageSnapshot: {
            image: packageImage,
            location,
            duration,
            tourType,
            price,
            priceUnit: packageDetails?.priceUnit || "",
            doubleOccupancyPrice: packageDetails?.doubleOccupancyPrice || 0,
          },
          name: data.name,
          email: data.email,
          countryCode: data.countryCode,
          phone: data.phone,
          guests: data.guests,
          dates: data.dates || "",
          accommodation: data.accommodation || "",
          hopes: data.hopes || "",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Failed to send enquiry.");
        return;
      }

      setSubmitted(true);
      toast.success("Enquiry sent — we'll reply within 24 hours.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN").format(number || 0);

  const packageMeta = (
    <div className="flex flex-col gap-2 font-body text-sm text-muted">
      {location && (
        <p className="inline-flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-primary" />
          {location}
        </p>
      )}
      {duration != null && duration !== "" && (
        <p>
          Duration:{" "}
          <span className="text-heading">
            {duration} Days / {Math.max(Number(duration) - 1, 0)} Nights
          </span>
        </p>
      )}
      {tourType && (
        <p>
          Category: <span className="text-heading">{tourType}</span>
        </p>
      )}
      {typeof price === "number" && (
        <div className="flex flex-col gap-1">
          {packageDetails?.priceUnit === "Double Occupancy Per Person Price Only" && packageDetails?.doubleOccupancyPrice > 0 ? (
            <>
              <p>
                Single Occupancy:{" "}
                <span className="font-heading text-xl text-heading">
                  {price === 0 ? "XXXX*" : `₹${formatNumber(price)}*`}
                </span>
              </p>
              <p>
                Double Occupancy:{" "}
                <span className="font-heading text-xl text-heading">
                  {`₹${formatNumber(packageDetails.doubleOccupancyPrice)}*`}
                </span>
              </p>
            </>
          ) : (
            <p>
              From:{" "}
              <span className="font-heading text-xl text-heading">
                {price === 0 ? "XXXX*" : `₹${formatNumber(price)}*`}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex! h-[min(92dvh,900px)] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden rounded-dialog bg-background p-0 sm:max-w-5xl lg:max-w-6xl"
      >
        <DialogHeader className="shrink-0 border-b border-border/60 px-4 py-4 pr-12 sm:px-5 md:px-6">
          <DialogTitle className="font-heading text-2xl font-medium text-heading md:text-3xl">
            Make an enquiry
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted">
            Tell us a little about your stay. We&apos;ll craft a quiet reply
            within a day.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full overflow-hidden py-2 bg-white/50 border-b border-red-100">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="mx-4 text-sm font-medium text-red-600 uppercase tracking-wider">
              ongoing retreat-join on any day with advance booking
            </span>
            <span className="mx-4 text-sm font-medium text-red-600 uppercase tracking-wider">
              ongoing retreat-join on any day with advance booking
            </span>
            <span className="mx-4 text-sm font-medium text-red-600 uppercase tracking-wider">
              ongoing retreat-join on any day with advance booking
            </span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left — scrollable form */}
          <div className="min-h-0 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5 md:px-6 md:py-6">
            {/* Mobile package preview */}
            <div className="mb-6 flex gap-3 rounded-card border border-border/60 bg-surface p-3 lg:hidden">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-image bg-border/40">
                {packageImage ? (
                  <Image
                    src={packageImage}
                    alt={packageName || "Package"}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Enquiring for
                </p>
                <h3 className="mt-1 truncate font-heading text-lg font-medium text-heading">
                  {packageName}
                </h3>
                <div className="mt-1 space-y-0.5 font-body text-xs text-muted">
                  {location && <p className="truncate">{location}</p>}
                  {duration != null && duration !== "" && (
                    <p>
                      {duration} Days / {Math.max(Number(duration) - 1, 0)} Nights
                    </p>
                  )}
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="flex min-h-80 flex-col items-center justify-center py-12 text-center">
                <span className="font-heading text-5xl text-primary">✦</span>
                <h3 className="mt-6 font-heading text-3xl text-heading">
                  We&apos;ve received your enquiry.
                </h3>
                <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-muted">
                  We&apos;ll reach out within 24 hours with a calm plan for{" "}
                  <span className="text-heading">{packageName}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="mt-8 inline-flex h-11 items-center rounded-button bg-primary px-7 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="flex flex-col gap-6 pb-2">
                  <div>
                    <FieldLabel htmlFor="enquiry-packageName">
                      Package
                    </FieldLabel>
                    <Input
                      id="enquiry-packageName"
                      className="mt-2 bg-surface"
                      readOnly
                      {...register("packageName")}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="enquiry-name">Your name</FieldLabel>
                      <Input
                        id="enquiry-name"
                        placeholder="Enter Your Name"
                        className="mt-2"
                        {...register("name")}
                        aria-invalid={!!errors.name}
                      />
                      <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="enquiry-email">Email</FieldLabel>
                      <Input
                        id="enquiry-email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-2"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="enquiry-phone">Phone</FieldLabel>
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
                                className="w-[110px] rounded-l-button rounded-r-none border-0 border-r border-border focus:ring-0 bg-transparent"
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
                          id="enquiry-phone"
                          type="tel"
                          inputMode="numeric"
                          placeholder="98XXXXXXXX"
                          className="flex-1 rounded-l-none border-0 focus-visible:ring-0 bg-transparent"
                          {...register("phone")}
                          aria-invalid={!!errors.phone}
                        />
                      </div>
                      <FieldError message={errors.countryCode?.message} />
                      <FieldError message={errors.phone?.message} />
                    </div>
                    <div>
                      <FieldLabel htmlFor="enquiry-guests">Guests</FieldLabel>
                      <Controller
                        name="guests"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? "1 guest"}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="enquiry-guests"
                              className="mt-2 w-full"
                            >
                              <SelectValue placeholder="1 guest" />
                            </SelectTrigger>
                            <SelectContent>
                              {guestOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="enquiry-dates" optional>
                      Preferred dates
                    </FieldLabel>
                    <div className="mt-2">
                      <Controller
                        name="dates"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            id="enquiry-dates"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Pick a preferred date"
                            disablePast
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <FieldLabel htmlFor="enquiry-accommodation" optional>
                        Accommodation
                      </FieldLabel>
                      <Controller
                        name="accommodation"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              id="enquiry-accommodation"
                              className="mt-2 w-full"
                            >
                              <SelectValue placeholder="Choose" />
                            </SelectTrigger>
                            <SelectContent>
                              {accommodationOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="enquiry-hopes" optional>
                      A note about your hopes
                    </FieldLabel>
                    <Textarea
                      id="enquiry-hopes"
                      placeholder="A few lines about what you're hoping for — pace, intention, any constraints we should know."
                      rows={4}
                      className="mt-2 resize-y"
                      {...register("hopes")}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-button bg-primary px-7 font-body text-sm text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      )}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2
                            className="size-4 animate-spin"
                            aria-hidden="true"
                          />
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
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        [
                          "Namaste 🙏",
                          "",
                          "I hope you're well. I'd like to enquire about the following package:",
                          "",
                          `Package: ${packageName || "—"}`,
                          location ? `Location: ${location}` : null,
                          duration != null && duration !== ""
                            ? `Duration: ${duration} Days / ${Math.max(Number(duration) - 1, 0)} Nights`
                            : null,
                          tourType ? `Category: ${tourType}` : null,
                          typeof price === "number"
                            ? `Price: ${price === 0 ? "XXXX*" : `₹${formatNumber(price)} / Adult`}`
                            : null,
                          "",
                          "Could you please share availability and more details?",
                          "",
                          "Thank you!",
                        ]
                          .filter((line) => line !== null)
                          .join("\n")
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-button border border-border px-6 font-body text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:w-auto"
                    >
                      <MessageCircle className="size-4" aria-hidden="true" />
                      WhatsApp instead
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Desktop — package summary */}
          <aside className="hidden min-h-0 overflow-y-auto overscroll-contain border-l border-border/60 bg-surface lg:block">
            <div className="p-5">
              <div className="relative mx-auto h-40 w-full max-w-xs overflow-hidden rounded-image bg-border/40">
                {packageImage ? (
                  <Image
                    src={packageImage}
                    alt={packageName || "Package"}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-ui text-sm text-muted">
                    No image available
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Enquiring for
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-medium leading-snug text-heading">
                    {packageName}
                  </h3>
                </div>

                {packageMeta}

                {packageDetails?.basicDetails?.smallDesc && (
                  <div
                    className="line-clamp-4 font-body text-sm leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof packageDetails.basicDetails.smallDesc === "string"
                          ? packageDetails.basicDetails.smallDesc
                          : "",
                    }}
                  />
                )}
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
