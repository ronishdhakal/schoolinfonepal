"use client";
import Image from "next/image";
import { GraduationCap, MapPin, School } from "lucide-react";

export default function AdmissionInfo({ admission }) {
  if (!admission?.school) return null;

  const { school, courses } = admission;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex flex-col md:flex-row md:items-center md:gap-8">
        {/* School Logo */}
        <div className="flex-shrink-0 mb-4 md:mb-0">
          {school.logo && (
            <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-100">
              <Image
                src={school.logo}
                alt={school.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-blue-900">
              Admission opened by {school.name}
            </span>
          </div>
          <div className="text-sm text-gray-600 mb-2 flex items-center gap-3">
            <MapPin className="w-4 h-4" />
            <span>
              {school.address}
              {school.district ? `, ${school.district.name}` : ""}
            </span>
          </div>
          {/* Courses list */}
          {courses?.length > 0 && (
            <div className="mt-2">
              <div className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Open for:
              </div>
              <ul className="flex flex-wrap gap-2 mt-1">
                {courses.map((course) => (
                  <li
                    key={course.id}
                    className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1 rounded-xl"
                  >
                    {course.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
