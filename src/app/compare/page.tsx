'use client'

import { Suspense } from 'react'
import CompareContent from './CompareContent'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSkeleton count={3} />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
