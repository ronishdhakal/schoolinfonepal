// src/components/school/SchoolMapAndSocial.js
"use client";
import { Globe, Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";

// Helper for icon per platform (add more as needed)
function getSocialIcon(platform) {
  const p = platform?.toLowerCase() || "";
  if (p.includes("facebook")) return <Facebook className="w-6 h-6" />;
  if (p.includes("twitter") || p.includes("x.com")) return <Twitter className="w-6 h-6" />;
  if (p.includes("youtube")) return <Youtube className="w-6 h-6" />;
  if (p.includes("insta")) return <Instagram className="w-6 h-6" />;
  if (p.includes("linkedin")) return <Linkedin className="w-6 h-6" />;
  return <Globe className="w-6 h-6" />;
}

export default function SchoolMapAndSocial({ school }) {
  const map = school?.map_link?.trim();
  const socials = school?.social_media?.filter(s => s.url?.trim()) || [];

  // Helper: extract src from embed HTML if pasted, else treat as URL
  let mapSrc = "";
  if (map?.includes("iframe")) {
    // Extract src attribute from the embed code
    const match = map.match(/src=['"]([^'"]+)['"]/);
    mapSrc = match ? match[1] : "";
  } else if (map) {
    // Convert Google Maps share URL to embed if needed
    if (map.includes("/maps/")) {
      if (map.includes("/maps/place/") || map.includes("/maps/@")) {
        mapSrc = map.replace("/maps/", "/maps/embed?");
      } else if (map.includes("/maps?q=")) {
        mapSrc = "https://www.google.com/maps/embed?" + map.split("?")[1];
      } else {
        mapSrc = map;
      }
    } else {
      mapSrc = map;
    }
  }

  if (!mapSrc && !socials.length) return null;

  return (
    <section className="bg-white rounded-2xl shadow mb-8 px-6 py-7">
      {/* Map Section */}
      {mapSrc && (
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-7 h-7 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Location</h2>
          </div>
          <div className="aspect-video w-full rounded-xl overflow-hidden border shadow">
            <iframe
              src={mapSrc}
              title="School Map"
              loading="lazy"
              allowFullScreen
              className="w-full h-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}

      {/* Social Media Section */}
      {socials.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-bold text-gray-900">Connect with us:</h3>
          </div>
          <div className="flex gap-4 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold transition"
                title={s.platform}
              >
                {getSocialIcon(s.platform)}
                <span className="hidden sm:inline">{s.platform}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
