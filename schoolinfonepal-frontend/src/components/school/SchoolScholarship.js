// src/components/school/SchoolScholarship.js
"use client";

import { Award } from "lucide-react";

export default function SchoolScholarship({ school }) {
  const scholarship = school?.scholarship?.trim();

  if (!scholarship) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <Award className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Scholarships</h2>
      </div>
      <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
        {scholarship}
      </div>
    </section>
  );
}
