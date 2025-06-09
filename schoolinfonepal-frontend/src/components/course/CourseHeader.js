"use client"
import { GraduationCap, Clock, Building2, ArrowRight } from "lucide-react"

export default function CourseHeader({ course, onInquire }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Course Icon */}
      <div className="flex-shrink-0">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1ca3fd] to-[#0b8de0] rounded-xl flex items-center justify-center">
          <GraduationCap size={32} className="text-white" />
        </div>
      </div>

      {/* Course Information */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
          {course.abbreviation && (
            <div className="inline-flex items-center px-3 py-1 bg-[#1ca3fd] bg-opacity-10 text-[#1ca3fd] text-sm font-semibold rounded-full">
              {course.abbreviation}
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {course.university?.name && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 size={16} className="text-[#1ca3fd]" />
              <span className="font-medium">University:</span>
              <span>{course.university.name}</span>
            </div>
          )}
          {course.duration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} className="text-[#1ca3fd]" />
              <span className="font-medium">Duration:</span>
              <span>{course.duration}</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        {course.short_description && <p className="text-gray-700 leading-relaxed">{course.short_description}</p>}
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0">
        <button
          className="flex items-center gap-2 px-6 py-3 bg-[#1ca3fd] text-white font-semibold rounded-lg hover:bg-[#0b8de0] transition-colors shadow-sm"
          onClick={onInquire}
        >
          Inquire Now
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
