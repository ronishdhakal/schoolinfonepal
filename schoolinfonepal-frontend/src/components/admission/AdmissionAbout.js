"use client"
import { Info } from "lucide-react"

export default function AdmissionAbout({ admission }) {
  if (!admission?.description) return null

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
          <Info className="w-5 h-5 text-[#1ca3fd]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">About this Admission</h2>
      </div>

      <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
        {/* Check if description contains HTML */}
        {/<[a-z][\s\S]*>/i.test(admission.description) ? (
          <div dangerouslySetInnerHTML={{ __html: admission.description }} />
        ) : (
          <div className="whitespace-pre-line">{admission.description}</div>
        )}
      </div>
    </section>
  )
}
