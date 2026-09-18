"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2Icon, UploadIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SECTIONS = [
  {
    field: "philosophyTrustImage",
    title: "Philosophy Trust Image",
    description:
      "Shown on the homepage Philosophy Trust section (right-side feature image).",
  },
  {
    field: "ctaHowItWorksImage",
    title: "CTA How It Works Image",
    description:
      "Shown on the homepage CTA “How it works” arched image.",
  },
];

const EMPTY_IMAGES = {
  philosophyTrustImage: { url: "", key: "" },
  ctaHowItWorksImage: { url: "", key: "" },
};

export default function PhilosophyBannerPage() {
  const [images, setImages] = useState(EMPTY_IMAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingField, setUploadingField] = useState(null);
  const [removingField, setRemovingField] = useState(null);
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/philosophyBanner");
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message || "Failed to load images");
        }

        setImages({
          philosophyTrustImage:
            result.data?.philosophyTrustImage || EMPTY_IMAGES.philosophyTrustImage,
          ctaHowItWorksImage:
            result.data?.ctaHowItWorksImage || EMPTY_IMAGES.ctaHowItWorksImage,
        });
      } catch (error) {
        toast.error(error.message || "Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  const saveImage = async (field, image) => {
    const res = await fetch("/api/philosophyBanner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, image }),
    });
    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to save image");
    }

    setImages({
      philosophyTrustImage:
        result.data?.philosophyTrustImage || EMPTY_IMAGES.philosophyTrustImage,
      ctaHowItWorksImage:
        result.data?.ctaHowItWorksImage || EMPTY_IMAGES.ctaHowItWorksImage,
    });
  };

  const handleImageChange = async (field, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/cloudinary", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Cloudinary upload failed");
      }

      await saveImage(field, { url: data.url, key: data.key || "" });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error(error.message || "Cloudinary upload error");
    } finally {
      setUploadingField(null);
      if (fileInputRefs.current[field]) {
        fileInputRefs.current[field].value = "";
      }
    }
  };

  const handleRemoveImage = async (field) => {
    setRemovingField(field);
    try {
      const res = await fetch("/api/philosophyBanner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field }),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to remove image");
      }

      setImages({
        philosophyTrustImage:
          result.data?.philosophyTrustImage || EMPTY_IMAGES.philosophyTrustImage,
        ctaHowItWorksImage:
          result.data?.ctaHowItWorksImage || EMPTY_IMAGES.ctaHowItWorksImage,
      });
      toast.success("Image removed");
    } catch (error) {
      toast.error(error.message || "Failed to remove image");
    } finally {
      setRemovingField(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Philosophy & CTA Images
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage the two homepage images used in Philosophy Trust and CTA How It
          Works sections.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {SECTIONS.map(({ field, title, description }) => {
          const image = images[field] || EMPTY_IMAGES[field];
          const isUploading = uploadingField === field;
          const isRemoving = removingField === field;

          return (
            <div
              key={field}
              className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>

              <div className="mt-5">
                <Label className="mb-2 block text-sm font-medium text-slate-600">
                  Image
                </Label>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs.current[field] = el;
                  }}
                  onChange={(event) => handleImageChange(field, event)}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="mb-3 flex items-center gap-2 bg-blue-500 text-black hover:bg-blue-600 hover:text-black"
                  disabled={isUploading || isRemoving}
                  onClick={() => fileInputRefs.current[field]?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span>Select Image</span>
                      <UploadIcon className="size-4" />
                    </>
                  )}
                </Button>

                {image.url ? (
                  <div className="relative h-56 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <Image
                      src={image.url}
                      alt={title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(field)}
                      disabled={isRemoving || isUploading}
                      className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 hover:bg-red-100 disabled:opacity-60"
                      title="Remove image"
                    >
                      {isRemoving ? (
                        <Loader2 className="size-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2Icon className="size-4 text-red-600" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
                    No image uploaded
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
