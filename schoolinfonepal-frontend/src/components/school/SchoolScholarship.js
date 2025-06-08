// src/components/school/SchoolScholarship.js
"use client";

export default function SchoolScholarship({ school }) {
  const scholarship = school?.scholarship?.trim();

  if (!scholarship) return null;

  return (
    <section className="mb-10 px-2 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Scholarships
      </h2>
      <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-sans">
        {scholarship}
      </div>
    </section>
  );
}
