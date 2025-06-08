"use client";
import Image from "next/image";
import Link from "next/link";

export default function AdmissionCard({ admission }) {
  // Dates for display (formatting can be adjusted as needed)
  const from = admission.active_from || "";
  const until = admission.active_until || "";

  return (
    <Link
      href={`/admission/${admission.slug}`}
      className="block rounded-xl border border-gray-200 bg-white hover:shadow-lg transition p-4 h-full"
    >
      <div className="flex items-center gap-4 mb-4">
        {admission.school && admission.school.logo && (
          <div className="w-12 h-12 rounded-full overflow-hidden border bg-gray-100 flex-shrink-0">
            <Image
              src={admission.school.logo}
              alt={admission.school.name || "School Logo"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{admission.title}</h3>
          <div className="text-xs text-gray-500">
            {admission.school?.name}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Open:</span>{" "}
        {from ? new Date(from).toLocaleDateString() : "N/A"}{" "}
        <span className="mx-1 text-gray-400">→</span>
        {until ? new Date(until).toLocaleDateString() : "N/A"}
      </div>
    </Link>
  );
}
