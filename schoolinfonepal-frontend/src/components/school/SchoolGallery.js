// src/components/school/SchoolGallery.js
"use client";
import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function SchoolGallery({ school }) {
  const gallery = school?.gallery || [];
  const [showAll, setShowAll] = useState(false);
  const [popup, setPopup] = useState({ open: false, idx: 0 });

  if (!gallery.length) return null;

  const displayed = showAll ? gallery : gallery.slice(0, 6);

  // Open popup at index
  function openPopup(idx) {
    setPopup({ open: true, idx });
    document.body.style.overflow = "hidden";
  }
  function closePopup() {
    setPopup({ open: false, idx: 0 });
    document.body.style.overflow = "";
  }
  function prevImg() {
    setPopup((p) => ({
      ...p,
      idx: (p.idx - 1 + gallery.length) % gallery.length,
    }));
  }
  function nextImg() {
    setPopup((p) => ({
      ...p,
      idx: (p.idx + 1) % gallery.length,
    }));
  }

  // Keyboard navigation
  useState(() => {
    function handle(e) {
      if (!popup.open) return;
      if (e.key === "Escape") closePopup();
      if (e.key === "ArrowLeft") prevImg();
      if (e.key === "ArrowRight") nextImg();
    }
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [popup.open]);

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-5">
        <ImageIcon className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {displayed.map((img, i) => (
          <button
            key={img.id}
            className="aspect-square rounded-lg overflow-hidden border hover:scale-105 transition transform"
            style={{ background: "#f3f4f6" }}
            onClick={() => openPopup(showAll ? i : i)}
            aria-label="Open image"
          >
            <Image
              src={img.image}
              alt={img.caption || `Gallery Image ${i + 1}`}
              width={400}
              height={400}
              className="object-cover w-full h-full"
              unoptimized={false}
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </button>
        ))}
      </div>
      {gallery.length > 6 && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-blue-700 font-semibold hover:underline text-sm"
        >
          {showAll ? "Show less" : `Show all (${gallery.length})`}
        </button>
      )}

      {/* Popup */}
      {popup.open && (
        <div className="fixed inset-0 z-[1200] bg-black/80 flex items-center justify-center px-3">
          <button
            className="absolute top-6 right-6 text-white bg-black/70 rounded-full p-2 z-20"
            onClick={closePopup}
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 rounded-full p-2 z-20"
            onClick={prevImg}
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 rounded-full p-2 z-20"
            onClick={nextImg}
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>
          <div className="max-w-full max-h-[80vh] flex flex-col items-center justify-center relative">
            <Image
              src={gallery[popup.idx].image}
              alt={gallery[popup.idx].caption || `Gallery Image ${popup.idx + 1}`}
              width={900}
              height={600}
              className="rounded-2xl object-contain max-h-[70vh] shadow-xl"
              unoptimized={false}
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            {gallery[popup.idx].caption && (
              <div className="mt-3 text-white text-center text-base font-medium max-w-2xl px-2">
                {gallery[popup.idx].caption}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
