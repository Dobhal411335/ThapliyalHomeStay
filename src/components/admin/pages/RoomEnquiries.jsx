"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
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
const STATUS_OPTIONS = ["Pending", "Contacted", "Confirmed", "Closed"];

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusBadgeClass(status) {
  if (status === "Contacted" || status === "Confirmed") {
    return "border-primary/30 bg-primary/10 text-primary";
  }
  if (status === "Closed") {
    return "border-border bg-red-400 text-white";
  }
  return "border-warning/30 bg-warning/10 text-warning";
}

function getEnquiryListingType(enquiry) {
  if (enquiry?.listingType === "room" || enquiry?.listingType === "hotel") {
    return enquiry.listingType;
  }
  if (enquiry?.hotel?.listingType === "room") return "room";
  return "hotel";
}

function listingTypeLabel(type) {
  return type === "room" ? "Single room" : "Hotel room";
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

export default function RoomEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedListingType, setSelectedListingType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/room-enquiry");
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
    let list = enquiries;
    if (selectedMonth !== "all") {
      list = monthGroups[selectedMonth] || [];
    }
    if (selectedListingType !== "all") {
      list = list.filter(
        (enquiry) => getEnquiryListingType(enquiry) === selectedListingType
      );
    }
    return list;
  }, [enquiries, monthGroups, selectedMonth, selectedListingType]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonth, selectedListingType, enquiries.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE)
  );
  const currentItems = filteredEnquiries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function resetFilters() {
    setSelectedMonth("all");
    setSelectedListingType("all");
  }

  function handleView(enquiry) {
    setSelectedEnquiry(enquiry);
    setIsOpen(true);
  }

  async function handleDelete(id, fromDialog = false) {
    setDeleting(true);
    try {
      const response = await fetch("/api/room-enquiry", {
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
      const response = await fetch("/api/room-enquiry", {
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

  const guestName = selectedEnquiry
    ? `${selectedEnquiry.firstName || ""} ${selectedEnquiry.lastName || ""}`.trim()
    : "";
  const selectedListingTypeValue = selectedEnquiry
    ? getEnquiryListingType(selectedEnquiry)
    : "hotel";
  const isSingleRoomEnquiry = selectedListingTypeValue === "room";
  const selectedRoomName =
    selectedEnquiry?.room?.name ||
    selectedEnquiry?.roomName ||
    selectedEnquiry?.room?.title ||
    "—";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <AdminPageHeader
        title="Room enquiries"
        description="Booking enquiries submitted from hotel and single room detail pages."
      />

      <div className="flex flex-col gap-4 rounded-card border border-border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="grid w-full gap-3 sm:grid-cols-2 sm:gap-4 lg:max-w-xl">
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
              Listing type
            </label>
            <Select
              value={selectedListingType}
              onValueChange={setSelectedListingType}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="All listings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All listings</SelectItem>
                <SelectItem value="hotel">Hotel rooms</SelectItem>
                <SelectItem value="room">Single rooms</SelectItem>
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
                  <TableHead className="font-ui text-heading">Ref</TableHead>
                  <TableHead className="font-ui text-heading">Type</TableHead>
                  <TableHead className="font-ui text-heading">Hotel</TableHead>
                  <TableHead className="font-ui text-heading">Room</TableHead>
                  <TableHead className="font-ui text-heading">Guest</TableHead>
                  <TableHead className="font-ui text-heading">Arrival</TableHead>
                  <TableHead className="font-ui text-heading">Status</TableHead>
                  <TableHead className="w-[100px] text-right font-ui text-heading">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((enquiry, index) => {
                    const type = getEnquiryListingType(enquiry);
                    const isSingle = type === "room";
                    return (
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
                        <TableCell className="font-ui text-xs text-heading">
                          {enquiry.enquiryId || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-ui text-[10px] uppercase tracking-wide",
                              isSingle
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border bg-surface text-heading"
                            )}
                          >
                            {listingTypeLabel(type)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate font-body text-sm text-heading">
                          {isSingle
                            ? "—"
                            : enquiry.hotelName || enquiry.hotel?.title || "—"}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate font-body text-sm text-heading">
                          {enquiry.room?.name ||
                            enquiry.roomName ||
                            enquiry.room?.title ||
                            "—"}
                        </TableCell>
                        <TableCell className="font-body text-sm text-heading">
                          {enquiry.firstName} {enquiry.lastName}
                        </TableCell>
                        <TableCell className="font-body text-sm text-muted">
                          {formatDate(enquiry.arrival)}
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
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-48">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <Inbox className="size-8 text-muted" />
                        <p className="font-heading text-lg text-heading">
                          No room enquiries yet
                        </p>
                        <p className="font-body text-sm text-muted">
                          New booking enquiries will appear here.
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
              {selectedEnquiry?.enquiryId || "Room booking enquiry"} ·{" "}
              {formatDate(selectedEnquiry?.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedEnquiry && (
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
              <div className="rounded-card border border-border/60 bg-surface p-4">
                <div className="mb-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-ui text-[10px] uppercase tracking-wide",
                      isSingleRoomEnquiry
                        ? "border-primary/30 bg-primary/10 text-primary"
                        : "border-border bg-card text-heading"
                    )}
                  >
                    {listingTypeLabel(selectedListingTypeValue)}
                  </Badge>
                </div>
                {isSingleRoomEnquiry ? null : (
                  <>
                    <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Hotel
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-medium text-heading">
                      {selectedEnquiry.hotelName ||
                        selectedEnquiry.hotel?.title ||
                        "—"}
                    </h3>
                  </>
                )}
                <p
                  className={cn(
                    "font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted",
                    !isSingleRoomEnquiry && "mt-2"
                  )}
                >
                  Room
                </p>
                <h3 className="mt-1 font-heading text-xl font-medium text-heading">
                  {selectedRoomName}
                </h3>
                {selectedEnquiry.roomSnapshot?.code ? (
                  <p className="mt-1 font-ui text-xs text-muted">
                    Code {selectedEnquiry.roomSnapshot.code}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailRow label="Guest" value={guestName} />
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
                    <a
                      href={`tel:${selectedEnquiry.countryCode || ""}${selectedEnquiry.callNo}`}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Phone className="size-3.5" />
                      {selectedEnquiry.countryCode
                        ? `${selectedEnquiry.countryCode} `
                        : ""}
                      {selectedEnquiry.callNo}
                    </a>
                  }
                />
                <DetailRow
                  label="Alt phone"
                  value={
                    selectedEnquiry.countryCode
                      ? `${selectedEnquiry.countryCode} ${selectedEnquiry.altCallNo}`
                      : selectedEnquiry.altCallNo || "—"
                  }
                />
                <DetailRow
                  label="Arrival"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-primary" />
                      {formatDate(selectedEnquiry.arrival)}
                    </span>
                  }
                />
                <DetailRow
                  label="Stay"
                  value={`${selectedEnquiry.days || 0} day(s) · ${selectedEnquiry.roomNo || 0} room(s)`}
                />
                <DetailRow
                  label="Guests"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5 text-primary" />
                      {selectedEnquiry.adult || 0} adult
                      {(selectedEnquiry.child || 0) > 0
                        ? `, ${selectedEnquiry.child} child`
                        : ""}
                      {(selectedEnquiry.infant || 0) > 0
                        ? `, ${selectedEnquiry.infant} infant`
                        : ""}
                    </span>
                  }
                />
                <DetailRow
                  label="Estimated amount"
                  value={
                    selectedEnquiry.estimatedAmount
                      ? `₹${Number(selectedEnquiry.estimatedAmount).toLocaleString("en-IN")}`
                      : "—"
                  }
                />
              </div>

              <Separator />

              <DetailRow
                label="Address"
                value={`${selectedEnquiry.address}, ${selectedEnquiry.city}, ${selectedEnquiry.district}, ${selectedEnquiry.state}`}
              />
              <DetailRow
                label="Special request"
                value={selectedEnquiry.specialReq || "—"}
              />
              <div>
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Offers
                </p>
                {selectedEnquiry.offers?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEnquiry.offers.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="border-border bg-card font-body text-xs text-heading"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 font-body text-sm text-muted">—</p>
                )}
              </div>

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
