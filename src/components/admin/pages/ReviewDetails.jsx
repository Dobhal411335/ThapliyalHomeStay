"use client";

import {
  Calendar,
  Loader2,
  Mail,
  MessageSquare,
  Package,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function RatingStars({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-4",
            star <= rating ? "fill-warning text-warning" : "text-border"
          )}
        />
      ))}
      <span className="ml-1 font-ui text-xs text-muted">({rating}/5)</span>
    </div>
  );
}

function DetailBlock({ icon: Icon, label, children }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {Icon ? <Icon className="size-3.5 text-primary" /> : null}
        {label}
      </h3>
      <div className="mt-2 font-body text-sm text-heading">{children}</div>
    </div>
  );
}

export default function ReviewDetails({
  review,
  onClose,
  onApprove,
  onReject,
  onDelete,
  updating = false,
}) {
  if (!review) return null;

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const isApproved = review.status === "approved";

  return (
    <Dialog
      open={!!review}
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <DialogContent className="flex max-h-[min(90dvh,820px)] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-dialog p-5 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-border/60 px-5 py-4 pr-12">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <DialogTitle className="font-heading text-2xl font-medium text-heading">
                {review.name}
              </DialogTitle>
              <p className="mt-1 font-body text-sm text-muted">
                Package review details
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-border font-ui text-[10px] uppercase tracking-wide text-muted"
            >
              <Calendar className="mr-1 size-3" />
              {formattedDate}
            </Badge>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
          <div className="rounded-card border border-border/60 bg-surface p-4">
            <DetailBlock icon={Package} label="Package">
              {review.packageName || review.package?.packageName || "—"}
            </DetailBlock>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <DetailBlock icon={Star} label="Rating">
              <RatingStars rating={review.rating} />
            </DetailBlock>
            <DetailBlock label="Status">
              <span className="capitalize">{review.status || "pending"}</span>
            </DetailBlock>
            {review.email ? (
              <DetailBlock icon={Mail} label="Email">
                <a
                  href={`mailto:${review.email}`}
                  className="text-primary hover:underline"
                >
                  {review.email}
                </a>
              </DetailBlock>
            ) : null}
            {review.title ? (
              <DetailBlock label="Title">
                {review.title}
              </DetailBlock>
            ) : null}
          </div>

          <Separator />

          <DetailBlock icon={MessageSquare} label="Review">
            <div className="rounded-card border border-border/60 bg-surface p-4">
              <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-heading italic">
                {review.message || "—"}
              </p>
            </div>
          </DetailBlock>
        </div>

        <DialogFooter className="shrink-0 flex-col gap-2 border-t border-border/60 bg-surface px-5 py-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            disabled={updating}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            {!isApproved ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReject}
                  disabled={updating}
                >
                  Reject
                </Button>
                <Button type="button" onClick={onApprove} disabled={updating}>
                  {updating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Approve
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onApprove}
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Set pending
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
