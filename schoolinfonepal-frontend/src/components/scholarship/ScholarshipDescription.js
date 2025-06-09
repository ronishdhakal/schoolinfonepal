"use client"
import { FileText, Download } from "lucide-react"

export default function ScholarshipDescription({ scholarship }) {
  if (!scholarship) return null

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
          <FileText className="w-5 h-5 text-[#1ca3fd]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Description</h2>
      </div>

      <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line font-sans prose prose-blue max-w-none">
        {scholarship.description ? (
          <div
            dangerouslySetInnerHTML={{
              __html:
                scholarship.description.includes("<") && scholarship.description.includes(">")
                  ? scholarship.description
                  : scholarship.description.replace(/\n/g, "<br />"),
            }}
          />
        ) : (
          <div className="text-gray-400 italic">No description provided for this scholarship.</div>
        )}
      </div>

      {scholarship.attachment && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <a
            href={scholarship.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#1ca3fd] font-medium rounded-lg transition-colors border border-blue-100"
            download
          >
            <Download className="w-5 h-5" />
            Download Attachment
          </a>
        </div>
      )}
    </section>
  )
}
