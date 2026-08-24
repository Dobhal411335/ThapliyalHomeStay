"use client";

import Link from "next/link";
import { useState } from "react";

export default function GalleryDetailClient({ galleryCard, webpage }) {
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allGalleryImages = [];
  if (galleryCard.image?.url) allGalleryImages.push(galleryCard.image.url);
  if (galleryCard.bentoImages && galleryCard.bentoImages.length > 0) {
    galleryCard.bentoImages.forEach(img => {
      if (img.url) allGalleryImages.push(img.url);
    });
  }

  const getYouTubeId = (url) => {
    if (!url) return '';
    if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0];
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
    if (url.includes('/shorts/')) return url.split('/shorts/')[1]?.split('?')[0];
    return '';
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] font-geist text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Top Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="inline-block border border-gray-400 rounded-full px-4 py-1 text-sm font-medium text-gray-600">
            {galleryCard.chipName || webpage.design7Chip || "News & Insight"}
          </div>
          <Link href={`/${webpage.slug}`} className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black border border-gray-200 px-4 py-1 rounded-md bg-white">
            Back To Gallery
            <svg className="w-4 h-4 ml-1 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-serif text-gray-800 leading-tight mb-8 max-w-3xl">
            {galleryCard.title || "The latest news and insights."}
          </h1>

          <div className="flex justify-end items-center mb-4 text-sm font-semibold text-gray-800">
            {galleryCard.galleryDate && <span className="mr-3">Date : {galleryCard.galleryDate}</span>}
            {galleryCard.galleryDate && galleryCard.postedBy && <span className="mx-2">|</span>}
            {galleryCard.postedBy && <span className="ml-3">Posted By : {galleryCard.postedBy}</span>}
          </div>

          <hr className="mb-8 border-gray-300" />

          {galleryCard.galleryDescription && (
            <p className="text-gray-600 max-w-2xl text-lg">
              {galleryCard.galleryDescription}
            </p>
          )}
        </div>

        {/* Bento Grid Gallery Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Left Main Image */}
            <div className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-lg bg-gray-200 aspect-[4/5] md:aspect-auto">
              {galleryCard.image?.url ? (
                <img src={galleryCard.image.url} alt="Main Gallery" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Main Image</div>
              )}
              <button onClick={() => setShowGallery(true)} className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm hover:bg-black/80 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                VIEW GALLERY
              </button>
            </div>

            {/* Full Screen Gallery Modal */}
            {showGallery && (
              <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center">
                <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                  <h3 className="text-white font-semibold text-lg truncate pr-4">
                    {galleryCard.title || "Gallery"}
                    <span className="ml-4 text-sm font-normal text-gray-300">
                      {currentImageIndex + 1} / {allGalleryImages.length}
                    </span>
                  </h3>
                  <button onClick={() => { setShowGallery(false); setCurrentImageIndex(0); }} className="text-white hover:text-gray-300 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="relative w-full h-full flex items-center justify-center px-4 md:px-20 py-20">
                  {/* Left Button */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? allGalleryImages.length - 1 : prev - 1))}
                    className="absolute left-4 md:left-10 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  {/* Current Image */}
                  {allGalleryImages.length > 0 && (
                    <img
                      src={allGalleryImages[currentImageIndex]}
                      alt={`Gallery view ${currentImageIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300"
                    />
                  )}

                  {/* Right Button */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === allGalleryImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 md:right-10 z-20 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Right smaller images */}
            {galleryCard.bentoImages && galleryCard.bentoImages.length > 0 ? (
              galleryCard.bentoImages.slice(0, 4).map((img, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg bg-gray-200 aspect-video md:aspect-[4/3]">
                  <img src={img.url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((_, i) => (
                <div key={i} className="relative overflow-hidden rounded-lg bg-gray-200 aspect-video md:aspect-[4/3] flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                  <span className="text-sm">Image {i + 1}</span>
                </div>
              ))
            )}

            {/* Bottom Row Images */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {galleryCard.bentoImages && galleryCard.bentoImages.length > 4 ? (
                galleryCard.bentoImages.slice(4, 9).map((img, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg bg-gray-200 aspect-video">
                    <img src={img.url} alt={`Gallery extra ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg bg-gray-200 aspect-video flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                    <span className="text-sm">Thumbnail {i + 1}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* YouTube Shorts Section */}
        {galleryCard.youtubeShorts && galleryCard.youtubeShorts.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.582 6.186a2.686 2.686 0 00-1.884-1.895C17.986 3.84 12 3.84 12 3.84s-5.986 0-7.698.451a2.686 2.686 0 00-1.884 1.895C2 7.897 2 12 2 12s0 4.103.418 5.814a2.686 2.686 0 001.884 1.895C6.014 20.16 12 20.16 12 20.16s5.986 0 7.698-.451a2.686 2.686 0 001.884-1.895C22 16.103 22 12 22 12s0-4.103-.418-5.814zM9.953 15.228V8.772l5.518 3.228-5.518 3.228z" />
              </svg>
              <h2 className="text-2xl font-bold">Shorts</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {galleryCard.youtubeShorts && galleryCard.youtubeShorts.length > 0 ? (
                galleryCard.youtubeShorts.map((short, idx) => (
                  <div key={idx} className="flex flex-col gap-2 group">
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYouTubeId(short.url)}`}
                        title={short.title || "YouTube Short"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="absolute inset-0"
                      ></iframe>
                    </div>
                  </div>
                ))
              ) : (
                null
              )}
            </div>
          </div>
        )}
        {/* YouTube Highlights Section */}
        {galleryCard.youtubeVideos && galleryCard.youtubeVideos.length > 0 && (
          <div className="mb-20">
              <div className="flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.582 6.186a2.686 2.686 0 00-1.884-1.895C17.986 3.84 12 3.84 12 3.84s-5.986 0-7.698.451a2.686 2.686 0 00-1.884 1.895C2 7.897 2 12 2 12s0 4.103.418 5.814a2.686 2.686 0 001.884 1.895C6.014 20.16 12 20.16 12 20.16s5.986 0 7.698-.451a2.686 2.686 0 001.884-1.895C22 16.103 22 12 22 12s0-4.103-.418-5.814zM9.953 15.228V8.772l5.518 3.228-5.518 3.228z" />
              </svg>
              <h2 className="text-2xl font-bold">Videos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryCard.youtubeVideos && galleryCard.youtubeVideos.length > 0 ? (
                galleryCard.youtubeVideos.map((video, idx) => (
                  <div key={idx} className="flex flex-col gap-3 group cursor-pointer">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
                        title={video.title || "YouTube Video"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="absolute inset-0"
                      ></iframe>
                    </div>
                    {(video.title || video.views || video.date) && (
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-300">
                          <span className="font-bold text-gray-500 text-xs">Ch</span>
                        </div>
                        <div>
                          {video.title && <h3 className="font-bold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">{video.title}</h3>}
                          {/* <p className="text-gray-500 text-xs mt-1">
                             {video.views && <span>{video.views} </span>}
                             {video.views && video.date && <span>• </span>}
                             {video.date && <span>{video.date}</span>}
                           </p> */}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
