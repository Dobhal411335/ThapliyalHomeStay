"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import jsPDF from "jspdf";
import { Download, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value) {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function Row({ label, value }) {
  return (
    <>
      <div className="border-b border-border bg-surface px-3 py-2.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </div>
      <div className="border-b border-border px-3 py-2.5 font-body text-sm text-heading">
        {value || "—"}
      </div>
    </>
  );
}

export default function InvoiceModal({
  open,
  onClose,
  booking,
  bookingId,
  bookingDate,
}) {
  const invoiceRef = useRef(null);
  const exportRef = useRef(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!open) return null;

  const roomName =
    booking?.roomName || booking?.room?.title || booking?.packageName || "";
  const numAdult = Number(booking?.adult) || 0;
  const numChild = Number(booking?.child) || 0;
  const numInfant = Number(booking?.infant) || 0;
  const guests = [
    numAdult ? `${numAdult} Adult${numAdult > 1 ? "s" : ""}` : null,
    numChild ? `${numChild} Child${numChild > 1 ? "ren" : ""}` : null,
    numInfant ? `${numInfant} Infant${numInfant > 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const arrival = formatDate(booking?.arrival);
  const days = booking?.days || "";
  const numRoom = booking?.numRoom || booking?.roomNo || 1;
  const main = booking?.priceBreakdown?.main || {};
  const extrabed = booking?.priceBreakdown?.extraBed || null;
  const baseAmount =
    booking?.finalAmount ||
    booking?.estimatedAmount ||
    booking?.payment?.amount ||
    main?.amount ||
    booking?.roomSnapshot?.price ||
    0;
  const extrabedAmount = extrabed?.amount || 0;
  const hasExtraBed = extrabedAmount > 0;
  const invoiceNumber = booking?.invoiceNumber || bookingId;

  async function handleDownloadPdf() {
    setIsExportingPdf(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const html2canvas = (await import("html2canvas")).default;
      const exportElement = exportRef.current;
      if (!exportElement) return;

      const canvas = await html2canvas(exportElement, {
        scale: 2,
        backgroundColor: "#FCFAF6",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(
        pdfWidth / canvas.width,
        pdfHeight / canvas.height
      );
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      pdf.addImage(
        imgData,
        "PNG",
        (pdfWidth - imgWidth) / 2,
        20,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      pdf.save(`Enquiry-${invoiceNumber || "Room"}.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  }

  const invoiceBody = (
    <div className="space-y-5 font-body text-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div>
          <div className="relative mb-3 h-12 w-36 overflow-hidden rounded-card bg-surface">
            <Image
              src="/logo.png"
              alt="ThapliyalHomeStay"
              fill
              className="object-contain p-2"
              sizes="144px"
            />
          </div>
          <p className="font-heading text-xl font-medium text-heading">
            Thanks for your enquiry
          </p>
          <div className="mt-3 space-y-1 font-body text-sm text-muted">
            <p>
              <span className="text-heading">Name:</span> {booking?.firstName}{" "}
              {booking?.lastName}
            </p>
            <p>
              <span className="text-heading">Call:</span> {booking?.countryCode ? `${booking?.countryCode} ` : ""}{booking?.callNo}
            </p>
            <p>
              <span className="text-heading">Email:</span> {booking?.email}
            </p>
            <p>
              <span className="text-heading">Address:</span> {booking?.address}
            </p>
          </div>
          <p className="mt-3 font-ui text-xs text-muted">
            Ref:{" "}
            <span className="font-semibold text-heading">{invoiceNumber}</span>
          </p>
        </div>
        <div className="space-y-2 text-left font-body text-sm text-muted sm:text-right">
          <p>
            <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-heading">
              Enquiry no
            </span>
            <br />
            {bookingId}
          </p>
          <p>
            <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-heading">
              Date
            </span>
            <br />
            {formatDate(bookingDate)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 overflow-hidden rounded-card border border-border">
        <Row label="Room" value={roomName} />
        <Row label="Arrival" value={arrival} />
        {days ? <Row label="Days" value={days} /> : null}
        <Row label="Rooms" value={numRoom} />
        <Row label="Guests" value={guests || "—"} />
        <Row label="Estimated total" value={formatMoney(baseAmount)} />
        {hasExtraBed ? (
          <Row label="Extra bed" value={formatMoney(extrabedAmount)} />
        ) : null}
        {booking?.offers?.length ? (
          <Row label="Offers" value={booking.offers.join(", ")} />
        ) : null}
      </div>

      <p className="font-body text-xs leading-relaxed text-muted">
        Please treat this as your enquiry acknowledgement. Our team will confirm
        availability and next steps. Keep this copy for your records.
      </p>
      <p className="text-center font-ui text-[11px] text-muted">
        Automated acknowledgement · © {new Date().getFullYear()} ThapliyalHomeStay
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-heading/40 p-3 supports-backdrop-filter:backdrop-blur-xs">
      <div
        ref={invoiceRef}
        className={cn(
          "relative w-full max-w-2xl rounded-dialog border border-border bg-card p-5 shadow-sm md:p-8",
          !isExportingPdf && "max-h-[92dvh] overflow-y-auto"
        )}
      >
        {!isExportingPdf ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full border border-border bg-surface p-1.5 text-muted transition-colors hover:text-heading"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        ) : null}

        {invoiceBody}

        {!isExportingPdf ? (
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              disabled={isExportingPdf}
              onClick={handleDownloadPdf}
            >
              {isExportingPdf ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              Download PDF
            </Button>
          </div>
        ) : null}

        {isExportingPdf ? (
          <div
            ref={exportRef}
            className="fixed left-[-9999px] top-0 z-[-1] w-[700px] bg-card p-8"
          >
            {invoiceBody}
          </div>
        ) : null}
      </div>
    </div>
  );
}
