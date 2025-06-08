"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchRecentNews } from "@/utils/api";

export default function RecentNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentNews(6)
      .then((data) => {
        // API might return paginated data or flat array
        const items = data?.results || data;
        console.log("Fetched recent news:", items);
        setNews(Array.isArray(items) ? items : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading recent news...</div>;
  if (!news.length) return <div className="text-gray-400">No recent news found.</div>;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-[#1ca3fd] mb-6">Recent News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow border border-[#e8f4fc] flex items-center gap-4 p-4"
          >
            {/* News Image */}
            {item.featured_image && (
              <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={item.featured_image}
                  alt={item.title}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            )}
            {/* News Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="text-base font-semibold text-gray-900 truncate mb-1">
                {item.title}
              </div>
              {item.summary && (
                <div className="text-sm text-gray-500 mb-2 line-clamp-2">{item.summary}</div>
              )}
              <div className="text-xs text-gray-400 mt-auto">
                Published {item.published_date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
