"use client"
import Link from "next/link"
import { Clock, Building2, ArrowRight } from "lucide-react"

const CourseCard = ({ course, onInquire }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    {/* Card Header */}
    <div className="p-5 border-b border-gray-100 flex-grow">
      <div className="mb-3">
        {course.university?.name && (
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 size={14} className="text-gray-500" />
            <span className="text-sm text-gray-600 font-medium truncate">{course.university.name}</span>
          </div>
        )}

        {course.slug ? (
          <Link
            href={`/course/${course.slug}`}
            className="text-lg font-bold text-gray-800 hover:text-[#1ca3fd] transition-colors line-clamp-2"
          >
            {course.name}
          </Link>
        ) : (
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{course.name}</h3>
        )}
      </div>

      {course.duration && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock size={14} className="text-[#1ca3fd]" />
          <span>{course.duration}</span>
        </div>
      )}
    </div>

    {/* Card Footer */}
    <div className="p-4 bg-gray-50 flex items-center justify-between">
      <button
        className="flex items-center gap-1.5 px-4 py-2 bg-[#1ca3fd] text-white text-sm font-medium rounded-lg hover:bg-[#0b8de0] transition-colors"
        onClick={() => onInquire(course)}
      >
        Inquire Now
        <ArrowRight size={14} />
      </button>

      {course.slug && (
        <Link
          href={`/course/${course.slug}`}
          className="text-sm text-gray-600 hover:text-[#1ca3fd] font-medium transition-colors"
        >
          Details
        </Link>
      )}
    </div>
  </div>
)

export default CourseCard
