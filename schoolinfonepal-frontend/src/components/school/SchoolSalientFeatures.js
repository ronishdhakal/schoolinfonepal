// src/components/school/SchoolSalientFeatures.js
"use client";

export default function SchoolSalientFeatures({ school }) {
  const salient = school?.salient_feature?.trim();

  if (!salient) return null;

  return (
    <section className="mb-10 px-2 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Salient Features
      </h2>
      <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-sans">
        {salient}
      </div>
    </section>
  );
}
