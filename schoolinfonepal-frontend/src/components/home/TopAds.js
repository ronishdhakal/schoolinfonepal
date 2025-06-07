"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAdvertisements } from "@/utils/api";

const TOP_PLACEMENTS = ["home-1", "home-2", "home-3"];

export default function TopAds() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAdvertisements().then((allAds) => {
      // Only take ads with placement home-1, 2, or 3 and sort by placement
      const filtered = allAds
        .filter((ad) => TOP_PLACEMENTS.includes(ad.placement))
        .sort(
          (a, b) => TOP_PLACEMENTS.indexOf(a.placement) - TOP_PLACEMENTS.indexOf(b.placement)
        );
      setAds(filtered);
    });
  }, []);

  if (!ads.length) return null;

  return (
    <div className="w-full flex flex-row gap-4 mb-8 justify-center">
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg shadow-sm overflow-hidden border border-[#e9e9e9] hover:shadow-lg transition"
          style={{ width: 468, height: 90 }}
        >
          <Image
            src={ad.image_desktop}
            alt={ad.title}
            width={468}
            height={90}
            className="object-cover w-full h-full"
            priority
            unoptimized
          />
        </a>
      ))}
    </div>
  );
}
