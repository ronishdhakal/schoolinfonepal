"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAdvertisements } from "@/utils/api";

// Util: detect if screen is mobile
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

const TOP_PLACEMENTS = ["home-1", "home-2", "home-3"];

export default function TopAds() {
  const [ads, setAds] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchAdvertisements().then((allAds) => {
      const filtered = allAds
        .filter((ad) => TOP_PLACEMENTS.includes(ad.placement))
        .sort(
          (a, b) =>
            TOP_PLACEMENTS.indexOf(a.placement) -
            TOP_PLACEMENTS.indexOf(b.placement)
        );
      setAds(filtered);
    });
  }, []);

  if (!ads.length) return null;

  return (
    <div
      className={`w-full ${
        isMobile
          ? "flex flex-col gap-2 items-center mb-8 mx-2"
          : "flex flex-row gap-2 justify-center mb-8"
      }`}
    >
      {ads.map((ad) => (
        <a
          key={ad.id}
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl shadow-sm overflow-hidden border border-[#e9e9e9] hover:shadow-lg transition"
          style={{
            width: 468,
            height: 90,
            background: "#fafcff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={
              isMobile
                ? ad.image_mobile || ad.image_desktop
                : ad.image_desktop
            }
            alt={ad.title}
            width={468}
            height={90}
            className="object-cover w-full h-full"
            unoptimized
          />
        </a>
      ))}
    </div>
  );
}
