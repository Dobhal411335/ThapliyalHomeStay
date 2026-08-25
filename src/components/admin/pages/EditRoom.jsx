"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  IndianRupee,
  Hotel,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { cn } from "@/lib/utils";
import RoomInfo from "./RoomInfo.jsx";
import RoomPrice from "./RoomPrice.jsx";
import Amenities from "./Amenities.jsx";
import CreateRoom from "./CreateRoom.jsx";

const HOTEL_SECTIONS = [
  { key: "info", label: "Basic Info", icon: BedDouble },
  { key: "create_room", label: "Create Hotel Room", icon: Hotel },
  { key: "quantity", label: "Price", icon: IndianRupee },
  { key: "amenities", label: "Amenities", icon: Sparkles },
];

const ROOM_SECTIONS = [
  { key: "info", label: "Basic Info", icon: BedDouble },
  { key: "create_room", label: "Create Room", icon: Hotel },
  { key: "quantity", label: "Price", icon: IndianRupee },
  { key: "amenities", label: "Amenities", icon: Sparkles },
];

function resolveMode(roomData, initialMode) {
  if (roomData?.listingType === "room") return "room";
  if (roomData) return "hotel";
  if (initialMode === "room" || initialMode === "hotel") return initialMode;
  return null;
}

export default function EditRoom({ roomId, initialMode = null }) {
  const router = useRouter();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomId));
  const [activeSection, setActiveSection] = useState("info");
  const mode = resolveMode(roomData, initialMode);
  const isSingleRoom = mode === "room";
  const sections = isSingleRoom ? ROOM_SECTIONS : HOTEL_SECTIONS;
  const backHref =
    mode === "room"
      ? "/admin/create_room"
      : mode === "hotel"
        ? "/admin/manage_hotels"
        : "/admin/manage_hotels";

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/room/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.error) {
          setRoomData(null);
        } else {
          setRoomData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRoomData(null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <AdminPageHeader
        title={
          roomData?.title ||
          (mode === "room"
            ? "Edit room"
            : mode === "hotel"
              ? "Edit hotel"
              : "Edit listing")
        }
        description={
          mode === "room"
            ? "Update room details, pricing, and amenities."
            : mode === "hotel"
              ? "Update hotel details, pricing, and amenities."
              : "Loading listing details."
        }
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(backHref)}
          >
            <ArrowLeft className="size-4" />
            {mode === "room"
              ? "Back to rooms"
              : mode === "hotel"
                ? "Back to hotels"
                : "Back"}
          </Button>
        }
      />

      {loading || !roomData ? (
        <div className="flex min-h-64 items-center justify-center gap-2 rounded-card border border-border bg-card font-body text-sm text-muted">
          <Loader2 className="size-4 animate-spin text-primary" />
          {loading
            ? `Loading ${mode === "room" ? "room" : mode === "hotel" ? "hotel" : "listing"}`
            : "Listing not found"}
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 rounded-card border border-border bg-card p-2 lg:w-56">
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => setActiveSection(section.key)}
                    className={cn(
                      "inline-flex min-w-max flex-1 items-center gap-2 rounded-button px-4 py-2.5 text-left font-ui text-sm transition-colors lg:w-full lg:flex-none",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-heading hover:bg-surface"
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 rounded-card border border-border bg-card p-4 shadow-sm md:p-6">
            {activeSection === "info" ? (
              <RoomInfo roomData={roomData} roomId={roomId} mode={mode} />
            ) : null}
            {activeSection === "create_room" ? (
              <CreateRoom
                roomData={roomData}
                roomId={roomId}
                hotelId={roomId}
                mode={mode}
              />
            ) : null}
            {activeSection === "quantity" ? (
              <RoomPrice roomData={roomData} roomId={roomId} mode={mode} />
            ) : null}
            {activeSection === "amenities" ? (
              <Amenities roomData={roomData} roomId={roomId} mode={mode} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
