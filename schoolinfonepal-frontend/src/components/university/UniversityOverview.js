"use client"
import { Calendar, MapPin, Building2, Mail, Phone, Globe } from "lucide-react"

function withHttp(url) {
  if (!url) return ""
  return url.startsWith("http") ? url : "https://" + url
}

export default function UniversityOverview({ university }) {
  if (!university) return null

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <OverviewItem
          icon={<Calendar className="text-[#1ca3fd]" />}
          label="Established"
          value={
            university.established_date ? (
              new Date(university.established_date).getFullYear()
            ) : (
              <span className="text-gray-400">Not specified</span>
            )
          }
        />

        <OverviewItem
          icon={<Building2 className="text-[#1ca3fd]" />}
          label="Type"
          value={university.type_name || <span className="text-gray-400">Not specified</span>}
        />

        <OverviewItem
          icon={<MapPin className="text-[#1ca3fd]" />}
          label="Address"
          value={university.address || <span className="text-gray-400">Not specified</span>}
        />

        <OverviewItem
          icon={<Globe className="text-[#1ca3fd]" />}
          label="Website"
          value={
            university.website ? (
              <a
                href={withHttp(university.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1ca3fd] hover:underline truncate"
              >
                {university.website.replace(/^https?:\/\//, "")}
              </a>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )
          }
        />

        <OverviewItem
          icon={<Phone className="text-[#1ca3fd]" />}
          label="Phone"
          value={
            Array.isArray(university.phones) && university.phones.length > 0 ? (
              <div className="flex flex-col gap-1">
                {university.phones.map((p) => (
                  <a key={p.id} href={`tel:${p.phone}`} className="text-[#1ca3fd] hover:underline">
                    {p.phone}
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Not specified</span>
            )
          }
        />

        <OverviewItem
          icon={<Mail className="text-[#1ca3fd]" />}
          label="Email"
          value={
            Array.isArray(university.emails) && university.emails.length > 0 ? (
              <div className="flex flex-col gap-1">
                {university.emails.map((e) => (
                  <a key={e.id} href={`mailto:${e.email}`} className="text-[#1ca3fd] hover:underline truncate">
                    {e.email}
                  </a>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">Not specified</span>
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
