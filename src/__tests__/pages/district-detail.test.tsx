import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import DistrictDetailPage from '@/app/district/[id]/page'

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

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '0600001' }),
}))

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  }
})

const mockDistrict = {
  id: '0600001',
  name: 'Los Angeles Unified',
  state: 'California',
  stateAbbreviation: 'CA',
  city: 'Los Angeles',
  locale: 'urban',
  enrollment: 574570,
  graduationRate: 81.2,
  studentTeacherRatio: 23.1,
  revenuePerPupil: 16842,
  expenditurePerPupil: 15903,
}

describe('DistrictDetailPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading state initially', () => {
    vi.spyOn(global, 'fetch').mockReturnValue(new Promise(() => {}) as Promise<Response>)
    render(<DistrictDetailPage />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('displays district name after loading', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockDistrict,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Los Angeles Unified')).toBeInTheDocument()
    })
  })

  it('displays district location and locale', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockDistrict,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(screen.getByText(/Los Angeles, California/)).toBeInTheDocument()
      expect(screen.getByText('Urban')).toBeInTheDocument()
    })
  })

  it('displays metric cards', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockDistrict,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('574,570')).toBeInTheDocument()
      expect(screen.getByText('81.2%')).toBeInTheDocument()
      expect(screen.getByText('23.1:1')).toBeInTheDocument()
    })
  })

  it('has back to search link', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockDistrict,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      const links = screen.getAllByText(/Back to search/)
      expect(links.length).toBeGreaterThan(0)
    })
  })

  it('has add to compare link', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockDistrict,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Add to Compare')).toBeInTheDocument()
    })
  })

  it('shows error on 404', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('District not found.')).toBeInTheDocument()
    })
  })

  it('shows error on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(
        screen.getByText(
          'Unable to load district details. Please try again.'
        )
      ).toBeInTheDocument()
    })
  })

  it('renders N/A for null metrics', async () => {
    const districtWithNulls = {
      ...mockDistrict,
      graduationRate: null,
      studentTeacherRatio: null,
      revenuePerPupil: null,
      expenditurePerPupil: null,
    }

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => districtWithNulls,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      const naElements = screen.getAllByText('N/A')
      expect(naElements.length).toBe(4)
    })
  })

  it('hides chart sections when data is null', async () => {
    const districtNoCharts = {
      ...mockDistrict,
      graduationRate: null,
      revenuePerPupil: null,
      expenditurePerPupil: null,
    }

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => districtNoCharts,
    } as Response)

    render(<DistrictDetailPage />)
    await waitFor(() => {
      expect(screen.getByText('Los Angeles Unified')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('graduation-chart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('finance-chart')).not.toBeInTheDocument()
  })
})
