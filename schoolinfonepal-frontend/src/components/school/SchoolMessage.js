"use client"
import Image from "next/image"

export default function SchoolMessage({ school }) {
  const messages = Array.isArray(school?.messages) ? school.messages.filter((msg) => msg?.message?.trim()) : []

  if (!messages.length) return null

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Messages 
      </h2>
      <div className="space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className="flex flex-col md:flex-row gap-6 items-start p-4 rounded-lg border border-gray-100 hover:border-[#1ca3fd] hover:shadow-sm transition-all"
          >
            {msg.image && (
              <div className="flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={msg.image || "/placeholder.svg"}
                  alt={msg.name || "Principal/Head"}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              {msg.title && <div className="text-sm text-[#1ca3fd] mb-2 uppercase tracking-wide">{msg.title}</div>}
              <div className="text-gray-700 leading-relaxed mb-3">{msg.message}</div>
              {(msg.name || msg.designation) && (
                <div className="text-sm text-gray-600">
                  {msg.name && <span className="text-gray-900">{msg.name}</span>}
                  {msg.name && msg.designation && <span>, </span>}
                  {msg.designation && <span>{msg.designation}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
