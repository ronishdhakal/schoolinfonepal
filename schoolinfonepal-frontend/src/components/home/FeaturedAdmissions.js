"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchFeaturedAdmissions } from "@/utils/api";

export default function FeaturedAdmissions() {
  const [admissions, setAdmissions] = useState([]);

  useEffect(() => {
    fetchFeaturedAdmissions().then(setAdmissions);
  }, []);

  if (!admissions.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#1ca3fd] mb-6">Featured Admissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {admissions.map((adm) => (
          <div
            key={adm.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition border border-[#e8f4fc] p-6 flex gap-5"
          >
            {/* School Logo & Name */}
            <div className="flex flex-col items-center min-w-[90px]">
              {adm.school && adm.school.logo ? (
                <Image
                  src={adm.school.logo}
                  alt={adm.school.name}
                  width={64}
                  height={64}
                  className="object-contain rounded-xl border border-[#f0f0f0] bg-white"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300">
                  No Logo
                </div>
              )}
              <span className="text-xs text-gray-600 font-semibold mt-2 text-center">
                {adm.school?.name || "Unknown College"}
              </span>
            </div>

            {/* Admission Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-lg font-semibold mb-2 break-words whitespace-normal">
                {adm.title}
              </div>
              <div className="flex flex-wrap gap-2 my-2">
                {(adm.courses || []).map((c) =>
                  c && typeof c === "object" ? (
                    <span
                      key={c.id}
                      className="bg-[#e6f6ff] text-[#1ca3fd] rounded px-3 py-1 text-xs font-semibold"
                    >
                      {c.name}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
