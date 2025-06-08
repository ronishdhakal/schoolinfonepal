// src/components/school/SchoolAdmission.js
"use client";
import { useEffect, useState } from "react";
import { fetchAdmissions } from "@/utils/api";
import AdmissionInquiryModal from "@/components/common/AdmissionInquiryModal";
import { CalendarDays, GraduationCap, Clock, Building2 } from "lucide-react";

export default function SchoolAdmission({ school }) {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  useEffect(() => {
    if (!school?.slug) return;
    setLoading(true);
    fetchAdmissions({ school: school.slug }) // Filter by this school only
      .then((res) => {
        // Only include admissions that are currently active
        const today = new Date();
        setAdmissions(
          (res.results || res).filter(
            (ad) =>
              (!ad.active_from || new Date(ad.active_from) <= today) &&
              (!ad.active_until || new Date(ad.active_until) >= today)
          )
        );
      })
      .finally(() => setLoading(false));
  }, [school?.slug]);

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7 text-gray-500 text-center">
        Loading admissions...
      </section>
    );
  }

  if (!admissions.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <CalendarDays className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Active Admissions</h2>
      </div>
      <div className="flex flex-col gap-5">
        {admissions.map((ad) => (
          <div
            key={ad.id}
            className="border border-gray-100 rounded-xl px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-blue-900 mb-1 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span>{ad.title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {ad.university?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {ad.level?.name}
                </span>
                <span>
                  {ad.active_from} to {ad.active_until}
                </span>
              </div>
              <div className="text-gray-700 line-clamp-2">{ad.description}</div>
            </div>
            <div className="flex flex-col gap-2 md:gap-0">
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
                onClick={() => {
                  setSelectedAdmission(ad);
                  setInquiryOpen(true);
                }}
              >
                Apply/Inquiry
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Admission Inquiry Modal */}
      {inquiryOpen && selectedAdmission && (
        <AdmissionInquiryModal
          open={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          school={school}
          courses={selectedAdmission.courses || []}
        />
      )}
    </section>
  );
}
