'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import DistrictCard from '@/components/DistrictCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { District, SearchResult, SortField, LocaleType } from '@/lib/types'
import { STATES } from '@/lib/types'

const FEATURED_STATES = [
  'California',
  'New York',
  'Texas',
  'Florida',
  'Illinois',
  'Massachusetts',
]

export default function HomePage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [localeFilter, setLocaleFilter] = useState<LocaleType | ''>('')
  const [sortBy, setSortBy] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)

  async function fetchDistricts() {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (query) params.set('query', query)
    if (stateFilter) params.set('state', stateFilter)
    if (localeFilter) params.set('locale', localeFilter)
    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)
    params.set('page', String(page))
    params.set('limit', '18')

    try {
      const res = await fetch(`/api/districts/search?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch districts')
      const data: SearchResult = await res.json()
      setDistricts(data.districts)
      setTotal(data.total)
    } catch {
      setError('Unable to load districts. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDistricts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateFilter, localeFilter, sortBy, sortOrder, page])

  function handleSearch(q: string) {
    setQuery(q)
    setPage(1)
    fetchDistricts()
  }

  function handleStateChip(state: string) {
    setStateFilter(prev => (prev === state ? '' : state))
    setPage(1)
  }

  const totalPages = Math.ceil(total / 18)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Find the Right School District
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Explore and compare school districts across the United States.
          Evaluate graduation rates, spending, class sizes, and more using
          publicly available data.
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl">
        <SearchBar onSearch={handleSearch} initialQuery={query} />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Quick filter:</span>
        {FEATURED_STATES.map(state => (
          <button
            key={state}
            onClick={() => handleStateChip(state)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              stateFilter === state
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="locale-filter" className="text-sm font-medium text-gray-600">
            Locale:
          </label>
          <select
            id="locale-filter"
            value={localeFilter}
            onChange={e => {
              setLocaleFilter(e.target.value as LocaleType | '')
              setPage(1)
            }}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="town">Town</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-field" className="text-sm font-medium text-gray-600">
            Sort by:
          </label>
          <select
            id="sort-field"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortField)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="name">Name</option>
            <option value="enrollment">Enrollment</option>
            <option value="graduationRate">Graduation Rate</option>
            <option value="expenditurePerPupil">Spending/Pupil</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '\u2191' : '\u2193'}
          </button>
        </div>

        {total > 0 && (
          <span className="ml-auto text-sm text-gray-500">
            {total} district{total !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {loading && <LoadingSkeleton count={6} />}

      {error && (
        <ErrorMessage message={error} onRetry={fetchDistricts} />
      )}

      {!loading && !error && districts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">
            No districts found. Try adjusting your search or filters.
          </p>
        </div>
      )}

      {!loading && !error && districts.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {districts.map(district => (
              <DistrictCard key={district.id} district={district} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
