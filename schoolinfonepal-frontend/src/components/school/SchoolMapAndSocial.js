"use client"
import { Globe, Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react"

function getSocialIcon(platform) {
  const p = platform?.toLowerCase() || ""
  if (p.includes("facebook")) return <Facebook />
  if (p.includes("twitter") || p.includes("x.com")) return <Twitter />
  if (p.includes("youtube")) return <Youtube />
  if (p.includes("insta")) return <Instagram />
  if (p.includes("linkedin")) return <Linkedin />
  return <Globe />
}

function capitalizeFirst(str = "") {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ""
}

export default function SchoolMapAndSocial({ school }) {
  const map = school?.map_link?.trim()
  const socials = school?.social_media?.filter((s) => s.url?.trim()) || []

  let mapSrc = ""
  if (map?.includes("iframe")) {
    const match = map.match(/src=['"]([^'"]+)['"]/)
    mapSrc = match ? match[1] : ""
  } else if (map) {
    if (map.includes("/maps/")) {
      if (map.includes("/maps/place/") || map.includes("/maps/@")) {
        mapSrc = map.replace("/maps/", "/maps/embed?")
      } else if (map.includes("/maps?q=")) {
        mapSrc = "https://www.google.com/maps/embed?" + map.split("?")[1]
      } else {
        mapSrc = map
      }
    } else {
      mapSrc = map
    }
  }

  if (!mapSrc && !socials.length) return null

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      {mapSrc && (
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
        Location 
      </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-100">
            <iframe
              src={mapSrc}
              title="School Map"
              loading="lazy"
              allowFullScreen
              className="w-full h-full"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      )}

      {socials.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Connect with us</h3>
          <div className="flex gap-3 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-gray-800 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                title={capitalizeFirst(s.platform)}
              >
                <span className="text-[#1ca3fd]">{getSocialIcon(s.platform)}</span>
                <span className="hidden sm:inline">{capitalizeFirst(s.platform)}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
