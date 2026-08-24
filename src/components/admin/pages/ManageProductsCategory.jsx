'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

const ManageProductsCategory = () => {
    const { handleSubmit, register, setValue, reset } = useForm()
    const [menuItems, setMenuItems] = useState([])
    const [selectedMenu, setSelectedMenu] = useState("")
    const [editItem, setEditItem] = useState(null)
    const [bannerImage, setBannerImage] = useState(null)
    const [editBannerImage, setEditBannerImage] = useState(null)
    const [editProfileImage, setEditProfileImage] = useState(null)
    const [profileImage, setProfileImage] = useState(null)
    const [uploadingProfile, setUploadingProfile] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [uploadingEditProfile, setUploadingEditProfile] = useState(false)
    const [uploadingEditBanner, setUploadingEditBanner] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const profileFileInputRef = useRef(null)
    const bannerFileInputRef = useRef(null)
    const editBannerFileInputRef = useRef(null)
    const editProfileFileInputRef = useRef(null)

    const handleRemoveImage = async (key, type) => {
        if (type === 'banner') {
            setBannerImage(null)
        } else if (type === 'profile') {
            setProfileImage(null)
        } else if (type === 'editBanner') {
            setEditBannerImage(null)
        } else if (type === 'editProfile') {
            setEditProfileImage(null)
        }
        if (!key) return
        toast.loading('Deleting image from Cloudinary...', { id: 'cloud-delete' })
        try {
            const res = await fetch('/api/cloudinary', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicId: key }),
            })
            const data = await res.json()
            if (res.ok) {
                toast.success('Image deleted from Cloudinary!', { id: 'cloud-delete' })
            } else {
                toast.error('Cloudinary error: ' + (data.error || 'Failed to delete image from Cloudinary'), { id: 'cloud-delete' })
            }
        } catch (err) {
            toast.error('Failed to delete image from Cloudinary (network or server error)', { id: 'cloud-delete' })
        }
    }

    useEffect(() => {
        fetch(`/api/getAllMenuItems`)
            .then(res => res.json())
            .then(data => setMenuItems(data))
    }, [])

    const uploadImage = async (file, { onSuccess, setUploading, inputRef }) => {
        if (!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formData,
            })
            if (!res.ok) throw new Error('Upload failed')
            const result = await res.json()
            onSuccess({ url: result.url, key: result.key })
            toast.success('Image uploaded successfully!')
        } catch (err) {
            toast.error('Failed to upload image')
        } finally {
            setUploading(false)
            if (inputRef?.current) inputRef.current.value = ''
        }
    }

    const onSubmit = async (data) => {
        if (!selectedMenu) {
            toast.error("Please select a Menu Type", { style: { borderRadius: "10px", border: "2px solid red" } })
            return
        }

        if (!data.subMenu?.title) {
            toast.error("Sub Menu Title is required", {
                style: {
                    borderRadius: "10px",
                    border: "2px solid red",
                }
            })
            return
        }

        const selectedMenuItem = menuItems.find(item => item.title === selectedMenu)
        if (!selectedMenuItem?._id) {
            toast.error("Selected menu not found", { style: { borderRadius: "10px", border: "2px solid red" } })
            return
        }

        const url = data.subMenu.title.replace(/\s+/g, '_').toLowerCase()

        const payload = {
            id: selectedMenuItem._id,
            subMenu: {
                title: data.subMenu.title,
                url,
                profileImage: profileImage || null,
                active: true,
                order: (selectedMenuItem.subMenu?.length || 0) + 1,
                banner: bannerImage || null,
            },
        }

        setSubmitting(true)
        try {
            const result = await fetch("/api/admin/website-manage/addSubMenu", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const res = await result.json()

            if (!result.ok) {
                toast.error(`Failed To Add Sub Menu: ${res.message}`, { style: { borderRadius: "10px", border: "2px solid red" } })
            } else {
                reset()
                setSelectedMenu("")
                setBannerImage(null)
                setProfileImage(null)
                toast.success("Sub Menu added successfully!", { style: { borderRadius: "10px", border: "2px solid green" } })
                window.location.reload()
            }
        } catch (error) {
            toast.error("Something went wrong", {
                style: {
                    borderRadius: "10px",
                    border: "2px solid red",
                },
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdate = async (data) => {
        const selectedMenuItem = menuItems.find(item => item.title === selectedMenu)
        if (!selectedMenuItem?._id || !editItem?._id) {
            toast.error("Unable to update submenu", { style: { borderRadius: "10px", border: "2px solid red" } })
            return
        }

        setSubmitting(true)
        try {
            const response = await fetch(`/api/admin/website-manage/addSubMenu`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedMenuItem._id,
                    subMenuId: editItem._id,
                    subMenu: {
                        title: data.subMenu.title,
                        order: Number(data.subMenu.order),
                        banner: editBannerImage,
                        profileImage: editProfileImage,
                    },
                }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Submenu updated successfully!", { style: { borderRadius: "10px", border: "2px solid green" } })
                setEditItem(null)
                setEditBannerImage(null)
                setEditProfileImage(null)
                window.location.reload()
            } else {
                toast.error(`Failed to update submenu: ${res.message}`, { style: { borderRadius: "10px", border: "2px solid red" } })
            }
        } catch (error) {
            toast.error("Error updating submenu", { style: { borderRadius: "10px", border: "2px solid red" } })
        } finally {
            setSubmitting(false)
        }
    }

    const toggleSwitch = async (subMenuId, currentStatus) => {
        const id = menuItems.find(item => item.subMenu.some(sub => sub._id === subMenuId))?._id
        try {
            const response = await fetch(`/api/admin/website-manage/addSubMenu`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, subMenuId, active: !currentStatus }),
            })

            if (response.ok) {
                setMenuItems(menuItems.map(menu =>
                    menu._id === id
                        ? {
                            ...menu,
                            subMenu: menu.subMenu.map(sub =>
                                sub._id === subMenuId ? { ...sub, active: !sub.active } : sub
                            )
                        }
                        : menu
                ))
            } else {
                toast.error("Failed to update submenu status", { style: { borderRadius: "10px", border: "2px solid red" } })
            }
        } catch (error) {
            console.error("Error updating submenu status:", error)
        }
    }

    const handleEdit = (item) => {
        setEditItem(item)
        setValue("subMenu.title", item.title)
        setValue("subMenu.order", item.order)
        if (item.banner && typeof item.banner === 'object' && typeof item.banner.url === 'string' && item.banner.url.trim() !== '') {
            setEditBannerImage(item.banner)
        } else {
            setEditBannerImage(null)
        }
        if (item.profileImage && typeof item.profileImage === 'object' && typeof item.profileImage.url === 'string' && item.profileImage.url.trim() !== '') {
            setEditProfileImage(item.profileImage)
        } else {
            setEditProfileImage(null)
        }
    }

    const deleteMenuItem = async (subMenuId) => {
        if (!menuItems || !Array.isArray(menuItems)) {
            toast.error("Menu items not loaded")
            return
        }
        const menuItem = menuItems.find(item => Array.isArray(item.subMenu) && item.subMenu.some(sub => sub._id === subMenuId))
        if (!menuItem) {
            toast.error("Menu item not found")
            return
        }
        const id = menuItem._id
        try {
            const response = await fetch(`/api/admin/website-manage/addSubMenu`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, subMenuId }),
            })

            const res = await response.json()

            if (response.ok) {
                setMenuItems(menuItems.map(menu =>
                    menu._id === id
                        ? { ...menu, subMenu: menu.subMenu.filter(sub => sub._id !== subMenuId) }
                        : menu
                ))
                toast.success("Submenu deleted successfully!", { style: { borderRadius: "10px", border: "2px solid green" } })
            } else {
                toast.error(res.message, { style: { borderRadius: "10px", border: "2px solid red" } })
            }
        } catch (error) {
            console.error("Error deleting submenu:", error)
        }
    }

    const UploadButton = ({ onClick, disabled, uploading, label }) => (
        <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md mt-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
            onClick={onClick}
            disabled={disabled || uploading}
        >
            {uploading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                </>
            ) : (
                label
            )}
        </button>
    )

    const ImagePreview = ({ src, alt, onRemove, rounded = false, uploading = false }) => (
        <div className={`relative ${rounded ? '' : 'w-full'}`}>
            <Image
                className={`${rounded ? 'w-32 h-32 object-cover rounded-full' : 'w-full object-cover rounded-lg'} border border-border ${uploading ? 'opacity-50' : ''}`}
                src={src}
                quality={50}
                alt={alt}
                width={rounded ? 128 : 600}
                height={rounded ? 128 : 400}
            />
            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            )}
            {!uploading && (
                <button
                    type="button"
                    className={`absolute ${rounded ? 'top-0 right-0' : 'top-2 right-2'} bg-destructive text-destructive-foreground rounded-full p-1`}
                    onClick={onRemove}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    )

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-6 my-8 md:my-12 px-4 bg-card p-6 rounded-xl border border-border shadow-sm max-w-2xl mx-auto">
                <div className="flex flex-col justify-center gap-6 w-full">
                    <div className="flex flex-col gap-2">
                        <Label className="text-foreground font-medium">Select Menu Type</Label>
                        <Select value={selectedMenu} onValueChange={setSelectedMenu}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Menu" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Menu</SelectLabel>
                                    {menuItems.map((item) => (
                                        <SelectItem key={item._id} value={item.title}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="subMenu.title" className="text-foreground font-medium">Create Sub Menu</Label>
                        <Input
                            name="subMenu.title"
                            id="subMenu.title"
                            placeholder="Enter Sub Menu Title"
                            className="w-full"
                            {...register("subMenu.title")}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-foreground font-medium">Upload Category Profile Image</Label>
                        {profileImage ? (
                            <ImagePreview
                                src={profileImage.url}
                                alt="Profile"
                                rounded
                                uploading={uploadingProfile}
                                onRemove={() => handleRemoveImage(profileImage?.key, "profile")}
                            />
                        ) : uploadingProfile ? (
                            <div className="flex items-center justify-center w-32 h-32 rounded-full border border-dashed border-border bg-muted/40">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : null}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={profileFileInputRef}
                            onChange={(event) =>
                                uploadImage(event.target.files?.[0], {
                                    onSuccess: setProfileImage,
                                    setUploading: setUploadingProfile,
                                    inputRef: profileFileInputRef,
                                })
                            }
                            disabled={!selectedMenu || !!profileImage || uploadingProfile}
                        />
                        <UploadButton
                            onClick={() => profileFileInputRef.current?.click()}
                            disabled={!selectedMenu || !!profileImage}
                            uploading={uploadingProfile}
                            label="Upload Profile Image"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-foreground font-medium">Upload Banner</Label>
                        {bannerImage ? (
                            <ImagePreview
                                src={bannerImage.url}
                                alt="Banner"
                                uploading={uploadingBanner}
                                onRemove={() => handleRemoveImage(bannerImage?.key, "banner")}
                            />
                        ) : uploadingBanner ? (
                            <div className="flex items-center justify-center w-full h-40 rounded-lg border border-dashed border-border bg-muted/40">
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    <span className="text-sm">Uploading banner...</span>
                                </div>
                            </div>
                        ) : null}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={bannerFileInputRef}
                            onChange={(event) =>
                                uploadImage(event.target.files?.[0], {
                                    onSuccess: setBannerImage,
                                    setUploading: setUploadingBanner,
                                    inputRef: bannerFileInputRef,
                                })
                            }
                            disabled={!selectedMenu || !!bannerImage || uploadingBanner}
                        />
                        <UploadButton
                            onClick={() => bannerFileInputRef.current?.click()}
                            disabled={!selectedMenu || !!bannerImage}
                            uploading={uploadingBanner}
                            label="Upload Banner Image"
                        />
                    </div>
                </div>
                <button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md mt-4 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2"
                    type="submit"
                    disabled={submitting || uploadingProfile || uploadingBanner}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Add SubMenu"
                    )}
                </button>
            </form>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm max-w-5xl mx-auto w-full overflow-x-auto lg:overflow-visible text-center mb-12">
                <div className="min-w-[200px] md:min-w-0">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-center text-heading font-semibold w-1/3">Add Product</TableHead>
                                <TableHead className="text-center text-heading font-semibold w-1/3">Sub Menu Title</TableHead>
                                <TableHead className="text-center text-heading font-semibold w-1/3">Order</TableHead>
                                <TableHead className="w-1/3 text-heading font-semibold text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedMenu ? (
                                menuItems.some(item => item.title === selectedMenu && item.subMenu.length !== 0) ? (
                                    menuItems
                                        .filter(item => item.title === selectedMenu)
                                        .flatMap(menuItem => menuItem.subMenu.sort((a, b) => a.order - b.order).map((subItem) => (
                                            <TableRow key={subItem._id} className="border-border">
                                                <TableCell className="font-medium text-foreground">
                                                    <Link href={`/admin/manage_packages_category/addSubMenuPackage/${subItem._id}`} className="bg-background border border-border p-2 rounded-full text-primary hover:text-primary/80 flex items-center justify-center transition-colors">
                                                        <span className="xl:mr-6 mr-2 bg-muted text-muted-foreground rounded py-1 px-3 text-xs">{subItem?.packages?.length !== 0 ? subItem?.packages?.length : 0}</span>
                                                        <Plus className="w-4 h-4 mr-1" />
                                                        <span className="text-sm">Add Package</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">{subItem?.title}</TableCell>
                                                <TableCell className="font-medium text-foreground">{subItem?.order}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(subItem)}
                                                            className="p-2 rounded-full border border-border text-foreground hover:bg-accent transition-colors"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteMenuItem(subItem._id)}
                                                            className="p-2 rounded-full border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                id={`switch-${subItem._id}`}
                                                                checked={subItem.active}
                                                                onCheckedChange={() => toggleSwitch(subItem._id, subItem.active)}
                                                            />
                                                            <Label htmlFor={`switch-${subItem._id}`} className="text-muted-foreground text-xs font-medium">
                                                                {subItem.active ? "ON" : "OFF"}
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )))
                                ) : (
                                    <TableRow className="border-border">
                                        <TableCell colSpan={4} className="font-medium text-foreground text-center">
                                            No Sub Menu Available
                                        </TableCell>
                                    </TableRow>
                                )
                            ) : (
                                <TableRow className="border-border">
                                    <TableCell colSpan={4} className="font-medium text-foreground text-center">
                                        No Menu Selected
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {editItem && (
                    <Dialog open={!!editItem} onOpenChange={() => { setEditItem(null) }}>
                        <DialogContent className="font-barlow">
                            <DialogHeader>
                                <DialogTitle>Edit Menu Item</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleUpdate)}>
                                <div className="flex flex-col gap-2">
                                    <Label>Title</Label>
                                    <Input {...register("subMenu.title")} />
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Label>Order</Label>
                                    <Input {...register("subMenu.order")} min={0} max={menuItems.find(item => item.title === selectedMenu)?.subMenu.length + 1} type="number" />
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Label className="text-foreground">Upload Banner</Label>
                                    {editBannerImage && typeof editBannerImage.url === 'string' && editBannerImage.url.trim() !== '' ? (
                                        <div className="relative h-32">
                                            <Image className={`h-full w-full object-contain object-center rounded-lg border border-border ${uploadingEditBanner ? 'opacity-50' : ''}`} src={editBannerImage.url} quality={50} alt="Banner" width={400} height={192} />
                                            {uploadingEditBanner ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                </div>
                                            ) : (
                                                <button type="button" className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1" onClick={() => handleRemoveImage(editBannerImage.key, "editBanner")}><X className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    ) : uploadingEditBanner ? (
                                        <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border bg-muted/40">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    ) : null}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={editBannerFileInputRef}
                                        onChange={(event) =>
                                            uploadImage(event.target.files?.[0], {
                                                onSuccess: setEditBannerImage,
                                                setUploading: setUploadingEditBanner,
                                                inputRef: editBannerFileInputRef,
                                            })
                                        }
                                        disabled={!!editBannerImage || uploadingEditBanner}
                                    />
                                    <UploadButton
                                        onClick={() => editBannerFileInputRef.current?.click()}
                                        disabled={!!editBannerImage}
                                        uploading={uploadingEditBanner}
                                        label="Upload Banner Image"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Label className="text-foreground">Upload Profile Image</Label>
                                    {editProfileImage && typeof editProfileImage.url === 'string' && editProfileImage.url.trim() !== '' ? (
                                        <div className="relative h-32">
                                            <Image className={`h-full w-full object-contain object-center rounded-lg border border-border ${uploadingEditProfile ? 'opacity-50' : ''}`} src={editProfileImage.url} quality={50} alt="Profile" width={400} height={192} />
                                            {uploadingEditProfile ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg">
                                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                </div>
                                            ) : (
                                                <button type="button" className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1" onClick={() => handleRemoveImage(editProfileImage.key, "editProfile")}><X className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    ) : uploadingEditProfile ? (
                                        <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-border bg-muted/40">
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        </div>
                                    ) : null}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        ref={editProfileFileInputRef}
                                        onChange={(event) =>
                                            uploadImage(event.target.files?.[0], {
                                                onSuccess: setEditProfileImage,
                                                setUploading: setUploadingEditProfile,
                                                inputRef: editProfileFileInputRef,
                                            })
                                        }
                                        disabled={!!editProfileImage || uploadingEditProfile}
                                    />
                                    <UploadButton
                                        onClick={() => editProfileFileInputRef.current?.click()}
                                        disabled={!!editProfileImage}
                                        uploading={uploadingEditProfile}
                                        label="Upload Profile Image"
                                    />
                                </div>
                                <DialogFooter>
                                    <button
                                        className="bg-primary text-primary-foreground rounded-md px-4 py-2 font-medium hover:bg-primary/90 mt-4 transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2"
                                        type="submit"
                                        disabled={submitting || uploadingEditBanner || uploadingEditProfile}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    )
}

export default ManageProductsCategory
