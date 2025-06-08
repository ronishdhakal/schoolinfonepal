"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAdvertisements } from "@/utils/api";

const SIDEBAR_PLACEMENTS = [
  "home-4", "home-5", "home-6", "home-7", "home-8",
  "home-9", "home-10", "home-11", "home-12"
];

export default function SidebarAds() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAdvertisements().then((allAds) => {
      const filtered = allAds
        .filter((ad) => SIDEBAR_PLACEMENTS.includes(ad.placement))
        .sort(
          (a, b) =>
            SIDEBAR_PLACEMENTS.indexOf(a.placement) -
            SIDEBAR_PLACEMENTS.indexOf(b.placement)
        );
      setAds(filtered);
    });
  }, []);

  if (!ads.length) return null;

  return (
    <div className="flex flex-col gap-6 w-[220px] max-w-full md:w-[220px]">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            block rounded-xl overflow-hidden border border-[#e9e9e9] shadow hover:shadow-md transition
            w-full md:w-[220px] 
            bg-[#fafcff]
          "
          style={{
            // Fallback for browsers without Tailwind
            maxWidth: "100%",
          }}
        >
          <div className="hidden md:block">
            {/* Desktop version: 220x220 */}
            <Image
              src={ad.image_desktop}
              alt={ad.title}
              width={220}
              height={220}
              className="object-contain w-full h-full"
              unoptimized
            />
          </div>
          <div className="block md:hidden">
            {/* Mobile version: 468x90 */}
            <Image
              src={ad.image_mobile || ad.image_desktop}
              alt={ad.title}
              width={468}
              height={90}
              className="object-contain w-full"
              unoptimized
            />
          </div>
        </a>
      ))}
    </div>
  );
}
