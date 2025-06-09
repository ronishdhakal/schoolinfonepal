"use client"
import { GraduationCap, Clock, BookOpen } from "lucide-react"

export default function AdmissionInfo({ admission }) {
  if (!admission?.courses || admission.courses.length === 0) return null

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
          <GraduationCap className="w-5 h-5 text-[#1ca3fd]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {admission.courses.map((course) => (
          <div
            key={course.id}
            className="p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{course.name}</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  {course.duration && (
                    <span className="flex items-center gap-1 bg-blue-50 text-[#1ca3fd] px-2 py-1 rounded border border-blue-100">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  )}
                  {course.level_name && (
                    <span className="flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-1 rounded border border-gray-200">
                      <BookOpen className="w-3 h-3" />
                      {course.level_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
