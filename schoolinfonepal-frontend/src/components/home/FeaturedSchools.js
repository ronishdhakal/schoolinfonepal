"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchFeaturedSchools } from "@/utils/api";
import { CheckCircle, MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the modal to avoid SSR issues
const AdmissionInquiryModal = dynamic(
  () => import("@/components/common/AdmissionInquiryModal"),
  { ssr: false }
);

export default function FeaturedSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [modalCourses, setModalCourses] = useState([]);

  useEffect(() => {
    fetchFeaturedSchools()
      .then((data) => {
        const result = data?.results || data;
        setSchools(Array.isArray(result) ? result.slice(0, 6) : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (school, openCourses) => {
    setSelectedSchool(school);
    setModalCourses(openCourses);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSchool(null);
    setModalCourses([]);
  };

  if (loading) return <div className="text-gray-500 text-center py-8">Loading featured schools...</div>;
  if (!schools.length) return <div className="text-gray-400 text-center py-8">No featured schools found.</div>;

  return (
    <section className="mb-10 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Featured Schools</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {schools.map((school) => {
          const openCourses =
            school.school_courses_display?.filter(
              (c) => c.status && c.status.trim().toLowerCase() === "open"
            ).map((c) => ({
              id: c.course?.id,
              name: c.course?.name,
            })) || [];

          // Combine address + district if available
          let addressDistrict = school.address || "";
          if (school.district && school.district.name) {
            if (addressDistrict) addressDistrict += ", ";
            addressDistrict += school.district.name;
          }
          return (
            <div
              key={school.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Cover Photo */}
              <div className="relative w-full h-[120px] bg-gray-50">
                {school.cover_photo ? (
                  <Image
                    src={school.cover_photo}
                    alt={`${school.name} Cover`}
                    fill
                    className="object-cover rounded-t-xl"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-gray-100">
                    No Cover
                  </div>
                )}
                {/* Apply Button */}
                <button
                  onClick={() => openModal(school, openCourses)}
                  className="absolute top-2 right-2 px-4 py-1.5 rounded-lg bg-[#1ca3fd] text-white text-sm font-semibold shadow hover:bg-[#1692de] transition"
                >
                  Apply
                </button>
                {/* Logo */}
                <div className="absolute -bottom-6 left-4 bg-white rounded-full shadow-md p-1 w-12 h-12 flex items-center justify-center">
                  {school.logo ? (
                    <Image
                      src={school.logo}
                      alt={school.name}
                      width={40}
                      height={40}
                      className="object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No Logo
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="pt-8 px-4 pb-4 flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-lg font-semibold text-gray-900">{school.name}</span>
                  {school.verification && (
                    <CheckCircle className="w-4 h-4 text-[#1ca3fd]" title="Verified" />
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2 gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{addressDistrict || "Not Provided"}</span>
                </div>
                {/* Open Courses */}
                <div className="flex flex-wrap gap-1.5 my-2">
                  {openCourses.length > 0 ? (
                    openCourses.slice(0, 3).map((c) =>
                      c.name ? (
                        <span
                          key={c.id}
                          className="bg-[#e6f6ff] text-[#1ca3fd] rounded px-2 py-0.5 text-xs font-medium"
                        >
                          {c.name}
                        </span>
                      ) : null
                    )
                  ) : (
                    <span className="text-xs text-gray-400">No open courses</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiry Modal */}
      <AdmissionInquiryModal
        open={modalOpen}
        onClose={closeModal}
        school={selectedSchool}
        courses={modalCourses}
        onSuccess={closeModal}
      />
    </section>
  );
}
