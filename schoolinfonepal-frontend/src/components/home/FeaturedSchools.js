"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchFeaturedSchools } from "@/utils/api";
import { CheckCircle, MapPin } from "lucide-react";

export default function FeaturedSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    fetchFeaturedSchools().then(setSchools);
  }, []);

  if (!schools.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#1ca3fd] mb-6">Featured Schools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition p-0 border border-[#e8f4fc] flex flex-col overflow-hidden"
          >
            {/* Cover Photo */}
            <div className="relative w-full h-[140px] bg-gray-100">
              {school.cover_photo ? (
                <Image
                  src={school.cover_photo}
                  alt={`${school.name} Cover`}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                  No Cover
                </div>
              )}
              {/* Logo */}
              <div className="absolute -bottom-8 left-6 bg-white rounded-2xl shadow-lg p-1 w-20 h-20 flex items-center justify-center">
                {school.logo ? (
                  <Image
                    src={school.logo}
                    alt={school.name}
                    width={70}
                    height={70}
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                    No Logo
                  </div>
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="pt-12 px-6 pb-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-semibold text-gray-900">{school.name}</span>
                {school.verification && (
                  <CheckCircle className="w-5 h-5 text-[#1ca3fd]" title="Verified" />
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2 gap-2">
                <MapPin className="w-4 h-4" />
                <span>{school.address}</span>
                {school.level && (
                  <span className="ml-2 px-2 py-0.5 bg-[#f0faff] rounded text-[#1ca3fd] font-semibold text-xs">
                    {school.level?.title || ""}
                  </span>
                )}
              </div>
              {/* Only Open Courses */}
              <div className="flex flex-wrap gap-2 my-3">
                {(school.school_courses_display || [])
                  .filter(
                    (c) =>
                      c.status &&
                      c.status.trim().toLowerCase() === "open"
                  )
                  .map((c) => (
                    <span
                      key={c.id}
                      className="bg-[#e6f6ff] text-[#1ca3fd] rounded px-3 py-1 text-xs font-semibold"
                    >
                      {c.course?.name}
                    </span>
                  ))}
              </div>
              <div className="mt-auto flex justify-end">
                <a
                  href="#"
                  className="px-5 py-2 rounded-xl bg-[#1ca3fd] text-white font-semibold shadow hover:bg-[#1692de] transition"
                >
                  Apply
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
