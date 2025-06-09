"use client"
import { BookOpen } from "lucide-react"

export default function CourseCurriculum({ curriculum }) {
  if (!curriculum || curriculum.trim() === "") return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-[#1ca3fd]" />
        <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
      </div>
      <div className="prose prose-gray max-w-none">
        {curriculum.split("\n").map((line, idx) =>
          line.trim() === "" ? (
            <br key={idx} />
          ) : (
            <p key={idx} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
              {line}
            </p>
          ),
        )}
      </div>
    </div>
  )
}
