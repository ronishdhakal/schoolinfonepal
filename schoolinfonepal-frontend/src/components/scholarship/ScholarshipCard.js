// components/scholarship/ScholarshipCard.js
"use client";
import Link from "next/link";

export default function ScholarshipCard({ scholarship }) {
  return (
    <Link href={`/scholarship/${scholarship.slug}`} className="block bg-white rounded-xl shadow p-5 hover:shadow-lg transition-all mb-4">
      <div className="font-bold text-lg text-blue-700 mb-2 truncate">{scholarship.title}</div>
      <div className="text-sm text-gray-500">
        <span className="font-medium">Deadline: </span>
        {scholarship.active_from} &mdash; {scholarship.active_until}
      </div>
    </Link>
  );
}
