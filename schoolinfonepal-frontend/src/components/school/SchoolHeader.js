// src/components/school/SchoolHeader.js
"use client";
import { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import InquiryModal from "@/components/common/InquiryModal";

export default function SchoolHeader({ school }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  if (!school) return null;

  return (
    <section className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
      {/* Cover Photo */}
      <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 bg-gray-200">
        {school.cover_photo ? (
          <Image
            src={school.cover_photo}
            alt={school.name + " Cover"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
            No Cover Photo
          </div>
        )}
        {/* Logo */}
        <div className="absolute left-6 -bottom-10 z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-4 border-white">
            {school.logo ? (
              <Image
                src={school.logo}
                alt={school.name + " Logo"}
                width={128}
                height={128}
                className="object-contain w-full h-full"
                priority
              />
            ) : (
              <span className="text-gray-400 text-5xl">🏫</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="pt-14 pl-6 pr-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white">
        <div className="flex items-center gap-4 min-w-0">
          {/* Name and Verification */}
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                {school.name}
              </h1>
              {school.verification && (
                <span title="Verified" className="inline-flex items-center">
                  <CheckCircle2 className="text-blue-600 w-6 h-6" />
                </span>
              )}
            </div>
            {/* Address and District */}
            <div className="flex items-center gap-3 flex-wrap text-gray-600">
              {school.address && (
                <span className="inline-block">{school.address}</span>
              )}
              {school.district?.name && (
                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
                  {school.district.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Inquiry Button */}
        <div className="mt-4 md:mt-0 flex-shrink-0">
          <button
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
            onClick={() => setInquiryOpen(true)}
          >
            Inquire Now
          </button>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        school={school}
      />
    </section>
  );
}
