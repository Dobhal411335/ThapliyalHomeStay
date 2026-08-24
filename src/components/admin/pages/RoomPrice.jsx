"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const EMPTY_PRICES = {
  "01 Pax": { price: "", oldPrice: "", cgst: "", sgst: "" },
  "02 Pax": { price: "", oldPrice: "", cgst: "", sgst: "" },
  "Extra Bed": { price: "", oldPrice: "", cgst: "", sgst: "" },
};

export default function RoomPrice({ roomData, roomId }) {
  const [showExtraBed, setShowExtraBed] = useState(false);
  const [prices, setPrices] = useState(EMPTY_PRICES);
  const [editablePax, setEditablePax] = useState("01 Pax");
  const [saving, setSaving] = useState(false);
  const roomName = roomData?.title || "";

  useEffect(() => {
    async function fetchRoomPrice() {
      if (!roomId) return;
      try {
        const res = await fetch(`/api/roomPrice?product=${roomId}`);
        const data = await res.json();
        if (data && Array.isArray(data.prices)) {
          const next = { ...EMPTY_PRICES };
          data.prices.forEach((p) => {
            if (next[p.type]) {
              next[p.type] = {
                price: p.amount?.toString() ?? "",
                oldPrice: p.oldPrice?.toString() ?? "",
                cgst: p.cgst?.toString() ?? "",
                sgst: p.sgst?.toString() ?? "",
              };
            }
          });
          setPrices(next);
          setShowExtraBed(!!data.prices.find((p) => p.type === "Extra Bed"));
        }
      } catch {
        /* ignore */
      }
    }
    fetchRoomPrice();
  }, [roomId]);

  function updatePrice(type, field, value) {
    setPrices((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const allVariants = ["01 Pax", "02 Pax", "Extra Bed"].map((type) => ({
        type,
        amount: prices[type].price ? Number(prices[type].price) : 0,
        oldPrice: prices[type].oldPrice ? Number(prices[type].oldPrice) : 0,
        cgst: prices[type].cgst ? Number(prices[type].cgst) : 0,
        sgst: prices[type].sgst ? Number(prices[type].sgst) : 0,
      }));

      const variants = allVariants.filter((v) => {
        if (v.type === "Extra Bed" && !showExtraBed) return false;
        return v.amount || v.oldPrice || v.cgst || v.sgst;
      });

      const res = await fetch("/api/roomPrice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room: roomId, prices: variants }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || error.message || "Failed to save price");
      }

      toast.success("Hotel price saved.");
    } catch (err) {
      toast.error(err.message || "Failed to save price");
    } finally {
      setSaving(false);
    }
  }

  const rows = ["01 Pax", "02 Pax", ...(showExtraBed ? ["Extra Bed"] : [])];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium text-heading">
          Hotel price
        </h2>
        <p className="mt-1 font-body text-sm text-muted">
          Set nightly rates for occupancy types.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
          Hotel name
        </Label>
        <Input value={roomName || "Hotel name not found"} disabled className="bg-surface" />
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-surface px-4 py-3">
        {["01 Pax", "02 Pax"].map((type) => (
          <label
            key={type}
            className="flex cursor-pointer items-center gap-2 font-body text-sm text-heading"
          >
            <input
              type="radio"
              name="editablePax"
              checked={editablePax === type}
              onChange={() => setEditablePax(type)}
              className="accent-primary"
            />
            Edit {type}
          </label>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-2 font-body text-sm text-heading">
          <Checkbox
            checked={showExtraBed}
            onCheckedChange={(value) => setShowExtraBed(Boolean(value))}
          />
          Extra bed
        </label>
      </div>

      <div className="overflow-hidden rounded-card border border-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead className="bg-surface">
              <tr className="border-b border-border">
                {["Price for", "New price", "Old price", "CGST %", "SGST %"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-muted"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((type, index) => {
                const disabled = type !== "Extra Bed" && editablePax !== type;
                return (
                  <tr
                    key={type}
                    className={cn(
                      "border-b border-border last:border-0",
                      index % 2 === 1 && "bg-surface/40"
                    )}
                  >
                    <td className="px-4 py-3 font-body text-sm font-medium text-heading">
                      {type}
                    </td>
                    {["price", "oldPrice", "cgst", "sgst"].map((field) => (
                      <td key={field} className="px-4 py-3">
                        <Input
                          type="number"
                          min={0}
                          className="w-28 bg-card"
                          value={prices[type][field]}
                          disabled={disabled}
                          onChange={(e) =>
                            updatePrice(type, field, e.target.value)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Button type="submit" disabled={saving || !roomId}>
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Save prices"
        )}
      </Button>
    </form>
  );
}
