'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface GraduationChartProps {
  data: { name: string; rate: number }[]
}

function getBarColor(rate: number): string {
  if (rate >= 85) return '#16a34a'
  if (rate >= 70) return '#ca8a04'
  return '#dc2626'
}

export function formatGraduationTooltip(value: number): [string, string] {
  return [`${value.toFixed(1)}%`, 'Graduation Rate']
}

export default function GraduationChart({ data }: GraduationChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-gray-500">No data available.</p>
  }

  return (
    <div data-testid="graduation-chart" className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 60, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={formatGraduationTooltip} />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.rate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { getBarColor }
