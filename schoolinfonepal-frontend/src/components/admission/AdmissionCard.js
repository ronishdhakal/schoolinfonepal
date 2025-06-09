"use client"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, MapPin, ArrowRight, GraduationCap, Building2 } from "lucide-react"
import { getFullImageUrl } from "@/utils/imageUrl"

export default function AdmissionCard({ admission, onApply, compact = false }) {
  const admissionUrl = `/admission/${admission.slug}`
  const fromDate = admission.active_from ? new Date(admission.active_from).toLocaleDateString() : "N/A"
  const untilDate = admission.active_until ? new Date(admission.active_until).toLocaleDateString() : "N/A"

  // Compact version for sidebar or small spaces
  if (compact) {
    return (
      <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
        <Link href={admissionUrl} className="block p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 mb-2">
            {admission.title}
          </h3>

          {admission.school?.name && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{admission.school.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <CalendarDays className="w-3 h-3 text-[#1ca3fd] flex-shrink-0" />
            <span>
              {fromDate} → {untilDate}
            </span>
          </div>

          {admission.courses && admission.courses.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {admission.courses.slice(0, 2).map((course) => (
                <span
                  key={course.id}
                  className="inline-block bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded text-xs border border-blue-100"
                >
                  {course.name}
                </span>
              ))}
              {admission.courses.length > 2 && (
                <span className="inline-block bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                  +{admission.courses.length - 2}
                </span>
              )}
            </div>
          )}
        </Link>

        {onApply && (
          <div className="px-4 pb-4">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onApply(admission)
              }}
              className="w-full px-3 py-2 bg-[#1ca3fd] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              type="button"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    )
  }

  // Full version for main listing
  return (
    <div className="relative group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <Link href={admissionUrl} className="block">
        {/* Header with School Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            {admission.school?.logo && (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                <Image
                  src={getFullImageUrl(admission.school.logo) || "/placeholder.svg"}
                  alt={admission.school.name}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors truncate">
                {admission.title}
              </h3>
              {admission.school?.name && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{admission.school.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {(admission.school?.address || admission.school?.district?.name) && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {[admission.school?.address, admission.school?.district?.name].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4 text-[#1ca3fd] flex-shrink-0" />
            <span>
              {fromDate} → {untilDate}
            </span>
          </div>
        </div>
      </Link>

      {/* Courses */}
      {admission.courses && admission.courses.length > 0 && (
        <div className="p-4 flex-grow">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="w-4 h-4 text-[#1ca3fd]" />
            <span>Available Courses:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {admission.courses.slice(0, 3).map((course) => (
              <span
                key={course.id}
                className="inline-block bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded text-xs border border-blue-100"
              >
                {course.name}
              </span>
            ))}
            {admission.courses.length > 3 && (
              <span className="inline-block bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                +{admission.courses.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Apply Button */}
      <div className="p-4 pt-0">
        {onApply && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onApply(admission)
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1ca3fd] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
            type="button"
            aria-label={`Apply for ${admission.title}`}
          >
            <span>Apply Now</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
