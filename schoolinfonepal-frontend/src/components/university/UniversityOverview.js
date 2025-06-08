"use client";
import React from "react";

// Helper to ensure http(s) prefix
function withHttp(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : "https://" + url;
}

const UniversityOverview = ({ university }) => {
  if (!university) return null;

  // Display type name, established date, website, phones, emails
  return (
    <section className="bg-white rounded-2xl shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="flex flex-col md:flex-row md:gap-12 gap-2">
        <div className="flex-1 space-y-2">
          <OverviewRow label="Established">
            {university.established_date
              ? new Date(university.established_date).getFullYear()
              : <span className="text-gray-400">Not specified</span>}
          </OverviewRow>
          <OverviewRow label="Type">
            {university.type_name || <span className="text-gray-400">Not specified</span>}
          </OverviewRow>
          <OverviewRow label="Website">
            {university.website ? (
              <a
                href={withHttp(university.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {university.website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )}
          </OverviewRow>
        </div>
        <div className="flex-1 space-y-2">
          <OverviewRow label="Phone">
            {Array.isArray(university.phones) && university.phones.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {university.phones.map((p) => (
                  <span key={p.id}>{p.phone}</span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )}
          </OverviewRow>
          <OverviewRow label="Email">
            {Array.isArray(university.emails) && university.emails.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {university.emails.map((e) => (
                  <span key={e.id}>{e.email}</span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )}
          </OverviewRow>
        </div>
      </div>
    </section>
  );
};

// Simple row for label:value
function OverviewRow({ label, children }) {
  return (
    <div className="flex gap-2">
      <span className="w-28 shrink-0 font-medium text-gray-600">{label}:</span>
      <span>{children}</span>
    </div>
  );
}

export default UniversityOverview;
