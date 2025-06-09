"use client"
import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, MapPin, ArrowRight } from "lucide-react"
import { getFullImageUrl } from "@/utils/imageUrl"

export default function SchoolCard({ school, onApply }) {
  const schoolUrl = `/school/${school.slug}`

  return (
    <div className="relative group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link href={schoolUrl} className="block">
        {/* Cover Photo */}
        <div className="relative w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {school.cover_photo ? (
            <Image
              src={getFullImageUrl(school.cover_photo) || "/placeholder.svg"}
              alt={`${school.name} Cover`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
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

      {/* Logo positioned over cover photo */}
      <div className="relative z-20 flex items-center px-4" style={{ marginTop: "-2rem" }}>
        <div className="bg-white rounded-xl shadow-lg p-2 w-16 h-16 flex items-center justify-center border-2 border-white">
          {school.logo ? (
            <Image
              src={getFullImageUrl(school.logo) || "/placeholder.svg"}
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

      {/* Card Content */}
      <div className="pt-2 px-4 pb-4 flex-grow flex flex-col">
        {/* School Name with verification */}
        <div className="flex items-center gap-2 mb-2 min-w-0">
          <Link
            href={schoolUrl}
            className="text-lg font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors truncate flex items-center gap-1 min-w-0"
            title={school.name}
          >
            <span className="truncate">{school.name}</span>
            {school.verification && (
              <BadgeCheck className="w-5 h-5 text-[#1ca3fd] flex-shrink-0" title="Verified School" />
            )}
          </Link>
        </div>

        {/* Address */}
        {(school.address || school.district?.name) && (
          <div className="flex items-center gap-1 mb-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{[school.address, school.district?.name].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Inquiry Button */}
        <button
          onClick={() => onApply && onApply(school)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1ca3fd] hover:bg-[#0b8de0] text-white font-medium rounded-lg transition-colors shadow-sm"
          type="button"
          aria-label={`Inquire about ${school.name}`}
        >
          <span>Inquire Now</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
