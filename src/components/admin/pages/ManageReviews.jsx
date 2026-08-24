"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Loader2,
  Star,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import ReviewDetails from "@/components/admin/pages/ReviewDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusBadgeClass(status) {
  if (status === "approved") {
    return "border-primary/30 bg-primary/10 text-primary";
  }
  if (status === "rejected") {
    return "border-error/30 bg-error/10 text-error";
  }
  return "border-warning/30 bg-warning/10 text-warning";
}

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/saveReviews");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch reviews.");
      }

      setReviews(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setReviews([]);
      toast.error(error.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    if (statusFilter === "all") return reviews;
    return reviews.filter((review) => review.status === statusFilter);
  }, [reviews, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, reviews.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / ITEMS_PER_PAGE)
  );
  const currentItems = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  async function handleToggleApproved(review) {
    const nextApproved = review.status !== "approved";
    setUpdatingId(review._id);
    try {
      const response = await fetch("/api/saveReviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: review._id,
          approved: nextApproved,
          status: nextApproved ? "approved" : "pending",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update review.");
      }

      toast.success(nextApproved ? "Review approved." : "Review set to pending.");
      await fetchReviews();
      if (selectedReview?._id === review._id && result.data) {
        setSelectedReview(result.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update review.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleStatusChange(review, status) {
    setUpdatingId(review._id);
    try {
      const response = await fetch("/api/saveReviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: review._id, status }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status.");
      }

      toast.success(`Review marked as ${status}.`);
      await fetchReviews();
      if (selectedReview?._id === review._id && result.data) {
        setSelectedReview(result.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/saveReviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: deleteTarget._id }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete review.");
      }

      toast.success("Review deleted.");
      if (selectedReview?._id === deleteTarget._id) setSelectedReview(null);
      setDeleteTarget(null);
      await fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <AdminPageHeader
        title="Manage Reviews"
        description="Approve guest package reviews before they appear on the website."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm text-muted">
          {filteredReviews.length} review
          {filteredReviews.length === 1 ? "" : "s"}
          {statusFilter !== "all" ? ` · ${statusFilter}` : ""}
        </p>
        <div className="flex items-center gap-3">
          <span className="font-ui text-xs font-medium text-muted">Status</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 font-body text-sm text-muted">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading reviews…
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-ui text-heading">Date</TableHead>
                  <TableHead className="font-ui text-heading">Package</TableHead>
                  <TableHead className="font-ui text-heading">Guest</TableHead>
                  <TableHead className="font-ui text-heading">Rating</TableHead>
                  <TableHead className="font-ui text-heading">Status</TableHead>
                  <TableHead className="font-ui text-heading">Approved</TableHead>
                  <TableHead className="w-[120px] text-right font-ui text-heading">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((review, index) => (
                    <TableRow
                      key={review._id}
                      className={cn(
                        "border-border",
                        index % 2 === 1 && "bg-surface/60"
                      )}
                    >
                      <TableCell className="font-body text-sm text-muted">
                        {formatDate(review.createdAt)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-body text-sm text-heading">
                        {review.packageName ||
                          review.package?.packageName ||
                          "—"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-body text-sm text-heading">
                            {review.name}
                          </p>
                          {review.title ? (
                            <p className="line-clamp-1 font-body text-xs text-muted">
                              {review.title}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 font-ui text-sm text-heading">
                          <Star className="size-3.5 fill-warning text-warning" />
                          {review.rating}.0
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-ui text-[10px] uppercase tracking-wide",
                            statusBadgeClass(review.status)
                          )}
                        >
                          {review.status || "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={review.status === "approved"}
                          disabled={updatingId === review._id}
                          onCheckedChange={() => handleToggleApproved(review)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setSelectedReview(review)}
                            aria-label="View review"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8 text-error hover:text-error"
                            onClick={() => setDeleteTarget(review)}
                            aria-label="Delete review"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Inbox className="size-8 text-muted" />
                        <p className="font-heading text-lg text-heading">
                          No reviews found
                        </p>
                        <p className="font-body text-sm text-muted">
                          Guest package reviews will appear here for approval.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {filteredReviews.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <p className="font-ui text-xs text-muted">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedReview ? (
        <ReviewDetails
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onApprove={() => handleToggleApproved(selectedReview)}
          onReject={() => handleStatusChange(selectedReview, "rejected")}
          onDelete={() => setDeleteTarget(selectedReview)}
          updating={updatingId === selectedReview._id}
        />
      ) : null}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-heading">
              Delete review?
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted">
              This will remove the review from{" "}
              <span className="text-heading">{deleteTarget?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
