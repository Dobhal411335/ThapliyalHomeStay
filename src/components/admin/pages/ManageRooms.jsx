"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Copy, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function getListingId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.$oid) return value.$oid;
  return String(value);
}

const LISTING_COPY = {
  hotel: {
    headerTitle: "Manage Hotels",
    headerDescription:
      "Create hotels and open the editor to add photos, prices, and amenities.",
    formTitleNew: "New hotel",
    formTitleEdit: "Edit hotel",
    formHint: "Start with a title and code, then complete details in the editor.",
    codeLabel: "Hotel Code",
    titleLabel: "Hotel title",
    titlePlaceholder: "Garden cottage",
    activeHint: "Inactive hotels stay hidden on the website.",
    addLabel: "Add hotel",
    updateLabel: "Update hotel",
    addedToast: "Hotel added.",
    updatedToast: "Hotel updated.",
    addError: "Failed to add hotel.",
    updateError: "Failed to update hotel.",
    listTitle: "All hotels",
    emptyTitle: "No hotels yet",
    emptyHint: "Create your first hotel above.",
    deleteTitle: "Delete hotel ?",
    deletedToast: "Hotel deleted.",
    deleteError: "Failed to delete hotel.",
    tableHead: "Hotel",
    copyAria: "Copy hotel URL",
    deleteAria: "Delete hotel",
    pathPrefix: "/hotel",
  },
  room: {
    headerTitle: "Manage Rooms",
    headerDescription:
      "Create standalone rooms without attaching them to a hotel.",
    formTitleNew: "New room",
    formTitleEdit: "Edit room",
    formHint: "Start with a title and code, then complete details in the editor.",
    codeLabel: "Room Code",
    titleLabel: "Room title",
    titlePlaceholder: "Deluxe room",
    activeHint: "Inactive rooms stay hidden on the website.",
    addLabel: "Add room",
    updateLabel: "Update room",
    addedToast: "Room added.",
    updatedToast: "Room updated.",
    addError: "Failed to add room.",
    updateError: "Failed to update room.",
    listTitle: "All rooms",
    emptyTitle: "No rooms yet",
    emptyHint: "Create your first room above.",
    deleteTitle: "Delete room ?",
    deletedToast: "Room deleted.",
    deleteError: "Failed to delete room.",
    tableHead: "Room",
    copyAria: "Copy room URL",
    deleteAria: "Delete room",
    pathPrefix: "/room",
  },
};

export default function ManageRoom({ listingType: listingTypeProp }) {
  const pathname = usePathname();
  const listingType =
    listingTypeProp === "room" || listingTypeProp === "hotel"
      ? listingTypeProp
      : pathname?.includes("/create_room")
        ? "room"
        : "hotel";
  const copy = LISTING_COPY[listingType] || LISTING_COPY.hotel;
  const { handleSubmit, reset } = useForm();
  const formRef = useRef(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productCode, setProductCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [active, setActive] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchRooms() {
    setLoadingList(true);
    try {
      const response = await fetch(`/api/room?listingType=${listingType}`);
      const data = await response.json();
      const rooms = Array.isArray(data.rooms) ? data.rooms : [];
      setProducts(
        listingType === "room"
          ? rooms.filter((item) => item.listingType === "room")
          : rooms.filter((item) => item.listingType !== "room")
      );
    } catch {
      setProducts([]);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    setProductCode(generateCode());
    fetchRooms();
  }, [listingType]);

  function handleEditProduct(prod) {
    reset({
      title: prod.title || "",
      order: prod.order || 1,
      active: typeof prod.active === "boolean" ? prod.active : true,
    });
    setProductCode(prod.code || "");
    setActive(typeof prod.active === "boolean" ? prod.active : true);
    setOrder(prod.order || 1);
    setTitle(prod.title || "");
    setEditingRoomId(getListingId(prod._id));
    setIsEditing(true);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCancelEdit() {
    reset({ title: "", order: 1, active: true });
    setProductCode(generateCode());
    setActive(true);
    setOrder(1);
    setTitle("");
    setIsEditing(false);
    setEditingRoomId(null);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    toast.success("URL copied.");
  }

  async function deletePackage(id) {
    setDeleting(true);
    try {
      const response = await fetch(`/api/room/${getListingId(id)}`, { method: "DELETE" });
      const result = await response.json();
      if (response.ok) {
        setProducts((prev) => prev.filter((prod) => prod._id !== id));
        toast.success(copy.deletedToast);
        setDeleteTarget(null);
      } else {
        toast.error(result.error || result.message || copy.deleteError);
      }
    } catch {
      toast.error(copy.deleteError);
    } finally {
      setDeleting(false);
    }
  }

  async function onSubmit() {
    if (!title || !productCode) {
      toast.error("Title and code are required.");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        title,
        code: productCode,
        slug: slugify(title),
        listingType,
        order,
        active: typeof active === "boolean" ? active : true,
      };

      if (isEditing) {
        const listingId = getListingId(editingRoomId);
        const response = await fetch(`/api/room/${listingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: payload.title,
            code: payload.code,
            slug: payload.slug,
            listingType: payload.listingType,
            active: payload.active,
          }),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success(copy.updatedToast);
          handleCancelEdit();
          await fetchRooms();
        } else {
          toast.error(result.error || result.message || copy.updateError);
        }
      } else {
        const response = await fetch("/api/room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success(copy.addedToast);
          handleCancelEdit();
          await fetchRooms();
        } else {
          toast.error(result.error || result.message || copy.addError);
        }
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <AdminPageHeader
        title={copy.headerTitle}
        description={copy.headerDescription}
      />

      <form
        ref={formRef}
        className="space-y-5 rounded-card border border-border bg-card p-5 shadow-sm md:p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-medium text-heading">
              {isEditing ? copy.formTitleEdit : copy.formTitleNew}
            </h2>
            <p className="mt-1 font-body text-sm text-muted">
              {copy.formHint}
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
          <div className="space-y-2">
            <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {copy.codeLabel}
            </Label>
            <Input value={productCode} readOnly className="bg-surface font-ui" />
          </div>
          <div className="space-y-2">
            <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {copy.titleLabel}
            </Label>
            <Input
              placeholder={copy.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-input border border-border bg-surface px-4 py-3">
          <div>
            <p className="font-ui text-sm font-medium text-heading">Active</p>
            <p className="font-body text-xs text-muted">
              {copy.activeHint}
            </p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditing ? (
              <Pencil className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {isEditing ? copy.updateLabel : copy.addLabel}
          </Button>
          {isEditing ? (
            <Button type="button" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-xl font-medium text-heading">
            {copy.listTitle}
          </h2>
          <p className="mt-1 font-body text-sm text-muted">
            {products.length} total
          </p>
        </div>

        {loadingList ? (
          <div className="flex min-h-48 items-center justify-center gap-2 font-body text-sm text-muted">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-ui text-heading">#</TableHead>
                <TableHead className="font-ui text-heading">{copy.tableHead}</TableHead>
                <TableHead className="font-ui text-heading">Code</TableHead>
                <TableHead className="font-ui text-heading">URL</TableHead>
                <TableHead className="w-[160px] text-right font-ui text-heading">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((prod, index) => {
                  const url =
                    typeof window !== "undefined"
                      ? `${window.location.origin}${copy.pathPrefix}/${prod.slug || slugify(prod.title)}`
                      : "";
                  return (
                    <TableRow
                      key={prod._id}
                      className={cn(
                        "border-border",
                        index % 2 === 1 && "bg-surface/60"
                      )}
                    >
                      <TableCell className="font-body text-sm text-muted">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-body text-sm text-heading">
                        {prod.title}
                      </TableCell>
                      <TableCell className="font-ui text-sm text-muted">
                        {prod.code}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => copyToClipboard(url)}
                          disabled={!url}
                          aria-label={copy.copyAria}
                        >
                          <Copy className="size-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            nativeButton={false}
                            render={<Link href={`/admin/edit_room/${getListingId(prod._id)}?type=${listingType}`} />}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => handleEditProduct(prod)}
                            aria-label="Quick edit"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8 text-error hover:text-error"
                            onClick={() => setDeleteTarget(prod)}
                            aria-label={copy.deleteAria}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <p className="font-heading text-lg text-heading">
                      {copy.emptyTitle}
                    </p>
                    <p className="mt-1 font-body text-sm text-muted">
                      {copy.emptyHint}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-heading">
              {copy.deleteTitle}
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted">
              This will permanently remove{" "}
              <span className="text-heading">{deleteTarget?.title}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white">
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={deleting}
              onClick={() => deletePackage(deleteTarget?._id)}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
