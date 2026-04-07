import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DistrictCard from '@/components/DistrictCard'
import { District } from '@/lib/types'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const mockDistrict: District = {
  id: '001',
  name: 'Test District',
  state: 'California',
  stateAbbreviation: 'CA',
  city: 'Los Angeles',
  locale: 'urban',
  enrollment: 50000,
  graduationRate: 85.5,
  studentTeacherRatio: 16.3,
  revenuePerPupil: 15000,
  expenditurePerPupil: 14000,
}

describe('DistrictCard', () => {
  it('renders district name', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText('Test District')).toBeInTheDocument()
  })

  it('renders city and state', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText(/Los Angeles, CA/)).toBeInTheDocument()
  })

  it('renders locale badge', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText('Urban')).toBeInTheDocument()
  })

  it('renders formatted enrollment', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText('50,000')).toBeInTheDocument()
  })

  it('renders graduation rate', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText('85.5%')).toBeInTheDocument()
  })

  it('renders student-teacher ratio', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText('16.3:1')).toBeInTheDocument()
  })

  it('renders spending per pupil', () => {
    render(<DistrictCard district={mockDistrict} />)
    expect(screen.getByText('$14,000')).toBeInTheDocument()
  })

  it('links to district detail page', () => {
    render(<DistrictCard district={mockDistrict} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/district/001')
  })

  it('shows N/A for null graduation rate', () => {
    const district: District = {
      ...mockDistrict,
      graduationRate: null,
      studentTeacherRatio: null,
      expenditurePerPupil: null,
    }
    render(<DistrictCard district={district} />)
    const naElements = screen.getAllByText('N/A')
    expect(naElements.length).toBe(3)
  })
})
