"use client"
import { Award, CalendarDays, Building2, Clock, GraduationCap } from "lucide-react"
import Image from "next/image"
import { getFullImageUrl } from "@/utils/imageUrl"

export default function ScholarshipHeader({ scholarship }) {
  if (!scholarship) return null

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

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
              <Award className="w-5 h-5 text-[#1ca3fd]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{scholarship.title}</h1>
          </div>

          {/* Organizer Info */}
          {organizer && (
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              {organizerLogo ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                  <Image
                    src={getFullImageUrl(organizerLogo) || "/placeholder.svg"}
                    alt={organizer}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-blue-50 flex-shrink-0 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#1ca3fd]" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#1ca3fd]" />
                  <span className="font-semibold text-gray-900">{organizer}</span>
                </div>
                {scholarship.published_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Published: {scholarship.published_date}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm font-medium text-gray-700 mb-2">Application Deadline</div>
            <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#1ca3fd]" />
              {scholarship.active_from} &mdash; {scholarship.active_until}
            </div>
          </div>
        </div>

        {/* Right side - Level info */}
        {scholarship.level?.title && (
          <div className="flex-shrink-0">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-[#1ca3fd]" />
                <span className="font-medium text-gray-700">Education Level</span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{scholarship.level.title}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
