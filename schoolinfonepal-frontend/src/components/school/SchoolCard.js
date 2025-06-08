"use client";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { getFullImageUrl } from "@/utils/imageUrl"; // <- Make sure this util exists!

export default function SchoolCard({ school, onApply }) {
  const schoolUrl = `/school/${school.slug}`;

  return (
    <div className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      <Link href={schoolUrl} className="block group">
        {/* Cover Photo */}
        <div className="relative w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden rounded-t-2xl">
          {school.cover_photo ? (
            <Image
              src={getFullImageUrl(school.cover_photo)}
              alt={`${school.name} Cover`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
              unoptimized
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-sm">No Cover Image</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* LOGO: left-aligned, above name */}
      <div className="relative z-20 flex items-center px-3" style={{ marginTop: "-2rem" }}>
        <div className="bg-white rounded-2xl shadow-lg p-2 w-16 h-16 flex items-center justify-center border-2 border-white">
          {school.logo ? (
            <Image
              src={getFullImageUrl(school.logo)}
              alt={school.name}
              width={48}
              height={48}
              className="object-contain rounded-lg"
              unoptimized
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Card Content with left-aligned text */}
      <div className="pt-2 px-3 pb-3">
        {/* Name row with verification icon */}
        <div className="flex items-center gap-2 mb-2 min-w-0">
          <Link
            href={schoolUrl}
            className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate flex items-center gap-1 min-w-0"
            title={school.name}
          >
            <span className="truncate">{school.name}</span>
            {school.verification && (
              <BadgeCheck className="w-5 h-5 text-[#4c9bd5] flex-shrink-0" title="Verified School" />
            )}
          </Link>
        </div>

        {/* Address & District as plain text, icon at left */}
        {(school.address || school.district?.name) && (
          <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
            <span className="truncate">
              {[school.address, school.district?.name].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* Inquiry Button at the bottom */}
      <div className="px-3 pb-3 flex items-center justify-center">
        <button
          onClick={() => onApply && onApply(school)}
          className="w-full px-4 py-3 bg-[#4c9bd5] hover:bg-[#1868ae] text-white font-semibold rounded-xl shadow-md transition-all duration-200 text-base flex items-center justify-center gap-2"
          type="button"
          aria-label={`Apply to ${school.name}`}
        >
          <span>Inquire</span>
        </button>
      </div>
    </div>
  );
}
