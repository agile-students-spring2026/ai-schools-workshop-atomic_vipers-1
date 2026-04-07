import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompareRadar, {
  normalizeValue,
  buildRadarData,
} from '@/components/Charts/CompareRadar'
import { District } from '@/lib/types'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

const mockDistricts: District[] = [
  {
    id: '001',
    name: 'District A',
    state: 'CA',
    stateAbbreviation: 'CA',
    city: 'LA',
    locale: 'urban',
    enrollment: 50000,
    graduationRate: 85,
    studentTeacherRatio: 16,
    revenuePerPupil: 15000,
    expenditurePerPupil: 14000,
  },
  {
    id: '002',
    name: 'District B',
    state: 'NY',
    stateAbbreviation: 'NY',
    city: 'NYC',
    locale: 'suburban',
    enrollment: 30000,
    graduationRate: 90,
    studentTeacherRatio: 14,
    revenuePerPupil: 20000,
    expenditurePerPupil: 19000,
  },
]

describe('CompareRadar', () => {
  it('renders chart container when districts provided', () => {
    render(<CompareRadar districts={mockDistricts} />)
    expect(screen.getByTestId('compare-radar')).toBeInTheDocument()
  })

  it('renders empty message when no districts', () => {
    render(<CompareRadar districts={[]} />)
    expect(screen.getByText('No districts to compare.')).toBeInTheDocument()
  })
})

describe('normalizeValue', () => {
  it('normalizes value to percentage of max', () => {
    expect(normalizeValue(50, 100)).toBe(50)
    expect(normalizeValue(25, 50)).toBe(50)
  })

  it('returns 0 for null values', () => {
    expect(normalizeValue(null, 100)).toBe(0)
  })
})

describe('buildRadarData', () => {
  it('returns data for all 5 metrics', () => {
    const data = buildRadarData(mockDistricts)
    expect(data).toHaveLength(5)
    expect(data.map(d => d.metric)).toEqual([
      'Enrollment',
      'Graduation Rate',
      'Student:Teacher',
      'Revenue/Pupil',
      'Expenditure/Pupil',
    ])
  })

  it('normalizes values for each district', () => {
    const data = buildRadarData(mockDistricts)
    const enrollmentEntry = data.find(d => d.metric === 'Enrollment')!
    expect(enrollmentEntry['District A']).toBe(100)
    expect(enrollmentEntry['District B']).toBe(60)
  })

  it('handles districts with null values', () => {
    const districts: District[] = [
      {
        ...mockDistricts[0],
        graduationRate: null,
        studentTeacherRatio: null,
        revenuePerPupil: null,
        expenditurePerPupil: null,
      },
    ]
    const data = buildRadarData(districts)
    const gradEntry = data.find(d => d.metric === 'Graduation Rate')!
    expect(gradEntry[districts[0].name]).toBe(0)
  })
})
