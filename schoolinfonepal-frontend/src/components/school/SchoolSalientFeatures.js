// src/components/school/SchoolSalientFeatures.js
"use client";
import { Stars } from "lucide-react";

export default function SchoolSalientFeatures({ school }) {
  const salient = school?.salient_feature?.trim();

  if (!salient) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <Stars className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Salient Features</h2>
      </div>
      <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line">
        {salient}
      </div>
    </section>
  );
}
