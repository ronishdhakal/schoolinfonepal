"use client";
import { useState } from "react";
import InquiryModal from "@/components/common/InquiryModal";
import PreRegistrationInquiryModal from "@/components/common/PreRegistrationInquiryModal";
import Link from "next/link";
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
    <section className="p-3 md:p-6 mb-6 border border-gray-100 rounded-xl bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
          Courses Offered
        </h2>
        {level && (
          <span className="bg-gray-50 text-blue-600 rounded-full px-3 py-1 text-sm font-medium">
            {level}
          </span>
        )}
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-3 md:gap-4">
        {courses.map((sc) => {
          // Prefer sc.course.slug if available
          const slug = sc.course?.slug || sc.slug || "";
          return (
            <div
              key={sc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 md:p-4 rounded-xl border border-gray-200 bg-white group transition-all duration-200 shadow-none hover:shadow-lg hover:border-blue-200"
              style={{ position: "relative" }}
            >
              {/* Left: Course Info */}
              <div className="min-w-0 flex-1">
                <Link
                  href={slug ? `/course/${slug}` : "#"}
                  className="text-base md:text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2 hover:text-blue-700 transition-colors truncate no-underline"
                  title={sc.course?.name || sc.course_name || sc.name || "Course"}
                  style={{ textDecoration: "none" }}
                  tabIndex={slug ? 0 : -1}
                >
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  {sc.course?.name || sc.course_name || sc.name || "Course"}
                </Link>
                {(sc.course?.university_name || sc.university_name) && (
                  <div className="flex items-center gap-1 text-gray-500 text-xs font-medium mt-1">
                    <Building2 className="w-4 h-4 text-blue-300" />
                    <span className="bg-white border border-gray-100 px-2 py-1 rounded-full text-xs">
                      {sc.course?.university_name || sc.university_name}
                    </span>
                  </div>
                )}
                {sc.fee !== null && sc.fee !== undefined && sc.fee !== "" && (
                  <div className="flex items-center gap-1 mt-1 text-gray-700 text-sm">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span>Rs. {Number(sc.fee).toLocaleString()}</span>
                  </div>
                )}
              </div>
              {/* Right: Duration & Apply */}
              <div className="flex flex-row items-center gap-2 sm:gap-4 flex-shrink-0 mt-2 sm:mt-0">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-800 font-medium px-3 py-1.5 rounded-full text-sm border border-blue-200">
                  <Clock className="w-4 h-4" />
                  {sc.course?.duration || sc.duration || "—"}
                </span>
                <button
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-full text-sm transition-colors active:scale-95"
                  onClick={() => setOpenInquiryId(sc.id)}
                >
                  <Mail className="w-4 h-4" />
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
              {/* Optional blue highlight on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-blue-100 opacity-0 group-hover:opacity-60 transition" />
            </div>
          );
        })}
      </div>

      {/* Pre-Registration Form */}
      <div className="p-3 md:p-6 rounded-xl border border-gray-100 mt-6 bg-white">
        <div className="font-semibold text-base md:text-lg text-gray-900 mb-3 flex items-center gap-2">
          <Mail className="w-5 h-5" />
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
