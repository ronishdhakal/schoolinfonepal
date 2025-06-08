// src/components/school/SchoolFacilities.js
"use client";

export default function SchoolFacilities({ school }) {
  const facilities = school?.facilities || [];

  if (!facilities.length) return null;

  return (
    <section className="mb-10 px-2 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Facilities
      </h2>
      <div className="flex flex-wrap gap-3">
        {facilities.map((f) => (
          <span
            key={f.id}
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-4 py-1 rounded-full font-semibold text-sm border border-blue-100"
          >
            {f.name}
          </span>
        ))}
      </div>
    </section>
  );
}
