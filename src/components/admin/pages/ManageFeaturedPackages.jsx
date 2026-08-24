"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, UploadCloud, LayoutTemplate, Package, PencilIcon, Trash2Icon, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ManageFeaturedPackages = ({}) => {
    const fileInputRef = useRef(null);
    const [packages, setPackages] = useState([]);
    const [editingPackage, setEditingPackage] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        image: { url: "", key: "" }, // Storing both URL & Key
        link: "",
    });
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Add this line to fix delete button bug
    const [packageToDelete, setPackageToDelete] = useState({ id: null, imageKey: null });

    const fetchPackages = async () => {
        try {
            const response = await fetch(`/api/featured-packages`);
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setPackages(data.data);
            } else {
                console.error('Unexpected data format:', data);
                setPackages([]);
                toast.error("Failed to load packages: Invalid data format", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
            toast.error("Failed to fetch packages", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            setPackages([]);
        }
    };
    useEffect(() => {
        fetchPackages();
    }, []);

    const handleEdit = (pkg) => {
        setEditingPackage(pkg._id);
        setFormData({
            title: pkg.title,
            image: pkg.image || { url: "", key: "" },
            link: pkg.link || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.image?.url) {
            return toast.error("Please upload an image for the package", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
        
        setSubmitting(true);
        try {
            // Prepare the data to send
            const dataToSend = {
                title: formData.title,
                link: formData.link,
                image: formData.image
            };

            const url = editingPackage
                ? `/api/featured-packages/${editingPackage}`
                : '/api/featured-packages';

            const method = editingPackage ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save package');
            }

            // Show success message
            toast.success(editingPackage ? 'Package updated successfully!' : 'Package added successfully!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });

            // Reset form and refresh list
            setFormData({ title: '', image: { url: '', key: '' }, link: '' });
            setEditingPackage(null);
            await fetchPackages();

        } catch (error) {
            console.error('Error saving package:', error);
            toast.error(error.message || 'Failed to save package', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveBanner = () => {
        setFormData({ ...formData, image: { url: "", key: "" } });
    };

    const handleDelete = (id, imageKey) => {
        setPackageToDelete({ id, imageKey });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        const { id, imageKey } = packageToDelete;
        try {
            // Delete the image from Uploadthing first
            if (imageKey) {
                // Removed UploadThing delete, now just clear image from state(imageKey);
            }

            // Then delete the package from database
            const response = await fetch(`/api/featured-packages/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete package");
            }

            toast.success("Package deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });

            // Refresh the list of packages
            await fetchPackages();

            // If we were editing this package, clear the form
            if (editingPackage === id) {
                setEditingPackage(null);
                setFormData({ title: "", image: { url: "", key: "" }, link: "" });
            }
        } catch (error) {
            toast.error(error.message, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setShowDeleteModal(false);
            setPackageToDelete({ id: null, imageKey: null });
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPackageToDelete({ id: null, imageKey: null });
    };
    const handleCancelEdit = () => {
        setEditingPackage(null);
        setFormData({ title: "", image: { url: "", key: "" }, link: "" });
    };

    const onFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            });
            if (!res.ok) throw new Error('Image upload failed');
            const result = await res.json();
            setFormData((prev) => ({
                ...prev,
                image: { url: result.url, key: result.key },
            }));
            toast.success('Image uploaded successfully!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
        } catch (err) {
            toast.error('Upload failed', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Featured Packages</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the highlighted packages or products shown on the homepage.</p>
                </div>
                {editingPackage && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
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
                                    {editingPackage ? "Edit Package" : "Add New Package"}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500">Provide the package details and a high-quality image.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Package Title <span className="text-red-500">*</span></Label>
                                    <Input 
                                        name="title" 
                                        placeholder="e.g. Premium Safari Tour" 
                                        value={formData.title} 
                                        onChange={handleChange} 
                                        required 
                                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                    />
                                </div>
                                
                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Package Link <span className="text-red-500">*</span></Label>
                                    <Input 
                                        name="link" 
                                        placeholder="e.g. /tours/premium-safari" 
                                        value={formData.link} 
                                        onChange={handleChange} 
                                        required 
                                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                    />
                                </div>
                                
                                {/* Package Image Upload */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-slate-600 ml-1">Package Image <span className="text-red-500">*</span></Label>
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onFileChange}
                                        ref={fileInputRef}
                                        className="hidden"
                                    />

                                    {!formData.image?.url ? (
                                        <div 
                                            onClick={() => !uploading && fileInputRef.current && fileInputRef.current.click()}
                                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-colors
                                                ${uploading ? 'bg-slate-50 border-slate-200 cursor-default' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50 cursor-pointer'}`}
                                        >
                                            {uploading ? (
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
                                                        <p className="text-sm font-medium text-slate-700">Click to upload image</p>
                                                        <p className="text-xs text-slate-500 mt-1">Recommended: 800x600 px</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative w-full aspect-[4/3] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                            <Image
                                                src={formData.image.url}
                                                alt="Package Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={handleRemoveBanner}
                                                    className="w-10 h-10 rounded-full shadow-lg"
                                                >
                                                    <Trash2Icon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 flex items-center gap-3">
                                    <Button type="submit" className="h-11 flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all hover:shadow-md" disabled={submitting || uploading}>
                                        {submitting ? "Saving..." : editingPackage ? "Update Package" : "Add Package"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Display Grid Column */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">Existing Packages</CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">These packages are currently featured on the site.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 bg-slate-50/50">
                            {packages && packages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {packages.map((pkg) => (
                                        <div key={pkg._id} className="group relative bg-white border border-slate-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-slate-200">
                                            <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                                                <Image 
                                                    src={pkg.image.url} 
                                                    alt={pkg.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                                />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-semibold text-slate-800 text-lg mb-1 truncate" title={pkg.title}>{pkg.title}</h3>
                                                <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
                                                    <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                                                    <span className="truncate" title={pkg.link}>{pkg.link}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => handleEdit(pkg)} 
                                                        className="flex-1 h-9 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
                                                    >
                                                        <PencilIcon className="w-3.5 h-3.5 mr-2" />
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => handleDelete(pkg._id, pkg.image.key)} 
                                                        className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                                                    >
                                                        <Trash2Icon className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-800 mb-1">No packages found</h3>
                                    <p className="text-slate-500">Add a new featured package using the form.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="rounded-[24px] p-6 border-slate-100 shadow-xl bg-white max-w-md font-sans gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold text-slate-800">Delete Package</DialogTitle>
                    </DialogHeader>
                    <p className="text-slate-600 mb-6">Are you sure you want to delete this featured package? This action cannot be undone.</p>
                    <DialogFooter className="gap-2 sm:gap-0 bg-white">
                        <Button variant="ghost" onClick={cancelDelete} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                        <Button variant="default" onClick={confirmDelete} className="h-11 rounded-xl px-6 font-medium">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageFeaturedPackages;
