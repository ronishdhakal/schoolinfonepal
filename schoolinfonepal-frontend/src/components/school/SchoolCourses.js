// src/components/school/SchoolCourses.js
"use client";
import { useState } from "react";
import InquiryModal from "@/components/common/InquiryModal";
import PreRegistrationInquiryModal from "@/components/common/PreRegistrationInquiryModal";
import { GraduationCap, Banknote } from "lucide-react";

export default function SchoolCourses({ school }) {
  const [openInquiryId, setOpenInquiryId] = useState(null);

  const level = school?.level?.title || school?.level_text || "";
  const courses = school?.school_courses_display || [];

  if (!courses.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          Courses Offered
        </h2>
        {level && (
          <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-semibold ml-2 mb-1">
            {level}
          </span>
        )}
      </div>

      {/* Course Cards List */}
      <div className="flex flex-col gap-3 mb-8">
        {courses.map((sc) => (
          <div
            key={sc.id}
            className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="text-blue-600 w-5 h-5" />
                <span className="text-lg font-semibold text-gray-900">{sc.course?.name || "Course"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <span>University:</span>
                <span className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 font-medium">
                  {sc.course?.university_name || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <Banknote className="w-5 h-5 text-green-600" />
                {sc.fee !== null && sc.fee !== undefined && sc.fee !== "" ? (
                  <>
                    <span>Fee:</span>
                    <span className="text-gray-900 font-semibold">Rs. {Number(sc.fee).toLocaleString()}</span>
                  </>
                ) : (
                  <span>Fee: —</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
                onClick={() => setOpenInquiryId(sc.id)}
              >
                Apply Now
              </button>
            </div>
            {/* InquiryModal for this course */}
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
        ))}
      </div>

      {/* Embedded Pre-Registration Form (always visible, not modal) */}
      <div className="bg-gray-100 rounded-xl p-6 mt-4 shadow-inner max-w-xl mx-auto">
        <div className="font-semibold text-lg text-blue-700 mb-3">Pre-Registration Form</div>
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
