import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompareTable from '@/components/CompareTable'
import { District } from '@/lib/types'

const mockDistricts: District[] = [
  {
    id: '001',
    name: 'District A',
    state: 'California',
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
    state: 'New York',
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

describe('CompareTable', () => {
  it('renders a table with district names as headers', () => {
    render(<CompareTable districts={mockDistricts} />)
    expect(screen.getByText('District A')).toBeInTheDocument()
    expect(screen.getByText('District B')).toBeInTheDocument()
  })

  it('renders metric rows', () => {
    render(<CompareTable districts={mockDistricts} />)
    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('Enrollment')).toBeInTheDocument()
    expect(screen.getByText('Graduation Rate')).toBeInTheDocument()
  })

  it('renders formatted values', () => {
    render(<CompareTable districts={mockDistricts} />)
    expect(screen.getByText('50,000')).toBeInTheDocument()
    expect(screen.getByText('85.0%')).toBeInTheDocument()
    expect(screen.getByText('16.0:1')).toBeInTheDocument()
  })

  it('shows message when no districts provided', () => {
    render(<CompareTable districts={[]} />)
    expect(
      screen.getByText('No districts selected for comparison.')
    ).toBeInTheDocument()
  })

  it('shows N/A for null values', () => {
    const districts: District[] = [
      {
        ...mockDistricts[0],
        graduationRate: null,
        studentTeacherRatio: null,
        revenuePerPupil: null,
        expenditurePerPupil: null,
      },
    ]
    render(<CompareTable districts={districts} />)
    const naElements = screen.getAllByText('N/A')
    expect(naElements.length).toBe(4)
  })

  it('has a table role', () => {
    render(<CompareTable districts={mockDistricts} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })
})
