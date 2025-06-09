"use client";
import React from "react";

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 font-medium rounded-t-lg transition-all
            ${active === tab.key
              ? "bg-white border border-b-0 border-gray-200 text-[#1ca3fd] shadow"
              : "bg-gray-50 text-gray-500 hover:text-[#1ca3fd]"}
          `}
          style={{ borderBottom: active === tab.key ? "2px solid #1ca3fd" : "2px solid transparent" }}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
