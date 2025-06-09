"use client"
import { GraduationCap, Building2, BookOpen } from "lucide-react"
import Link from "next/link"

export default function ScholarshipOther({ scholarship }) {
  if (!scholarship) return null

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
          <BookOpen className="w-5 h-5 text-[#1ca3fd]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Scholarship Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* University */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-100">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 flex-shrink-0">
            <Building2 className="w-5 h-5 text-[#1ca3fd]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-500 mb-1">University</div>
            <div className="text-base font-semibold text-gray-900">
              {scholarship.university?.name ? (
                <Link href={`/university/${scholarship.university.slug}`} className="text-[#1ca3fd] hover:underline">
                  {scholarship.university.name}
                </Link>
              ) : (
                <span className="text-gray-400">Not specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-white transition-all duration-200 hover:shadow-md hover:border-blue-100">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#1ca3fd]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-500 mb-1">Education Level</div>
            <div className="text-base font-semibold text-gray-900">
              {scholarship.level?.title || <span className="text-gray-400">Not specified</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      {Array.isArray(scholarship.courses) && scholarship.courses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Available for Courses</h3>
          <div className="flex flex-wrap gap-2">
            {scholarship.courses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.slug}`}
                className="inline-flex items-center gap-1.5 bg-blue-50 text-gray-800 px-4 py-2 rounded-lg text-sm border border-blue-100 transition-all duration-200 hover:bg-blue-100"
              >
                <BookOpen className="w-4 h-4 text-[#1ca3fd]" />
                {course.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
