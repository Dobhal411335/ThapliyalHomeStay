"use client";

import { useEffect, useRef, useState } from "react";
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

export default function ManageRoom() {
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
      const response = await fetch("/api/room");
      const data = await response.json();
      setProducts(Array.isArray(data.rooms) ? data.rooms : []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    setProductCode(generateCode());
    fetchRooms();
  }, []);

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
    setEditingRoomId(prod._id || null);
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
      const response = await fetch(`/api/room/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (response.ok) {
        setProducts((prev) => prev.filter((prod) => prod._id !== id));
        toast.success("Room deleted.");
        setDeleteTarget(null);
      } else {
        toast.error(result.error || result.message || "Failed to delete room.");
      }
    } catch {
      toast.error("Failed to delete room.");
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
        order,
        active: typeof active === "boolean" ? active : true,
      };

      if (isEditing) {
        const response = await fetch(`/api/room/${editingRoomId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: productCode, ...payload }),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success("Hotel updated.");
          handleCancelEdit();
          await fetchRooms();
        } else {
          toast.error(result.message || "Failed to update hotel.");
        }
      } else {
        const response = await fetch("/api/room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok) {
          toast.success("Hotel added.");
          handleCancelEdit();
          await fetchRooms();
        } else {
          toast.error(result.error || result.message || "Failed to add hotel.");
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
        title="Manage Hotels"
        description="Create hotels and open the editor to add photos, prices, and amenities."
      />

      <form
        ref={formRef}
        className="space-y-5 rounded-card border border-border bg-card p-5 shadow-sm md:p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-medium text-heading">
              {isEditing ? "Edit hotel" : "New hotel"}
            </h2>
            <p className="mt-1 font-body text-sm text-muted">
              Start with a title and code, then complete details in the editor.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
          <div className="space-y-2">
            <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Hotel Code
            </Label>
            <Input value={productCode} readOnly className="bg-surface font-ui" />
          </div>
          <div className="space-y-2">
            <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Hotel title
            </Label>
            <Input
              placeholder="Garden cottage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-input border border-border bg-surface px-4 py-3">
          <div>
            <p className="font-ui text-sm font-medium text-heading">Active</p>
            <p className="font-body text-xs text-muted">
              Inactive hotels stay hidden on the website.
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
            {isEditing ? "Update hotel" : "Add hotel"}
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
            All hotels
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
                <TableHead className="font-ui text-heading">Hotel</TableHead>
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
                      ? `${window.location.origin}/hotel/${prod.slug || slugify(prod.title)}`
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
                          aria-label="Copy hotel URL"
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
                            render={<Link href={`/admin/edit_room/${prod._id}`} />}
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
                            aria-label="Delete hotel"
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
                      No hotels yet
                    </p>
                    <p className="mt-1 font-body text-sm text-muted">
                      Create your first hotel above.
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
              Delete hotel ?
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
