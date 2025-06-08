"use client";
import {
  Calendar,
  MapPin,
  Building2,
  Mail,
  Phone,
  Globe,
  Download,
  UsersRound,
} from "lucide-react";

export default function SchoolOverview({ school }) {
  if (!school) return null;

  // Data extraction
  const email = school.emails?.[0]?.email || school.admin_email || "";
  const emails = school.emails?.length > 0 ? school.emails.map((e) => e.email) : [email].filter(Boolean);
  const phones = school.phones?.length > 0 ? school.phones.map((p) => p.phone) : [school.phones?.[0]?.phone].filter(Boolean);
  const established = school.established_date
    ? new Date(school.established_date).getFullYear()
    : "Not Listed";
  const type = school.type?.name || "Not Listed";
  const address = school.address || "Not Listed";
  const district = school.district?.name || "";
  const universities = school.universities || [];
  const website = school.website;
  const brochure = school.brochures?.[0];
  const affiliation =
    universities.length > 0
      ? universities.map((u) => u.name).join(", ")
      : "Not Listed";

  return (
    <section className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 mb-6">
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#1868ae] mb-6">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Established */}
        <OverviewItem
          icon={<Calendar className="w-6 h-6 text-[#1868ae]" />}
          label="Established"
          value={established}
        />
        {/* Location */}
        <OverviewItem
          icon={<MapPin className="w-6 h-6 text-[#1868ae]" />}
          label="Location"
          value={
            <>
              {address}
              {district && (
                <>
                  {", "}
                  <span className="text-[#1868ae]">{district}</span>
                </>
              )}
            </>
          }
        />
        {/* Type */}
        <OverviewItem
          icon={<Building2 className="w-6 h-6 text-[#1868ae]" />}
          label="Type"
          value={type}
        />
        {/* Email */}
        <OverviewItem
          icon={<Mail className="w-6 h-6 text-[#1868ae]" />}
          label="Email"
          value={
            emails.length > 0 ? (
              emails.map((e, index) => (
                <a
                  key={index}
                  href={`mailto:${e}`}
                  className="text-[#1868ae] hover:underline block truncate max-w-xs"
                >
                  {e}
                </a>
              ))
            ) : (
              "Not Listed"
            )
          }
        />
        {/* Phone */}
        <OverviewItem
          icon={<Phone className="w-6 h-6 text-[#1868ae]" />}
          label="Phone"
          value={
            phones.length > 0 ? (
              phones.map((p, index) => (
                <a
                  key={index}
                  href={`tel:${p}`}
                  className="text-[#1868ae] hover:underline block truncate max-w-xs"
                >
                  {p}
                </a>
              ))
            ) : (
              "Not Listed"
            )
          }
        />
        {/* Affiliation */}
        <OverviewItem
          icon={<UsersRound className="w-6 h-6 text-[#1868ae]" />}
          label="Affiliation"
          value={affiliation}
        />
        {/* Website */}
        <OverviewItem
          icon={<Globe className="w-6 h-6 text-[#1868ae]" />}
          label="Website Link"
          value={
            website ? (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
                className="text-[#1868ae] hover:underline truncate max-w-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              "Not Listed"
            )
          }
        />
        {/* Brochure */}
        <OverviewItem
          icon={<Download className="w-6 h-6 text-[#1868ae]" />}
          label="Brochure"
          value={
            brochure?.file ? (
              <a
                href={brochure.file}
                className="text-[#1868ae] hover:underline"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            ) : (
              "Not Listed"
            )
          }
        />
      </div>
    </section>
  );
}

// Overview item with clean and modern design
function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center text-[#1868ae] bg-blue-50 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className="text-base font-semibold text-gray-900">{value}</div>
      </div>
    </div>
  );
}