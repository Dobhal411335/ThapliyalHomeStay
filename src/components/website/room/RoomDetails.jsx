"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bath,
  Bed,
  Coffee,
  Copy,
  Luggage,
  Mail,
  MessageCircle,
  ParkingCircle,
  Phone,
  Share2,
  ShowerHead,
  Snowflake,
  Tv,
  Utensils,
  Wifi,
  Loader2,
  Wind,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import BookingDetails from "@/components/website/room/BookingDetails";
import { useCompanyBasicInfo } from "@/providers/CompanyBasicInfoProvider";

const amenityIcons = {
  Restaurant: Utensils,
  Bed,
  "Room Phone": Phone,
  Parking: ParkingCircle,
  Shower: ShowerHead,
  "Towel In Room": Bath,
  "Wi-Fi": Wifi,
  Television: Tv,
  "Bath Tub": Bath,
  Elevator: Luggage,
  Laggage: Luggage,
  "Tea Maker": Coffee,
  "Room AC": Snowflake,
  // Bedding
  "Plush mattresses": Bed,
  "clean linens": Bed,
  "extra pillows": Bed,
  "blackout curtains": Bed,
  // Climate Control
  "Air conditioning": Wind,
  "Room Heating": Wind,
  // Furniture & Setup
  "Work desk with a chair": Briefcase,
  "luggage rack": Briefcase,
  "Wardrobe": Briefcase,
  "Full-length mirror": Briefcase,
  // Bathroom
  "Shampoo": Bath,
  "Conditioner": Bath,
  "Body wash/soap": Bath,
  "Dental kit": Bath,
  "Shaving kit": Bath,
  "Bath Towels": Bath,
  "Hand towels": Bath,
  "Bath mats": Bath,
  "Hairdryer": Bath,
  "Bathrobes": Bath,
  "Bathroom Slippers": Bath,
  // Electronics & Comfort
  "Free high-speed Wi-Fi": Tv,
  "Smart TV": Tv,
  "Bedside power outlets": Tv,
  "USB charging ports": Tv,
  "Tea/coffee maker": Tv,
  "Bottled water": Tv,
  "Mini-fridge or minibar": Tv,
  "Electronic safe deposit box": Tv,
  "Iron and ironing board": Tv,
  // Other Features
  "Window": Coffee,
  "Balcony": Coffee,
  "Sofa / Chair / Table": Coffee,
  "News Paper": Coffee,
};

function formatPrice(value) {
  if (value == null || value === "") return "—";
  return `₹${new Intl.NumberFormat("en-IN").format(Number(value) || 0)}`;
}

/** Renders occupancy labels with "Pax" in primary color, e.g. 01 Pax */
function PaxLabel({ value, className }) {
  const text = String(value || "");
  const match = text.match(/^(.*?)(\s*)(Pax)$/i);
  if (!match) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {match[1]}
      {match[2]}
      <span className="text-heading">{match[3]}</span>
    </span>
  );
}

function stripHtmlPreview(html = "", wordLimit = 36) {
  const text = String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean);
  if (words.length <= wordLimit) {
    return { preview: text, truncated: false, words };
  }
  return {
    preview: `${words.slice(0, wordLimit).join(" ")}…`,
    truncated: true,
    words,
  };
}

export default function RoomDetailView({ data }) {
  const companyInfo = useCompanyBasicInfo();
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [expertForm, setExpertForm] = useState({
    name: "",
    email: "",
    phone: "",
    need: "Appointment",
    question: "",
    contactMethod: "Phone",
  });
  const [submittingExpert, setSubmittingExpert] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [rooms, setRooms] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [carouselApi, setCarouselApi] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const mainPhotoUrl = data?.mainPhoto?.url || data?.mainPhotot?.url || "";
  const allImagesRaw = [
    mainPhotoUrl,
    ...(data?.relatedPhotos?.map((img) => img.url) || []),
  ];
  const allImages = allImagesRaw.filter(
    (img) => typeof img === "string" && img.trim().length > 0
  );
  const gallery = allImages.length ? allImages : [];

  const priceRows = data?.prices?.[0]?.prices || [];
  const baseRate =
    priceRows.find((p) => p.type === "01 Pax") ||
    priceRows.find((p) => p.type === "02 Pax");
  const maxOccupancy = priceRows.some((p) => p.type === "02 Pax")
    ? "02 Pax"
    : priceRows.some((p) => p.type === "01 Pax")
      ? "01 Pax"
      : "—";
  const extraBed = priceRows.some((p) => p.type === "Extra Bed");
  const descriptionMeta = stripHtmlPreview(data?.paragraph || "");
  const preview = descriptionMeta?.preview || "";
  const isTruncated = Boolean(descriptionMeta?.truncated);

  useEffect(() => {
    if (typeof window !== "undefined" && data?.slug) {
      setProductUrl(`${window.location.origin}/hotel/${data.slug}`);
    }
  }, [data?.slug]);

  useEffect(() => {
    if (data?.rooms) {
      setRooms(data.rooms);
    } else if (data?.slug) {
      fetch(`/api/room/relatedRooms?slug=${encodeURIComponent(data.slug)}`)
        .then((res) => res.json())
        .then((res) => setRooms(res.relatedRooms || []))
        .catch(() => setRooms([]));
    }
  }, [data?.slug, data?.rooms]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setActiveImageIdx(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    setActiveImageIdx(carouselApi.selectedScrollSnap());
    return () => carouselApi.off("select", onSelect);
  }, [carouselApi]);

  useEffect(() => {
    if (!showShareBox) return;
    function handleClick(e) {
      const pop = document.getElementById("share-popover");
      if (pop && !pop.contains(e.target)) setShowShareBox(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showShareBox]);


  const whatsappMessage = [
    "Dear Reservations Team,",
    "",
    "Greetings For Hotel Kedar Heaven!",
    "",
    "We are writing to inquire about room availability at your esteemed property for our upcoming dates. Could you please share the availability status along with the pricing details for your Deluxe Room category?",
    "",
    "We look forward to your prompt response so we can proceed with our travel plans.",
    "",
    "--- Details ---",
    `Room: ${data?.title || "—"}`,
    data?.code ? `Code: ${data.code}` : null,
    baseRate
      ? `Base rate: ${formatPrice(baseRate.amount)} / night (${baseRate.type})`
      : null,
    data?.slug ? `Page: ${process.env.NEXT_PUBLIC_SITE_URL}/hotel/${data.slug}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return (
    <div className="min-h-screen bg-background font-body">
      <Section spacing="sm">
        <Container>
          <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:gap-10 min-w-0">
            {/* Gallery — left */}
            <div className="min-w-0 w-full overflow-hidden">
              <div className="relative overflow-hidden rounded-image bg-surface w-full">
                {gallery.length > 0 ? (
                  <Carousel
                    className="w-full"
                    opts={{ loop: true }}
                    plugins={[Autoplay({ delay: 4500 })]}
                    setApi={setCarouselApi}
                  >
                    <CarouselContent>
                      {gallery.map((img, idx) => (
                        <CarouselItem key={`${img}-${idx}`}>
                          <div className="relative aspect-square md:aspect-[4/3] w-full">
                            <Image
                              src={img}
                              alt={`${data.title} image ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 55vw"
                              priority={idx === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {gallery.length > 1 ? (
                      <>
                        <CarouselPrevious className="left-3 z-10 size-10 border-0 bg-card/90 text-heading shadow-sm hover:bg-card" />
                        <CarouselNext className="right-3 z-10 size-10 border-0 bg-card/90 text-heading shadow-sm hover:bg-card" />
                      </>
                    ) : null}
                  </Carousel>
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center font-body text-sm text-muted">
                    No images available
                  </div>
                )}
              </div>

              {gallery.length > 1 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((img, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      type="button"
                      onClick={() => carouselApi?.scrollTo(idx)}
                      className={cn(
                        "relative size-14 shrink-0 overflow-hidden rounded-image border transition-colors sm:size-16",
                        activeImageIdx === idx
                          ? "border-primary"
                          : "border-border"
                      )}
                    >
                      <Image
                        src={img}
                        alt={`${data.title} thumb ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Details — right */}
            <aside className="space-y-4 lg:sticky lg:top-24 min-w-0">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h1 className="font-heading text-3xl font-medium leading-tight text-heading md:text-4xl">
                    {data?.title}
                  </h1>
                  {data?.code ? (
                    <span className="shrink-0 rounded-full border border-border bg-white px-3 py-1 font-ui text-xs tracking-wider uppercase text-muted shadow-sm">
                      Code: {data.code}
                    </span>
                  ) : null}
                </div>
                {data?.name && (
                  <h2 className="font-body text-lg text-muted">{data.name}</h2>
                )}
              </div>

              {data?.heading ? (
                <p className="font-body text-base text-muted md:text-md">
                  {data.heading}
                </p>
              ) : null}

              {data?.paragraph ? (
                <div className="font-body text-sm leading-relaxed text-heading">
                  {showFullDesc || !isTruncated ? (
                    <div
                      className="prose custom-desc-list max-w-none font-body text-sm leading-relaxed text-heading [&_li]:text-heading [&_p]:text-heading [&_span]:text-heading"
                      dangerouslySetInnerHTML={{ __html: data.paragraph }}
                    />
                  ) : (
                    <p className="prose custom-desc-list max-w-none font-body text-sm leading-relaxed text-heading [&_li]:text-heading [&_p]:text-heading [&_span]:text-heading">{preview}</p>
                  )}
                  {isTruncated ? (
                    <button
                      type="button"
                      className="mt-2 font-ui text-sm font-medium text-primary hover:underline"
                      onClick={() => setShowFullDesc((v) => !v)}
                    >
                      {showFullDesc ? "Show less" : "Read more"}
                    </button>
                  ) : null}
                </div>
              ) : (
                <p className="font-body text-sm text-muted">No Description</p>
              )}
              <p className="font-heading text-lg font-medium text-black md:text-xl">
                {baseRate ? (
                  <>
                    Room Base Rate for{" "}
                    <PaxLabel value={baseRate.type} />{" "}
                    {formatPrice(baseRate.amount)}
                  </>
                ) : (
                  "Rate available on enquiry"
                )}
              </p>

              <div className="overflow-hidden rounded-2xl border border-border bg-surface/50">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface">
                    <tr>
                      <th className="border-b border-r border-border px-4 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
                        Person
                      </th>
                      <th className="border-b border-border px-4 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
                        Price For Night
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {["01 Pax", "02 Pax", "Extra Bed"].map((type) => {
                      const row = priceRows.find((p) => p.type === type);
                      if (!row) return null;
                      return (
                        <tr key={type} className="border-b border-border bg-transparent last:border-b-0">
                          <td className="border-r border-border px-4 py-3 font-body text-sm font-medium text-gray-800">
                            <PaxLabel value={type} />
                          </td>
                          <td className="px-4 py-3 font-body text-sm font-medium text-gray-800">
                            {formatPrice(row.amount)}
                          </td>
                        </tr>
                      );
                    })}
                    {priceRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-3 py-4 font-body text-sm text-muted"
                        >
                          Pricing will appear once configured.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {(data.amenities || []).length > 0 ? (
                <div className="pt-2">
                  <h2 className="font-heading text-lg font-medium text-heading">
                    Room Amenities
                  </h2>
                  <TooltipProvider>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(data.amenities || []).map((am, i) => {
                        const Icon = amenityIcons[am.label] || Bed;
                        return (
                          <Tooltip key={am._id || i}>
                            <TooltipTrigger className="bg-white size-[42px] rounded-2xl flex items-center justify-center cursor-default border border-border transition-colors hover:border-primary/50 shadow-sm text-heading">
                              <Icon className="size-4 text-muted" />
                            </TooltipTrigger>
                            <TooltipContent className="font-body text-xs">{am.label}</TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              ) : null}

              <div className="space-y-1 font-body text-sm text-muted pt-2">
                <p>
                  Max occupancy:{" "}
                  <PaxLabel value={maxOccupancy} className="font-medium text-heading" />
                </p>
                <p>Extra bed available: <span className="text-heading">{extraBed ? "Yes" : "No"}</span></p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-full text-black border-gray-700 hover:bg-white transition-colors"
                    nativeButton={false}
                    render={
                      <a
                        href={`https://wa.me/${(companyInfo?.contactNumbers?.[0] || "").replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </Button>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-surface/50 border-border hover:bg-white transition-colors"
                      onClick={() => setShowShareBox((prev) => !prev)}
                      aria-label="Share room"
                    >
                      <Share2 className="size-4" />
                    </Button>
                    {showShareBox ? (
                      <div
                        id="share-popover"
                        className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-border bg-white p-4 shadow-md"
                      >
                        <p className="font-ui text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                          Share room
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Input
                            value={productUrl}
                            readOnly
                            className="bg-surface text-xs"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(productUrl);
                              toast.success("Link copied.");
                            }}
                          >
                            <Copy className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="bg-surface">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-card border border-gray-500 bg-card p-6">
              <h3 className="font-heading text-xl font-medium text-heading">
                Stay notes
              </h3>
              <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-muted">
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Check-in
                  </p>
                  <p className="mt-1">
                    Guests receive arrival guidance before check-in. Front desk
                    staff will greet you on arrival.
                  </p>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Pets
                  </p>
                  <p className="mt-1">Pets are not allowed.</p>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Children
                  </p>
                  <p className="mt-1">
                    Children are welcome. Extra bedding may be available on
                    request.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-card border border-gray-500 bg-card p-6">
              <h3 className="font-heading text-xl font-medium text-heading">
                Timings
              </h3>
              <div className="mt-5 space-y-4 font-body text-sm leading-relaxed text-muted">
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Check-in
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>From 12:00 PM</li>
                    <li>Early check-in subject to availability</li>
                  </ul>
                </div>
                <div>
                  <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-heading">
                    Check-out
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    <li>Before 11:00 AM</li>
                    <li>Late check-out subject to availability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {rooms.length > 0 ? (
        <Section spacing="md">
          <Container>
            <h2 className="font-heading text-3xl font-medium text-heading">
              Our Rooms
            </h2>
            <p className="mt-2 font-body text-sm text-muted mb-8">
              Explore the rooms available at {data?.title || companyInfo?.companyName || "our retreat"}.
            </p>
            <div className="w-full flex flex-col gap-6">
              {rooms.map((room, idx) => {
                const imageUrls = [
                  ...(room.mainPhoto?.url ? [room.mainPhoto.url] : []),
                  ...(room.relatedPhotos?.length ? room.relatedPhotos.map(photo => photo.url) : [])
                ];
                if (imageUrls.length === 0) imageUrls.push('');

                return (
                  <div key={room._id || idx} className="relative flex flex-col md:flex-row bg-[#f8f5ef] rounded-2xl p-5 md:items-start gap-6 shadow-lg border border-gray-200">
                    {/* Image Carousel */}
                    <div className="relative md:w-[420px] md:h-[290px] h-[250px] py-2 shrink-0 flex items-center justify-center rounded-xl overflow-hidden bg-gray-100">
                      <Carousel className="w-full h-full" opts={{ loop: true }}>
                        <CarouselContent>
                          {imageUrls.map((img, i) => (
                            <CarouselItem key={i} className="w-full h-full flex items-center justify-center">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={room.title || 'Room'}
                                  width={420}
                                  height={290}
                                  className="object-cover w-full h-full rounded-xl"
                                  priority={i === 0}
                                />
                              ) : (
                                <div className="flex w-full h-full items-center justify-center text-muted">
                                  <Loader2 className="animate-spin mr-2" /> No Image Available
                                </div>
                              )}
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full border border-white bg-white/30 text-black backdrop-blur-sm hover:bg-white/50" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full border border-white bg-white/30 text-black backdrop-blur-sm hover:bg-white/50" />
                      </Carousel>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-3 justify-between relative min-h-[260px]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <h3 className="font-heading text-2xl font-medium text-heading md:text-4xl">{room.name || "Room"}</h3>
                          {room.name && <h4 className="font-body text-md text-muted">{room.title}</h4>}
                        </div>
                        {room.code && (
                          <div className="shrink-0 rounded-full border border-border bg-white px-3 py-1 font-ui text-xs uppercase tracking-wider text-muted shadow-sm">
                            Code: {room.code}
                          </div>
                        )}
                      </div>

                      {room.paragraph && (
                        <div className="prose custom-desc-list max-w-none font-body text-sm leading-relaxed text-heading [&_li]:text-heading [&_p]:text-heading [&_span]:text-heading mt-2" dangerouslySetInnerHTML={{ __html: room.paragraph }} />
                      )}

                      {room.amenities?.length > 0 && (
                        <>
                          <div className="mt-4 font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Room Amenities</div>
                          <TooltipProvider>
                            <div className="flex gap-2 flex-wrap mt-2">
                              {room.amenities.map((am, i) => {
                                const label = typeof am === 'string' ? am : am.label;
                                const Icon = amenityIcons[label] || Bed;
                                return (
                                  <Tooltip key={i}>
                                    <TooltipTrigger className="bg-white px-3 py-1.5 rounded-full font-body text-xs flex items-center justify-center cursor-default border border-border gap-1.5 transition-colors hover:border-primary/50 shadow-sm text-heading">
                                      <Icon className="size-3.5" />
                                      {label}
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      {label}
                                    </TooltipContent>
                                  </Tooltip>
                                )
                              })}
                            </div>
                          </TooltipProvider>
                        </>
                      )}

                      <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4 sm:flex-row sm:gap-6">
                        <span className="font-body text-sm text-muted">
                          Single Occupancy: <strong className="font-heading text-lg font-medium text-heading">{formatPrice(room.singleOccupancyPrice)}</strong>
                        </span>
                        <span className="font-body text-sm text-muted">
                          Double Occupancy: <strong className="font-heading text-lg font-medium text-heading">{formatPrice(room.doubleOccupancyPrice)}</strong>
                        </span>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-end gap-2">
                        <Button
                          className="rounded-button"
                          onClick={() => {
                            setSelectedRoom(room);
                            setBookingOpen(true);
                          }}
                        >
                          Book Room
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>
      ) : null}
      {bookingOpen && selectedRoom ? (
        <BookingDetails hotel={data} room={selectedRoom} onClose={() => {
          setBookingOpen(false);
          setSelectedRoom(null);
        }} />
      ) : null}
    </div>
  );
}
