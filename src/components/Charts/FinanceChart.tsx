'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface FinanceChartProps {
  data: { name: string; revenue: number; expenditure: number }[]
}

export function formatFinanceTooltip(value: number): [string, string] {
  return [`$${value.toLocaleString()}`, '']
}

export default function FinanceChart({ data }: FinanceChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-gray-500">No data available.</p>
  }

  return (
    <div data-testid="finance-chart" className="h-72 w-full">
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
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={formatFinanceTooltip} />
          <Legend />
          <Bar
            dataKey="revenue"
            name="Revenue/Pupil"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenditure"
            name="Expenditure/Pupil"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
