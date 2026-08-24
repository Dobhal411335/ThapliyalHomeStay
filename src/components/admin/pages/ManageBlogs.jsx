"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Pencil, Trash2, Youtube, Image as ImageIcon, Plus, Settings, Eye, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TiptapEditor = ({ value, onChange }) => (
    <textarea className="w-full min-h-[150px] border-slate-200 bg-slate-50/50 rounded-xl p-4 focus:ring-blue-500 focus:border-blue-500" value={value} onChange={e => onChange(e.target.value)} placeholder="Rich text editor coming soon..." />
);

const Blogs = ({ }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageUploading, setImageUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef();

    const [title, setTitle] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteBlogId, setDeleteBlogId] = useState(null);
    const [showBlogsModal, setShowBlogsModal] = useState(false);
    const [selectedArtisanBlogs, setSelectedArtisanBlogs] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const formRef = useRef(null);

    const fetchBlogs = async () => {
        try {
            setLoadingReviews(true);
            const res = await fetch(`/api/blogs`);
            if (!res.ok) throw new Error('Failed to fetch blogs');
            const data = await res.json();
            setBlogs(data.blogs || []);
        } catch (err) {
            toast.error('Failed to fetch blogs', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            setBlogs([]);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        if (selectedImages.length + files.length > 10) {
            toast.error('You can only upload up to 10 images.', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            return;
        }
        setImageUploading(true);
        setUploadProgress(0);
        try {
            let newImages = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);
                const res = await fetch('/api/cloudinary', {
                    method: 'POST',
                    body: formData
                });
                if (!res.ok) throw new Error('Image upload failed');
                const result = await res.json();
                newImages.push({ url: result.url, key: result.key });
                setUploadProgress(Math.round(((i + 1) / files.length) * 100));
            }
            setSelectedImages(prev => [...prev, ...newImages].slice(0, 10));
            toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded!`, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
        } catch (err) {
            toast.error('Image upload failed', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setImageUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleBrowseClick = () => {
        if (selectedImages.length >= 10) {
            toast.error('Maximum 10 images allowed.', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            return;
        }
        fileInputRef.current?.click();
    };

    const handleRemoveImage = async (index) => {
        const img = selectedImages[index];
        if (img.key) {
            toast.loading('Deleting image...', { id: 'cloud-delete-blog' });
            try {
                const res = await fetch('/api/cloudinary', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId: img.key })
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success('Image deleted!', { id: 'cloud-delete-blog', style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                } else {
                    toast.error('Cloudinary error: ' + (data.error || 'Failed to delete image'), { id: 'cloud-delete-blog', style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
                }
            } catch (err) {
                toast.error('Failed to delete image', { id: 'cloud-delete-blog', style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } else {
            toast.error('No valid Cloudinary key found.', { id: 'cloud-delete-blog', style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleEdit = (blog) => {
        setEditMode(true);
        setEditingBlogId(blog._id);
        setTitle(blog.title || '');
        setYoutubeUrl(blog.youtubeUrl || '');
        setShortDescription(blog.shortDescription || '');
        setLongDescription(blog.longDescription || '');
        setSelectedImages(
            (Array.isArray(blog.images) ? blog.images : []).map((img, idx) => {
                if (typeof img === 'string') {
                    return { url: img, key: `img-string-${idx}`, file: null };
                } else if (typeof img === 'object' && img !== null) {
                    return {
                        url: img.url || '',
                        key: img.key || `img-obj-${idx}`,
                        file: null
                    };
                }
                return { url: '', key: `img-unknown-${idx}`, file: null };
            })
        );
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleDelete = async () => {
        if (!deleteBlogId) return;
        try {
            const res = await fetch('/api/blogs', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deleteBlogId })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Blog deleted successfully!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                fetchBlogs();
            } else {
                toast.error(data?.message || data?.error || 'Failed to delete blog', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (err) {
            toast.error('Error deleting blog', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setShowDeleteModal(false);
            setDeleteBlogId(null);
        }
    };

    const openDeleteModal = (id) => {
        setDeleteBlogId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteBlogId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Title is required.', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title,
                youtubeUrl,
                shortDescription,
                longDescription,
                images: selectedImages.map(img => ({ url: img.url, key: img.key })),
            };
            let res, data;
            if (editMode && editingBlogId) {
                res = await fetch('/api/blogs', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingBlogId, ...payload })
                });
            } else {
                res = await fetch('/api/blogs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            data = await res.json();
            if (res.ok) {
                toast.success(editMode ? 'Blog updated successfully!' : 'Blog created successfully!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                fetchBlogs();
                handleCancelEdit();
            } else {
                toast.error(data?.message || data?.error || 'Failed to save blog', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (err) {
            toast.error('Error saving blog', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditingBlogId(null);
        setTitle('');
        setYoutubeUrl('');
        setShortDescription('');
        setLongDescription('');
        setSelectedImages([]);
    };

    const [mediaTab, setMediaTab] = useState('image'); // 'image' or 'youtube'

    const handleTabChange = (tab) => {
        setMediaTab(tab);
        if (tab === 'image') {
            setYoutubeUrl('');
        } else {
            setSelectedImages([]);
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24 mt-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Manage Blogs</h1>
                    <p className="text-sm text-slate-500 mt-1">Create and manage your blog posts and video content.</p>
                </div>
            </div>

            <div className="space-y-8" ref={formRef}>
                {/* Form Card (Top) */}
                <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-600" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    {editMode ? "Edit Blog" : "Create New Blog"}
                                </CardTitle>
                            </div>
                            {editMode && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    className="h-8 text-slate-500 hover:text-slate-700"
                                >
                                    <X className="w-4 h-4 mr-1" /> Cancel Edit
                                </Button>
                            )}
                        </div>
                        <CardDescription className="text-slate-500 mt-1">
                            {editMode ? "Update the content for the selected blog." : "Add a new blog post or video to your site."}
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-3">
                                <Label className="text-slate-700 font-medium">Title Of Blog/Video <span className="text-red-500">*</span></Label>
                                <Input
                                    type="text"
                                    placeholder="Enter your blog title..."
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-700 font-medium">Media Type</Label>
                                <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-xl w-fit">
                                    <button
                                        type="button"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaTab === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                                        onClick={() => handleTabChange('image')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Image Gallery
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaTab === 'youtube' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                                        onClick={() => handleTabChange('youtube')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Youtube className="w-4 h-4" /> YouTube Video
                                        </div>
                                    </button>
                                </div>

                                {mediaTab === 'youtube' ? (
                                    <div className="space-y-3">
                                        <Label className="text-slate-700 font-medium">YouTube URL</Label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <Youtube className="w-4 h-4" />
                                            </div>
                                            <Input
                                                type="text"
                                                placeholder="https://youtube.com/watch?v=..."
                                                value={youtubeUrl}
                                                onChange={e => setYoutubeUrl(e.target.value)}
                                                className="h-11 pl-9 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Label className="text-slate-700 font-medium">Blog Images (Max 10)</Label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 text-center transition-colors hover:bg-slate-50">
                                            {selectedImages.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center text-slate-500">
                                                    <ImageIcon className="w-8 h-8 mb-2 text-slate-300" />
                                                    <p>No images uploaded yet.</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-4 justify-center mb-4">
                                                    {selectedImages.map((image, index) => (
                                                        <div key={image.key || image.url || index} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm w-32 h-32">
                                                            <img
                                                                src={image.url}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="absolute top-2 right-2 bg-red-600/90 text-white rounded-lg p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                                                onClick={() => handleRemoveImage(index)}
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-4 flex flex-col items-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                    onChange={handleImageChange}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="rounded-xl border-slate-300 shadow-sm"
                                                    onClick={handleBrowseClick}
                                                    disabled={imageUploading || selectedImages.length >= 10}
                                                >
                                                    {imageUploading ? 'Uploading...' : 'Browse Images'}
                                                </Button>

                                                <small className={`mt-2 block ${selectedImages.length === 10 ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                                                    {selectedImages.length}/10 images selected
                                                </small>
                                            </div>

                                            {imageUploading && (
                                                <div className="w-full max-w-md mx-auto mt-4 space-y-2">
                                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium">Uploading... {uploadProgress}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-700 font-medium">Short Description</Label>
                                <Input
                                    type="text"
                                    placeholder="Brief summary of the blog..."
                                    value={shortDescription}
                                    onChange={e => setShortDescription(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50/50"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-slate-700 font-medium">Long Description</Label>
                                <TiptapEditor value={longDescription} onChange={setLongDescription} />
                            </div>
                        </CardContent>

                        <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-6 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 shadow-sm transition-all"
                            >
                                {isSubmitting ? 'Saving...' : (editMode ? 'Update Blog' : <><Plus className="w-4 h-4 mr-2" /> Publish Blog</>)}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Table Card (Bottom) */}
                <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <CardTitle className="text-lg font-semibold text-slate-800">Existing Blogs</CardTitle>
                            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full ml-2">
                                {blogs.length} Total
                            </span>
                        </div>
                        <CardDescription className="text-slate-500 mt-1">Manage and edit your existing blog posts.</CardDescription>
                    </CardHeader>

                    <CardContent className="p-2">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                    <TableRow className="hover:bg-transparent border-0">
                                        <TableHead className="text-slate-500 font-medium h-12 pl-6 w-16 text-center">S.No</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12 text-center w-32">Image/Media</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12">Title</TableHead>
                                        <TableHead className="text-slate-500 font-medium h-12 text-right pr-6 w-48">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingReviews ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={i} className="border-b border-slate-50">
                                                <TableCell className="pl-6 py-4 text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                                                <TableCell className="py-4 text-center"><Skeleton className="h-16 w-16 rounded-xl mx-auto" /></TableCell>
                                                <TableCell className="py-4"><Skeleton className="h-5 w-[200px] rounded-md" /></TableCell>
                                                <TableCell className="text-right pr-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                                        <Skeleton className="h-9 w-9 rounded-xl" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : blogs.length > 0 ? (
                                        blogs.map((blog, idx) => (
                                            <TableRow key={blog._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                <TableCell className="pl-6 py-4 text-center text-slate-500 font-medium align-middle">{idx + 1}</TableCell>
                                                <TableCell className="py-4 text-center align-middle">
                                                    {Array.isArray(blog.images) && blog.images.length > 0 ? (() => {
                                                        let imgObj = blog.images[0];
                                                        let url = typeof imgObj === 'object' && imgObj !== null ? imgObj.url : imgObj;
                                                        if (typeof url === 'string' && url.trim() && url !== 'undefined') {
                                                            return (
                                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 mx-auto shadow-sm">
                                                                    <img
                                                                        src={url}
                                                                        alt="Blog Preview"
                                                                        className="w-full h-full object-cover"
                                                                        onError={e => { e.target.style.display = 'none'; }}
                                                                    />
                                                                </div>
                                                            );
                                                        } else {
                                                            return <span className="text-slate-400 text-xs italic">No image</span>;
                                                        }
                                                    })() : (
                                                        <span className="text-slate-400 text-xs italic">No image</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 align-middle">
                                                    <span className="font-semibold text-slate-800">{blog.title || "Untitled Blog"}</span>
                                                    {blog.youtubeUrl && (
                                                        <Badge variant="secondary" className="ml-2 bg-red-50 text-red-600 border-none px-1.5 py-0">
                                                            <Youtube className="w-3 h-3 mr-1 inline" /> Video
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right pr-6 py-4 align-middle">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                            onClick={() => {
                                                                setSelectedArtisanBlogs([blog]);
                                                                setShowBlogsModal(true);
                                                            }}
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                                            onClick={() => handleEdit(blog)}
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                            onClick={() => openDeleteModal(blog._id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-500">
                                                    <FileText className="w-8 h-8 mb-2 text-slate-300" />
                                                    <p>No blogs available.</p>
                                                    <Button
                                                        variant="link"
                                                        onClick={() => {
                                                            if (formRef.current) {
                                                                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                            }
                                                        }}
                                                        className="text-blue-600 p-0 h-auto mt-1"
                                                    >
                                                        Create your first one
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete Modal */}
                <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogContent className="sm:max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-slate-800">Delete Blog</DialogTitle>
                        </DialogHeader>
                        <p className="text-slate-600 py-4">Are you sure you want to delete this blog? This action cannot be undone.</p>
                        <DialogFooter className="gap-2 sm:gap-0 bg-white">
                            <Button variant="outline" onClick={closeDeleteModal} className="rounded-xl border-slate-200 text-slate-700">Cancel</Button>
                            <Button variant="destructive" onClick={handleDelete} className="rounded-xl bg-red-600 hover:bg-red-700">Delete Blog</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Modal */}
                <Dialog open={showBlogsModal} onOpenChange={setShowBlogsModal}>
                    <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-slate-800">Blog Details</DialogTitle>
                        </DialogHeader>

                        {selectedArtisanBlogs.length > 0 && (
                            <div className="space-y-6 mt-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-500">Blog Title</h4>
                                    <p className="text-base text-slate-900 font-medium">{selectedArtisanBlogs[0].title}</p>
                                </div>

                                {selectedArtisanBlogs[0].youtubeUrl && (
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium text-slate-500">YouTube URL</h4>
                                        <a
                                            href={selectedArtisanBlogs[0].youtubeUrl.startsWith('http') ? selectedArtisanBlogs[0].youtubeUrl : `https://${selectedArtisanBlogs[0].youtubeUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                        >
                                            {selectedArtisanBlogs[0].youtubeUrl}
                                        </a>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-500">Short Description</h4>
                                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedArtisanBlogs[0].shortDescription || '-'}</p>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-slate-500">Long Description</h4>
                                    <div className="text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                                        {selectedArtisanBlogs[0].longDescription || '-'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-slate-500">Images</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {Array.isArray(selectedArtisanBlogs[0].images) && selectedArtisanBlogs[0].images.length > 0 ? (
                                            selectedArtisanBlogs[0].images.map((img, idx) => {
                                                let url = typeof img === 'object' && img !== null ? img.url : img;
                                                const key = (typeof img === 'object' && img !== null && img.key) ? img.key : (url ? url : idx);
                                                if (typeof url !== 'string' || !url.trim() || url === 'undefined') return null;

                                                return (
                                                    <div key={key} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                                        <img
                                                            src={url}
                                                            alt={`Blog Image ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                            onError={e => { e.target.style.display = 'none'; }}
                                                        />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-slate-400 italic text-sm">No images attached.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-6">
                            <DialogClose aschild>
                                <Button type="button" variant="outline" className="rounded-xl">Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default Blogs;
