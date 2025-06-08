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

// Helper: Capitalize first letter, rest lowercase (even if value is all uppercase)
function capitalizeFirst(str = "") {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
}

export default function SchoolMapAndSocial({ school }) {
  const map = school?.map_link?.trim();
  const socials = school?.social_media?.filter(s => s.url?.trim()) || [];

  // Helper: extract src from embed HTML if pasted, else treat as URL
  let mapSrc = "";
  if (map?.includes("iframe")) {
    const match = map.match(/src=['"]([^'"]+)['"]/);
    mapSrc = match ? match[1] : "";
  } else if (map) {
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
    <section className="mb-10 px-2 md:px-0">
      {/* Map Section */}
      {mapSrc && (
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1868ae] mb-4 font-sans tracking-tight">
            Location
          </h2>
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-blue-100">
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

      {/* Social Media Section */}
      {socials.length > 0 && (
        <div className="mt-2">
          <h3 className="text-lg font-bold text-[#1868ae] mb-4 font-sans">Connect with us</h3>
          <div className="flex gap-4 flex-wrap">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold rounded-full shadow-sm border border-blue-100 hover:bg-blue-200 hover:text-blue-900 transition focus:ring-2 focus:ring-blue-200"
                title={capitalizeFirst(s.platform)}
              >
                {getSocialIcon(s.platform)}
                <span className="hidden sm:inline text-base font-medium">
                  {capitalizeFirst(s.platform)}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
