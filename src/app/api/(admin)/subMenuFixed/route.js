import mongoose from "mongoose"
import connectDB from "@/lib/connectDB"
import SubMenuFixed from "@/models/Admin/SubMenuFixed"
import { NextResponse } from "next/server"

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

export async function GET(req) {
    try {
        await connectDB()
        const { searchParams } = new URL(req.url)
        const frontendOnly = searchParams.get("frontendOnly") === "1" || searchParams.get("frontendOnly") === "true"
        const menuItems = await SubMenuFixed.find({})
        const output = frontendOnly
            ? menuItems
                .filter((item) => item.active)
                .map((item) => ({
                    ...item.toObject(),
                    subCat: Array.isArray(item.subCat)
                        ? item.subCat
                            .filter((subCat) => subCat.active)
                            .map((subCat) => ({
                                ...subCat,
                                subCatPackage: Array.isArray(subCat.subCatPackage)
                                    ? subCat.subCatPackage.filter((pkg) => pkg.active)
                                    : [],
                            }))
                        : [],
                }))
            : menuItems

        return NextResponse.json(output)
    } catch (error) {
        console.error("GET /api/subMenuFixed:", error)
        return NextResponse.json({ success: false, message: "Failed to fetch menu items" }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        await connectDB()
        const body = await req.json()
        const { type, catTitle, categoryId, subCatTitle, subCategoryId, title, url } = body

        if (type === "category") {
            if (!catTitle?.trim()) {
                return NextResponse.json({ success: false, message: "Category title is required" }, { status: 400 })
            }

            const newCategory = new SubMenuFixed({
                catTitle: catTitle.trim(),
                active: true,
                subCat: [],
            })
            await newCategory.save()
            return NextResponse.json({ success: true, message: "Category added successfully", data: newCategory })
        }

        if (type === "subcategory") {
            if (!categoryId || !isValidObjectId(categoryId)) {
                return NextResponse.json({ success: false, message: "Valid categoryId is required" }, { status: 400 })
            }
            if (!subCatTitle?.trim()) {
                return NextResponse.json({ success: false, message: "Subcategory title is required" }, { status: 400 })
            }

            const category = await SubMenuFixed.findById(categoryId)
            if (!category) {
                return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 })
            }

            category.subCat.push({
                title: subCatTitle.trim(),
                active: true,
                subCatPackage: [],
            })
            await category.save()
            return NextResponse.json({ success: true, message: "Subcategory added successfully" })
        }

        if (type === "package") {
            if (!subCategoryId || !isValidObjectId(subCategoryId)) {
                return NextResponse.json({ success: false, message: "Valid subCategoryId is required" }, { status: 400 })
            }
            if (!title?.trim()) {
                return NextResponse.json({ success: false, message: "Package title is required" }, { status: 400 })
            }

            const category = await SubMenuFixed.findOne({ "subCat._id": subCategoryId })
            if (!category) {
                return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 })
            }

            const subCategory = category.subCat.id(subCategoryId)
            if (!subCategory) {
                return NextResponse.json({ success: false, message: "Subcategory not found" }, { status: 404 })
            }

            subCategory.subCatPackage.push({
                title: title.trim(),
                url: url?.trim() || "",
                active: true,
            })
            await category.save()
            return NextResponse.json({ success: true, message: "Package added successfully" })
        }

        return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 })
    } catch (error) {
        console.error("POST /api/subMenuFixed:", error)
        return NextResponse.json(
            { success: false, message: error.message || "Failed to add item" },
            { status: 500 }
        )
    }
}