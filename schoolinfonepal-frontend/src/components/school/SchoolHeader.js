"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, MapPin, BadgeCheck } from "lucide-react";
import InquiryModal from "@/components/common/InquiryModal";
import { API_BASE_URL } from "@/utils/api";

const SchoolHeader = ({ school }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!school) return null;

  const getFullUrl = (url) =>
    url?.startsWith("http") ? url : `${API_BASE_URL}${url || ""}`;

  const coverImage = getFullUrl(school.cover_photo);
  const logoImage = getFullUrl(school.logo);

  // Show cover photo only for verified school (like consultancy)
  const showCover = school.verification;

  return (
    <header
      className="relative w-full flex flex-col justify-end overflow-hidden"
      aria-labelledby="school-header-title"
    >
      {/* Cover Photo (like consultancy, only if verified) */}
      {showCover && (
        <div className="relative w-full aspect-[16/4] bg-white">
          {school.cover_photo ? (
            <Image
              src={coverImage}
              alt={`${school.name} cover image`}
              fill
              className="object-cover bg-gray-100"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-lg font-light italic">No Cover Photo Available</span>
            </div>
          )}
        </div>
      )}

      {/* Header Info Block */}
      <div
        className={`relative w-full max-w-[2000px] bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl transition-all duration-300 ${
          isScrolled ? "shadow-2xl" : "shadow-lg"
        }`}
        style={{ marginTop: showCover ? "-1rem" : "0" }}
      >
        {/* Left: Logo and Info */}
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {/* Logo (overlaps if cover) */}
          {school.logo ? (
            <div className={`relative ${showCover ? "-mt-16 sm:-mt-24" : ""} w-24 h-24 sm:w-28 sm:h-28 bg-white p-2.5 rounded-2xl shadow-xl border-4 border-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
              <Image
                src={logoImage}
                alt={`${school.name} logo`}
                fill
                className="object-contain rounded-xl"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-xl text-sm text-gray-500">
              No Logo
            </div>
          )}

          {/* Name and Location */}
          <div className="flex-1 pt-2 sm:pt-0">
            <h1
              id="school-header-title"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 flex items-center flex-wrap"
            >
              {school.name}
              {school.verification && (
                <span
                  className="ml-2"
                  title="Verified School"
                  aria-label="Verified School"
                >
                  <BadgeCheck className="h-6 w-6 md:h-7 md:w-7 text-[#4c9bd5]" />
                </span>
              )}
            </h1>
            <div className="flex items-center flex-wrap text-gray-500 text-sm md:text-base mt-2 gap-2">
              {school.address && (
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span className="line-clamp-1">{school.address}</span>
                </span>
              )}
              {school.district?.name && (
                <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-0.5 ml-2 font-semibold text-xs md:text-sm">
                  {school.district.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button for Verified only (like consultancy) */}
        {school.verification && (
          <button
            onClick={() => setInquiryOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#4c9bd5] hover:bg-[#3a8cc1] text-white font-medium rounded-xl shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#4c9bd5] focus:ring-opacity-50"
            aria-label={`Inquire about ${school.name}`}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            <span>Ask a Question</span>
          </button>
        )}

        {/* Inquiry Modal */}
        <InquiryModal
          open={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          school={school}
        />
      </div>
    </header>
  );
};

export default SchoolHeader;
