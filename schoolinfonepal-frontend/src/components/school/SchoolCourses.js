"use client";
import { useState } from "react";
import InquiryModal from "@/components/common/InquiryModal";
import PreRegistrationInquiryModal from "@/components/common/PreRegistrationInquiryModal";
import {
  GraduationCap,
  Building2,
  Clock,
  Mail,
  Banknote,
} from "lucide-react";

export default function SchoolCourses({ school }) {
  const [openInquiryId, setOpenInquiryId] = useState(null);

  const level = school?.level?.title || school?.level_text || "";
  const courses = school?.school_courses_display || [];

  if (!courses.length) return null;

  return (
    <section className="bg-white rounded-2xl p-3 md:p-8 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-extrabold text-[#1868ae] font-sans tracking-tight">
          Courses Offered
        </h2>
        {level && (
          <span className="inline-block bg-gray-50 text-[#1868ae] rounded-full px-4 py-1 text-sm md:text-base font-semibold shadow-sm border border-blue-100">
            {level}
          </span>
        )}
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-3 md:gap-6 mb-6 md:mb-10">
        {courses.map((sc) => (
          <div
            key={sc.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 bg-white border border-gray-200 rounded-xl px-3 py-3 md:px-6 md:py-5 transition group hover:shadow-md"
          >
            {/* Left: Course Info */}
            <div className="min-w-0">
              <div className="text-base md:text-xl font-semibold text-gray-900 mb-0.5 flex items-center gap-1 font-sans truncate">
                <GraduationCap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="truncate">{sc.course?.name || sc.course_name || sc.name || "Course"}</span>
              </div>
              {(sc.course?.university_name || sc.university_name) && (
                <div className="flex items-center gap-1 text-blue-700 text-xs font-semibold mb-0.5">
                  <Building2 className="w-4 h-4 text-blue-300 flex-shrink-0" />
                  <span className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full shadow-sm">
                    {sc.course?.university_name || sc.university_name}
                  </span>
                </div>
              )}
              {sc.fee !== null && sc.fee !== undefined && sc.fee !== "" && (
                <div className="flex items-center gap-1 mt-0.5 text-gray-700 text-xs md:text-sm font-normal">
                  <Banknote className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>
                    Rs. {Number(sc.fee).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            {/* Right: Duration & Apply */}
            <div className="flex flex-row items-center gap-2 sm:gap-4 flex-shrink-0 mt-2 sm:mt-0">
              <span className="inline-flex items-center gap-1 bg-gray-50 text-blue-700 font-semibold px-2 py-1 rounded-full text-xs md:text-sm border border-gray-200">
                <Clock className="w-4 h-4" />
                {(sc.course?.duration || sc.duration) ? `${sc.course?.duration || sc.duration}` : "—"}
              </span>
              <button
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 md:px-6 md:py-2 rounded-full shadow-sm transition text-xs md:text-base active:scale-95 focus:outline-none"
                onClick={() => setOpenInquiryId(sc.id)}
              >
                <Mail className="w-4 h-4 md:w-5 md:h-5" />
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
        ))}
      </div>

      {/* Embedded Pre-Registration Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-7 max-w-2xl mx-auto mt-6">
        <div className="font-semibold text-base md:text-xl text-[#1868ae] mb-3 md:mb-5 font-sans flex items-center gap-2">
          <Mail className="w-5 h-5 md:w-6 md:h-6" />
          Pre-Registration Form
        </div>
        <PreRegistrationInquiryModal
          open={true}
          onClose={() => {}}
          school={school}
          course={null}
        />
      </div>
    </section>
  );
}
