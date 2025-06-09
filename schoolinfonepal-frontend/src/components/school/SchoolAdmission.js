"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchAdmissions } from "@/utils/api"
import AdmissionInquiryModal from "@/components/common/AdmissionInquiryModal"
import { GraduationCap, Clock, Building2 } from "lucide-react"

export default function SchoolAdmission({ school }) {
  const [admissions, setAdmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [selectedAdmission, setSelectedAdmission] = useState(null)

  useEffect(() => {
    if (!school?.slug) return
    setLoading(true)
    fetchAdmissions({ school: school.slug })
      .then((res) => {
        const today = new Date()
        setAdmissions(
          (res.results || res).filter(
            (ad) =>
              (!ad.active_from || new Date(ad.active_from) <= today) &&
              (!ad.active_until || new Date(ad.active_until) >= today),
          ),
        )
      })
      .finally(() => setLoading(false))
  }, [school?.slug])

  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow-sm p-6 mb-8 text-gray-500 text-center">
        Loading admissions...
      </section>
    )
  }

  if (!admissions.length) return null

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Ongoing Admissions 
      </h2>
      <div className="space-y-4">
        {admissions.map((ad) => (
          <div
            key={ad.id}
            className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:border-[#1ca3fd] hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="text-lg text-gray-900 mb-1 flex items-center gap-2">
                <GraduationCap className="text-[#1ca3fd] flex-shrink-0" />
                {ad.slug ? (
                  <Link
                    href={`/admission/${ad.slug}`}
                    className="hover:text-[#1ca3fd] transition-colors"
                  >
                    {ad.title}
                  </Link>
                ) : (
                  <span>{ad.title}</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                {ad.university?.name && (
                  <span className="flex items-center gap-1">
                    <Building2 className="text-[#1ca3fd]" />
                    {ad.university.name}
                  </span>
                )}
                {ad.level?.title && (
                  <span className="flex items-center gap-1">
                    <Clock className="text-[#1ca3fd]" />
                    {ad.level.title}
                  </span>
                )}
                <span className="bg-blue-50 text-gray-700 px-2 py-1 rounded text-xs border border-blue-100">
                  {ad.active_from} to {ad.active_until}
                </span>
              </div>
              <div className="text-gray-700">{ad.description}</div>
            </div>
            <button
              className="px-4 py-2 bg-[#1ca3fd] hover:bg-blue-600 text-white rounded-lg transition-colors"
              onClick={() => {
                setSelectedAdmission(ad)
                setInquiryOpen(true)
              }}
            >
              Apply/Inquiry
            </button>
          </div>
        ))}
      </div>
      {inquiryOpen && selectedAdmission && (
        <AdmissionInquiryModal
          open={inquiryOpen}
          onClose={() => setInquiryOpen(false)}
          school={school}
          courses={selectedAdmission.courses || []}
        />
      )}
    </section>
  )
}
