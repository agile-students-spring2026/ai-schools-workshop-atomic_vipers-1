'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { District } from '@/lib/types'

interface CompareRadarProps {
  districts: District[]
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

function normalizeValue(value: number | null, max: number): number {
  if (value === null) return 0
  return Math.round((value / max) * 100)
}

export function buildRadarData(districts: District[]) {
  const maxEnrollment = Math.max(...districts.map(d => d.enrollment), 1)
  const maxGrad = 100
  const maxRatio = Math.max(
    ...districts.map(d => d.studentTeacherRatio ?? 0),
    1
  )
  const maxRevenue = Math.max(
    ...districts.map(d => d.revenuePerPupil ?? 0),
    1
  )
  const maxExpenditure = Math.max(
    ...districts.map(d => d.expenditurePerPupil ?? 0),
    1
  )

  const metrics = [
    'Enrollment',
    'Graduation Rate',
    'Student:Teacher',
    'Revenue/Pupil',
    'Expenditure/Pupil',
  ]

  return metrics.map(metric => {
    const entry: Record<string, string | number> = { metric }
    districts.forEach(d => {
      switch (metric) {
        case 'Enrollment':
          entry[d.name] = normalizeValue(d.enrollment, maxEnrollment)
          break
        case 'Graduation Rate':
          entry[d.name] = normalizeValue(d.graduationRate, maxGrad)
          break
        case 'Student:Teacher':
          entry[d.name] = normalizeValue(d.studentTeacherRatio, maxRatio)
          break
        case 'Revenue/Pupil':
          entry[d.name] = normalizeValue(d.revenuePerPupil, maxRevenue)
          break
        case 'Expenditure/Pupil':
          entry[d.name] = normalizeValue(d.expenditurePerPupil, maxExpenditure)
          break
      }
    })
    return entry
  })
}

export default function CompareRadar({ districts }: CompareRadarProps) {
  if (districts.length === 0) {
    return <p className="text-center text-gray-500">No districts to compare.</p>
  }

  const data = buildRadarData(districts)

  return (
    <div data-testid="compare-radar" className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Tooltip />
          {districts.map((d, i) => (
            <Radar
              key={d.id}
              name={d.name}
              dataKey={d.name}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { normalizeValue }
