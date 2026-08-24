"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { AdminPageHeader } from "@/components/admin/common/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const emptyForm = {
  titleTag: "",
  date: "",
  title: "",
  name: "",
  location: "",
  image: { url: "", key: "" },
  active: true,
};

export default function CreateTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/testimonials");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch testimonials.");
      }

      setTestimonials(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setTestimonials([]);
      toast.error(error.message || "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  function resetForm() {
    setEditId(null);
    setFormData(emptyForm);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch("/api/cloudinary", {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Image upload failed.");
      }

      setFormData((prev) => ({
        ...prev,
        image: { url: data.url, key: data.key || "" },
      }));
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim() || !formData.name.trim() || !formData.location.trim()) {
      toast.error("Title, name, and location are required.");
      return;
    }

    if (!formData.image?.url) {
      toast.error("Please upload an image.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: editId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId || undefined,
          titleTag: formData.titleTag.trim(),
          date: formData.date,
          title: formData.title.trim(),
          name: formData.name.trim(),
          location: formData.location.trim(),
          image: formData.image,
          active: formData.active,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save testimonial.");
      }

      toast.success(editId ? "Testimonial updated." : "Testimonial created.");
      resetForm();
      await fetchTestimonials();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(item) {
    setEditId(item._id);
    setFormData({
      titleTag: item.titleTag || "",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      title: item.title || "",
      name: item.name || "",
      location: item.location || "",
      image: item.image || { url: "", key: "" },
      active: item.active !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete() {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete.");
      }

      toast.success("Testimonial deleted.");
      if (editId === deleteTarget._id) resetForm();
      setDeleteTarget(null);
      await fetchTestimonials();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <AdminPageHeader
        title="Create Testimonials"
        description="Add guest voices that appear on the public testimonials page."
        action={
          editId ? (
            <Button type="button" variant="outline" size="sm" onClick={resetForm}>
              <X className="size-4" />
              Cancel edit
            </Button>
          ) : null
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-card border border-border bg-card p-5 shadow-sm md:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-medium text-heading">
              {editId ? "Edit testimonial" : "New testimonial"}
            </h2>
            <p className="mt-1 font-body text-sm text-muted">
              Upload a photo, then add the quote title, guest name, and location.
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-border font-ui text-[10px] uppercase tracking-wide text-muted"
          >
            {editId ? "Editing" : "Create"}
          </Badge>
        </div>

        <div className="space-y-2">
          <Label className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Image
          </Label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={cn(
                "relative flex h-36 w-full max-w-xs items-center justify-center overflow-hidden rounded-image border border-dashed border-border bg-surface transition-colors hover:border-primary/50",
                uploading && "opacity-60"
              )}
            >
              {formData.image?.url ? (
                <Image
                  src={formData.image.url}
                  alt="Testimonial preview"
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 font-body text-sm text-muted">
                  <UploadCloud className="size-6 text-primary" />
                  {uploading ? "Uploading…" : "Upload image"}
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UploadCloud className="size-4" />
                )}
                {formData.image?.url ? "Replace image" : "Choose image"}
              </Button>
              {formData.image?.url ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      image: { url: "", key: "" },
                    }))
                  }
                >
                  Remove image
                </Button>
              ) : null}
            </div>
          </div>
        </div>


        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="testimonial-titleTag"
              className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
            >
              Title Tag
            </Label>
            <Input
              id="testimonial-titleTag"
              value={formData.titleTag}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, titleTag: e.target.value }))
              }
              placeholder="A life-changing experience"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="testimonial-date"
              className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
            >
              Date
            </Label>
            <DatePicker
              id="testimonial-date"
              value={formData.date}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, date: val || "" }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="testimonial-title"
            className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
          >
            Quote / Testimonial Body
          </Label>
          <Textarea
            id="testimonial-title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="I came for a break and left with a quieter mind…"
            rows={4}
            className="resize-y"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="testimonial-name"
              className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
            >
              Name
            </Label>
            <Input
              id="testimonial-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter Your Name"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="testimonial-location"
              className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-muted"
            >
              Location
            </Label>
            <Input
              id="testimonial-location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Mumbai, India"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-input border border-border bg-surface px-4 py-3">
          <div>
            <p className="font-ui text-sm font-medium text-heading">Visible on site</p>
            <p className="font-body text-xs text-muted">
              Inactive testimonials stay hidden on the public page.
            </p>
          </div>
          <Switch
            checked={formData.active}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, active: checked }))
            }
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit" disabled={submitting || uploading}>
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : editId ? (
              <Pencil className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {editId ? "Update testimonial" : "Add testimonial"}
          </Button>
          {editId ? (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-card border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-xl font-medium text-heading">
            All testimonials
          </h2>
          <p className="mt-1 font-body text-sm text-muted">
            {testimonials.length} total
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 font-body text-sm text-muted">
            <Loader2 className="size-4 animate-spin text-primary" />
            Loading…
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-ui text-heading">Image</TableHead>
                <TableHead className="font-ui text-heading">Title</TableHead>
                <TableHead className="font-ui text-heading">Name</TableHead>
                <TableHead className="font-ui text-heading">Location</TableHead>
                <TableHead className="font-ui text-heading">Status</TableHead>
                <TableHead className="w-[120px] text-right font-ui text-heading">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length > 0 ? (
                testimonials.map((item, index) => (
                  <TableRow
                    key={item._id}
                    className={cn(
                      "border-border",
                      index % 2 === 1 && "bg-surface/60"
                    )}
                  >
                    <TableCell>
                      <div className="relative size-12 overflow-hidden rounded-full bg-surface">
                        {item.image?.url ? (
                          <Image
                            src={item.image.url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[280px]">
                      <p className="line-clamp-2 font-body text-sm text-heading">
                        {item.title}
                      </p>
                    </TableCell>
                    <TableCell className="font-body text-sm text-heading">
                      {item.name}
                    </TableCell>
                    <TableCell className="font-body text-sm text-muted">
                      {item.location}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-ui text-[10px] uppercase tracking-wide",
                          item.active !== false
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border bg-muted text-muted"
                        )}
                      >
                        {item.active !== false ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8"
                          onClick={() => handleEdit(item)}
                          aria-label="Edit testimonial"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8 text-error hover:text-error"
                          onClick={() => setDeleteTarget(item)}
                          aria-label="Delete testimonial"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <p className="font-heading text-lg text-heading">
                      No testimonials yet
                    </p>
                    <p className="mt-1 font-body text-sm text-muted">
                      Create your first guest story above.
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
              Delete testimonial?
            </DialogTitle>
            <DialogDescription className="font-body text-sm text-muted">
              This will permanently remove{" "}
              <span className="text-heading">{deleteTarget?.name}</span>&apos;s
              testimonial and its image.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
