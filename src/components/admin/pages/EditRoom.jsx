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
import CreateRoom from "./CreateRoom.jsx"
const sections = [
  { key: "info", label: "Basic Info", icon: BedDouble },
  { key: "create_room", label: "Create Hotel Room", icon: Hotel },
  { key: "quantity", label: "Price", icon: IndianRupee },
  { key: "amenities", label: "Amenities", icon: Sparkles },
];

export default function EditRoom({ roomId }) {
  const router = useRouter();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("info");

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);
    fetch(`/api/room/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setRoomData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roomId]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <AdminPageHeader
        title={roomData?.title || "Edit hotel"}
        description="Update hotel details, pricing, and amenities."
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/manage_hotels")}
          >
            <ArrowLeft className="size-4" />
            Back to hotels
          </Button>
        }
      />

      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-2 rounded-card border border-border bg-card font-body text-sm text-muted">
          <Loader2 className="size-4 animate-spin text-primary" />
          Loading hotel
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
              <RoomInfo roomData={roomData} roomId={roomId} />
            ) : null}
            {activeSection === "create_room" ? (
              <CreateRoom roomData={roomData} roomId={roomId} hotelId={roomId} />
            ) : null}
            
            {activeSection === "quantity" ? (
              <RoomPrice roomData={roomData} roomId={roomId} />
            ) : null}
            {activeSection === "amenities" ? (
              <Amenities roomData={roomData} roomId={roomId} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
