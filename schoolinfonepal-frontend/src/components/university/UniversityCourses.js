"use client"
import Link from "next/link"
import { GraduationCap, Clock, BookOpen } from "lucide-react"

export default function UniversityCourses({ university }) {
  const courses = Array.isArray(university?.courses) ? university.courses : []

  if (!courses.length) {
    return (
      <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Courses Offered</h2>
        <div className="text-gray-400 text-center py-8">No courses listed for this university.</div>
      </section>
    )
  }

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Courses Offered</h2>
      <div className="space-y-4">
        {courses.map((course) => {
          const slug = course.slug || course.id
          return (
            <Link
              key={course.id}
              href={`/course/${slug}`}
              className="block p-4 rounded-lg border border-gray-100 hover:border-[#1ca3fd] hover:shadow-sm transition-all relative group"
              aria-label={`View ${course.name}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="text-[#1ca3fd] flex-shrink-0" />
                    <h3 className="text-lg text-gray-900 group-hover:text-[#1ca3fd] cursor-pointer">
                      {course.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {course.duration && (
                      <span className="flex items-center gap-1 bg-blue-50 text-gray-800 px-2 py-1 rounded border border-blue-100">
                        <Clock className="text-[#1ca3fd]" style={{ width: "16px", height: "16px" }} />
                        {course.duration}
                      </span>
                    )}
                    {course.level_name && (
                      <span className="flex items-center gap-1 bg-blue-50 text-gray-800 px-2 py-1 rounded border border-blue-100">
                        <BookOpen className="text-[#1ca3fd]" style={{ width: "16px", height: "16px" }} />
                        {course.level_name}
                      </span>
                    )}
                    {course.discipline_name && (
                      <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded border border-gray-200 text-xs">
                        {course.discipline_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
