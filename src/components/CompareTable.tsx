import { District } from '@/lib/types'
import {
  formatNumber,
  formatPercent,
  formatCurrency,
  formatRatio,
  getLocaleLabel,
} from '@/lib/utils'

interface CompareTableProps {
  districts: District[]
}

interface MetricRow {
  label: string
  getValue: (d: District) => string
}

const metrics: MetricRow[] = [
  { label: 'State', getValue: d => d.state },
  { label: 'City', getValue: d => d.city },
  { label: 'Locale', getValue: d => getLocaleLabel(d.locale) },
  { label: 'Enrollment', getValue: d => formatNumber(d.enrollment) },
  {
    label: 'Graduation Rate',
    getValue: d =>
      d.graduationRate !== null ? formatPercent(d.graduationRate) : 'N/A',
  },
  {
    label: 'Student:Teacher Ratio',
    getValue: d =>
      d.studentTeacherRatio !== null
        ? formatRatio(d.studentTeacherRatio)
        : 'N/A',
  },
  {
    label: 'Revenue/Pupil',
    getValue: d =>
      d.revenuePerPupil !== null ? formatCurrency(d.revenuePerPupil) : 'N/A',
  },
  {
    label: 'Expenditure/Pupil',
    getValue: d =>
      d.expenditurePerPupil !== null
        ? formatCurrency(d.expenditurePerPupil)
        : 'N/A',
  },
]

export default function CompareTable({ districts }: CompareTableProps) {
  if (districts.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No districts selected for comparison.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" role="table">
        <thead>
          <tr>
            <th className="border-b-2 border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Metric
            </th>
            {districts.map(d => (
              <th
                key={d.id}
                className="border-b-2 border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900"
              >
                {d.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map(metric => (
            <tr key={metric.label} className="hover:bg-gray-50">
              <td className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-gray-600">
                {metric.label}
              </td>
              {districts.map(d => (
                <td
                  key={d.id}
                  className="border-b border-gray-100 px-4 py-3 text-sm text-gray-800"
                >
                  {metric.getValue(d)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
