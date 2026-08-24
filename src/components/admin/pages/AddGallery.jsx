'use client'

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePackage } from "@/components/admin/context/PackageContext";
import toast from "react-hot-toast";

const AddGallery = () => {
    const {
        formState: { errors },
        setValue,
        getValues
    } = useForm();

    const packages = usePackage();

    const [images, setImages] = useState([]);
    const [loadedImages, setLoadedImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (packages.gallery) {
            setImages(packages.gallery);
        }
    }, [packages]);

    const handleImageLoad = (index) => {
        setLoadedImages((prev) => {
            const updated = [...prev, index]; // Store loaded indexes
            return updated;
        });
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;
        setUploading(true);
        let newFiles = [];
        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/cloudinary', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error('Image upload failed');
                const result = await res.json();
                newFiles.push({ url: result.url, key: result.key });
            }
            setImages(prev => [...prev, ...newFiles]);
            setValue("gallery", [...(getValues("gallery") || []), ...newFiles], { shouldValidate: true });
            saveImagesToDatabase(newFiles);
            toast.success('Images uploaded successfully');
        } catch (err) {
            toast.error('Image upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = async (key) => {
        const deleteImage = await fetch("/api/admin/website-manage/addPackage/addGallery", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pkgId: packages._id,
                key: key,
            }),
        });

        if (!deleteImage.ok) {
            return toast.error(`Failed to delete image: ${deleteImage.message}`, {
                duration: 5000,
                icon: "❌",
                style: { borderRadius: "10px", border: "2px solid red" },
            });
        } else {
            setImages(prev => prev.filter(file => file.key !== key));

            toast.success("Image Deleted", {
                duration: 5000,
                icon: "📸",
                style: { borderRadius: "10px", border: "2px solid green" },
            });
        }
    };

    const saveImagesToDatabase = async (newImages) => {
        if (!newImages || newImages.length === 0) return; // ✅ Prevent unnecessary calls

        // ✅ Merge new images with existing ones before sending to the server
        const updatedGallery = [...images, ...newImages];

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addGallery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pkgId: packages._id,
                    images: updatedGallery, // ✅ Send all images (old + new)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return toast.error(`Failed to upload images: ${data.message}`, {
                    duration: 5000,
                    icon: "❌",
                    style: { borderRadius: "10px", border: "2px solid red" },
                });
            }

            // ✅ Update state with the full gallery
            setImages(updatedGallery);

            toast.success("Images Uploaded", {
                duration: 5000,
                icon: "📸",
                style: { borderRadius: "10px", border: "2px solid green" },
            });

        } catch (error) {
            console.error("Error saving images to database", error);
        }
    };

    return (
        <div className="flex w-full max-w-full flex-col gap-8 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-border/50 md:p-8">
            <h1 className="font-heading text-3xl text-heading md:text-4xl">Add Gallery</h1>
            <div className="space-y-2 w-full">
                <Label>Gallery Images</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-4">
                    {images.length > 0 ? (
                        images.map((file, index) => (
                            <div
                                key={index}
                                className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden border border-border group"
                            >
                                {!loadedImages.includes(index) && (
                                    <div className="absolute inset-0 flex items-center justify-center animate-pulse bg-surface">
                                        <Loader2 className="size-6 animate-spin text-primary" />
                                    </div>
                                )}

                                <Image
                                    src={file.url || '/placeholder.png'}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className={`object-cover transition-opacity duration-500 ${loadedImages.includes(index) ? 'opacity-100' : 'opacity-0'}`}
                                    onLoad={() => handleImageLoad(index)}
                                />

                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-heading/40 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => handleRemoveImage(file.key)}
                                        aria-label="Remove image"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="font-body text-sm text-muted">No images uploaded yet.</p>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                />
                <Button
                    type="button"
                    className="mt-6"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="size-4" />
                            Upload Images
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default AddGallery;
