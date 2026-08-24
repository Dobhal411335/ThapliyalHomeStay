"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

import { PencilIcon, Trash2Icon, LayoutTemplate, Megaphone, Link as LinkIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const TopAdvertismentBanner = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);
    const [banners, setBanners] = useState([]);
    const [editBanner, setEditBanner] = useState(null);
    const [formData, setFormData] = useState({
        title:"",
        buttonLink: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await fetch(`/api/topAdvertismentBanner`);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const method = editBanner ? "PATCH" : "POST";          
            // Compose payload with coupon details
            const payload = {
                ...formData,
                id: editBanner,
            };
            const response = await fetch("/api/topAdvertismentBanner", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Advertisment ${editBanner ? "updated" : "added"} successfully`, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setEditBanner(null);

                // Refresh banner list
                const updatedBanners = await fetch(`/api/topAdvertismentBanner `).then((res) => res.json());
                setBanners(updatedBanners);

                // Reset form
                setFormData({
                    title:"",
                    buttonLink: "",
                });

            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (banner) => {
        setEditBanner(banner._id);
        setFormData({
            title:banner.title,
            buttonLink: banner.buttonLink,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/topAdvertismentBanner", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Banner deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });

                setBanners((prev) => prev.filter((banner) => banner._id !== id));

                const updatedBanners = await fetch(`/api/topAdvertismentBanner`).then((res) => res.json());
                setBanners(updatedBanners);
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
    };

    const confirmDelete = async () => {
        if (bannerToDelete) {
            await handleDelete(bannerToDelete);
            setBannerToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setBannerToDelete(null);
    };

    const handleToggleActive = async (id, isActive) => {
        try {
            const response = await fetch("/api/topAdvertismentBanner", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isActive }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update banner status");
            }

            // Update local state to reflect the change
            setBanners(prevBanners =>
                prevBanners.map(banner =>
                    banner._id === id ? { ...banner, isActive } : banner
                )
            );
            toast.success("Banner status updated successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
        } catch (error) {
            console.error("Error updating banner status:", error);
            toast.error(error.message || "Failed to update banner status", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 p-6 font-sans pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Top Advertisement Banner</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the text announcement banner displayed at the very top of the page.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Form Column */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    {editBanner ? "Edit Advertisement" : "Add Advertisement"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500">Configure the text and link for the top banner.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Banner Title</Label>
                                    <Input 
                                        name="title" 
                                        placeholder="e.g. Get 20% off on your first booking!" 
                                        type="text" 
                                        value={formData.title} 
                                        onChange={handleInputChange} 
                                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Target URL</Label>
                                    <Input 
                                        name="buttonLink" 
                                        placeholder="https://example.com/promo" 
                                        type="url" 
                                        value={formData.buttonLink} 
                                        onChange={handleInputChange} 
                                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                    />
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                                    <Button type="submit" className="h-11 flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all hover:shadow-md" disabled={submitting}>
                                        {submitting ? "Saving..." : editBanner ? "Update Banner" : "Add Banner"}
                                    </Button>
                                    {editBanner && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-medium"
                                            onClick={() => {
                                                setEditBanner(null);
                                                setFormData({
                                                    title: "",
                                                    buttonLink: "",
                                                });
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
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
                                <Megaphone className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">Active Banners</CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">List of all created banners and their visibility status.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="text-slate-500 font-medium h-12 text-center w-16">#</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12">Banner Title</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12 text-center">Status</TableHead>
                                        <TableHead className="text-slate-500 font-medium text-right pr-6 h-12">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {banners.length > 0 ? (
                                        banners.map((banner, index) => (
                                            <TableRow key={banner._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                <TableCell className="text-slate-400 text-center py-4">{index + 1}</TableCell>
                                                <TableCell className="py-4">
                                                    <div className="font-semibold text-slate-700 max-w-xs truncate" title={banner.title}>
                                                        {banner.title}
                                                    </div>
                                                    {banner.buttonLink && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <LinkIcon className="w-3 h-3 text-slate-400" />
                                                            <a href={banner.buttonLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline max-w-xs truncate">
                                                                {banner.buttonLink}
                                                            </a>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center py-4">
                                                    <Switch
                                                        checked={banner.isActive}
                                                        onCheckedChange={(checked) => handleToggleActive(banner._id, checked)}
                                                        className="scale-90"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)} className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors">
                                                            <PencilIcon className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => { setShowDeleteModal(true); setBannerToDelete(banner._id); }} className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                            <Trash2Icon className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="4" className="text-center py-12 text-slate-400">
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
                    <p className="text-slate-600 mb-6">Are you sure you want to delete this banner? This action cannot be undone.</p>
                    <DialogFooter className="gap-2 bg-white sm:gap-0">
                        <Button variant="ghost" onClick={cancelDelete} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                        <Button variant="default" onClick={confirmDelete} className="h-11 rounded-xl px-6 font-medium">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TopAdvertismentBanner;