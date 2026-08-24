"use client";

import { useState } from "react";
import { CircleCheckBig, Loader2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z
    .string()
    .trim()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Please enter a valid email",
    }),
  title: z.string().optional(),
  message: z.string().min(5, "Please write a short review"),
});

export default function ReviewForm({ packageId, packageName }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      message: "",
    },
  });

  async function onSubmit(data) {
    if (rating < 1) {
      toast.error("Please select a rating.");
      return;
    }

    if (!packageId) {
      toast.error("Package information is missing.");
      return;
    }

    try {
      const response = await fetch("/api/saveReviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email || "",
          title: data.title || "",
          message: data.message,
          rating,
          packageId,
          packageName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Failed to submit review.");
        return;
      }

      reset();
      setRating(0);
      setIsSubmitted(true);
      toast.success("Review submitted — pending admin approval.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-card border border-border bg-surface px-5 py-10 text-center">
        <CircleCheckBig className="mx-auto size-12 text-primary" />
        <h4 className="mt-4 font-heading text-2xl font-medium text-heading">
          Thank you for your review
        </h4>
        <p className="mt-2 font-body text-sm text-muted">
          Your feedback is pending approval and will appear once reviewed.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => setIsSubmitted(false)}
        >
          Write another review
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-card border border-border bg-surface p-5 md:p-6"
    >
      <div>
        <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Your rating
        </Label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="rounded-sm p-0.5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={cn(
                  "size-6",
                  star <= (hoveredRating || rating)
                    ? "fill-warning text-warning"
                    : "text-border"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="review-name"
            className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
          >
            Name
          </Label>
          <Input
            id="review-name"
            placeholder="Your name"
            {...register("name")}
            aria-invalid={!!errors.name}
          />
          {errors.name ? (
            <p className="font-ui text-xs text-error" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="review-email"
            className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
          >
            Email{" "}
            <span className="font-normal normal-case tracking-normal text-muted/70">
              (optional)
            </span>
          </Label>
          <Input
            id="review-email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email ? (
            <p className="font-ui text-xs text-error" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="review-title"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          Title{" "}
          <span className="font-normal normal-case tracking-normal text-muted/70">
            (optional)
          </span>
        </Label>
        <Input
          id="review-title"
          placeholder="A quiet week by the Ganga"
          {...register("title")}
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="review-message"
          className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
        >
          Your review
        </Label>
        <Textarea
          id="review-message"
          rows={4}
          placeholder="Share what stayed with you after the retreat…"
          className="resize-y"
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message ? (
          <p className="font-ui text-xs text-error" role="alert">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting || rating === 0}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  );
}
