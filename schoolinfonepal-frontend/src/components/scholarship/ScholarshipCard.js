"use client"
import Link from "next/link"
import { CalendarDays, Award, ArrowRight, Building2, GraduationCap } from "lucide-react"
import Image from "next/image"
import { getFullImageUrl } from "@/utils/imageUrl"

export default function ScholarshipCard({ scholarship, onApply, compact = false }) {
  const scholarshipUrl = `/scholarship/${scholarship.slug}`

  // Format dates
  const fromDate = scholarship.active_from ? new Date(scholarship.active_from).toLocaleDateString() : "N/A"
  const untilDate = scholarship.active_until ? new Date(scholarship.active_until).toLocaleDateString() : "N/A"

  // Determine organizer display
  let organizer = ""
  let organizerLogo = null
  let organizerType = null

  if (scholarship.organizer_custom) {
    organizer = scholarship.organizer_custom
    organizerType = "custom"
  } else if (scholarship.organizer_school?.name) {
    organizer = scholarship.organizer_school.name
    organizerLogo = scholarship.organizer_school.logo
    organizerType = "school"
  } else if (scholarship.organizer_university?.name) {
    organizer = scholarship.organizer_university.name
    organizerLogo = scholarship.organizer_university.logo
    organizerType = "university"
  }

  // Compact version for sidebar or small spaces
  if (compact) {
    return (
      <div className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
        <Link href={scholarshipUrl} className="block p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors line-clamp-2 mb-2">
            {scholarship.title}
          </h3>

          {organizer && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{organizer}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <CalendarDays className="w-3 h-3 text-[#1ca3fd] flex-shrink-0" />
            <span>Deadline: {untilDate}</span>
          </div>
        </Link>

        {onApply && (
          <div className="px-4 pb-4">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onApply(scholarship)
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
      <Link href={scholarshipUrl} className="block">
        {/* Header with Organizer Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            {organizerLogo ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                <Image
                  src={getFullImageUrl(organizerLogo) || "/placeholder.svg"}
                  alt={organizer}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 bg-blue-50 flex-shrink-0 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#1ca3fd]" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1ca3fd] transition-colors truncate">
                {scholarship.title}
              </h3>
              {organizer && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{organizer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4 text-[#1ca3fd] flex-shrink-0" />
            <span>
              Deadline: <span className="font-medium">{untilDate}</span>
            </span>
          </div>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex-grow">
        {scholarship.level?.title && (
          <div className="flex items-center gap-1 text-sm mb-2">
            <GraduationCap className="w-4 h-4 text-[#1ca3fd]" />
            <span className="text-gray-700">{scholarship.level.title}</span>
          </div>
        )}

        {scholarship.description && (
          <div className="text-sm text-gray-600 line-clamp-3 mb-3">
            {scholarship.description.replace(/<[^>]*>/g, "")}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <div className="p-4 pt-0">
        <Link
          href={scholarshipUrl}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1ca3fd] hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
