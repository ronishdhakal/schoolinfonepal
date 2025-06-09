"use client"
import Image from "next/image"
import { Calendar, Tag, Building2, Clock } from "lucide-react"
import { getFullImageUrl } from "@/utils/imageUrl"

function formatDate(dateStr) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
}

export default function InformationHeader({ info }) {
  if (!info) return null

  return (
    <section className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-80 bg-gradient-to-br from-gray-50 to-gray-100">
        {info.featured_image ? (
          <Image
            src={getFullImageUrl(info.featured_image) || "/placeholder.svg"}
            alt={info.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Tag className="w-16 h-16 mx-auto mb-4" />
              <span className="text-lg">No Image Available</span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Featured Badge */}
        {info.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-white font-bold px-3 py-1 rounded-lg shadow flex items-center gap-1">
            <span>⭐</span>
            FEATURED
          </div>
        )}
      </div>

      {/* Information Details */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left side - Main info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
                <Tag className="w-5 h-5 text-[#1ca3fd]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{info.title}</h1>
            </div>

            {/* Category and Date */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {info.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#1ca3fd]" />
                  <span className="bg-blue-50 text-[#1ca3fd] px-3 py-1 rounded-lg text-sm font-medium border border-blue-100">
                    {info.category_display || info.category_name || info.category?.name || ""}
                  </span>
                </div>
              )}

              {info.published_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#1ca3fd]" />
                  <span className="text-sm font-medium">Published: {formatDate(info.published_date)}</span>
                </div>
              )}

              {info.updated_at && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Updated: {formatDate(info.updated_at)}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            {info.summary && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Summary</div>
                <div className="text-gray-900 leading-relaxed">{info.summary}</div>
              </div>
            )}
          </div>

          {/* Right side - Related entities */}
          <div className="flex-shrink-0 space-y-4">
            {/* Universities */}
            {info.universities && info.universities.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-[#1ca3fd]" />
                  <span className="font-medium text-gray-700">Related Universities</span>
                </div>
                <div className="space-y-1">
                  {info.universities.slice(0, 3).map((university) => (
                    <div key={university.id} className="text-sm text-gray-900">
                      {university.name}
                    </div>
                  ))}
                  {info.universities.length > 3 && (
                    <div className="text-xs text-gray-500">+{info.universities.length - 3} more</div>
                  )}
                </div>
              </div>
            )}

            {/* Levels */}
            {info.levels && info.levels.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-5 h-5 text-[#1ca3fd]" />
                  <span className="font-medium text-gray-700">Education Levels</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {info.levels.map((level) => (
                    <span
                      key={level.id}
                      className="inline-block bg-white text-gray-700 px-2 py-1 rounded text-xs border border-gray-200"
                    >
                      {level.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
