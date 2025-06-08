"use client";
import Image from "next/image";

// Helper: handle absolute and relative image URLs
function getFullImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000";
  return `${BASE}${url}`;
}

const UniversityHeader = ({ university }) => {
  if (!university) return null;

  return (
    <section className="relative w-full rounded-2xl shadow bg-white mb-8">
      {/* Cover */}
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
        {university.cover_photo ? (
          <Image
            src={getFullImageUrl(university.cover_photo)}
            alt={university.name + " Cover"}
            fill
            className="object-cover w-full h-full"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xl">
            No Cover Photo
          </div>
        )}
      </div>

      {/* Logo & info box, shifted right */}
      <div className="flex flex-col items-start pl-36 md:pl-48">
        <div className="relative -mt-14 z-10">
          <div className="w-24 h-24 rounded-full bg-white shadow-md border-4 border-white flex items-center justify-center overflow-hidden">
            {university.logo ? (
              <Image
                src={getFullImageUrl(university.logo)}
                alt={university.name + " Logo"}
                width={96}
                height={96}
                className="object-contain"
              />
            ) : (
              <span className="text-4xl text-gray-300">🏛️</span>
            )}
          </div>
        </div>
        {/* Info box below cover, right-aligned */}
        <div className="flex flex-col items-start mt-2 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{university.name}</h1>
          <div className="text-gray-500 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 21l-4.243-4.243A8 8 0 1117.657 16.657z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
            <span>{university.address || "Address not specified"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityHeader;
