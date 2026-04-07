'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { District } from '@/lib/types'
import {
  formatNumber,
  formatPercent,
  formatCurrency,
  formatRatio,
  getLocaleLabel,
  getGraduationRateColor,
  getStudentTeacherRatioColor,
} from '@/lib/utils'
import MetricCard from '@/components/MetricCard'
import GraduationChart from '@/components/Charts/GraduationChart'
import FinanceChart from '@/components/Charts/FinanceChart'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function DistrictDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [district, setDistrict] = useState<District | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchDistrict() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/districts/${id}`)
      if (res.status === 404) {
        setError('District not found.')
        return
      }
      if (!res.ok) throw new Error('Failed to fetch district')
      const data: District = await res.json()
      setDistrict(data)
    } catch {
      setError('Unable to load district details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchDistricts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function fetchDistricts() {
    fetchDistrict()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSkeleton count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorMessage message={error} onRetry={fetchDistrict} />
        <div className="mt-4 text-center">
          <Link href="/" className="text-primary-600 hover:underline">
            Back to search
          </Link>
        </div>
      </div>
    )
  }

  if (!district) return null

  const graduationData =
    district.graduationRate !== null
      ? [{ name: district.name, rate: district.graduationRate }]
      : []

  const financeData =
    district.revenuePerPupil !== null && district.expenditurePerPupil !== null
      ? [
          {
            name: district.name,
            revenue: district.revenuePerPupil,
            expenditure: district.expenditurePerPupil,
          },
        ]
      : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-primary-600 hover:underline"
        >
          &larr; Back to search
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{district.name}</h1>
        <p className="mt-1 text-lg text-gray-500">
          {district.city}, {district.state}
          <span className="ml-2 inline-block rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-600">
            {getLocaleLabel(district.locale)}
          </span>
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label="Enrollment"
          value={formatNumber(district.enrollment)}
        />
        <MetricCard
          label="Graduation Rate"
          value={
            district.graduationRate !== null
              ? formatPercent(district.graduationRate)
              : 'N/A'
          }
          colorClass={
            district.graduationRate !== null
              ? getGraduationRateColor(district.graduationRate)
              : 'text-gray-400'
          }
        />
        <MetricCard
          label="Student:Teacher"
          value={
            district.studentTeacherRatio !== null
              ? formatRatio(district.studentTeacherRatio)
              : 'N/A'
          }
          colorClass={
            district.studentTeacherRatio !== null
              ? getStudentTeacherRatioColor(district.studentTeacherRatio)
              : 'text-gray-400'
          }
        />
        <MetricCard
          label="Revenue/Pupil"
          value={
            district.revenuePerPupil !== null
              ? formatCurrency(district.revenuePerPupil)
              : 'N/A'
          }
        />
        <MetricCard
          label="Expenditure/Pupil"
          value={
            district.expenditurePerPupil !== null
              ? formatCurrency(district.expenditurePerPupil)
              : 'N/A'
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {graduationData.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Graduation Rate
            </h2>
            <GraduationChart data={graduationData} />
          </div>
        )}
        {financeData.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Financial Overview
            </h2>
            <FinanceChart data={financeData} />
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/compare?ids=${district.id}`}
          className="inline-block rounded-md bg-primary-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          Add to Compare
        </Link>
      </div>
    </div>
  )
}
