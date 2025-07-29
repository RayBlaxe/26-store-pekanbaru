export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-600 rounded animate-pulse mt-2"></div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-4">
        <div className="h-10 w-64 bg-slate-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-slate-700 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-slate-700 rounded animate-pulse"></div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-slate-600 rounded animate-pulse"></div>
              <div className="ml-3 space-y-2">
                <div className="h-4 w-20 bg-slate-600 rounded animate-pulse"></div>
                <div className="h-6 w-8 bg-slate-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
            
            {/* Table Rows */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
