"use client";
export default function Pagination({
  current,
  total,
  pageSize,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-4 mt-10 ${className}`}>
      <button
        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
      >
        Previous
      </button>
      <span>
        Page <strong>{current}</strong> of <strong>{totalPages}</strong>
      </span>
      <button
        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
        disabled={current === totalPages}
        onClick={() => onPageChange(current + 1)}
      >
        Next
      </button>
    </div>
  );
}
