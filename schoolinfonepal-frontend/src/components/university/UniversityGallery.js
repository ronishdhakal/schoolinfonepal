"use client";
import { useState } from "react";
import Image from "next/image";

// Helper for absolute/relative URLs
function getFullImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000";
  return `${BASE}${url}`;
}

const UniversityGallery = ({ university }) => {
  const [selected, setSelected] = useState(null);

  if (!university || !Array.isArray(university.gallery) || university.gallery.length === 0)
    return null;

  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {university.gallery.map((img, idx) => (
          <button
            key={img.id || idx}
            type="button"
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ minHeight: 0 }}
            onClick={() => setSelected(img)}
            title={img.caption || ""}
          >
            <Image
              src={getFullImageUrl(img.image)}
              alt={img.caption || `Gallery image ${idx + 1}`}
              fill
              className="object-cover w-full h-full transition"
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ display: "block" }}
              unoptimized={false}
            />
          </button>
        ))}
      </div>
      {/* Modal preview */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-4 max-w-xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getFullImageUrl(selected.image)}
              alt={selected.caption || "Gallery Image"}
              width={800}
              height={450}
              className="object-contain w-full max-h-[60vh] rounded-lg mb-2"
              priority
            />
            {selected.caption && (
              <div className="text-center text-gray-700 text-sm">{selected.caption}</div>
            )}
            <button
              className="absolute top-2 right-2 bg-white rounded-full shadow px-2 py-1 text-gray-600 hover:bg-gray-200"
              onClick={() => setSelected(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UniversityGallery;
