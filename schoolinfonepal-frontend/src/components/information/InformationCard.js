"use client"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Building2, Tag } from "lucide-react"
import { getFullImageUrl } from "@/utils/imageUrl"

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export default function InformationCard({ info, compact = false }) {
  const infoUrl = `/information/${info.slug}`

  // Compact version for sidebar or small spaces
  if (compact) {
    return (
      <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
        <Link href={infoUrl} className="block">
          <div className="flex gap-3 p-4">
            <div className="relative h-16 w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
              {info.featured_image ? (
                <Image
                  src={getFullImageUrl(info.featured_image) || "/placeholder.svg"}
                  alt={info.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <Tag className="w-6 h-6" />
                </div>
              )}
              {info.featured && (
                <span className="absolute top-1 right-1 bg-yellow-400 text-white text-xs font-bold px-1 py-0.5 rounded">
                  ★
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 text-sm mb-1">
                {info.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <Calendar className="w-3 h-3 text-[#1ca3fd] flex-shrink-0" />
                <span>{formatDate(info.published_date)}</span>
              </div>
              {info.category && (
                <span className="inline-block bg-blue-50 text-[#1ca3fd] px-2 py-0.5 rounded text-xs border border-blue-100">
                  {info.category_display || info.category_name || info.category?.name || ""}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Full version for main listing
  return (
    <div className="relative group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link href={infoUrl} className="block">
        {/* Featured Image */}
        <div className="relative w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {info.featured_image ? (
            <Image
              src={getFullImageUrl(info.featured_image) || "/placeholder.svg"}
              alt={info.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Tag className="w-12 h-12 mx-auto mb-2" />
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {info.featured && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
              FEATURED
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-[#1ca3fd] text-white text-sm font-bold px-3 py-1 rounded-lg shadow">
            {formatDate(info.published_date)}
          </div>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category */}
        {info.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded text-xs border border-blue-100">
              {info.category_display || info.category_name || info.category?.name || ""}
            </span>
          </div>
        )}

        {/* Title */}
        <Link
          href={infoUrl}
          className="text-lg font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 mb-3"
        >
          {info.title}
        </Link>

        {/* Summary */}
        {info.summary && <div className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{info.summary}</div>}

        {/* Related Info */}
        <div className="space-y-2 mb-4">
          {/* Universities */}
          {info.universities && info.universities.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {info.universities
                  .slice(0, 2)
                  .map((u) => u.name)
                  .join(", ")}
                {info.universities.length > 2 && ` +${info.universities.length - 2} more`}
              </span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <Link
          href={infoUrl}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1ca3fd] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>Read More</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
