"use client";
import Image from "next/image";

export default function SchoolMessage({ school }) {
  const messages = Array.isArray(school?.messages) ? school.messages.filter(msg => msg?.message?.trim()) : [];

  if (!messages.length) return null;

  return (
    <section className="mb-12 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#1868ae] mb-8 tracking-tight border-b-2 border-gray-100 pb-2">
        Message from Principal/Head
      </h2>
      <div className="flex flex-col gap-8">
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-300"
          >
            {msg.image && (
              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                <Image
                  src={msg.image}
                  alt={msg.name || "Principal/Head"}
                  width={128}
                  height={128}
                  className="rounded-lg object-cover border-2 border-gray-100"
                />
              </div>
            )}
            <div className="flex-1">
              {msg.title && (
                <div className="text-base font-medium text-[#1868ae] mb-3 uppercase tracking-wide">
                  {msg.title}
                </div>
              )}
              <div className="text-gray-800 text-base md:text-lg leading-relaxed">
                {msg.message}
              </div>
              {(msg.name || msg.designation) && (
                <div className="mt-4 text-sm text-gray-600 font-medium">
                  {msg.name && <span className="text-gray-900">{msg.name}</span>}
                  {msg.name && msg.designation && <span>, </span>}
                  {msg.designation && <span className="text-gray-700">{msg.designation}</span>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}