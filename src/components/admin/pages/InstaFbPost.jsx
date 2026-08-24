"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PencilIcon, Trash2Icon, LayoutTemplate, UploadCloud, Image as ImageIcon, Link as LinkIcon, Share2 } from "lucide-react";

const Facebook = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const InstaFbPost = ({}) => {
    const [posts, setPosts] = useState([]);
    const [editPost, setEditPost] = useState(null);
    const [activeTab, setActiveTab] = useState("instagram"); // "instagram" | "facebook"
    
    const [formData, setFormData] = useState({
        image: { url: "", key: "" },
        link: "",
    });
    
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    
    const fileInputRef = useRef(null);

    const instaUrl = "/api/instagram-posts";
    const fbUrl = "/api/facebook-posts";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const url = activeTab === "instagram" ? `${instaUrl}` : `${fbUrl}`;
                const response = await fetch(url);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                toast.error(`Failed to fetch ${activeTab} posts`, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        };
        fetchPosts();
    }, [activeTab]);

    const handleTabChange = (tab) => {
        if (activeTab === tab) return;
        setActiveTab(tab);
        setEditPost(null);
        setFormData({ image: { url: "", key: "" }, link: "" });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
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
            
            setFormData(prev => ({ ...prev, image: { url: result.url, key: result.key } }));
            toast.success('Image uploaded successfully!', { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
        } catch (err) {
            toast.error('Image upload failed', { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image.url) return toast.error("Please upload an image", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        if (!formData.link) return toast.error("Please enter a URL", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        
        setSubmitting(true);
        try {
            const method = editPost ? "PATCH" : "POST";
            const url = activeTab === "instagram" ? instaUrl : fbUrl;
            
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    image: formData.image.url,
                    url: formData.link,
                    id: editPost,
                    type: activeTab
                }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                toast.success(`${activeTab === 'instagram' ? 'Instagram' : 'Facebook'} post ${editPost ? "updated" : "added"} successfully`, { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setEditPost(null);
                
                // Refresh posts
                const updatedPosts = await fetch(`${activeTab === "instagram" ? instaUrl : fbUrl}`).then((res) => res.json());
                setPosts(updatedPosts);
                
                setFormData({ image: { url: "", key: "" }, link: "" });
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (post) => {
        setEditPost(post._id);
        setFormData({
            image: { url: post.image, key: post.imageKey || "" },
            link: post.url || "",
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            const post = posts.find(p => p._id === id);
            const url = post?.type === "facebook" ? fbUrl : instaUrl;
            
            const response = await fetch(url, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            
            const data = await response.json();
            
            if (response.ok) {
                toast.success("Post deleted successfully", { style: { borderRadius: "10px", border: "1px solid #dcfce7", background: "#f0fdf4", color: "#166534" } });
                setPosts((prev) => prev.filter((p) => p._id !== id));
            } else {
                toast.error(data.error, { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
            }
        } catch (error) {
            toast.error("Something went wrong", { style: { borderRadius: "10px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#991b1b" } });
        }
    };

    const confirmDelete = async () => {
        if (postToDelete) {
            await handleDelete(postToDelete);
            setPostToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPostToDelete(null);
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: { url: '', key: '' } }));
    };

    // Filter posts for safety, though the API should return correctly based on URL
    const filteredPosts = posts.filter(post => post.type === activeTab);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 p-6 font-sans pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Social Media Posts</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and display your Instagram and Facebook embedded posts.</p>
                </div>
                
                {/* Platform Toggles */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                        onClick={() => handleTabChange("instagram")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === "instagram" 
                            ? "bg-white text-pink-600 shadow-sm border border-slate-200/50" 
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <Instagram className="w-4 h-4" />
                        Instagram
                    </button>
                    <button
                        onClick={() => handleTabChange("facebook")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === "facebook" 
                            ? "bg-white text-blue-600 shadow-sm border border-slate-200/50" 
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <Facebook className="w-4 h-4" />
                        Facebook
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Form Section */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    {editPost ? `Edit ${activeTab === 'instagram' ? 'Instagram' : 'Facebook'} Post` : `Add New ${activeTab === 'instagram' ? 'Instagram' : 'Facebook'} Post`}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500">
                                Upload a thumbnail image and provide the URL to the social media post.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Image Upload */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-slate-600 ml-1">Post Thumbnail <span className="text-red-500">*</span></Label>
                                        
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            ref={fileInputRef}
                                            className="hidden"
                                        />

                                        {!formData.image.url ? (
                                            <div 
                                                onClick={() => !uploading && fileInputRef.current && fileInputRef.current.click()}
                                                className={`border-2 border-dashed rounded-2xl h-[240px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors
                                                    ${uploading ? 'bg-slate-50 border-slate-200' : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 bg-slate-50/50'}`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                                        <p className="text-sm font-medium text-slate-600">Uploading...</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                                            <UploadCloud className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div className="text-center px-4">
                                                            <p className="text-sm font-medium text-slate-700">Upload Image</p>
                                                            <p className="text-xs text-slate-500 mt-1">Recommended: Square format</p>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative w-full max-w-[240px] mx-auto lg:mx-0 h-[240px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-50 group">
                                                <Image
                                                    src={formData.image.url}
                                                    alt="Post Thumbnail Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={handleRemoveImage}
                                                        className="w-12 h-12 rounded-full shadow-lg"
                                                    >
                                                        <Trash2Icon className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Form Inputs */}
                                    <div className="space-y-5 flex flex-col justify-center">
                                        <div className="grid gap-2">
                                            <Label className="text-sm font-medium text-slate-600 ml-1">
                                                {activeTab === 'instagram' ? 'Instagram' : 'Facebook'} URL <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input 
                                                    name="link" 
                                                    placeholder={`https://www.${activeTab}.com/p/...`}
                                                    type="url" 
                                                    value={formData.link} 
                                                    onChange={handleInputChange} 
                                                    required
                                                    className="h-11 pl-10 rounded-xl border-slate-200 focus-visible:ring-slate-200 focus-visible:border-slate-400 bg-slate-50/50 transition-colors hover:bg-slate-50"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 ml-1">Provide the direct link to the post.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-3">
                                    {editPost && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => {
                                                setEditPost(null);
                                                setFormData({ image: { url: "", key: "" }, link: "" });
                                            }} 
                                            className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel Editing
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit" 
                                        className={`h-11 px-8 rounded-xl text-white font-medium transition-all hover:shadow-md ${
                                            activeTab === 'instagram' 
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`} 
                                        disabled={submitting || uploading}
                                    >
                                        {submitting ? "Saving..." : editPost ? "Update Post" : "Add Post"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Section */}
                <div className="w-full">
                    <Card className="rounded-[20px] border-slate-100 shadow-sm bg-white overflow-hidden h-full">
                        <CardHeader className="border-b border-slate-50 bg-white/50 pb-6">
                            <div className="flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-slate-400" />
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Existing {activeTab === 'instagram' ? 'Instagram' : 'Facebook'} Posts
                                </CardTitle>
                            </div>
                            <CardDescription className="text-slate-500 mt-1">Review and manage your embedded social media posts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-2">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                        <TableRow className="border-0 hover:bg-transparent">
                                            <TableHead className="text-slate-500 font-medium h-12 w-16 text-center">#</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12 w-32 text-center">Thumbnail</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12">Post Link</TableHead>
                                            <TableHead className="text-slate-500 font-medium h-12 text-center w-32">Platform</TableHead>
                                            <TableHead className="text-slate-500 font-medium text-right pr-6 h-12">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPosts.length > 0 ? (
                                            filteredPosts.map((post, index) => (
                                                <TableRow key={post._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                                                    <TableCell className="text-center py-4 text-slate-500">{index + 1}</TableCell>
                                                    <TableCell className="py-4 text-center">
                                                        <div className="relative w-16 h-16 mx-auto rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                                            {post.image ? (
                                                                <Image src={post.image} alt="Thumbnail" fill className="object-cover" />
                                                            ) : (
                                                                <ImageIcon className="w-5 h-5 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        {post.url ? (
                                                            <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1 max-w-sm truncate" title={post.url}>
                                                                <LinkIcon className="w-3.5 h-3.5 shrink-0" /> {post.url}
                                                            </a>
                                                        ) : (
                                                            <span className="text-slate-400 text-sm">No link provided</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                            post.type === 'instagram' 
                                                            ? 'bg-pink-50 text-pink-700 border border-pink-100'
                                                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                                                        }`}>
                                                            {post.type === 'instagram' ? <Instagram className="w-3 h-3" /> : <Facebook className="w-3 h-3" />}
                                                            {post.type === 'instagram' ? 'Instagram' : 'Facebook'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6 py-4">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 rounded-xl transition-colors">
                                                                <PencilIcon className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={() => { setShowDeleteModal(true); setPostToDelete(post._id); }} className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                                <Trash2Icon className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan="5" className="text-center py-12 text-slate-400">
                                                    No {activeTab} posts found. Create one to get started.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <DialogContent className="rounded-[24px] p-6 border-slate-100 shadow-xl bg-white max-w-md font-sans gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold text-slate-800">Delete Post</DialogTitle>
                    </DialogHeader>
                    <p className="text-slate-600 mb-6">Are you sure you want to delete this {activeTab} post? This action cannot be undone.</p>
                    <DialogFooter className="gap-2 sm:gap-0 bg-white">
                        <Button variant="ghost" onClick={cancelDelete} className="h-11 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">Cancel</Button>
                        <Button variant="default" onClick={confirmDelete} className="h-11 rounded-xl px-6 font-medium">Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InstaFbPost;
