"use client";
import Link from "next/link";
import Image from "next/image";
import { getFullImageUrl } from "@/utils/imageUrl";

const UniversityCard = ({ university }) => {
  // If you want a different base path, adjust `/university/` below
  const href = `/university/${university.slug}`;

  return (
    <Link href={href} className="block">
      <div
        className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl cursor-pointer group"
      >
        {/* Cover Photo */}
        <div className="relative h-32 w-full bg-gray-100">
          {university.cover_photo ? (
            <Image
              src={getFullImageUrl(university.cover_photo)}
              alt={university.name + " Cover"}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 600px) 100vw, 600px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100">
              No Cover
            </div>
          )}
          {/* Logo */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-white shadow bg-white w-20 h-20 flex items-center justify-center overflow-hidden">
            {university.logo ? (
              <Image
                src={getFullImageUrl(university.logo)}
                alt={university.name + " Logo"}
                width={80}
                height={80}
                className="object-contain"
              />
            ) : (
              <span className="text-gray-300 text-3xl">🏛️</span>
            )}
          </div>
        </div>
        {/* Name */}
        <div className="pt-8 pb-4 px-4 text-center">
          <div className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-700">
            {university.name}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;
