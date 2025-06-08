// src/components/school/SchoolFAQs.js
"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SchoolFAQs({ school }) {
  const faqs = school?.faqs || [];
  const [openIdx, setOpenIdx] = useState(null);

  if (!faqs.length) return null;

  return (
    <section className="mb-10 px-2 md:px-0">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-6 font-sans tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-blue-50">
        {faqs.map((faq, idx) => (
          <div key={faq.id || idx} className="py-3">
            <button
              className="flex items-center w-full text-left justify-between focus:outline-none transition"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              aria-expanded={openIdx === idx}
              aria-controls={`faq-content-${idx}`}
            >
              <span className="font-medium text-gray-900 text-base">{faq.question}</span>
              {openIdx === idx ? (
                <ChevronUp className="w-5 h-5 text-[#1868ae]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div
              id={`faq-content-${idx}`}
              className={`transition-all duration-300 mt-1 text-gray-800 text-base overflow-hidden ${
                openIdx === idx ? "max-h-52" : "max-h-0"
              }`}
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
