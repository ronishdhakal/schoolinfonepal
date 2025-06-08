// src/components/school/SchoolOverview.js
"use client";
import { Mail, Phone, Globe, FileText, University as UniversityIcon, Calendar, Building2 } from "lucide-react";

export default function SchoolOverview({ school }) {
  if (!school) return null;

  // Helper for first email and phone
  const email = school.emails?.[0]?.email || school.admin_email || "";
  const phone = school.phones?.[0]?.phone || "";
  const established = school.established_date ? new Date(school.established_date).getFullYear() : null;
  const type = school.type?.name || "";
  const universities = school.universities || [];
  const website = school.website;
  const brochure = school.brochures?.[0];

  return (
    <section className="bg-white rounded-2xl shadow mb-6 p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      {/* Established */}
      <OverviewItem
        icon={<Calendar className="w-5 h-5 text-blue-600" />}
        label="Established"
        value={established ? established : "—"}
      />
      {/* Type */}
      <OverviewItem
        icon={<Building2 className="w-5 h-5 text-blue-600" />}
        label="Type"
        value={type || "—"}
      />
      {/* Email */}
      <OverviewItem
        icon={<Mail className="w-5 h-5 text-blue-600" />}
        label="Email"
        value={email ? <a href={`mailto:${email}`} className="hover:underline">{email}</a> : "—"}
      />
      {/* Phone */}
      <OverviewItem
        icon={<Phone className="w-5 h-5 text-blue-600" />}
        label="Phone"
        value={phone ? <a href={`tel:${phone}`} className="hover:underline">{phone}</a> : "—"}
      />
      {/* University */}
      <OverviewItem
        icon={<UniversityIcon className="w-5 h-5 text-blue-600" />}
        label="University"
        value={
          universities.length > 0
            ? universities.map((u) => (
                <span key={u.id} className="inline-block bg-blue-50 text-blue-700 rounded px-2 py-0.5 mr-1 text-xs font-semibold">
                  {u.name}
                </span>
              ))
            : "—"
        }
      />
      {/* Website */}
      <OverviewItem
        icon={<Globe className="w-5 h-5 text-blue-600" />}
        label="Website"
        value={
          website ? (
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              className="text-blue-700 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {website.replace(/^https?:\/\//, "")}
            </a>
          ) : "—"
        }
      />
      {/* Brochure */}
      <OverviewItem
        icon={<FileText className="w-5 h-5 text-blue-600" />}
        label="Brochure"
        value={
          brochure?.file ? (
            <a
              href={brochure.file}
              className="text-blue-700 hover:underline"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          ) : "—"
        }
      />
    </section>
  );
}

// Helper Overview Item
function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1">{icon}</span>
      <div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-base font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}
