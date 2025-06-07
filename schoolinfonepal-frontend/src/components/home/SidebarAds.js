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
      // Only take ads with placement home-4 to home-12
      const filtered = allAds
        .filter((ad) => SIDEBAR_PLACEMENTS.includes(ad.placement))
        .sort(
          (a, b) => SIDEBAR_PLACEMENTS.indexOf(a.placement) - SIDEBAR_PLACEMENTS.indexOf(b.placement)
        );
      setAds(filtered);
    });
  }, []);

  if (!ads.length) return null;

  return (
    <div className="flex flex-col gap-6">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-[#e9e9e9] shadow-sm hover:shadow-md transition"
          style={{ width: 250, height: 250 }}
        >
          <Image
            src={ad.image_desktop}
            alt={ad.title}
            width={250}
            height={250}
            className="object-cover w-full h-full"
            unoptimized
          />
        </a>
      ))}
    </div>
  );
}
