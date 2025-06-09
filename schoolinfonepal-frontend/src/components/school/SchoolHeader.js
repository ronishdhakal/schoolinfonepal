"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { MessageSquare, MapPin, BadgeCheck } from "lucide-react"
import InquiryModal from "@/components/common/InquiryModal"
import { API_BASE_URL } from "@/utils/api"

export default function SchoolHeader({ school }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!school) return null

  const getFullUrl = (url) => (url?.startsWith("http") ? url : `${API_BASE_URL}${url || ""}`)

  const coverImage = getFullUrl(school.cover_photo)
  const logoImage = getFullUrl(school.logo)
  const showCover = school.verification

  return (
    <header className="relative w-full flex flex-col justify-end overflow-hidden">
      {showCover && (
        <div className="relative w-full aspect-[16/4] bg-gray-100">
          {school.cover_photo ? (
            <Image
              src={coverImage || "/placeholder.svg"}
              alt={`${school.name} cover image`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
              <span>No Cover Photo Available</span>
            </div>
          )}
        </div>
      )}

      <div
        className={`relative w-full bg-white px-4 sm:px-8 md:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-t-3xl transition-all ${
          isScrolled ? "shadow-lg" : "shadow-md"
        }`}
        style={{ marginTop: showCover ? "-1rem" : "0" }}
      >
        <div className="flex items-center gap-5 w-full sm:w-auto">
          {school.logo ? (
            <div
              className={`relative ${showCover ? "-mt-16 sm:-mt-24" : ""} bg-white p-2 rounded-xl shadow-md border-4 border-white transition-all hover:shadow-lg`}
            >
              <Image
                src={logoImage || "/placeholder.svg"}
                alt={`${school.name} logo`}
                width={112}
                height={112}
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div
              className="bg-gray-200 flex items-center justify-center rounded-xl text-sm text-gray-500"
              style={{ width: "96px", height: "96px" }}
            >
              No Logo
            </div>
          )}

          <div className="flex-1 pt-2 sm:pt-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 flex items-center flex-wrap">
              {school.name}
              {school.verification && (
                <span className="ml-2" title="Verified School">
                  <BadgeCheck className="text-[#1ca3fd]" style={{ width: "28px", height: "28px" }} />
                </span>
              )}
            </h1>
            <div className="flex items-center flex-wrap text-gray-600 text-sm md:text-base mt-2 gap-2">
              {school.address && (
                <span className="flex items-center">
                  <MapPin className="mr-1 flex-shrink-0 text-[#1ca3fd]" style={{ width: "20px", height: "20px" }} />
                  <span>{school.address}</span>
                </span>
              )}
              {school.district?.name && (
                <span className="bg-blue-50 text-gray-800 rounded-full px-3 py-1 ml-2 text-xs md:text-sm border border-blue-100">
                  {school.district.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {school.verification && (
          <button
            onClick={() => setInquiryOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#1ca3fd] hover:bg-blue-600 text-white rounded-lg shadow-sm flex items-center justify-center transition-all"
          >
            <MessageSquare className="mr-2" style={{ width: "20px", height: "20px" }} />
            <span>Ask a Question</span>
          </button>
        )}

        <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} school={school} />
      </div>
    </header>
  )
}
