"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { format, parse } from "date-fns";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import InvoiceModal from "./InvoiceModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { statesIndia } from "@/lib/IndiaStates";
import { cn } from "@/lib/utils";
import { countryCodes } from "@/lib/countryCodes";

const STEPS = ["Stay", "Guest", "Extras", "Review"];
const OFFERS = [
  "Rafting",
  "Local Sightseeing",
  "Pickup Require",
  "Dropp Off Require",
  "Bike On Rent",
  "Yoga Classes",
  "Spa & Massage",
];
const INITIAL = {
  arrival: "",
  roomNo: 1,
  days: 1,
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  callNo: "",
  altCallNo: "",
  address: "",
  city: "",
  district: "",
  state: "",
  adult: "",
  infant: "",
  child: "",
  specialReq: "",
  offers: [],
};

function fromPrice(room) {
  return Number(room?.doubleOccupancyPrice) || Number(room?.singleOccupancyPrice) || 0;
}

function Err({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1 font-ui text-xs text-destructive" role="alert">
      {message}
    </p>
  );
}

function Field({ id, label, error, className, children }) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="font-ui text-xs uppercase tracking-wider text-muted">
        {label}
      </Label>
      {children}
      <Err message={error} />
    </div>
  );
}

function Stepper({ label, value, min = 1, onChange, error }) {
  return (
    <Field label={label} error={error}>
      <div className="mt-2 flex items-center gap-2 rounded-button border border-border bg-card px-2 py-1">
        <Button type="button" variant="ghost" size="icon" className="size-8 rounded-button" onClick={() => onChange(Math.max(min, Number(value) - 1))}>
          <Minus className="size-4" />
        </Button>
        <span className="flex-1 text-center font-heading text-lg text-heading">{value}</span>
        <Button type="button" variant="ghost" size="icon" className="size-8 rounded-button" onClick={() => onChange(Number(value) + 1)}>
          <Plus className="size-4" />
        </Button>
      </div>
    </Field>
  );
}

const BookingDetails = ({ hotel, room, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [enquiryId, setEnquiryId] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);

  const roomName = room?.name || room?.title || "Room";
  const roomImg = room?.mainPhoto?.url || " ";
  const roomCode = room?.code || "";
  const price = useMemo(() => fromPrice(room), [room]);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));
  const toggleOffer = (offer) =>
    setForm((p) => ({
      ...p,
      offers: p.offers.includes(offer) ? p.offers.filter((o) => o !== offer) : [...p.offers, offer],
    }));

  const validate = (current = step) => {
    const e = {};
    if (current === 1) {
      if (!form.arrival) e.arrival = "Arrival date is required";
      if (!form.roomNo || Number(form.roomNo) < 1) e.roomNo = "At least 1 room is required";
      if (!form.days || Number(form.days) < 1) e.days = "Stay must be at least 1 day";
    }
    if (current === 2) {
      if (!form.firstName.trim()) e.firstName = "First name is required";
      if (!form.lastName.trim()) e.lastName = "Last name is required";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.callNo.trim()) e.callNo = "Phone number is required";
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.district.trim()) e.district = "District is required";
      if (!form.state) e.state = "State is required";
      if (!form.adult || Number(form.adult) < 1) e.adult = "At least 1 adult is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setErrors({});
    setStep((s) => Math.min(4, s + 1));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const booking = {
    ...form,
    hotelName: hotel?.title || "Hotel",
    hotel,
    roomName,
    room,
    numRoom: form.roomNo,
    roomId: room?._id,
    hotelId: hotel?._id,
    estimatedAmount: price * Number(form.days || 1) * Number(form.roomNo || 1),
    finalAmount: price * Number(form.days || 1) * Number(form.roomNo || 1),
    roomSnapshot: { image: roomImg, code: roomCode, price },
  };

  const submit = async () => {
    if (!validate(2)) {
      setStep(2);
      return;
    }
    setSubmitting(true);
    try {
      const estimatedAmount =
        price * Number(form.days || 1) * Number(form.roomNo || 1);
      const res = await fetch("/api/room-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          roomNo: Number(form.roomNo),
          days: Number(form.days),
          adult: Number(form.adult) || 0,
          infant: Number(form.infant) || 0,
          child: Number(form.child) || 0,
          hotelId: hotel?._id,
          hotelName: hotel?.title || "Hotel",
          roomId: room?._id,
          roomName,
          estimatedAmount,
          roomSnapshot: { image: roomImg, code: roomCode, price },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success)
        throw new Error(json?.message || "Failed to submit enquiry");
      setEnquiryId(String(json?.data?.enquiryId || json?.data?._id || ""));
      setBookingDate(new Date());
      setSuccess(true);
      toast.success(json?.message || "Enquiry submitted successfully");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const topGuestFields = [
    ["firstName", "First name"],
    ["lastName", "Last name"],
    ["email", "Email", "email"],
  ];

  const bottomGuestFields = [
    ["altCallNo", "Alt. phone"],
    ["address", "Address"],
    ["city", "City"],
    ["district", "District"],
  ];

  return (
    <>
      <Dialog open onOpenChange={(o) => !o && onClose?.()}>
        <DialogContent
          showCloseButton
          className="max-h-[90dvh] w-full max-w-4xl overflow-y-auto rounded-dialog bg-surface p-2 sm:max-w-4xl"
        >
          <div className="w-full overflow-hidden py-2 rounded-t-dialog bg-white/50 border-b border-red-100">
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
          <DialogHeader className="border-b border-border px-5 py-4 sm:px-6">
            <DialogTitle className="font-heading text-xl text-heading md:text-2xl">
              {success ? "Enquiry received" : "Room enquiry"}
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted">
              {success
                ? "Our team will review your request and get back to you shortly."
                : `Step ${step} of 4 — ${STEPS[step - 1]}`}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="space-y-5 px-5 py-8 sm:px-6">
              <p className="font-body text-sm text-muted">
                Enquiry reference:{" "}
                <span className="font-ui font-semibold text-heading">{enquiryId || "—"}</span>
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" className="rounded-button" onClick={() => setShowInvoice(true)}>
                  View invoice
                </Button>
                <Button type="button" variant="outline" className="rounded-button" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1.2fr_0.8fr] sm:px-6">
              <div className="min-w-0 space-y-5">
                <div className="flex gap-2">
                  {STEPS.map((label, i) => (
                    <div
                      key={label}
                      title={label}
                      className={cn("h-1.5 flex-1 rounded-full bg-border", i + 1 <= step && "bg-primary")}
                    />
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <Field id="arrival" label="Arrival date" error={errors.arrival}>
                      <DatePicker
                        id="arrival"
                        value={form.arrival}
                        onChange={(value) => set("arrival", value)}
                        placeholder="Pick arrival date"
                        disablePast
                        className="mt-2 rounded-button bg-card"
                      />
                    </Field>
                    <Stepper label="Number of rooms" value={form.roomNo} onChange={(v) => set("roomNo", v)} error={errors.roomNo} />
                    <Stepper label="Number of days" value={form.days} onChange={(v) => set("days", v)} error={errors.days} />
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {topGuestFields.map(([key, label, type = "text"]) => (
                      <Field key={key} id={key} label={label} error={errors[key]} className={key === "address" || key === "email" ? "sm:col-span-2" : undefined}>
                        <Input id={key} type={type} className="mt-2 rounded-button bg-card" value={form[key]} onChange={(e) => set(key, e.target.value)} />
                      </Field>
                    ))}
                    <Field id="callNo" label="Phone" error={errors.callNo}>
                      <div className="mt-2 flex rounded-button border border-border bg-card">
                        <Select value={form.countryCode} onValueChange={(v) => set("countryCode", v)}>
                          <SelectTrigger className="w-[110px] rounded-l-button rounded-r-none border-0 border-r border-border focus:ring-0 bg-transparent">
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
                        <Input
                          id="callNo"
                          type="tel"
                          className="flex-1 rounded-l-none border-0 focus-visible:ring-0 bg-transparent"
                          value={form.callNo}
                          onChange={(e) => set("callNo", e.target.value)}
                        />
                      </div>
                    </Field>
                    {bottomGuestFields.map(([key, label, type = "text"]) => (
                      <Field key={key} id={key} label={label} error={errors[key]} className={key === "address" ? "sm:col-span-2" : undefined}>
                        <Input id={key} type={type} className="mt-2 rounded-button bg-card" value={form[key]} onChange={(e) => set(key, e.target.value)} />
                      </Field>
                    ))}
                    <Field label="State" error={errors.state} className="sm:col-span-2">
                      <Select value={form.state} onValueChange={(v) => set("state", v)}>
                        <SelectTrigger className="mt-2 w-full rounded-button bg-card">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {statesIndia.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    {[
                      ["adult", "Adults"],
                      ["child", "Children"],
                      ["infant", "Infants"],
                    ].map(([key, label]) => (
                      <Field key={key} id={key} label={label} error={errors[key]}>
                        <Input id={key} type="number" min={0} className="mt-2 rounded-button bg-card" value={form[key]} onChange={(e) => set(key, e.target.value)} />
                      </Field>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <Field id="specialReq" label="Special requests">
                      <Textarea id="specialReq" className="mt-2 min-h-28 rounded-card bg-card" value={form.specialReq} onChange={(e) => set("specialReq", e.target.value)} placeholder="Anything we should know?" />
                    </Field>
                    <div>
                      <p className="font-ui text-xs uppercase tracking-wider text-muted">Optional add-ons</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {OFFERS.map((offer) => (
                          <label key={offer} className="flex cursor-pointer items-center gap-2.5 font-body text-sm text-heading">
                            <Checkbox checked={form.offers.includes(offer)} onCheckedChange={() => toggleOffer(offer)} />
                            {offer}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-2 rounded-card border border-border bg-card p-4 font-body text-sm text-heading">
                    <p>
                      <span className="text-muted">Arrival:</span>{" "}
                      {form.arrival
                        ? format(parse(form.arrival, "yyyy-MM-dd", new Date()), "PPP")
                        : "—"}
                    </p>
                    <p><span className="text-muted">Rooms / Days:</span> {form.roomNo} / {form.days}</p>
                    <p><span className="text-muted">Guest:</span> {form.firstName} {form.lastName}</p>
                    <p><span className="text-muted">Contact:</span> {form.email} · {form.callNo}</p>
                    <p><span className="text-muted">Address:</span> {form.address}, {form.city}, {form.district}, {form.state}</p>
                    <p>
                      <span className="text-muted">Guests:</span> {form.adult} adult(s)
                      {form.child ? `, ${form.child} child` : ""}
                      {form.infant ? `, ${form.infant} infant` : ""}
                    </p>
                    {form.specialReq ? <p><span className="text-muted">Requests:</span> {form.specialReq}</p> : null}
                    {form.offers.length > 0 ? <p><span className="text-muted">Add-ons:</span> {form.offers.join(", ")}</p> : null}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  {step > 1 && (
                    <Button type="button" variant="outline" className="rounded-button" onClick={back} disabled={submitting}>
                      Back
                    </Button>
                  )}
                  {step < 4 ? (
                    <Button type="button" className="flex-1 rounded-button" onClick={next}>Continue</Button>
                  ) : (
                    <Button type="button" className="flex-1 rounded-button" onClick={submit} disabled={submitting}>
                      {submitting ? "Submitting…" : "Submit enquiry"}
                    </Button>
                  )}
                </div>
              </div>

              <aside className="rounded-card border border-border bg-card p-4">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-card bg-surface">
                  <Image src={roomImg} alt={roomName} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 320px" />
                </div>
                <h3 className="font-heading text-lg text-heading">{roomName}</h3>
                {roomCode ? (
                  <p className="mt-1 font-ui text-xs uppercase tracking-wider text-muted">Code {roomCode}</p>
                ) : null}
                <p className="mt-3 font-body text-sm text-heading">
                  From{" "}
                  <span className="font-heading text-xl text-black font-bold">₹{price.toLocaleString("en-IN")}</span>
                  <span className="text-muted"> / night</span>
                </p>
              </aside>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <InvoiceModal
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        booking={booking}
        bookingId={enquiryId}
        bookingDate={bookingDate || new Date()}
      />
    </>
  );
};

export default BookingDetails;
