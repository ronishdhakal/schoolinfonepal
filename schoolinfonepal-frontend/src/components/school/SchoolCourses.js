"use client"
import Link from "next/link"
import { useState } from "react"
import InquiryModal from "@/components/common/InquiryModal"
import PreRegistrationInquiryModal from "@/components/common/PreRegistrationInquiryModal"
import { GraduationCap, Building2, Clock, Mail, Banknote } from "lucide-react"

export default function SchoolCourses({ school }) {
  const [openInquiryId, setOpenInquiryId] = useState(null)
  const courses = school?.school_courses_display || []

  if (!courses.length) return null

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
          Courses Offered
        </h2>
        {school?.level_text && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            {school.level_text}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {courses.map((sc) => {
          const slug = sc.course?.slug || sc.slug || ""
          const courseName = sc.course?.name || sc.course_name || sc.name || "Course"
          const university = sc.course?.university_name || sc.university_name
          const duration = sc.course?.duration || sc.duration || "—"
          const fee =
            sc.fee !== null && sc.fee !== undefined && sc.fee !== ""
              ? `Rs. ${Number(sc.fee).toLocaleString()}`
              : ""

          // Wrap only if we have a valid slug
          const cardContent = (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-lg font-semibold flex items-center gap-2 mb-1 text-[#1868ae] group-hover:underline">
                  <GraduationCap className="text-[#1ca3fd] flex-shrink-0" />
                  {courseName}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  {university && (
                    <div className="flex items-center gap-1">
                      <Building2 className="text-[#1ca3fd]" />
                      <span>{university}</span>
                    </div>
                  )}
                  {fee && (
                    <div className="flex items-center gap-1">
                      <Banknote className="text-[#1ca3fd]" />
                      <span>{fee}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="flex items-center gap-1 bg-blue-50 text-gray-800 px-3 py-1 rounded-full text-sm border border-blue-100">
                  <Clock className="text-[#1ca3fd]" />
                  {duration}
                </span>
                <button
                  className="flex items-center gap-1 bg-[#1ca3fd] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  onClick={e => {
                    e.preventDefault() // prevent Link navigation when clicking button
                    e.stopPropagation()
                    setOpenInquiryId(sc.id)
                  }}
                >
                  <Mail />
                  Apply
                </button>
                {openInquiryId === sc.id && (
                  <InquiryModal
                    open={true}
                    onClose={() => setOpenInquiryId(null)}
                    school={school}
                    course={sc.course}
                    onSuccess={() => setOpenInquiryId(null)}
                  />
                )}
              </div>
            </div>
          )

          return slug ? (
            <Link
              key={sc.id}
              href={`/course/${slug}`}
              className="block p-4 rounded-lg border border-gray-100 hover:border-[#1ca3fd] hover:shadow-sm transition-all group bg-white"
              tabIndex={0}
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={sc.id}
              className="p-4 rounded-lg border border-gray-100 bg-white"
            >
              {cardContent}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-gray-100 bg-gray-50">
        <div className="text-lg text-gray-900 mb-3 flex items-center gap-2">
          <Mail className="text-[#1ca3fd]" />
          Pre-Registration Form
        </div>
        <PreRegistrationInquiryModal open={true} onClose={() => {}} school={school} course={null} />
      </div>
    </section>
  )
}
