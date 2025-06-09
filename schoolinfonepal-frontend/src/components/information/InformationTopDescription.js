"use client"
import { Info } from "lucide-react"

export default function InformationTopDescription({ info }) {
  if (!info.top_description) return null

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50">
          <Info className="w-5 h-5 text-[#1ca3fd]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
      </div>

      <div className="text-gray-700 text-lg leading-relaxed font-sans prose prose-blue max-w-none">
        <div dangerouslySetInnerHTML={{ __html: info.top_description }} />
      </div>
    </section>
  )
}
