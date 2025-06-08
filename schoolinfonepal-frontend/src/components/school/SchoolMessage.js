// src/components/school/SchoolMessage.js
"use client";
import Image from "next/image";
import { MessageSquareText } from "lucide-react";

export default function SchoolMessage({ school }) {
  const msg = school?.messages?.[0];

  if (!msg || !msg.message?.trim()) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquareText className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Message from Principal/Head</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Head Image */}
        {msg.image && (
          <div className="flex-shrink-0">
            <Image
              src={msg.image}
              alt={msg.name || "Principal/Head"}
              width={120}
              height={120}
              className="rounded-xl object-cover border shadow"
            />
          </div>
        )}
        {/* Message Content */}
        <div>
          {msg.title && (
            <div className="text-lg font-semibold text-blue-700 mb-1">{msg.title}</div>
          )}
          <div className="text-gray-800 text-base whitespace-pre-line mb-2">
            {msg.message}
          </div>
          {(msg.name || msg.designation) && (
            <div className="mt-2 text-sm text-gray-700 font-medium">
              {msg.name}
              {msg.name && msg.designation && <span>, </span>}
              {msg.designation}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
