"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, Eye, Globe, Loader2, Bed, Phone, ParkingCircle, ShowerHead, Wifi, Tv, Bath, Elevator, Luggage, Coffee, Snowflake, Utensils } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { X } from "lucide-react";
const BannerSection = () => (
    <div className="relative w-full h-[120px] md:h-[350px]">
        <Image
            src="/accommodation.jpg"
            alt="Accommodation Image"
            fill
            className="md:object-cover md:object-center object-contain w-full h-full"
            quality={100}
            priority
        />
    </div>
);
const amenityIcons = {
    'Restaurant': <Utensils size={20} />,
    'Bed': <Bed size={20} />,
    'Room Phone': <Phone size={20} />,
    'Parking': <ParkingCircle size={20} />,
    'Shower': <ShowerHead size={20} />,
    'Towel In Room': (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 16V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10M4 20h16M4 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2M4 20h16" /></svg>
    ),
    'Wi-Fi': <Wifi size={20} />,
    'Television': <Tv size={20} />,
    'Bath Tub': <Bath size={20} />,
    'Elevator': (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="6" y="3" width="12" height="18" rx="2" strokeWidth="2" />
            <path d="M9 9h6M9 13h6M12 16v2" strokeWidth="2" />
            <path d="M10.5 6l1.5-2 1.5 2" strokeWidth="2" />
        </svg>
    ),
    'Laggage': <Luggage size={20} />,
    'Tea Maker': <Coffee size={20} />,
    'Room AC': <Snowflake size={20} />,
};
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Accommodation = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 6; // for second row pagination
    const gridRef = useRef(null);
    // useEffect(() => {
    //     if (gridRef.current) {
    //         gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    //     }
    // }, [page]);
    // console.log(rooms)



    // Fetch Artisan (copied from RandomTourPackageSection)
    useEffect(() => {
        const fetchArtisan = async () => {
            try {
                const res = await fetch("/api/room");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRooms(data);
                } else if (Array.isArray(data.rooms)) {
                    setRooms(data.rooms);
                } else {
                    setRooms([]);
                }
            } catch (error) {
                setRooms([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArtisan();
    }, []);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedReviews, setSelectedReviews] = useState([]);

    const paginatedArtisans = rooms.slice(0 + (page - 1) * pageSize, 6 + page * pageSize);
    const totalPaginated = rooms.length > 5 ? rooms.length - 5 : 0;
    const totalPages = Math.ceil(totalPaginated / pageSize);
    const startIdx = 5 + (page - 1) * pageSize + 1;
    const endIdx = Math.min(5 + page * pageSize, rooms.length);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-white">
                <div className="text-2xl font-bold text-gray-600 animate-pulse flex items-center"><Loader2 className="animate-spin mr-2" />Loading Accommodation...</div>
            </div>
        );
    }
    return (
        <div className="w-full min-h-screen bg-background " ref={gridRef}>
            <BannerSection />
            {/* Below banner: left text, right carousel */}
            <div className="w-full md:max-w-[1500px] mx-auto ">
                <div className="flex flex-col md:flex-row w-full">
                    {rooms.length > 0 && (
                        <div className="w-full flex flex-row gap-2 md:w-[90%] mx-auto">
                            <div className="right w-[100%] md:p-2 p-1">
                                {(page === 1
                                    ? rooms.slice(0)
                                    : paginatedArtisans
                                ).map((item, idx) => {
                                    const imageUrls = [
                                        ...(item.mainPhoto?.url ? [item.mainPhoto.url] : []),
                                        ...(item.relatedPhotos?.length ? item.relatedPhotos.map(photo => photo.url) : [])
                                    ];
                                    if (imageUrls.length === 0) imageUrls.push('');
                                    return (
                                        <div key={item._id || idx} className="relative flex flex-col md:flex-row bg-[#f8f5ef] rounded-2xl p-5 my-2 md:items-start gap-6 shadow-lg md:px-5 mx-auto border border-gray-800">
                                            {/* Image Carousel */}
                                            <div className="relative md:w-[420px] md:h-[290px] h-[250px] py-2 md:px-0 flex-shrink-0 flex items-start justify-start flex-col rounded-xl overflow-hidden">
                                                <Carousel className="w-full h-full" opts={{ loop: true }}>
                                                    <CarouselContent>
                                                        {imageUrls.map((img, i) => (
                                                            <CarouselItem key={i} className="w-full h-full flex items-center justify-center bg-gray-100 rounded-image">
                                                                {img ? (
                                                                    <Image
                                                                        src={img}
                                                                        alt={item.title || 'Room'}
                                                                        width={420}
                                                                        height={420}
                                                                        className="object-contain object-top w-[420px] h-fit rounded-image"
                                                                        priority={i === 0}
                                                                    />
                                                                ) : (
                                                                    <div className="flex w-full h-full items-center justify-center text-gray-400">
                                                                        <Loader2 className="animate-spin mr-2" /> No Image Available
                                                                    </div>
                                                                )}
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2" />
                                                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2" />
                                                </Carousel>
                                            </div>
                                            {/* Details */}
                                            <div className="flex-1 md:p-5 p-2 flex flex-col gap-2 justify-between min-h-[260px] relative">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="md:text-3xl text-md font-bold text-gray-900">{item.title || "Room Name"}</h3>

                                                </div>
                                                <div className="text-gray-800 text-xs md:text-sm mb-1" dangerouslySetInnerHTML={{ __html: item.paragraph }} />
                                                <div className="font-semibold text-gray-800 text-xs md:text-sm mt-1">Room Amenities</div>
                                                <div className="flex gap-2 mb-1 text-xs md:text-sm">
                                                    <TooltipProvider>
                                                        <div className="flex gap-2 mb-1 text-lg flex-wrap">
                                                            {(item.amenities || []).map((am, i) => (
                                                                <Tooltip key={am._id || i}>
                                                                    <TooltipTrigger aschild>
                                                                        <span className="bg-gray-100 px-1 rounded flex items-center justify-center cursor-pointer">
                                                                            {amenityIcons[am.label] || am.label}
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">
                                                                        {am.label}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            ))}
                                                        </div>
                                                    </TooltipProvider>
                                                </div>
                                                {(() => {
                                                    const priceList = (item.prices && item.prices[0] && item.prices[0].prices) || [];
                                                    return (
                                                        <div className="flex gap-8 text-xs md:text-sm py-2">
                                                            <span>
                                                                Max occupancy: {
                                                                    priceList.some(p => p.type === '02 Pax')
                                                                        ? '02 Pax'
                                                                        : priceList.some(p => p.type === '01 Pax')
                                                                            ? '01 Pax'
                                                                            : 'N/A'
                                                                }
                                                            </span>
                                                            <span>
                                                                Extra bed available: {
                                                                    priceList.some(p => p.type === 'Extra Bed') ? 'Yes' : 'No'
                                                                }
                                                            </span>
                                                        </div>
                                                    );
                                                })()}

                                                {(() => {
                                                    const priceList = (item.prices && item.prices[0] && item.prices[0].prices) || [];
                                                    const mainPrice = priceList.find(p => p.type === '02 Pax') || priceList.find(p => p.type === '01 Pax');
                                                    return (
                                                        <div className="flex items-center gap-4">
                                                            <span className="md:text-2xl text-md font-bold text-black">Rs. {mainPrice ? mainPrice.amount : 'N/A'}</span>
                                                            <span className="md:text-lg text-sm font-semibold text-gray-800 line-through">{mainPrice && mainPrice.oldPrice ? mainPrice.oldPrice : 'N/A'}</span>
                                                            <span className="text-md text-gray-700">/ Per Night</span>
                                                            <Link
                                                                className="ml-auto bg-green-700 hover:bg-green-800 text-white font-semibold md:px-16 md:px-8 px-3 md:py-2 py-1 rounded-md"
                                                                href={`/hotel/${item.slug}`}
                                                            >View More</Link>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    );
                                })}
                                {totalPaginated > 0 && (
                                    <div className="w-full mt-8">
                                        {/* Pagination Info and Controls */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-md font-medium text-gray-800">
                                                Showing {startIdx}-{endIdx} of {artisan.length} Results
                                            </span>
                                            <div className="flex items-center gap-3">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        className={`border rounded-full w-12 h-12 flex items-center justify-center text-lg ${page === i + 1 ? 'bg-black text-white' : 'bg-transparent text-black'} transition`}
                                                        onClick={() => setPage(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    className="border rounded-full px-4 h-12 flex items-center justify-center text-lg bg-transparent text-black transition"
                                                    onClick={() => setPage(page < totalPages ? page + 1 : page)}
                                                    disabled={page === totalPages}
                                                >
                                                    NEXT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* {data.longPara && ( */}
                <div className="my-4 md:mx-10 mx-2 rounded-xl overflow-hidden border-2 border-black p-5">
                    <div
                        className="my-4"
                    >
                        <h2 className="text-xl font-bold text-gray-900 pb-2">Our Hospitality & Stay</h2>
                        At our hotel, we are committed to offering a warm and welcoming experience that makes every guest feel at home. With comfortable accommodations and restaurant-style amenities, we ensure that your stay is both relaxing and fulfilling. Whether you're here for a peaceful getaway or an adventurous escape, our team strives to provide the best in service, comfort, and care—creating a stay that’s truly memorable.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accommodation;
