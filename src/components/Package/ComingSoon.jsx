'use client'

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRef } from "react"
import Image from "next/image"
import { X, Copy, Loader2, Pencil, Trash2, UploadIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

const ComingSoon = () => {
    const { handleSubmit, register, reset, setValue } = useForm()
    const [editId, setEditId] = useState(null);
    const [url, setUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [bannerLoading, setBannerLoading] = useState(false)
    const [bannerUrl, setBannerUrl] = useState("")
    const [bannerKey, setBannerKey] = useState("")
    const [thumbLoading, setThumbLoading] = useState(false)
    const [thumbUrl, setThumbUrl] = useState("")
    const [thumbKey, setThumbKey] = useState("")
    const [packageCode, setPackageCode] = useState(generateCode())
    const [comingSoonPackages, setComingSoonPackages] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    useEffect(() => {
        fetchPackages()
    }, [])

    const fetchPackages = async () => {
        setTableLoading(true)
        try {
            const res = await fetch(`/api/comingSoon`)
            const result = await res.json()
            setComingSoonPackages(result.data || [])
        } catch (err) {
            toast.error("Failed to fetch packages")
        } finally {
            setTableLoading(false)
        }
    }

    const copyToClipboard = (text) => {
        // Prevent form submission if inside a button in a form
        window?.event?.stopPropagation?.();
        window?.event?.preventDefault?.();
        navigator.clipboard.writeText(text)
            .then(() => toast.success("Link copied to clipboard!"))
            .catch(() => toast.error("Failed to copy link"));
    }

    const handleDelete = async (id, key1, key2) => {
        setDeleteId(id)
        try {
            const res = await fetch("/api/comingSoon", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            const result = await res.json()
            if (res.ok) {
                toast.success("Package deleted!")
                setComingSoonPackages(prev => prev.filter(pkg => pkg._id !== id))
            } else {
                toast.error(result.error || "Failed to delete package")
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setDeleteId(null)
        }
    }

    const bannerInputRef = useRef(null);
    const handleBannerUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBannerLoading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setBannerUrl(data.url);
                setBannerKey(data.key || '');
                toast.success('Banner uploaded!');
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            toast.error('Upload error: ' + err.message);
        }
        setBannerLoading(false);
    }

    const handleRemoveBanner = async () => {
        const key = bannerKey;
        setBannerUrl("");
        setBannerKey("");
        if (key) {
            try {
                await fetch('/api/cloudinary', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId: key })
                });
            } catch(e) {
                console.error("Failed to delete banner", e);
            }
        }
        if (editId) {
            await fetch("/api/comingSoon", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editId, bannerUrl: "", bannerKey: "" })
            });
            toast.success("Banner removed!");
        }
    }

    const thumbInputRef = useRef(null);
    const handleThumbUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setThumbLoading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setThumbUrl(data.url);
                setThumbKey(data.key || '');
                toast.success('Thumbnail uploaded!');
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            toast.error('Upload error: ' + err.message);
        }
        setThumbLoading(false);
    }

    const handleRemoveThumb = async () => {
        const key = thumbKey;
        setThumbUrl("");
        setThumbKey("");
        if (key) {
            try {
                await fetch('/api/cloudinary', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId: key })
                });
            } catch(e) {
                console.error("Failed to delete thumb", e);
            }
        }
        if (editId) {
            await fetch("/api/comingSoon", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editId, thumbUrl: "", thumbKey: "" })
            });
            toast.success("Thumbnail removed!");
        }
    }

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            let res, result;
            if (editId) {
                // Update
                res = await fetch("/api/comingSoon", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: editId,
                        title: data.title,
                        location: data.location,
                        days: Number(data.days),
                        tourType: data.tourType,
                        bannerUrl,
                        bannerKey,
                        thumbUrl,
                        thumbKey,
                    })
                });
                result = await res.json();
                if (res.ok) {
                    toast.success("Package updated!");
                    setEditId(null);
                    reset();
                    setBannerUrl(""); setBannerKey(""); setThumbUrl(""); setThumbKey("");
                    setPackageCode(generateCode());
                    fetchPackages(); // always refresh table after update
                } else {
                    toast.error(result.error || "Failed to update package");
                }
            } else {
                // Create
                res = await fetch("/api/comingSoon", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: data.title,
                        location: data.location,
                        days: Number(data.days),
                        tourType: data.tourType,
                        bannerUrl,
                        bannerKey,
                        thumbUrl,
                        thumbKey,
                    })
                });
                result = await res.json();
                if (res.ok) {
                    setUrl(result.url)
                    toast.success("Coming soon package created!")
                    reset()
                    setBannerUrl(""); setBannerKey(""); setThumbUrl(""); setThumbKey("");
                    setPackageCode(generateCode());
                    fetchPackages();
                } else {
                    toast.error(result.error || "Failed to create package")
                }
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    // Utility to get the package URL in the desired format
    const getPackageUrl = (pkg) => `/piligrimage/${pkg._id}`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full">
          <form className="flex flex-col items-center justify-center gap-8 bg-blue-100 max-w-4xl w-full p-4 rounded-lg shadow" style={{marginTop: 40, marginBottom: 40}} onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-3xl font-semibold">Add Coming Soon Package</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Package Title</label>
                    <Input className="border-2 border-blue-600" placeholder="Package Title" {...register("title")} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Location</label>
                    <Input className="border-2 border-blue-600" placeholder="Location" {...register("location")} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Days of Tour</label>
                    <Input className="border-2 border-blue-600" type="number" placeholder="Days of Tour" {...register("days")} />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="font-semibold">Tour Type</label>
                    <Input className="border-2 border-blue-600" placeholder="Tour Type" {...register("tourType")} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="space-y-2 w-full">
                    <label className="font-semibold">Thumbnail Image</label>
                    <div className="grid grid-cols-1 w-full gap-4">
                        {bannerUrl ? (
                            <div className="relative aspect-video rounded-lg h-40 w-full overflow-hidden border-2 border-blue-600 group">
                                <Image src={bannerUrl} alt="Banner Preview" fill sizes="100vw" className="object-contain w-full" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button type="button" onClick={handleRemoveBanner} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No Thumbnail uploaded</p>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        ref={bannerInputRef}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                        onClick={() => bannerInputRef.current && bannerInputRef.current.click()}
                        disabled={bannerLoading || bannerUrl}
                    >
                        {bannerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
                        {bannerLoading ? "Uploading..." : "Upload Banner"}
                    </Button>
                </div>
                <div className="space-y-2 w-full">
                    <label className="font-semibold">Banner Image</label>
                    <div className="grid grid-cols-1 w-full gap-4">
                        {thumbUrl ? (
                            <div className="relative aspect-video rounded-lg h-40 w-full overflow-hidden border-2 border-blue-600 group">
                                <Image src={thumbUrl} alt="Thumb Preview" fill sizes="100vw" className="object-contain w-full" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button type="button" onClick={handleRemoveThumb} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">No Banner uploaded</p>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbUpload}
                        ref={thumbInputRef}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                        onClick={() => thumbInputRef.current && thumbInputRef.current.click()}
                        disabled={thumbLoading || thumbUrl}
                    >
                        {thumbLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
                        {thumbLoading ? "Uploading..." : "Upload Thumbnail"}
                    </Button>
                </div>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={isLoading}>
              {editId ? (isLoading ? "Updating..." : "Update Package") : (isLoading ? "Saving..." : "Create Coming Soon")}
            </Button>
            {editId && (
              <Button type="button" className="ml-2 bg-gray-400 hover:bg-gray-500" onClick={() => {
                setEditId(null);
                reset();
                setBannerUrl(""); setBannerKey(""); setThumbUrl(""); setThumbKey("");
              }}>
                Cancel Edit
              </Button>
            )}
            <div className="bg-blue-100 p-4 rounded-lg shadow max-w-5xl mx-auto w-full overflow-x-auto lg:overflow-visible text-center mt-8">
                <Table className="w-full min-w-max lg:min-w-0">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center !text-black w-1/4">Title</TableHead>
                            <TableHead className="text-center !text-black w-1/4">Location</TableHead>
                            <TableHead className="text-center !text-black w-1/4">Link</TableHead>
                            <TableHead className="w-1/4 !text-black text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableLoading ? (
                            <TableRow><TableCell colSpan="4">Loading...</TableCell></TableRow>
                        ) : comingSoonPackages.length > 0 ? (
                            comingSoonPackages.map(pkg => (
                                <TableRow key={pkg._id}>
                                    <TableCell className="border font-semibold border-blue-600">{pkg.title}</TableCell>
                                    <TableCell className="border font-semibold border-blue-600">{pkg.location}</TableCell>
                                    <TableCell className="border font-semibold border-blue-600">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    copyToClipboard(`${window.location.origin}${getPackageUrl(pkg)}`)
                                                }}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            {/* <span className="text-xs break-all">{getPackageUrl(pkg)}</span> */}
                                        </div>
                                    </TableCell>
                                    <TableCell className="border font-semibold border-blue-600">
                                        <div className="flex items-center justify-center gap-6">
                                            <Button size="icon" variant="outline" type="button" onClick={() => {
                                                setEditId(pkg._id);
                                                setValue("title", pkg.title);
                                                setValue("location", pkg.location);
                                                setValue("days", pkg.days);
                                                setValue("tourType", pkg.tourType);
                                                setBannerUrl(pkg.bannerUrl);
                                                setBannerKey(pkg.bannerKey);
                                                setThumbUrl(pkg.thumbUrl);
                                                setThumbKey(pkg.thumbKey);
                                            }}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" disabled={deleteId === pkg._id} onClick={() => handleDelete(pkg._id, pkg.bannerKey, pkg.thumbKey)} variant="destructive">
                                                {deleteId === pkg._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="4" className="text-center border font-semibold border-blue-600">
                                    No packages available.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
          </form>
        </div>
    )
}

export default ComingSoon