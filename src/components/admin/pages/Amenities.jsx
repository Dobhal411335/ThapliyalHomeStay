"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getHotelAmenityIcon } from "@/lib/hotelAmenityIcons";

export default function Amenities({ roomId }) {
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchAmenities() {
      if (!roomId) return;
      setLoading(true);
      try {
        const amenitiesRes = await fetch("/api/roomAmenities");
        const allAmenities = await amenitiesRes.json();
        const list = Array.isArray(allAmenities)
          ? allAmenities
          : Array.isArray(allAmenities?.data)
            ? allAmenities.data
            : [];
        setAmenitiesList(list);

        const roomRes = await fetch(`/api/room/${roomId}`);
        if (roomRes.ok) {
          const room = await roomRes.json();
          setChecked(
            list.map((item) =>
              Boolean(room.amenities?.some((am) => am.label === item.label))
            )
          );
        } else {
          setChecked(Array(list.length).fill(false));
        }
      } catch {
        setAmenitiesList([]);
        setChecked([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAmenities();
  }, [roomId]);

  useEffect(() => {
    if (amenitiesList.length && checked.length !== amenitiesList.length) {
      setChecked(Array(amenitiesList.length).fill(false));
    }
  }, [amenitiesList, checked.length]);

  function handleCheck(idx) {
    setChecked((prev) => prev.map((val, i) => (i === idx ? !val : val)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const checkedLabels = amenitiesList
        .filter((_, idx) => checked[idx])
        .map((a) => a.label);
      const res = await fetch("/api/roomAmenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, checkedLabels }),
      });
      if (!res.ok) throw new Error("Failed to save amenities");
      toast.success("Amenities saved.");
    } catch (err) {
      toast.error(err.message || "Error saving amenities");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 font-body text-sm text-muted">
        <Loader2 className="size-4 animate-spin text-primary" />
        Loading amenities…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium text-heading">
          Hotel amenities
        </h2>
        <p className="mt-1 font-body text-sm text-muted">
          Select the amenities available for this Hotel.
        </p>
      </div>

      {amenitiesList.length === 0 ? (
        <div className="rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
          <p className="font-heading text-lg text-heading">No amenities found</p>
          <p className="mt-1 font-body text-sm text-muted">
            Add amenity records first, then assign them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {amenitiesList.map((item, idx) => {
            const Icon = getHotelAmenityIcon(item.label);
            return (
              <label
                key={item.label}
                htmlFor={`amenity-${idx}`}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-card border border-border bg-surface px-4 py-3 transition-colors hover:border-primary/40",
                  checked[idx] && "border-primary/50 bg-primary/5"
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-card text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-body text-sm font-medium text-heading">
                    {item.label}
                  </span>
                </span>
                <Checkbox
                  id={`amenity-${idx}`}
                  checked={!!checked[idx]}
                  onCheckedChange={() => handleCheck(idx)}
                />
              </label>
            );
          })}
        </div>
      )}

      <Button type="submit" disabled={saving || amenitiesList.length === 0}>
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save amenities"
        )}
      </Button>
    </form>
  );
}
