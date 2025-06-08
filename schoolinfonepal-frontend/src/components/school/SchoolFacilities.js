// src/components/school/SchoolFacilities.js
"use client";
import { Sparkles } from "lucide-react";

export default function SchoolFacilities({ school }) {
  const facilities = school?.facilities || [];

  if (!facilities.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Facilities</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {facilities.map((f) => (
          <span
            key={f.id}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-4 py-1 rounded-full font-semibold text-sm shadow-sm border border-blue-100"
          >
            {/* You can use an icon per facility if you want */}
            {/* <IconHere /> */}
            {f.name}
          </span>
        ))}
      </div>
    </section>
  );
}
