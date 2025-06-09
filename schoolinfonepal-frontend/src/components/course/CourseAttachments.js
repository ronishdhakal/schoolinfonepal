"use client"
import { FileText, Download } from "lucide-react"

export default function CourseAttachments({ attachments }) {
  if (!attachments || attachments.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={20} className="text-[#1ca3fd]" />
        <h2 className="text-xl font-bold text-gray-900">Course Attachments</h2>
      </div>
      <div className="space-y-3">
        {attachments.map((att) => (
          <div
            key={att.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1ca3fd] bg-opacity-10 rounded-lg flex items-center justify-center">
                <FileText size={16} className="text-[#1ca3fd]" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{att.description || "Course Attachment"}</h3>
                <p className="text-sm text-gray-500">Click to download</p>
              </div>
            </div>
            <a
              href={att.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#1ca3fd] text-white text-sm font-medium rounded-lg hover:bg-[#0b8de0] transition-colors"
              download
            >
              <Download size={14} />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
