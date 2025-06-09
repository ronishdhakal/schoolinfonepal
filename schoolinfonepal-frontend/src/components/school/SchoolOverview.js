"use client"
import { Calendar, MapPin, Building2, Mail, Phone, Globe, Download, UsersRound } from "lucide-react"

export default function SchoolOverview({ school }) {
  if (!school) return null

  // Data extraction
  const email = school.emails?.[0]?.email || school.admin_email || ""
  const emails = school.emails?.length > 0 ? school.emails.map((e) => e.email) : [email].filter(Boolean)
  const phones =
    school.phones?.length > 0 ? school.phones.map((p) => p.phone) : [school.phones?.[0]?.phone].filter(Boolean)
  const established = school.established_date ? new Date(school.established_date).getFullYear() : "Not Listed"
  const type = school.type?.name || "Not Listed"
  const address = school.address || "Not Listed"
  const district = school.district?.name || ""
  const universities = school.universities || []
  const website = school.website
  const brochure = school.brochures?.[0]
  const affiliation = universities.length > 0 ? universities.map((u) => u.name).join(", ") : "Not Listed"

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
<h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewItem icon={<Calendar className="text-[#1ca3fd]" />} label="Established" value={established} />
        <OverviewItem
          icon={<MapPin className="text-[#1ca3fd]" />}
          label="Location"
          value={
            <>
              {address}
              {district && (
                <>
                  {", "}
                  <span className="text-[#1ca3fd]">{district}</span>
                </>
              )}
            </>
          }
        />
        <OverviewItem icon={<Building2 className="text-[#1ca3fd]" />} label="Type" value={type} />
        <OverviewItem
          icon={<Mail className="text-[#1ca3fd]" />}
          label="Email"
          value={
            emails.length > 0
              ? emails.map((e, index) => (
                  <a key={index} href={`mailto:${e}`} className="text-[#1ca3fd] hover:underline block truncate">
                    {e}
                  </a>
                ))
              : "Not Listed"
          }
        />
        <OverviewItem
          icon={<Phone className="text-[#1ca3fd]" />}
          label="Phone"
          value={
            phones.length > 0
              ? phones.map((p, index) => (
                  <a key={index} href={`tel:${p}`} className="text-[#1ca3fd] hover:underline block truncate">
                    {p}
                  </a>
                ))
              : "Not Listed"
          }
        />
        <OverviewItem icon={<UsersRound className="text-[#1ca3fd]" />} label="Affiliation" value={affiliation} />
        <OverviewItem
          icon={<Globe className="text-[#1ca3fd]" />}
          label="Website"
          value={
            website ? (
              <a
                href={website.startsWith("http") ? website : `https://${website}`}
                className="text-[#1ca3fd] hover:underline truncate"
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
        <OverviewItem
          icon={<Download className="text-[#1ca3fd]" />}
          label="Brochure"
          value={
            brochure?.file ? (
              <a
                href={brochure.file}
                className="text-[#1ca3fd] hover:underline"
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
  )
}

function OverviewItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-100 hover:border-[#1ca3fd] hover:shadow-sm transition-all">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="text-gray-900">{value}</div>
      </div>
    </div>
  )
}
