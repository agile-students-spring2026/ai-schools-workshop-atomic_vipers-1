'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { District } from '@/lib/types'
import { fallbackDistricts } from '@/lib/fallback-data'
import CompareTable from '@/components/CompareTable'
import CompareRadar from '@/components/Charts/CompareRadar'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function CompareContent() {
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids')

  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    idsParam ? idsParam.split(',').filter(Boolean) : []
  )
  const [selectValue, setSelectValue] = useState('')

  async function fetchComparison(ids: string[]) {
    if (ids.length === 0) {
      setDistricts([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/districts/compare?ids=${ids.join(',')}`
      )
      if (!res.ok) throw new Error('Failed to fetch comparison')
      const data = await res.json()
      setDistricts(data.districts)
    } catch {
      setError('Unable to load comparison. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedIds.length > 0) {
      fetchComparison(selectedIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleAdd() {
    if (!selectValue || selectedIds.includes(selectValue)) return
    if (selectedIds.length >= 5) return

    const newIds = [...selectedIds, selectValue]
    setSelectedIds(newIds)
    setSelectValue('')
    fetchComparison(newIds)
  }

  function handleRemove(id: string) {
    const newIds = selectedIds.filter(i => i !== id)
    setSelectedIds(newIds)
    fetchComparison(newIds)
  }

  const availableDistricts = fallbackDistricts.filter(
    d => !selectedIds.includes(d.id)
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Compare School Districts
        </h1>
        <p className="mt-2 text-gray-600">
          Select up to 5 districts to compare side by side.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor="district-select"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Add a district
          </label>
          <select
            id="district-select"
            value={selectValue}
            onChange={e => setSelectValue(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Choose a district...</option>
            {availableDistricts.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.stateAbbreviation})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          disabled={!selectValue || selectedIds.length >= 5}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
        >
          Add
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {districts.map(d => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700"
            >
              {d.name}
              <button
                onClick={() => handleRemove(d.id)}
                className="ml-1 text-primary-400 hover:text-primary-600"
                aria-label={`Remove ${d.name}`}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {loading && <LoadingSkeleton count={3} />}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => fetchComparison(selectedIds)}
        />
      )}

      {!loading && !error && districts.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">
            Select districts above to start comparing.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-primary-600 hover:underline"
          >
            Browse districts
          </Link>
        </div>
      )}

      {!loading && !error && districts.length > 0 && (
        <div className="space-y-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Visual Comparison
            </h2>
            <CompareRadar districts={districts} />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Detailed Comparison
            </h2>
            <CompareTable districts={districts} />
          </div>
        </div>
      )}
    </div>
  )
}
