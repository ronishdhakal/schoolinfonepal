"use client";
import Image from "next/image";

const InformationHeader = ({ info }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{info.title}</h1>
        <div className="flex items-center gap-3 mb-2">
          {info.category && (
            <span className="text-xs inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {info.category_display || info.category_name || info.category?.name || ""}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {info.published_date ? new Date(info.published_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}
          </span>
        </div>
      </div>
      <div className="w-full md:w-60 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative aspect-[4/3]">
        {info.featured_image ? (
          <Image
            src={info.featured_image}
            alt={info.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 240px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-4xl">
            No Image
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationHeader;
