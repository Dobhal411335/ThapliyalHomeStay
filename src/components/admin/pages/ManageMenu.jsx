'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const Page = () => {

    const { handleSubmit, register, setValue } = useForm()
    const [menuItems, setMenuItems] = useState([])
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        fetch(`/api/getAllMenuItems`)
            .then(res => res.json())
            .then(data => setMenuItems(data))
    }, [])

    const onSubmit = async (data) => {
        if (!data.title) {
            toast.error("Menu Title is required", {
                style: {
                    borderRadius: "10px",
                    border: "2px solid red",
                }
            })
            return;
        }

        data.active = true
        data.order = menuItems.length + 1

        try {
            const result = await fetch("/api/admin/website-manage/addMenu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!result.ok) {
                toast.error("Failed To Add Menu", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid red",
                    },
                })
            } else {
                setValue("title", "");
                toast.success("Menu added successfully!", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid green",
                    },
                })
                window.location.reload()
            }
        } catch (error) {
            toast.error("Something went wrong", {
                style: {
                    borderRadius: "10px",
                    border: "2px solid red",
                },
            })
        }
    }

    const handleUpdate = async (data) => {
        try {
            const response = await fetch(`/api/admin/website-manage/addMenu`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editItem._id, ...data }),
            });

            if (response.ok) {
                toast.success("Menu updated successfully!", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid green",
                    },
                });
                setMenuItems(menuItems.map(item => item._id === editItem._id ? { ...item, ...data } : item));
                setEditItem(null);
                window.location.reload();
            } else {
                toast.error("Failed to update menu", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid red",
                    },
                });
            }
        } catch (error) {
            toast.error("Error updating menu item", {
                style: {
                    borderRadius: "10px",
                    border: "2px solid red",
                },
            });
        }
    };

    const toggleSwitch = async (id, currentStatus) => {
        try {
            const response = await fetch(`/api/admin/website-manage/addMenu`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, active: !currentStatus }),
            });

            const result = await response.json();

            if (result.message === "Menu updated successfully!") {
                setMenuItems(menuItems.map(item =>
                    item._id === id ? { ...item, active: !item.active } : item
                ));
            } else {
                toast.error("Failed to update menu", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid red",
                    },
                });
            }
        } catch (error) {
            console.error("Error updating menu item:", error);
        }
    }

    const handleEdit = (item) => {
        setEditItem(item);
        setValue("title", item.title);
        setValue("order", item.order);
    };

    const deleteMenuItem = async (id) => {
        try {
            const response = await fetch(`/api/admin/website-manage/addMenu`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                setMenuItems(menuItems.filter(item => item._id !== id));
                toast.success("Menu deleted successfully!", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid green",
                    },
                });
            } else {
                toast.error("Failed to delete menu", {
                    style: {
                        borderRadius: "10px",
                        border: "2px solid red",
                    },
                });
            }
        } catch (error) {
            console.error("Error deleting menu item:", error);
        }
    }
    return (

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <h1 className="text-3xl md:text-4xl px-12 font-semibold">Manage Menu Section</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end justify-center gap-4 my-12 bg-card p-6 rounded-xl border border-border shadow-sm max-w-5xl mx-auto">
                        <div className="flex flex-col justify-center gap-2">
                            <Label htmlFor="menu" className="text-foreground font-medium">Menu Title</Label>
                            <Input
                                name="title"
                                id="title"
                                placeholder="Enter Menu Title"
                                className="md:w-96"
                                {...register("title")}
                            />
                        </div>
                        <Button type="submit">
                            Add Menu
                        </Button>
                    </form>

                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm max-w-5xl mx-auto w-full text-center">
                        <div className="min-w-[100px] md:min-w-0">
                            <Table className="w-full min-w-max lg:min-w-0">
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="text-center text-heading font-semibold w-1/3">Menu Title</TableHead>
                                        <TableHead className="text-center text-heading font-semibold w-1/3">Order</TableHead>
                                        <TableHead className="w-1/3 text-heading font-semibold text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {menuItems.map((item) => (
                                        <TableRow key={item._id} className="border-border">
                                            <TableCell className="font-medium text-foreground">{item.title}</TableCell>
                                            <TableCell className="font-medium text-foreground">{item.order}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-6">
                                                    <Button size="icon" onClick={() => handleEdit(item)} variant="outline" className="border-border text-foreground hover:bg-accent">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" onClick={() => deleteMenuItem(item._id)} variant="destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            id={`switch-${item._id}`}
                                                            checked={item.active}
                                                            onCheckedChange={() => toggleSwitch(item._id, item.active)}
                                                        />
                                                        <Label htmlFor={`switch-${item._id}`} className="text-muted-foreground text-xs font-medium">
                                                            {item.active ? "ON" : "OFF"}
                                                        </Label>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {editItem && (
                        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
                            <DialogContent className="font-barlow">
                                <DialogHeader>
                                    <DialogTitle>Edit Menu Item</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(handleUpdate)}>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-foreground">Title</Label>
                                        <Input {...register("title")} className="bg-background" />
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Label className="text-foreground">Order</Label>
                                        <Input {...register("order")} min={0} max={menuItems.length + 1} type="number" className="bg-background" />
                                    </div>
                                    <DialogFooter>
                                        <Button className="mt-4" type="submit">Save Changes</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
    )
}

export default Page;
