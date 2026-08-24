"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Edit, Loader2, Pencil, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const slugify = (str) => {
  if (!str) return "";
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const AddPackage = ({ id }) => {
  const { handleSubmit, register, setValue, reset } = useForm();
  const subMenuId = id;
  const [packageCode, setPackageCode] = useState("");
  const [selectedPriceUnit, setSelectedPriceUnit] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const [priceUsdValue, setPriceUsdValue] = useState(0);
  const [doubleOccupancyPriceValue, setDoubleOccupancyPriceValue] = useState(0);
  const [doubleOccupancyPriceUsdValue, setDoubleOccupancyPriceUsdValue] =
    useState(0);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subMenuItems, setSubMenuItems] = useState([]);

  const fetchSubMenuItems = async () => {
    try {
      const response = await fetch(`/api/getSubMenuById/${subMenuId}`);
      const data = await response.json();
      // console.log(data)
      setSubMenuItems(data);
    } catch (error) {
      console.error("Error fetching sub-menu items:", error);
    }
  };

  const resetToCreateMode = () => {
    const newCode = generateCode();
    setEditingPackageId(null);
    setPackageCode(newCode);
    setSelectedPriceUnit("");
    setPriceValue(0);
    setPriceUsdValue(0);
    setDoubleOccupancyPriceValue(0);
    setDoubleOccupancyPriceUsdValue(0);
    reset({
      packages: {
        packageName: "",
        price: 0,
        priceUsd: 0,
        doubleOccupancyPrice: 0,
        doubleOccupancyPriceUsd: 0,
        priceUnit: "",
        packageCode: newCode,
      },
    });
  };

  useEffect(() => {
    const newCode = generateCode();
    setPackageCode(newCode);
    setValue("packages.packageCode", newCode);
    fetchSubMenuItems();
  }, [setValue]);

  const startEdit = (pkg) => {
    setEditingPackageId(pkg._id);
    setPackageCode(pkg.packageCode || "");
    setSelectedPriceUnit(pkg.priceUnit || "");
    setPriceValue(pkg.price || 0);
    setPriceUsdValue(pkg.priceUsd || 0);
    setDoubleOccupancyPriceValue(pkg.doubleOccupancyPrice || 0);
    setDoubleOccupancyPriceUsdValue(pkg.doubleOccupancyPriceUsd || 0);
    setValue("packages.packageName", pkg.packageName || "");
    setValue("packages.price", pkg.price || 0);
    setValue("packages.priceUsd", pkg.priceUsd || 0);
    setValue("packages.doubleOccupancyPrice", pkg.doubleOccupancyPrice || 0);
    setValue(
      "packages.doubleOccupancyPriceUsd",
      pkg.doubleOccupancyPriceUsd || 0,
    );
    setValue("packages.priceUnit", pkg.priceUnit || "");
    setValue("packages.packageCode", pkg.packageCode || "");
  };

  const deletePackage = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Package deleted successfully!", {
          style: { borderRadius: "10px", border: "2px solid green" },
        });
        window.location.reload();
        setIsLoading(false);
      } else {
        toast.error("Failed to delete package", {
          style: { borderRadius: "10px", border: "2px solid red" },
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong", {
        style: { borderRadius: "10px", border: "2px solid red" },
      });
    }
  };

  const toggleSwitch = async (pkgId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pkgId, active: !currentStatus }),
      });

      if (response.ok) {
        setSubMenuItems((prevSubMenu) => ({
          ...prevSubMenu,
          packages: prevSubMenu.packages.map((pkg) =>
            pkg._id === pkgId ? { ...pkg, active: !pkg.active } : pkg,
          ),
        }));
      } else {
        toast.error("Failed to update submenu status", {
          style: { borderRadius: "10px", border: "2px solid red" },
        });
      }
    } catch (error) {
      console.error("Error updating submenu status:", error);
    }
  };
  const toggleIsTrending = async (pkgId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/website-manage/addPackage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pkgId, isTrending: !currentStatus }),
      });

      if (response.ok) {
        setSubMenuItems((prevSubMenu) => ({
          ...prevSubMenu,
          packages: prevSubMenu.packages.map((pkg) =>
            pkg._id === pkgId ? { ...pkg, isTrending: !pkg.isTrending } : pkg,
          ),
        }));
        toast.success("Package status updated successfully!", {
          style: { borderRadius: "10px", border: "2px solid green" },
        });
      } else {
        toast.error("Failed to update submenu status", {
          style: { borderRadius: "10px", border: "2px solid red" },
        });
      }
    } catch (error) {
      console.error("Error updating submenu status:", error);
    }
  };

  const onSubmit = async (data) => {
    if (!data.packages.packageName || !data.packages.priceUnit) {
      toast.error("All fields are required", {
        style: { borderRadius: "10px", border: "2px solid red" },
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const isEditMode = Boolean(editingPackageId);

      const response = await fetch("/api/admin/website-manage/addPackage", {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isEditMode
            ? {
                pkgId: editingPackageId,
                packageName: data.packages.packageName,
                price: Number(data.packages.price) || 0,
                priceUsd: Number(data.packages.priceUsd) || 0,
                doubleOccupancyPrice:
                  Number(data.packages.doubleOccupancyPrice) || 0,
                doubleOccupancyPriceUsd:
                  Number(data.packages.doubleOccupancyPriceUsd) || 0,
                priceUnit: data.packages.priceUnit,
                packageCode,
                slug: slugify(data.packages.packageName),
              }
            : {
                subMenuId,
                packages: {
                  packageName: data.packages.packageName,
                  price: Number(data.packages.price) || 0,
                  priceUsd: Number(data.packages.priceUsd) || 0,
                  doubleOccupancyPrice:
                    Number(data.packages.doubleOccupancyPrice) || 0,
                  doubleOccupancyPriceUsd:
                    Number(data.packages.doubleOccupancyPriceUsd) || 0,
                  priceUnit: data.packages.priceUnit,
                  packageCode,
                  link: packageCode,
                  active: true,
                  order: (subMenuItems?.packages?.length || 0) + 1,
                  slug: slugify(data.packages.packageName),
                },
              },
        ),
      });

      if (response.ok) {
        toast.success(
          isEditMode
            ? "Package updated successfully!"
            : "Package added successfully!",
          { style: { borderRadius: "10px", border: "2px solid green" } },
        );
        await fetchSubMenuItems();
        resetToCreateMode();
      } else {
        toast.error(
          isEditMode ? "Failed to update package" : "Failed to add package",
          { style: { borderRadius: "10px", border: "2px solid red" } },
        );
      }
    } catch (error) {
      toast.error("Something went wrong", {
        style: { borderRadius: "10px", border: "2px solid red" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center gap-8 my-20 bg-card border border-border shadow-sm w-full max-w-xl md:max-w-7xl mx-auto p-6 md:p-8 rounded-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full items-end">
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="packageCode"
                className="font-medium text-foreground text-sm"
              >
                Package Code
              </label>
              <Input
                name="packageCode"
                className="border-border bg-muted focus-visible:ring-primary font-medium"
                readOnly
                value={packageCode}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="packageName"
                className="font-medium text-foreground text-sm"
              >
                Package Name
              </label>
              <Input
                name="packageName"
                className="w-full font-medium border-border focus-visible:ring-primary bg-background"
                {...register("packages.packageName")}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="priceUnit"
                className="font-medium text-foreground text-sm"
              >
                Price Unit
              </label>
              <Select
                value={selectedPriceUnit}
                name="priceUnit"
                onValueChange={(value) => {
                  setSelectedPriceUnit(value);
                  setValue("packages.priceUnit", value);
                  if (value !== "Double Occupancy Per Person Price Only") {
                    setDoubleOccupancyPriceValue(0);
                    setDoubleOccupancyPriceUsdValue(0);
                    setValue("packages.doubleOccupancyPrice", 0);
                    setValue("packages.doubleOccupancyPriceUsd", 0);
                  }
                }}
              >
                <SelectTrigger className="w-full border-border bg-background focus:ring-primary">
                  <SelectValue placeholder="Select Price Unit" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover min-w-[280px]">
                  <SelectGroup>
                    <SelectItem
                      className="focus:bg-accent focus:text-accent-foreground font-medium"
                      value="Single Occupancy Per Person Price Only"
                    >
                      Single Occupancy Per Person Price Only
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-accent focus:text-accent-foreground font-medium"
                      value="Double Occupancy Per Person Price Only"
                    >
                      Double Occupancy Per Person Price Only
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="price"
                className="font-medium text-foreground text-sm"
              >
                {selectedPriceUnit === "Double Occupancy Per Person Price Only"
                  ? "Single Occupancy Price (₹)"
                  : "Package Price (₹)"}
              </label>
              <NumericFormat
                thousandSeparator={true}
                prefix="₹"
                name="price"
                value={priceValue}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                onValueChange={(values) => {
                  const value = values.floatValue || 0;
                  setPriceValue(value);
                  setValue("packages.price", value);
                }}
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label
                htmlFor="priceUsd"
                className="font-medium text-foreground text-sm"
              >
                {selectedPriceUnit === "Double Occupancy Per Person Price Only"
                  ? "Single Occupancy Price ($)"
                  : "Package Price ($)"}
              </label>
              <NumericFormat
                thousandSeparator={true}
                prefix="$"
                name="priceUsd"
                value={priceUsdValue}
                className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                onValueChange={(values) => {
                  const value = values.floatValue || 0;
                  setPriceUsdValue(value);
                  setValue("packages.priceUsd", value);
                }}
              />
            </div>
            {selectedPriceUnit === "Double Occupancy Per Person Price Only" && (
              <>
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="doubleOccupancyPrice"
                    className="font-medium text-foreground text-sm"
                  >
                    Double Occupancy Price (₹)
                  </label>
                  <NumericFormat
                    thousandSeparator={true}
                    prefix="₹"
                    name="doubleOccupancyPrice"
                    value={doubleOccupancyPriceValue}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                    onValueChange={(values) => {
                      const value = values.floatValue || 0;
                      setDoubleOccupancyPriceValue(value);
                      setValue("packages.doubleOccupancyPrice", value);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="doubleOccupancyPriceUsd"
                    className="font-medium text-foreground text-sm"
                  >
                    Double Occupancy Price ($)
                  </label>
                  <NumericFormat
                    thousandSeparator={true}
                    prefix="$"
                    name="doubleOccupancyPriceUsd"
                    value={doubleOccupancyPriceUsdValue}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                    onValueChange={(values) => {
                      const value = values.floatValue || 0;
                      setDoubleOccupancyPriceUsdValue(value);
                      setValue("packages.doubleOccupancyPriceUsd", value);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editingPackageId ? "Update Package" : "Add Package"}
          </Button>
          {editingPackageId ? (
            <Button type="button" variant="outline" onClick={resetToCreateMode}>
              Cancel Edit
            </Button>
          ) : null}
        </div>
      </form>

      <div className="bg-card border border-border rounded-xl shadow-sm max-w-5xl mx-auto w-full overflow-hidden text-center mb-20">
        <Table className="w-full min-w-max lg:min-w-0">
          <TableHeader className="bg-muted/20 hover:bg-transparent border-b border-border">
            <TableRow>
              <TableHead className="text-center text-heading font-semibold w-1/2">
                Package Name
              </TableHead>
              <TableHead className="text-center text-heading font-semibold w-1/4">
                Order
              </TableHead>
              <TableHead className="text-center text-heading font-semibold w-1/2">
                Trending
              </TableHead>
              <TableHead className="w-1/2 text-heading font-semibold text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subMenuItems?.packages?.length > 0 ? (
              subMenuItems?.packages?.map((pkg) => (
                <TableRow
                  key={pkg._id}
                  className="border-b border-border hover:bg-muted/10 transition-colors"
                >
                  <TableCell className="font-medium text-foreground py-3">
                    {pkg.packageName}
                  </TableCell>
                  <TableCell className="font-medium text-foreground py-3">
                    {pkg.order}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-6">
                      <Switch
                        id={`switch-${pkg._id}`}
                        checked={pkg.isTrending}
                        onCheckedChange={() =>
                          toggleIsTrending(pkg._id, pkg.isTrending)
                        }
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-accent text-muted-foreground border-border"
                        onClick={() => startEdit(pkg)}
                        title="Edit data here"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:bg-accent text-muted-foreground border-border"
                        aschild
                        title="Edit full package page"
                      >
                        <Link href={`/admin/editPackage/${pkg._id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>

                      <Button
                        size="icon"
                        disabled={isLoading}
                        onClick={() => deletePackage(pkg._id)}
                        variant="destructive"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                      <div className="flex items-center gap-2 border-l border-border pl-4">
                        <Switch
                          id={`switch-${pkg._id}`}
                          checked={pkg.active}
                          onCheckedChange={() =>
                            toggleSwitch(pkg._id, pkg.active)
                          }
                        />
                        <Label
                          htmlFor={`switch-${pkg._id}`}
                          className="text-muted-foreground text-xs font-medium"
                        >
                          {pkg.active ? "ON" : "OFF"}
                        </Label>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-border">
                <TableCell
                  colSpan="4"
                  className="text-center font-medium text-muted-foreground py-6"
                >
                  No packages available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AddPackage;
