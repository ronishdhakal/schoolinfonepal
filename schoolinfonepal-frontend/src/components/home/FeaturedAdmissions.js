"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchFeaturedAdmissions } from "@/utils/api";

export default function FeaturedAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedAdmissions()
      .then((data) => {
        const result = data?.results || data;
        console.log("Fetched featured admissions:", result);
        setAdmissions(Array.isArray(result) ? result : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500 text-center py-4">Loading featured admissions...</div>;
  if (!admissions.length) return <div className="text-gray-400 text-center py-4">No featured admissions found.</div>;

  return (
    <section className="py-8 px-4 md:px-6 lg:px-12 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1ca3fd] mb-6 text-center md:text-left">
        Featured Admissions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {admissions.map((adm) => (
          <div
            key={adm.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-4 md:p-6 flex flex-col items-start"
          >
            {/* Logo and School Name */}
            <div className="flex items-center mb-4">
              {adm.school && adm.school.logo ? (
                <Image
                  src={adm.school.logo}
                  alt={adm.school.name}
                  width={80}
                  height={80}
                  className="object-contain rounded-lg mr-4"
                  unoptimized
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No Logo
                </div>
              )}
              <div>
                <h3 className="text-md md:text-lg font-semibold text-gray-800 line-clamp-2">
                  {adm.school?.name || "Unknown School"}
                </h3>
              </div>
            </div>

            {/* Courses */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(adm.courses || []).map((c) =>
                c && typeof c === "object" ? (
                  <span
                    key={c.id}
                    className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs md:text-sm font-medium"
                  >
                    {c.name}
                  </span>
                ) : null
              )}
            </div>

            {/* Admission Dates */}
            <div className="text-gray-600 text-xs md:text-sm">
              <p className="font-medium">Admission Open:</p>
              <p>
                {adm.active_from && adm.active_until ? (
                  <>
                    {adm.active_from} – {adm.active_until}
                  </>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}