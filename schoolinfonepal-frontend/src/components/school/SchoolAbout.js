// src/components/school/SchoolAbout.js
"use client";

export default function SchoolAbout({ school }) {
  const about = school?.about_college?.trim();

  if (!about) return null;

  return (
    <section className="mb-10 px-2 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        About
      </h2>
      <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-sans">
        {about}
      </div>
    </section>
  );
}
