import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Review from "@/models/Admin/Review";
import "@/models/Admin/Package";

function json(success, message, data = null, status = 200) {
  return NextResponse.json({ success, message, data }, { status });
}

function serializeReview(review) {
  if (!review) return null;

  const packageRef =
    review.packageId && typeof review.packageId === "object"
      ? {
          _id: review.packageId._id?.toString?.() || String(review.packageId._id || ""),
          packageName: review.packageId.packageName || "",
          slug: review.packageId.slug || "",
        }
      : null;

  return {
    _id: review._id?.toString?.() || String(review._id),
    packageId:
      packageRef?._id ||
      review.packageId?.toString?.() ||
      String(review.packageId || ""),
    packageName: review.packageName || packageRef?.packageName || "",
    package: packageRef,
    name: review.name || "",
    email: review.email || "",
    rating: Number(review.rating) || 0,
    title: review.title || "",
    message: review.message || "",
    status: review.status || "pending",
    approved: review.status === "approved",
    deleted: !!review.deleted,
    createdAt: review.createdAt
      ? new Date(review.createdAt).toISOString()
      : null,
    updatedAt: review.updatedAt
      ? new Date(review.updatedAt).toISOString()
      : null,
  };
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const packageId = searchParams.get("packageId");
    const approvedOnly = searchParams.get("approved") === "true";

    const filter = { deleted: false };

    if (packageId) {
      filter.packageId = packageId;
    }

    if (approvedOnly) {
      filter.status = "approved";
    } else if (status && status !== "all") {
      filter.status = status;
    }

    const reviews = await Review.find(filter)
      .populate("packageId", "packageName slug")
      .sort({ createdAt: -1 })
      .lean();

    return json(
      true,
      "Reviews fetched.",
      reviews.map(serializeReview),
      200
    );
  } catch (error) {
    return json(false, error.message || "Failed to fetch reviews.", null, 500);
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const packageId = body?.packageId;
    const packageName = String(body?.packageName || "").trim();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const title = String(body?.title || "").trim();
    const message = String(body?.message || body?.description || "").trim();
    const rating = Number(body?.rating);

    if (!packageId || !packageName) {
      return json(false, "Package information is required.", null, 400);
    }

    if (!name || name.length < 2) {
      return json(false, "Please enter your name.", null, 400);
    }

    if (!message || message.length < 5) {
      return json(false, "Please write a short review.", null, 400);
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return json(false, "Please select a rating from 1 to 5.", null, 400);
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(false, "Please enter a valid email.", null, 400);
    }

    const review = await Review.create({
      packageId,
      packageName,
      name,
      email,
      title,
      message,
      rating,
      status: "pending",
      deleted: false,
    });

    return json(
      true,
      "Review submitted. It will appear after admin approval.",
      serializeReview(review.toObject()),
      201
    );
  } catch (error) {
    return json(false, error.message || "Failed to submit review.", null, 500);
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const id = body?._id || body?.id;

    if (!id) {
      return json(false, "Review id is required.", null, 400);
    }

    const review = await Review.findById(id);
    if (!review || review.deleted) {
      return json(false, "Review not found.", null, 404);
    }

    if (typeof body.deleted === "boolean") {
      review.deleted = body.deleted;
    }

    if (body.status && ["pending", "approved", "rejected"].includes(body.status)) {
      review.status = body.status;
    } else if (typeof body.approved === "boolean") {
      review.status = body.approved ? "approved" : "pending";
    }

    await review.save();

    return json(true, "Review updated.", serializeReview(review.toObject()), 200);
  } catch (error) {
    return json(false, error.message || "Failed to update review.", null, 500);
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const body = await req.json();
    const id = body?._id || body?.id;

    if (!id) {
      return json(false, "Review id is required.", null, 400);
    }

    const review = await Review.findById(id);
    if (!review) {
      return json(false, "Review not found.", null, 404);
    }

    review.deleted = true;
    await review.save();

    return json(true, "Review deleted.", null, 200);
  } catch (error) {
    return json(false, error.message || "Failed to delete review.", null, 500);
  }
}
