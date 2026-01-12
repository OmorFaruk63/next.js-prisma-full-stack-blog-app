// Extracted Components for cleaner code
export default function SearchForm({
  search,
  sort,
}: {
  search: string;
  sort: string;
}) {
  return (
    <form className="flex flex-col sm:flex-row gap-4 mb-12 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search posts..."
          className="w-full px-5 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <select
        name="sort"
        defaultValue={sort}
        className="px-4 py-3 bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>

      <button className="px-6 py-3 bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-cyan-500/40">
        Search
      </button>
    </form>
  );
}
