"use client";

import { usePackage } from "@/components/admin/context/PackageContext";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddSummary = () => {
  const { handleSubmit, register, setValue, reset } = useForm();
  const packages = usePackage();

  const [editItem, setEditItem] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [editSelectedDay, setEditSelectedDay] = useState("");

  // Dynamic description inputs for ADD form
  const [descriptions, setDescriptions] = useState([""]);

  // Dynamic description inputs for EDIT form
  const [editDescriptions, setEditDescriptions] = useState([""]);

  const summaries = packages.summary || [];

  // Generate day options from Day 1 to Day 31
  const dayOptions = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);

  // --- ADD form handlers ---
  const addDescriptionField = () => {
    setDescriptions((prev) => [...prev, ""]);
  };

  const removeDescriptionField = (index) => {
    setDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index, value) => {
    setDescriptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // --- EDIT form handlers ---
  const addEditDescriptionField = () => {
    setEditDescriptions((prev) => [...prev, ""]);
  };

  const removeEditDescriptionField = (index) => {
    setEditDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditDescriptionChange = (index, value) => {
    setEditDescriptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const onSubmit = async () => {
    const filteredDesc = descriptions.filter((d) => d.trim() !== "");

    if (!selectedDay || filteredDesc.length === 0) {
      toast.error("Day and at least one description are required", {
        style: { border: "2px solid red", borderRadius: "10px" },
      });
      return;
    }

    const summary = {
      days: selectedDay,
      description: filteredDesc,
    };

    try {
      const response = await fetch(
        "/api/admin/website-manage/addPackage/addSummary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pkgId: packages._id, summary }),
        },
      );

      const res = await response.json();

      if (response.ok) {
        toast.success("Summary added successfully!", {
          style: { border: "2px solid green", borderRadius: "10px" },
        });
        window.location.reload();
      } else {
        toast.error(`Failed to add summary: ${res.message}`, {
          style: { border: "2px solid red", borderRadius: "10px" },
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        style: { border: "2px solid red", borderRadius: "10px" },
      });
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditSelectedDay(item.days);
    setEditDescriptions(
      item.description?.length > 0 ? [...item.description] : [""],
    );
  };

  const handleUpdate = async () => {
    const filteredDesc = editDescriptions.filter((d) => d.trim() !== "");

    if (!editSelectedDay || filteredDesc.length === 0) {
      toast.error("Day and at least one description are required", {
        style: { border: "2px solid red", borderRadius: "10px" },
      });
      return;
    }

    const summary = {
      _id: editItem._id,
      days: editSelectedDay,
      description: filteredDesc,
    };

    try {
      const response = await fetch(
        "/api/admin/website-manage/addPackage/addSummary",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pkgId: packages._id, summary }),
        },
      );

      const res = await response.json();

      if (response.ok) {
        toast.success("Summary updated successfully!", {
          style: { border: "2px solid green", borderRadius: "10px" },
        });
        window.location.reload();
        setEditItem(null);
      } else {
        toast.error(`Failed to update summary: ${res.message}`, {
          style: { border: "2px solid red", borderRadius: "10px" },
        });
      }
    } catch (error) {
      toast.error("Error updating summary", {
        style: { border: "2px solid red", borderRadius: "10px" },
      });
    }
  };

  const handleDelete = async (summaryId) => {
    try {
      const response = await fetch(
        "/api/admin/website-manage/addPackage/addSummary",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pkgId: packages._id, summaryId }),
        },
      );

      if (response.ok) {
        toast.success("Summary deleted successfully!", {
          style: { border: "2px solid green", borderRadius: "10px" },
        });
        window.location.reload();
      } else {
        toast.error("Failed to delete summary", {
          style: { border: "2px solid red", borderRadius: "10px" },
        });
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
    }
  };

  return (
    <div className="flex w-full max-w-full flex-col gap-8 rounded-[var(--radius-card)] bg-white p-6 font-body ring-1 ring-border/50 md:p-8">
      <h1 className="font-heading text-3xl text-heading md:text-4xl">Add Summary</h1>

      {/* Add Summary Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl rounded-[var(--radius-card)] border border-border bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4">
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

          {/* Dynamic Description Inputs */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="font-ui text-sm text-heading">Description Points</Label>
              <Button
                type="button"
                size="sm"
                onClick={addDescriptionField}
              >
                <Plus className="w-4 h-4 mr-1" /> Add Point
              </Button>
            </div>
            <div className="space-y-2">
              {descriptions.map((desc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={desc}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    placeholder={`Description point ${index + 1}`}
                  />
                  {descriptions.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeDescriptionField(index)}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit">
            Save Summary
          </Button>
        </div>
      </form>

      {/* Summaries Table */}
      <Table className="max-w-5xl mx-auto">
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-center text-heading">Day</TableHead>
            <TableHead className="text-center text-heading">
              Description
            </TableHead>
            <TableHead className="text-center text-heading">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.length > 0 ? (
            summaries.map((item) => (
              <TableRow key={item._id} className="border-border">
                <TableCell className="border border-border text-center">
                  {item.days}
                </TableCell>
                <TableCell className="border border-border">
                  <ul className="list-disc list-inside text-sm">
                    {item.description?.map((desc, di) => (
                      <li key={di}>{desc}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="border border-border">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="icon"
                      onClick={() => handleEdit(item)}
                      variant="outline"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      onClick={() => handleDelete(item._id)}
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-border">
              <TableCell
                colSpan={3}
                className="border border-border text-center"
              >
                No Summary Added
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Summary Dialog */}
      {editItem && (
        <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
          <DialogContent className="md:!max-w-xl border-border font-body">
            <DialogHeader>
              <DialogTitle>Edit Summary</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <div className="grid grid-cols-1 gap-4">
                {/* Day Selection */}
                <div className="flex flex-col gap-2">
                  <Label className="font-ui text-sm text-heading">Day</Label>
                  <Select
                    defaultValue={editItem.days}
                    onValueChange={(value) => setEditSelectedDay(value)}
                  >
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

                {/* Dynamic Description Inputs */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-ui text-sm text-heading">Description Points</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addEditDescriptionField}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Point
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editDescriptions.map((desc, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={desc}
                          onChange={(e) =>
                            handleEditDescriptionChange(index, e.target.value)
                          }
                          placeholder={`Description point ${index + 1}`}
                        />
                        {editDescriptions.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={() => removeEditDescriptionField(index)}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button type="submit">
                  Update Summary
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AddSummary;
