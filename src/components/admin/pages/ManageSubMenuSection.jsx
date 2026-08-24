'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"

const ManageSubMenuSection = () => {
    const [categories, setCategories] = useState([])
    const [editItem, setEditItem] = useState(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)
    const [editType, setEditType] = useState('')
    const [activeTab, setActiveTab] = useState('categories')
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)

    // Form states
    const [categoryForm, setCategoryForm] = useState({ catTitle: '' })
    const [subCategoryForm, setSubCategoryForm] = useState({ categoryId: '', subCatTitle: ''})
    const [packageForm, setPackageForm] = useState({ subCategoryId: '', subCatPackageTitle: '', subCatPackageUrl: ''})

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch(`/api/subMenuFixed`)
            const data = await res.json()
            setCategories(Array.isArray(data) ? data : [])
        } catch (error) {
            toast.error("Failed to fetch categories")
            setCategories([])
        }
    }

    const handleSubcategoryChange = (value) => {
        const nextValue = value || ''
        setPackageForm({ ...packageForm, subCategoryId: nextValue })
        setSelectedSubcategory(nextValue)
    }

    const handleAddCategory = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/subMenuFixed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "category",
                    
                    catTitle: categoryForm.catTitle,
                }),
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success("Category added successfully!")
                setCategoryForm({ catTitle: '' })
                fetchCategories()
            } else {
                toast.error(responseData.message || responseData.error || "Failed to add category")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Something went wrong")
        }
    }

    const handleAddSubCategory = async (e) => {
        e.preventDefault()
        if (!subCategoryForm.categoryId) {
            toast.error("Please select a category")
            return
        }
        try {
            const response = await fetch("/api/subMenuFixed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "subcategory",
                    categoryId: subCategoryForm.categoryId,
                    subCatTitle: subCategoryForm.subCatTitle,
                }),
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success("Subcategory added successfully!")
                setSubCategoryForm({ categoryId: '', subCatTitle: '' })
                fetchCategories()
            } else {
                toast.error(responseData.message || responseData.error || "Failed to add subcategory")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleAddPackage = async (e) => {
        e.preventDefault()
        if (!packageForm.subCategoryId) {
            toast.error("Please select a subcategory")
            return
        }
        try {
            const response = await fetch("/api/subMenuFixed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "package",
                    subCategoryId: packageForm.subCategoryId,
                    title: packageForm.subCatPackageTitle,
                    url: packageForm.subCatPackageUrl,
                }),
            })

            const responseData = await response.json()

            if (response.ok) {
                toast.success("Package added successfully!")
                setPackageForm({ subCategoryId: '', subCatPackageTitle: '', subCatPackageUrl: '' })
                setSelectedSubcategory(null)
                fetchCategories()
            } else {
                toast.error(responseData.message || responseData.error || "Failed to add package")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            let endpoint = "/api/subMenuFixed"
            let body = {}

            const formData = new FormData(e.target)
            const title = formData.get('title')
            const url = formData.get('url')

            if (editType === 'category') {
                endpoint = `/api/subMenuFixed/${editItem._id}`
                body = { catTitle: title }
            } else if (editType === 'subcategory') {
                endpoint = `/api/subMenuFixed/subCategory/${editItem._id}`
                body = {
                    categoryId: editItem.parentId,
                    title: title,
                
                }
            } else if (editType === 'package') {
                endpoint = `/api/subMenuFixed/package/${editItem._id}`
                body = {
                    subCategoryId: editItem.parentId,
                    title: title,
                    url: url,
            
                }
            }

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (response.ok) {
                toast.success("Item updated successfully!")
                setIsEditDialogOpen(false)
                fetchCategories()
            } else {
                toast.error("Failed to update item")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleDelete = async () => {
        try {
            let endpoint = "/api/subMenuFixed"
            const searchParams = new URLSearchParams()

            if (editType === 'category') {
                endpoint = `/api/subMenuFixed/${itemToDelete._id}?${searchParams.toString()}`
            } else if (editType === 'subcategory') {
                searchParams.set('categoryId', itemToDelete.parentId)
                endpoint = `/api/subMenuFixed/subCategory/${itemToDelete._id}?${searchParams.toString()}`
            } else if (editType === 'package') {
                searchParams.set('subCategoryId', itemToDelete.parentId)
                endpoint = `/api/subMenuFixed/package/${itemToDelete._id}?${searchParams.toString()}`
            }

            const response = await fetch(endpoint, {
                method: "DELETE",
            })

            if (response.ok) {
                toast.success("Item deleted successfully!")
                setIsDeleteDialogOpen(false)
                fetchCategories()
            } else {
                toast.error("Failed to delete item")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const toggleActive = async (item, type, parentId = null) => {
        try {
            const response = await fetch(`/api/subMenuFixed/${item._id}/toggle-active`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, parentId, active: !item.active }),
            })

            if (!response.ok) {
                toast.error("Failed to update status")
            }
            await fetchCategories();
            window.dispatchEvent(new Event('menuItemsUpdated'));
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const openEditDialog = (item, type, parentId = null) => {
        setEditItem({ ...item, parentId })
        setEditType(type)
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (item, type, parentId = null) => {
        setItemToDelete({ ...item, parentId })
        setEditType(type)
        setIsDeleteDialogOpen(true)
    }

    const getPackagesForSelectedSubcategory = () => {
        if (!selectedSubcategory) return []

        for (const category of categories) {
            if (category.subCat) {
                for (const subcat of category.subCat) {
                    if (String(subcat._id) === String(selectedSubcategory) && subcat.subCatPackage) {
                        return subcat.subCatPackage.map(pkg => ({
                            ...pkg,
                            categoryTitle: category.catTitle,
                            subcategoryTitle: subcat.title
                        }))
                    }
                }
            }
        }
        return []
    }

    const selectedSubcategoryPackages = getPackagesForSelectedSubcategory()
    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            {/* Add Forms Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Add Category Form */}
                <div className="bg-card border border-border shadow-sm p-6 rounded-xl">
                    <form onSubmit={handleAddCategory} className="flex flex-col justify-between h-full gap-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Add Category</h2>
                            <Label>Category Title</Label>
                            <Input
                                value={categoryForm.catTitle}
                                onChange={(e) => setCategoryForm({ ...categoryForm, catTitle: e.target.value })}
                                placeholder="Enter Category Title"
                                required
                                className={"mt-2"}
                            />

                        </div>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Category</Button>
                    </form>
                </div>

                {/* Add SubCategory Form */}
                <div className="bg-card border border-border shadow-sm p-6 rounded-xl">
                    <form onSubmit={handleAddSubCategory} className="flex flex-col justify-between h-full gap-4">
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold mb-4">Add SubCategory</h2>
                            <Label>Select Category</Label>
                            <Select
                                value={subCategoryForm.categoryId || null}
                                onValueChange={(value) => setSubCategoryForm({ ...subCategoryForm, categoryId: value || '' })}
                                items={categories.map((cat) => ({
                                    value: String(cat._id),
                                    label: cat.catTitle,
                                }))}
                            >
                                <SelectTrigger className="w-full border-border bg-background focus:ring-primary">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="border-border bg-popover">
                                    <SelectGroup>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat._id}
                                                value={String(cat._id)}
                                                className="focus:bg-accent focus:text-accent-foreground font-medium"
                                            >
                                                {cat.catTitle}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div>
                                <Label>SubCategory Title</Label>
                                <Input
                                    value={subCategoryForm.subCatTitle}
                                    onChange={(e) => setSubCategoryForm({ ...subCategoryForm, subCatTitle: e.target.value })}
                                    className={"mt-2"}
                                    placeholder="Enter SubCategory Title"
                                    required
                                />
                            </div>

                        </div>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add SubCategory</Button>
                    </form>
                </div>

                {/* Add Package Form */}
                <div className="bg-card border border-border shadow-sm p-6 rounded-xl">
                    <form onSubmit={handleAddPackage} className="flex flex-col justify-between h-full gap-4">
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold mb-4">Add Package</h2>
                            <Label>Select SubCategory</Label>
                            <Select
                                value={packageForm.subCategoryId || null}
                                onValueChange={handleSubcategoryChange}
                                items={categories.flatMap((cat) =>
                                    (cat.subCat || []).map((sub) => ({
                                        value: String(sub._id),
                                        label: `${cat.catTitle} - ${sub.title}`,
                                    }))
                                )}
                            >
                                <SelectTrigger className="w-full border-border bg-background focus:ring-primary">
                                    <SelectValue placeholder="Select a subcategory" />
                                </SelectTrigger>
                                <SelectContent className="border-border bg-popover">
                                    <SelectGroup>
                                        {categories.map((cat) =>
                                            cat.subCat?.map((sub) => (
                                                <SelectItem
                                                    key={sub._id}
                                                    value={String(sub._id)}
                                                    className="focus:bg-accent focus:text-accent-foreground font-medium"
                                                >
                                                    {cat.catTitle} - {sub.title}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div>
                                <Label>Package Title</Label>
                                <Input
                                    value={packageForm.subCatPackageTitle}
                                    onChange={(e) => setPackageForm({ ...packageForm, subCatPackageTitle: e.target.value })}
                                    placeholder="Enter Package Title"
                                    required
                                    className={"mt-2"}
                                />
                            </div>
                            <div>
                                <Label>Package URL</Label>
                                <Input
                                    value={packageForm.subCatPackageUrl}
                                    onChange={(e) => setPackageForm({ ...packageForm, subCatPackageUrl: e.target.value })}
                                    placeholder="Enter Package URL"
                                    className={"mt-2"}
                                />
                            </div>

                        </div>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add Package</Button>
                    </form>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <Button
                    className={`${activeTab === 'categories' ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent' : 'bg-background text-foreground hover:bg-accent border-border'}`}
                    variant={activeTab === 'categories' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </Button>
                <Button
                    className={`${activeTab === 'subcategories' ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent' : 'bg-background text-foreground hover:bg-accent border-border'}`}
                    variant={activeTab === 'subcategories' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('subcategories')}
                >
                    Subcategories
                </Button>
                <Button
                    className={`${activeTab === 'packages' ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent' : 'bg-background text-foreground hover:bg-accent border-border'}`}
                    variant={activeTab === 'packages' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('packages')}
                >
                    Packages
                </Button>
            </div>

            {/* Categories Table */}
            {activeTab === 'categories' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden mt-8 shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-transparent border-b border-border">
                                <TableHead className="text-heading font-semibold">Category Title</TableHead>
                                <TableHead className="text-heading font-semibold">Status</TableHead>
                                <TableHead className="text-heading font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category._id} className="border-b border-border hover:bg-muted/10 transition-colors">
                                    <TableCell className="font-medium text-foreground">{category.catTitle}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id={`switch-${category._id}`}
                                                checked={category.active}
                                                onCheckedChange={() => toggleActive(category, 'category', category._id,)}
                                            />
                                            <Label htmlFor={`switch-${category._id}`} className="text-muted-foreground text-xs font-medium">
                                                {category.active ? "ON" : "OFF"}
                                            </Label>
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => openEditDialog(category, 'category')}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="destructive"
                                            onClick={() => openDeleteDialog(category, 'category')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Subcategories Table */}
            {activeTab === 'subcategories' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden mt-8 shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-transparent border-b border-border">
                                <TableHead className="text-heading font-semibold">Category</TableHead>
                                <TableHead className="text-heading font-semibold">Subcategory Title</TableHead>
                                <TableHead className="text-heading font-semibold">Status</TableHead>
                                <TableHead className="text-heading font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                category.subCat?.map((subCategory) => (
                                    <TableRow key={`subcat-${subCategory._id}`} className="border-b border-border hover:bg-muted/10 transition-colors">
                                        <TableCell className="font-medium text-foreground">{category.catTitle}</TableCell>
                                        <TableCell className="font-medium text-foreground">{subCategory.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id={`switch-${subCategory._id}`}
                                                    checked={subCategory.active}
                                                    onCheckedChange={() => toggleActive(subCategory, 'subcategory', category._id)}
                                                />
                                                <Label htmlFor={`switch-${subCategory._id}`} className="text-muted-foreground text-xs font-medium">
                                                    {subCategory.active ? "ON" : "OFF"}
                                                </Label>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => openEditDialog(subCategory, 'subcategory', category._id)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(subCategory, 'subcategory', category._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Packages Table */}
            {activeTab === 'packages' && (
                <div className="bg-card border border-border rounded-xl overflow-hidden mt-8 shadow-sm">
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/20 hover:bg-transparent border-b border-border">
                                    <TableHead className="text-heading font-semibold">Category</TableHead>
                                    <TableHead className="text-heading font-semibold">Subcategory</TableHead>
                                    <TableHead className="text-heading font-semibold">Package Title</TableHead>
                                    <TableHead className="text-heading font-semibold">URL</TableHead>
                                    <TableHead className="text-heading font-semibold">Status</TableHead>
                                    <TableHead className="text-heading font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedSubcategory ? (
                                    selectedSubcategoryPackages.length > 0 ? (
                                        selectedSubcategoryPackages.map((pkg) => (
                                            <TableRow key={`pkg-${pkg._id}`} className="border-b border-border hover:bg-muted/10 transition-colors">
                                                <TableCell className="font-medium text-foreground">{pkg.categoryTitle}</TableCell>
                                                <TableCell className="font-medium text-foreground">{pkg.subcategoryTitle}</TableCell>
                                                <TableCell className="font-medium text-foreground">{pkg.title}</TableCell>
                                                <TableCell className="truncate max-w-xs font-medium text-foreground">{pkg.url}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            id={`switch-${pkg._id}`}
                                                            checked={pkg.active}
                                                            onCheckedChange={() => toggleActive(pkg, 'package', selectedSubcategory)}
                                                        />
                                                        <Label htmlFor={`switch-${pkg._id}`} className="text-muted-foreground text-xs font-medium">
                                                            {pkg.active ? "ON" : "OFF"}
                                                        </Label>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => openEditDialog(pkg, 'package', selectedSubcategory)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => openDeleteDialog(pkg, 'package', selectedSubcategory)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-4">
                                                No packages found for this subcategory
                                            </TableCell>
                                        </TableRow>
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-4">
                                            Please select a subcategory to view packages
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4 p-4">
                        {selectedSubcategory ? (
                            selectedSubcategoryPackages.length > 0 ? (
                                selectedSubcategoryPackages.map((pkg) => (
                                    <div key={`mobile-pkg-${pkg._id}`} className="border border-border bg-card shadow-sm rounded-xl p-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Category:</span>
                                                <span>{pkg.categoryTitle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Subcategory:</span>
                                                <span>{pkg.subcategoryTitle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Package:</span>
                                                <span>{pkg.title}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">URL:</span>
                                                <span className="truncate max-w-[180px]">{pkg.url}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Status:</span>
                                                <Switch
                                                    checked={pkg.active}
                                                    onCheckedChange={() => toggleActive(pkg, 'package', selectedSubcategory)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEditDialog(pkg, 'package', selectedSubcategory)}
                                            >
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => openDeleteDialog(pkg, 'package', selectedSubcategory)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    No packages found for this subcategory
                                </div>
                            )
                        ) : (
                            <div className="text-center py-4">
                                Please select a subcategory to view packages
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit {editType}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input
                                name="title"
                                defaultValue={
                                    editType === 'category'
                                        ? editItem?.catTitle
                                        : editItem?.title
                                }
                                required
                            />
                        </div>
                        {(editType === 'package') && (
                            <div>
                                <Label>URL</Label>
                                <Input
                                    name="url"
                                    defaultValue={editItem?.url}
                                    required
                                />
                            </div>
                        )}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this {editType}? This action cannot be undone.</p>
                    <DialogFooter className="bg-white">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="default" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ManageSubMenuSection