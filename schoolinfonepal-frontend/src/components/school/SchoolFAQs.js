"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function SchoolFAQs({ school }) {
  const faqs = school?.faqs || []
  const [openIdx, setOpenIdx] = useState(null)

  if (!faqs.length) return null

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        FAQs
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={faq.id || idx} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              className="flex items-center w-full text-left justify-between p-4 hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
            >
              <span className="text-gray-900 pr-4">{faq.question}</span>
              {openIdx === idx ? (
                <ChevronUp className="text-[#1ca3fd] flex-shrink-0" />
              ) : (
                <ChevronDown className="text-gray-400 flex-shrink-0" />
              )}
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-4 text-gray-700 border-t border-gray-100 pt-3">
                <div className="whitespace-pre-line">{faq.answer}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
