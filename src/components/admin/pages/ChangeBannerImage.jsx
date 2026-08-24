"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PencilIcon, Trash2Icon, LayoutTemplate, ImageIcon, Link as LinkIcon, UploadCloud, Smartphone, Monitor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ChangeBannerImage = ({}) => {
    const fileInputRef = useRef(null);
    const fileInputBackRef = useRef(null);
    
    const [banners, setBanners] = useState([]);
    const [editBanner, setEditBanner] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    
    const [formData, setFormData] = useState({
        buttonLink: "",
        frontImg: { url: "", key: "" },
        mobileImg: { url: "", key: "" },
    });
    
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFront, setUploadingFront] = useState(false);
    const [uploadingMobileImg, setUploadingMobileImg] = useState(false);

    // Fetch banners and determine the next order number
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`/api/addBanner`);
                const data = await response.json();
                setBanners(data);
            } catch (error) {
                toast.error("Failed to fetch banners", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        };
        fetchBanners();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingFront(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, frontImg: { url: data.url, key: data.key || '' } }));
                toast.success('Desktop image uploaded!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'), { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (err) {
            toast.error('Upload error: ' + err.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
        setUploadingFront(false);
    };

    const handleMobileImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingMobileImg(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setFormData(prev => ({ ...prev, mobileImg: { url: data.url, key: data.key || '' } }));
                toast.success('Mobile image uploaded!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
            } else {
                toast.error('Upload failed: ' + (data.error || 'Unknown error'), { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (err) {
            toast.error('Upload error: ' + err.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
        setUploadingMobileImg(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.frontImg?.url || !formData.frontImg?.key) return toast.error("Please upload a desktop image", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        if (!formData.mobileImg?.url || !formData.mobileImg?.key) return toast.error("Please upload a mobile image", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        
        setSubmitting(true);
        try {
            const method = editBanner ? "PATCH" : "POST";
            const payload = {
                ...formData,
                id: editBanner,
            };
            const response = await fetch("/api/addBanner", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Banner ${editBanner ? "updated" : "added"} successfully`, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setEditBanner(null);

                // Refresh banner list
                const updatedBanners = await fetch(`/api/addBanner`).then((res) => res.json());
                setBanners(updatedBanners);

                // Reset form
                setFormData({
                    buttonLink: "",
                    frontImg: { url: "", key: "" },
                    mobileImg: { url: "", key: "" },
                });
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } },{error: error.message});
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (banner) => {
        setEditBanner(banner._id);
        setFormData({
            buttonLink: banner.buttonLink,
            frontImg: banner.frontImg || { url: "", key: "" },
            mobileImg: banner.mobileImg || { url: "", key: "" },
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        setBannerToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch("/api/addBanner", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: bannerToDelete }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Banner deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setBanners((prev) => prev.filter((banner) => banner._id !== bannerToDelete));
                
                const updatedBanners = await fetch(`/api/addBanner`).then((res) => res.json());
                setBanners(updatedBanners);
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setShowDeleteModal(false);
            setBannerToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setBannerToDelete(null);
    };

    const handleDeleteImage = () => {
        setFormData(prev => ({ ...prev, frontImg: { url: '', key: '' } }));
    };
    
    const handleDeleteMobileImage = () => {
        setFormData(prev => ({ ...prev, mobileImg: { url: '', key: '' } }));
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Hero Banners</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage large hero images for both desktop and mobile views.</p>
                </div>
                {editBanner && (
                    <Button type="button" variant="outline" onClick={() => {
                        setEditBanner(null);
                        setFormData({
                            buttonLink: "",
                            frontImg: { url: "", key: "" },
                            mobileImg: { url: "", key: "" },
                        });
                    }} className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                        Cancel Editing
                    </Button>
                )}
            </div>

            <div className="space-y-8">
                {/* Form Column */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    {editBanner ? "Edit Banner" : "Add New Banner"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500">Upload responsive images and configure the banner URL.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Desktop Image Upload */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium text-slate-600 ml-1 flex items-center gap-2">
                                            <Monitor className="w-4 h-4 text-slate-400" />
                                            Desktop Image <span className="text-red-500">*</span>
                                        </Label>
                                    </div>
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        className="hidden"
                                    />

                                    {!formData.frontImg.url ? (
                                        <div 
                                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
                                                ${uploadingFront ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                        >
                                            {uploadingFront ? (
                                                <>
                                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-sm font-medium text-slate-600">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                        <UploadCloud className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-slate-700">Upload Desktop Image</p>
                                                        <p className="text-xs text-slate-500 mt-1">Horizontal layout (e.g. 1920x1080)</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-full aspect-[21/9] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                            <Image
                                                src={formData.frontImg.url}
                                                alt="Desktop Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={handleDeleteImage}
                                                    className="w-10 h-10 rounded-full shadow-lg"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Image Upload */}
                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium text-slate-600 ml-1 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4 text-slate-400" />
                                            Mobile Image <span className="text-red-500">*</span>
                                        </Label>
                                    </div>
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMobileImageChange}
                                        ref={fileInputBackRef}
                                        className="hidden"
                                    />

                                    {!formData.mobileImg.url ? (
                                        <div 
                                            onClick={() => fileInputBackRef.current && fileInputBackRef.current.click()}
                                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors mx-auto w-2/3
                                                ${uploadingMobileImg ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                        >
                                            {uploadingMobileImg ? (
                                                <>
                                                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-sm font-medium text-slate-600">Uploading...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                        <UploadCloud className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-slate-700">Upload Mobile</p>
                                                        <p className="text-xs text-slate-500 mt-1">Vertical layout</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-1/2 mx-auto aspect-[3/4] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                            <Image
                                                src={formData.mobileImg.url}
                                                alt="Mobile Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={handleDeleteMobileImage}
                                                    className="w-10 h-10 rounded-full shadow-lg"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="grid gap-2 pt-4 border-t border-slate-50">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Target URL</Label>
                                    <Input 
                                        name="buttonLink" 
                                        placeholder="https://example.com/collection" 
                                        type="url" 
                                        value={formData.buttonLink} 
                                        onChange={handleInputChange} 
                                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                    />
                                </div>

                                <div className="pt-2 flex items-center gap-3">
                                    <Button type="submit" className="h-11 flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all hover:shadow-md" disabled={submitting || uploadingFront || uploadingMobileImg}>
                                        {submitting ? "Saving..." : editBanner ? "Update Banner" : "Add Banner"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Column */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">Active Banners</CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">Manage existing responsive banners.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-2">
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="text-slate-500 font-medium h-12 text-center w-16">#</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12">Desktop</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12">Mobile</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12">Link</TableHead>
                                        <TableHead className="text-slate-500 font-medium text-right pr-6 h-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {banners.length > 0 ? (
                                        banners.map((banner, index) => (
                                            <TableRow key={banner._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                <TableCell className="text-slate-400 text-center py-4">{index + 1}</TableCell>
                                                <TableCell className="py-4">
                                                    {banner.frontImg?.url ? (
                                                        <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                                            <Image src={banner.frontImg.url} alt="Desktop Image" fill className="object-cover" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 italic">No image</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {banner.mobileImg?.url ? (
                                                        <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                                            <Image src={banner.mobileImg.url} alt="Mobile Image" fill className="object-cover" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 italic">No image</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {banner.buttonLink ? (
                                                        <div className="flex items-center gap-1.5 text-sm max-w-[150px]">
                                                            <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <a href={banner.buttonLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate">
                                                                {banner.buttonLink}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-slate-400 italic">No link</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)} className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors">
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(banner._id)} className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="5" className="text-center py-12 text-slate-400">
                                                No banners found. Create one to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="rounded-[24px] p-6 border-slate-100 shadow-xl bg-white max-w-md font-sans gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold text-slate-800">Delete Banner</DialogTitle>
                    </DialogHeader>
                    <p className="text-slate-600 mb-6">Are you sure you want to delete this responsive banner? This action cannot be undone.</p>
                    <DialogFooter className="gap-2 sm:gap-0 bg-white">
                        <Button variant="ghost" onClick={cancelDelete} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                        <Button variant="default" onClick={confirmDelete} className="h-11 rounded-xl px-6 font-medium">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChangeBannerImage;
