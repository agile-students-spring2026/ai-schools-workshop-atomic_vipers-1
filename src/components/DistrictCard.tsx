import Link from 'next/link'
import { District } from '@/lib/types'
import {
  formatNumber,
  formatPercent,
  formatCurrency,
  formatRatio,
  getLocaleLabel,
  getGraduationRateColor,
} from '@/lib/utils'

interface DistrictCardProps {
  district: District
}

export default function DistrictCard({ district }: DistrictCardProps) {
  return (
    <Link
      href={`/district/${district.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
    >
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {district.name}
        </h3>
        <p className="text-sm text-gray-500">
          {district.city}, {district.stateAbbreviation}
          <span className="ml-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {getLocaleLabel(district.locale)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Enrollment
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {formatNumber(district.enrollment)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Graduation Rate
          </p>
          <p
            className={`text-sm font-semibold ${
              district.graduationRate !== null
                ? getGraduationRateColor(district.graduationRate)
                : 'text-gray-400'
            }`}
          >
            {district.graduationRate !== null
              ? formatPercent(district.graduationRate)
              : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Student:Teacher
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {district.studentTeacherRatio !== null
              ? formatRatio(district.studentTeacherRatio)
              : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Spending/Pupil
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {district.expenditurePerPupil !== null
              ? formatCurrency(district.expenditurePerPupil)
              : 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  )
}
