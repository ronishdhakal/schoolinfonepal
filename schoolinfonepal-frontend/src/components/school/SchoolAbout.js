// src/components/school/SchoolAbout.js
"use client";
import { Info } from "lucide-react";

export default function SchoolAbout({ school }) {
  const about = school?.about_college?.trim();

  if (!about) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <Info className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">About</h2>
      </div>
      <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
        {about}
      </div>
    </section>
  );
}
