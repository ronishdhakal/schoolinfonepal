"use client";
import { useState } from "react";
import { CalendarDays } from "lucide-react";
import AdmissionInquiryModal from "@/components/common/AdmissionInquiryModal";

export default function AdmissionHeader({ admission }) {
  const [modalOpen, setModalOpen] = useState(false);

  // Debug: Check if courses are coming through
  console.log("AdmissionHeader - admission.courses:", admission?.courses);

  if (!admission) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CalendarDays className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{admission.title}</h1>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <span className="font-medium text-gray-600">Open:</span>{" "}
          {admission.active_from ? new Date(admission.active_from).toLocaleDateString() : "N/A"}{" "}
          <span className="mx-1 text-gray-400">→</span>
          {admission.active_until ? new Date(admission.active_until).toLocaleDateString() : "N/A"}
        </div>
      </div>
      <div className="flex items-center">
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-base shadow"
          onClick={() => setModalOpen(true)}
        >
          Apply / Inquiry
        </button>
      </div>

      {modalOpen && (
        <AdmissionInquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          school={admission.school}
          courses={admission.courses || []}
        />
      )}
    </section>
  );
}
