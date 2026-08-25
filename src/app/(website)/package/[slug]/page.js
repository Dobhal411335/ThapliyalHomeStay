import Image from "next/image"
import PackageDetailClient from "@/components/Package/PackageDetailClient"
import {
    MapPin,
    Calendar,
    Clock,
    Tag,
    Star,
    PhoneCall,
    MessageCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import connectDB from "@/lib/connectDB"
import Package from "@/models/Admin/Package"
import Review from "@/models/Admin/Review"
import ComingSoon from "@/models/Admin/ComingSoon"
import CompanyBasicInfo from "@/models/Admin/CompanyBasicInfo"
import ComingSoonEnquiryForm from "@/components/Package/ComingSoonEnquiries.jsx"
import { serializePackage } from "@/lib/serializePackage"

const getPackageBySlug = async (slug) => {
    try {
        await connectDB()
        const packageData = await Package.findOne({ slug }).lean()
        return serializePackage(packageData)
    } catch (error) {
        console.error("Error fetching package by slug:", error)
        return null
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params
    const packageDetails = await getPackageBySlug(slug)

    if (!packageDetails) {
        return { title: "Package" }
    }

    const keywords = Array.isArray(packageDetails.keywords)
        ? packageDetails.keywords.filter(Boolean)
        : []

    return {
        title: packageDetails.titleLine || packageDetails.packageName || "Package",
        description: packageDetails?.basicDetails?.smallDesc || "",
        ...(keywords.length > 0 ? { keywords } : {}),
    }
}

const getApprovedReviews = async (packageId) => {
    try {
        if (!packageId) return []
        await connectDB()
        const reviews = await Review.find({
            packageId,
            status: "approved",
            deleted: false,
        })
            .sort({ createdAt: -1 })
            .lean()

        return reviews.map((review) => ({
            _id: review._id?.toString(),
            packageId: review.packageId?.toString(),
            packageName: review.packageName || "",
            name: review.name || "",
            email: review.email || "",
            rating: Number(review.rating) || 0,
            title: review.title || "",
            message: review.message || "",
            status: review.status,
            approved: review.status === "approved",
            createdAt: review.createdAt
                ? new Date(review.createdAt).toISOString()
                : null,
        }))
    } catch (error) {
        console.error("Error fetching reviews:", error)
        return []
    }
}

const getFeaturedPackages = async () => {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!baseUrl) return []

        const res = await fetch(`${baseUrl}/api/featured-packages`, {
            next: { revalidate: 60 },
        })

        if (!res.ok) return []
        const data = await res.json()
        if (data?.success && Array.isArray(data.data)) return data.data
        if (Array.isArray(data)) return data
        return []
    } catch (error) {
        console.error("Error fetching featured packages:", error)
        return []
    }
}

const getComingSoonById = async (id) => {
    try {
        await connectDB()
        const pkg = await ComingSoon.findById(id).lean()
        return serializePackage(pkg)
    } catch (e) {
        return null
    }
}

const PackageDetailsPage = async ({ params }) => {
    const { slug } = await params
    await connectDB()

    let packageDetails = await getPackageBySlug(slug)
    let isComingSoon = false

    if (!packageDetails) {
        packageDetails = await getComingSoonById(slug)
        isComingSoon = !!packageDetails
    }

    const reviews = packageDetails?._id
        ? await getApprovedReviews(packageDetails._id)
        : []

    const packages = serializePackage(
        await Package.find({ active: true, slug: { $ne: slug } }).limit(10).lean().exec()
    ) || []

    const featuredPackages = await getFeaturedPackages()
    const companyInfo = await CompanyBasicInfo.findOne().lean()
    const contactNumber = companyInfo?.contactNumbers?.[0] || ""
    const contactLink = contactNumber.replace(/\s+/g, "")
    const whatsappLink = (companyInfo?.whatsappNumber || contactNumber).replace(/\D/g, "")

    const formatNumber = (number) => {
        return new Intl.NumberFormat("en-IN").format(number)
    }

    if (!packageDetails) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Package Not Available</h1>
                <p className="mb-8">
                    This package is either not found or has been disabled by the admin.
                </p>
                <Button render={<Link href="/" />}>Back to Home</Button>
            </div>
        )
    }

    const formatNumeric = (number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number)
    }

    const validReviews = Array.isArray(reviews)
        ? reviews.filter(
            (review) => review.approved === true || review.status === "approved"
          )
        : []

    const avgRating =
        validReviews.length > 0
            ? parseFloat(
                (
                    validReviews.reduce((total, review) => total + review.rating, 0) /
                    validReviews.length
                ).toFixed(1)
              )
            : 0

    if (isComingSoon) {
        return (
            <div className="min-h-screen mb-20 font-barlow">
                <div className="relative h-30 md:h-75 w-full overflow-hidden bg-gray-300 flex items-center justify-center">
                    {packageDetails.bannerUrl ? (
                        <Image src={packageDetails.thumbUrl} alt="Banner" fill className="object-cover" />
                    ) : (
                        <span className="text-2xl md:text-4xl font-bold text-gray-400">IMAGE BANNER</span>
                    )}
                </div>
                <div className="lg:p-6 p-2 border-b">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <div className="flex md:flex-row flex-col items-center gap-4">
                            {packageDetails.thumbUrl ? (
                                <Image
                                    src={packageDetails.bannerUrl || "/placeholder.png"}
                                    alt="Tour package image"
                                    width={300}
                                    height={300}
                                    className="object-cover w-full lg:w-96 rounded-xl aspect-video"
                                />
                            ) : (
                                <div className="w-full aspect-video bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                                    Image<br />Update Soon
                                </div>
                            )}
                            <div className="flex flex-col gap-2 lg:w-[50rem]">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Tag className="h-4 w-4" />
                                    <span className="font-medium">
                                        Package Code:{" "}
                                        <span className="font-bold tracking-wider text-2xl text-black">
                                            Not Available
                                        </span>
                                    </span>
                                </div>
                                <h2 className="text-2xl lg:text-4xl font-gilda font-bold w-full">
                                    {packageDetails?.title}
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>Location: {packageDetails.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>Duration: {packageDetails.days} Days</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="h-4 w-4 mr-1 " />
                                        <span>Tour Type: {packageDetails.tourType}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-4">
                                    <Button
                                        size="icon"
                                        render={<Link href={`tel:${contactLink}`} />}
                                        className="border-2 border-primary !p-6"
                                        variant="outline"
                                    >
                                        <PhoneCall className="!h-6 !w-6 text-heading" />
                                    </Button>
                                    <Button
                                        render={
                                            <Link
                                                href={`https://wa.me/${whatsappLink}?text=${encodeURIComponent(`I'm interested in your package ${packageDetails?.title || ""}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            />
                                        }
                                        className="!bg-success hover:!bg-success/90 !p-6"
                                    >
                                        <MessageCircle className="!h-6 !w-6" />
                                        Whatsapp
                                    </Button>
                                </div>
                                <h2 className="text-2xl lg:text-4xl font-gilda font-bold w-full">
                                    Price Currently Not Available
                                </h2>
                            </div>
                        </div>
                        <div className="md:text-right w-fit">
                            <div className="text-2xl font-bold text-primary">
                                {typeof packageDetails.price !== "number" ||
                                isNaN(packageDetails.price) ||
                                packageDetails.price === 0 ? (
                                    <span className="text-4xl text-primary">XXXX*</span>
                                ) : (
                                    <>
                                        ₹
                                        <span className="text-4xl text-primary">
                                            {formatNumber(packageDetails.price)}*
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">Per Person</div>
                            <div className="flex items-center md:justify-end mt-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 text-sm font-medium">{0}</span>
                                <span className="ml-1 text-sm text-gray-500 font-medium">reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg p-8 mt-10 max-w-3xl mx-auto">
                    <ComingSoonEnquiryForm packageId={packageDetails._id?.toString()} />
                </div>
            </div>
        )
    }

    return (
        <PackageDetailClient
            packageDetails={packageDetails}
            reviews={reviews}
            packages={packages}
            featuredPackages={JSON.parse(JSON.stringify(featuredPackages || []))}
            avgRating={avgRating}
            formatNumericStr={formatNumeric.toString()}
        />
    )
}

export default PackageDetailsPage
