"use client";
import Image from "next/image";
import Link from "next/link";

const InformationCard = ({ info }) => {
  return (
    <Link
      href={`/information/${info.slug}`}
      className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group border"
      style={{ minHeight: 260 }}
    >
      <div className="relative w-full h-40 bg-gray-100">
        {info.featured_image ? (
          <Image
            src={info.featured_image}
            alt={info.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-5xl">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 mb-1">
          {info.title}
        </h3>
        {info.category && (
          <span className="text-xs inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {info.category_display || info.category_name || ""}
          </span>
        )}
      </div>
    </Link>
  );
};

export default InformationCard;
