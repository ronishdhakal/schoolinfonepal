// src/components/school/SchoolFAQs.js
"use client";
import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function SchoolFAQs({ school }) {
  const faqs = school?.faqs || [];
  const [openIdx, setOpenIdx] = useState(null);

  if (!faqs.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <HelpCircle className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
      </div>
      <div className="divide-y">
        {faqs.map((faq, idx) => (
          <div key={faq.id || idx} className="py-3">
            <button
              className="flex items-center w-full text-left justify-between focus:outline-none"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
              aria-controls={`faq-content-${idx}`}
            >
              <span className="font-medium text-gray-900 text-base">{faq.question}</span>
              {openIdx === idx ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div
              id={`faq-content-${idx}`}
              className={`transition-all mt-2 text-gray-800 text-base overflow-hidden ${
                openIdx === idx ? "max-h-52" : "max-h-0"
              }`}
              style={{
                transition: "max-height 0.3s cubic-bezier(.4,0,.2,1)",
              }}
            >
              {openIdx === idx && (
                <div className="pt-2 whitespace-pre-line">{faq.answer}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
