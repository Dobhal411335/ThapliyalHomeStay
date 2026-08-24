"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Loader2,
  Mail,
  Phone,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;
const STATUS_OPTIONS = ["Pending", "Contacted", "Closed"];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusBadgeClass(status) {
  if (status === "Contacted") {
    return "border-primary/30 bg-primary/10 text-primary";
  }
  if (status === "Closed") {
    return "border-border bg-muted text-muted";
  }
  return "border-warning/30 bg-warning/10 text-warning";
}

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="space-y-1">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <div className="font-body text-sm text-heading">{value}</div>
    </div>
  );
}

export default function ContactUsPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact-enquiry");
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch enquiries.");
      }
      setEnquiries(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setEnquiries([]);
      setError(err.message || "Something went wrong.");
      toast.error(err.message || "Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const monthGroups = useMemo(() => {
    const groups = {};
    enquiries.forEach((enquiry) => {
      const date = new Date(enquiry.createdAt);
      const key = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(enquiry);
    });
    return groups;
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    let list =
      selectedMonth === "all" ? enquiries : monthGroups[selectedMonth] || [];

    if (selectedStatus !== "all") {
      list = list.filter((item) => (item.status || "Pending") === selectedStatus);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.phone?.toLowerCase().includes(query) ||
          item.countryCode?.toLowerCase().includes(query) ||
          item.plan?.toLowerCase().includes(query)
      );
    }

    return list;
  }, [enquiries, monthGroups, selectedMonth, selectedStatus, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedStatus, search, enquiries.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE)
  );
  const currentItems = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleView(enquiry) {
    setSelectedEnquiry(enquiry);
    setIsOpen(true);
  }

  async function handleDelete(id, fromDialog = false) {
    setDeleting(true);
    try {
      const response = await fetch("/api/contact-enquiry", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || "Failed to delete enquiry.");
        return;
      }
      setEnquiries((prev) => prev.filter((item) => item._id !== id));
      toast.success("Enquiry deleted.");
      if (fromDialog) {
        setIsOpen(false);
        setSelectedEnquiry(null);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleStatusChange(status) {
    if (!selectedEnquiry?._id) return;
    setUpdatingStatus(true);
    try {
      const response = await fetch("/api/contact-enquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedEnquiry._id, status }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message || "Failed to update status.");
        return;
      }
      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === selectedEnquiry._id ? { ...item, status } : item
        )
      );
      setSelectedEnquiry((prev) => (prev ? { ...prev, status } : prev));
      toast.success("Status updated.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setUpdatingStatus(false);
    }
  }

  function resetFilters() {
    setSelectedMonth("all");
    setSelectedStatus("all");
    setSearch("");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <AdminPageHeader
        title="Contact enquiries"
        description="Stay enquiries submitted from the contact page."
      />

      <div className="flex flex-col gap-4 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="grid w-full gap-3 sm:grid-cols-3 sm:gap-4 lg:max-w-3xl">
          <div className="space-y-1.5">
            <label className="font-ui text-xs font-medium text-muted">
              Search
            </label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, email, phone…"
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-ui text-xs font-medium text-muted">
              Month
            </label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="All months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All months</SelectItem>
                {Object.keys(monthGroups).map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="font-ui text-xs font-medium text-muted">
              Status
            </label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-body text-sm text-muted">
            {filteredEnquiries.length} enquir
            {filteredEnquiries.length === 1 ? "y" : "ies"}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-2 font-body text-sm text-muted">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading enquiries…
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-body text-sm text-error">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchEnquiries}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-ui text-heading">Date</TableHead>
                  <TableHead className="font-ui text-heading">Guest</TableHead>
                  <TableHead className="font-ui text-heading">Email</TableHead>
                  <TableHead className="font-ui text-heading">Guests</TableHead>
                  <TableHead className="font-ui text-heading">Plan</TableHead>
                  <TableHead className="font-ui text-heading">Status</TableHead>
                  <TableHead className="w-[100px] text-right font-ui text-heading">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((enquiry, index) => (
                    <TableRow
                      key={enquiry._id}
                      className={cn(
                        "border-border",
                        index % 2 === 1 && "bg-surface/60"
                      )}
                    >
                      <TableCell className="font-body text-sm text-muted">
                        {formatDate(enquiry.createdAt)}
                      </TableCell>
                      <TableCell className="font-body text-sm text-heading">
                        {enquiry.name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-body text-sm text-muted">
                        {enquiry.email}
                      </TableCell>
                      <TableCell className="font-body text-sm text-muted">
                        {enquiry.guests}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate font-body text-sm text-heading">
                        {enquiry.plan || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-ui text-[10px] uppercase tracking-wide",
                            statusBadgeClass(enquiry.status)
                          )}
                        >
                          {enquiry.status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => handleView(enquiry)}
                          aria-label="View enquiry"
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Inbox className="size-8 text-muted" />
                        <p className="font-heading text-lg text-heading">
                          No contact enquiries yet
                        </p>
                        <p className="font-body text-sm text-muted">
                          Submissions from the contact page will appear here.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {filteredEnquiries.length > ITEMS_PER_PAGE && (
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

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSelectedEnquiry(null);
        }}
      >
        <DialogContent className="flex max-h-[min(90dvh,820px)] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-dialog p-4 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-border/60 px-5 py-4 pr-12">
            <DialogTitle className="font-heading text-2xl font-medium text-heading">
              Enquiry details
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted">
              Contact page · {formatDate(selectedEnquiry?.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Guest" value={selectedEnquiry.name} />
                <DetailRow
                  label="Email"
                  value={
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Mail className="size-3.5" />
                      {selectedEnquiry.email}
                    </a>
                  }
                />
                <DetailRow
                  label="Phone"
                  value={
                    selectedEnquiry.phone ? (
                      <a
                        href={`tel:${selectedEnquiry.countryCode || ""}${selectedEnquiry.phone}`}
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        <Phone className="size-3.5" />
                        {selectedEnquiry.countryCode ? `${selectedEnquiry.countryCode} ` : ""}
                        {selectedEnquiry.phone}
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <DetailRow
                  label="Guests"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" />
                      {selectedEnquiry.guests}
                    </span>
                  }
                />
                <DetailRow
                  label="Plan of interest"
                  value={selectedEnquiry.plan || "—"}
                />
                <DetailRow
                  label="Preferred start date"
                  value={selectedEnquiry.startDate || "—"}
                />
              </div>

              <Separator />

              <DetailRow
                label="What are they hoping for?"
                value={selectedEnquiry.hopes || "—"}
              />

              <div className="space-y-2">
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Status
                </p>
                <Select
                  value={selectedEnquiry.status || "Pending"}
                  onValueChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="w-full max-w-xs bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="shrink-0 border-t border-border/60 bg-surface px-5 py-4 sm:justify-between">
            <Button
              type="button"
              variant="destructive"
              disabled={deleting || !selectedEnquiry}
              onClick={() => handleDelete(selectedEnquiry?._id, true)}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
