"use client"
import { useState } from "react"
import { CalendarDays, Building2, MapPin } from "lucide-react"
import AdmissionInquiryModal from "@/components/common/AdmissionInquiryModal"
import Image from "next/image"
import { getFullImageUrl } from "@/utils/imageUrl"

export default function AdmissionHeader({ admission }) {
  const [modalOpen, setModalOpen] = useState(false)

  if (!admission) return null

  const fromDate = admission.active_from ? new Date(admission.active_from).toLocaleDateString() : "N/A"
  const untilDate = admission.active_until ? new Date(admission.active_until).toLocaleDateString() : "N/A"

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {/* Left side - Main info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
              <CalendarDays className="w-5 h-5 text-[#1ca3fd]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{admission.title}</h1>
          </div>

          {/* School Info */}
          {admission.school && (
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              {admission.school.logo && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
                  <Image
                    src={getFullImageUrl(admission.school.logo) || "/placeholder.svg"}
                    alt={admission.school.name}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#1ca3fd]" />
                  <span className="font-semibold text-gray-900">{admission.school.name}</span>
                </div>
                {(admission.school.address || admission.school.district?.name) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {[admission.school.address, admission.school.district?.name].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm font-medium text-gray-700 mb-2">Admission Period</div>
            <div className="text-lg font-semibold text-gray-900">
              {fromDate} → {untilDate}
            </div>
          </div>
        </div>

        {/* Right side - Apply button */}
        <div className="flex-shrink-0">
          <button
            className="w-full lg:w-auto px-8 py-3 bg-[#1ca3fd] hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            onClick={() => setModalOpen(true)}
          >
            <CalendarDays className="w-5 h-5" />
            Apply / Inquiry
          </button>
        </div>
      </div>

      {modalOpen && (
        <AdmissionInquiryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          school={admission.school}
          courses={admission.courses || []}
          admission={admission}
        />
      )}
    </section>
  )
}
