"use client";
import Link from "next/link";
import Image from "next/image";

const RecentInformation = ({ items, currentSlug }) => {
  if (!items || items.length === 0) return null;

  return (
    <aside className="bg-white rounded-xl shadow p-4 mb-8">
      <h3 className="text-lg font-semibold mb-4">Recent Information</h3>
      <div className="space-y-3">
        {items
          .filter((info) => info.slug !== currentSlug)
          .map((info) => (
            <Link
              key={info.id}
              href={`/information/${info.slug}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-16 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {info.featured_image ? (
                  <Image
                    src={info.featured_image}
                    alt={info.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300">No Image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700 line-clamp-2">
                  {info.title}
                </div>
                {info.published_date && (
                  <div className="text-xs text-gray-400">{new Date(info.published_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                )}
              </div>
            </Link>
          ))}
      </div>
    </aside>
  );
};

export default RecentInformation;
