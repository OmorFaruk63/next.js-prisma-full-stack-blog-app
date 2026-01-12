import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  search,
  sort,
}: {
  page: number;
  totalPages: number;
  search: string;
  sort: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center gap-2 mt-12 flex-wrap">
      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNum = i + 1;
        const isActive = page === pageNum;
        return (
          <Link
            key={i}
            href={`/?page=${pageNum}&search=${encodeURIComponent(
              search
            )}&sort=${sort}`}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
              ${
                isActive
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-cyan-300 border border-gray-700"
              }
            `}
          >
            {pageNum}
          </Link>
        );
      })}
    </nav>
  );
}
