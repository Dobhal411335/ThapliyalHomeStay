'use client'

import { usePackage } from "@/components/admin/context/PackageContext";
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const AddHotels = () => {
    const { handleSubmit, register, setValue, reset } = useForm()
    const packages = usePackage()

    const [editItem, setEditItem] = useState(null)
    const [selectedDay, setSelectedDay] = useState("")
    const [editSelectedDay, setEditSelectedDay] = useState("")

    const hotels = packages.hotels || []

    // Generate day options from Day 1 to Day 31
    const dayOptions = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`)

    const onSubmit = async (data) => {
        const hotel = {
            days: selectedDay,
            cityName: data.cityName,
            hotelName: data.hotelName,
        }

        if (!hotel.days || !hotel.cityName || !hotel.hotelName) {
            toast.error("All fields are required", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
            return
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addHotels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, hotel }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Hotel added successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
            } else {
                toast.error(`Failed to add hotel: ${res.message}`, {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            toast.error("Something went wrong", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
        }
    }

    const handleEdit = (item) => {
        setEditItem(item)
        setEditSelectedDay(item.days)
        setValue("editCityName", item.cityName)
        setValue("editHotelName", item.hotelName)
    }

    const handleUpdate = async (data) => {
        const hotel = {
            _id: editItem._id,
            days: editSelectedDay,
            cityName: data.editCityName,
            hotelName: data.editHotelName,
        }

        if (!hotel.days || !hotel.cityName || !hotel.hotelName) {
            toast.error("All fields are required", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
            return
        }

        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addHotels", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, hotel }),
            })

            const res = await response.json()

            if (response.ok) {
                toast.success("Hotel updated successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
                setEditItem(null)
            } else {
                toast.error(`Failed to update hotel: ${res.message}`, {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            toast.error("Error updating hotel", {
                style: { border: "2px solid red", borderRadius: "10px" }
            })
        }
    }

    const handleDelete = async (hotelId) => {
        try {
            const response = await fetch("/api/admin/website-manage/addPackage/addHotels", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pkgId: packages._id, hotelId }),
            })

            if (response.ok) {
                toast.success("Hotel deleted successfully!", {
                    style: { border: "2px solid green", borderRadius: "10px" }
                })
                window.location.reload()
            } else {
                toast.error("Failed to delete hotel", {
                    style: { border: "2px solid red", borderRadius: "10px" }
                })
            }
        } catch (error) {
            console.error("Error deleting hotel:", error)
        }
    }

    return (
        <div className="flex w-full max-w-full flex-col gap-8 rounded-[var(--radius-card)] bg-white p-6 font-body ring-1 ring-border/50 md:p-8">
            <h1 className="font-heading text-3xl text-heading md:text-4xl">Add Hotels</h1>

            {/* Add Hotel Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl rounded-[var(--radius-card)] border border-border bg-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Day Selection */}
                    <div className="flex flex-col gap-2">
                        <Label className="font-ui text-sm text-heading">Day</Label>
                        <Select onValueChange={(value) => setSelectedDay(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Day" />
                            </SelectTrigger>
                            <SelectContent className="border-border bg-white max-h-60">
                                <SelectGroup>
                                    {dayOptions.map((day) => (
                                        <SelectItem key={day} value={day}>
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* City Name */}
                    <div className="flex flex-col gap-2">
                        <Label className="font-ui text-sm text-heading">City Name</Label>
                        <Input
                            {...register("cityName")}
                            placeholder="Enter city name"
                        />
                    </div>

                    {/* Hotel Name */}
                    <div className="flex flex-col gap-2">
                        <Label className="font-ui text-sm text-heading">Hotel Name</Label>
                        <Input
                            {...register("hotelName")}
                            placeholder="Enter hotel name"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <Button type="submit">
                        Save Hotel
                    </Button>
                </div>
            </form>

            {/* Hotels Table */}
            <Table className="max-w-5xl mx-auto">
                <TableHeader>
                    <TableRow className="border-border">
                        <TableHead className="text-center text-heading">Day</TableHead>
                        <TableHead className="text-center text-heading">City Name</TableHead>
                        <TableHead className="text-center text-heading">Hotel Name</TableHead>
                        <TableHead className="text-center text-heading">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hotels.length > 0 ? (
                        hotels.map((hotel) => (
                            <TableRow key={hotel._id} className="border-border">
                                <TableCell className="border border-border text-center">{hotel.days}</TableCell>
                                <TableCell className="border border-border text-center">{hotel.cityName}</TableCell>
                                <TableCell className="border border-border text-center">{hotel.hotelName}</TableCell>
                                <TableCell className="border border-border">
                                    <div className="flex items-center justify-center gap-4">
                                        <Button size="icon" onClick={() => handleEdit(hotel)} variant="outline">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" onClick={() => handleDelete(hotel._id)} variant="destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow className="border-border">
                            <TableCell colSpan={4} className="border border-border text-center">
                                No Hotels Added
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Edit Hotel Dialog */}
            {editItem && (
                <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
                    <DialogContent className="md:!max-w-xl border-border font-body">
                        <DialogHeader>
                            <DialogTitle>Edit Hotel</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(handleUpdate)}>
                            <div className="grid grid-cols-1 gap-4">
                                {/* Day Selection */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-ui text-sm text-heading">Day</Label>
                                    <Select defaultValue={editItem.days} onValueChange={(value) => setEditSelectedDay(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Day" />
                                        </SelectTrigger>
                                        <SelectContent className="border-border bg-white max-h-60">
                                            <SelectGroup>
                                                {dayOptions.map((day) => (
                                                    <SelectItem key={day} value={day}>
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* City Name */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-ui text-sm text-heading">City Name</Label>
                                    <Input
                                        {...register("editCityName")}
                                    />
                                </div>

                                {/* Hotel Name */}
                                <div className="flex flex-col gap-2">
                                    <Label className="font-ui text-sm text-heading">Hotel Name</Label>
                                    <Input
                                        {...register("editHotelName")}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button type="submit">
                                    Update Hotel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default AddHotels
