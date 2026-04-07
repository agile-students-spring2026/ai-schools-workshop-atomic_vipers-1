interface LoadingSkeletonProps {
  count?: number
}

export default function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-3">
            <div className="h-5 w-3/4 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="mt-1 h-4 w-12 rounded bg-gray-200" />
            </div>
            <div>
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="mt-1 h-4 w-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
