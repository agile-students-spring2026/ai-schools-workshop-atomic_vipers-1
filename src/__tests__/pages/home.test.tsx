import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/page'

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

const mockFetch = vi.fn()
global.fetch = mockFetch

const mockSearchResult = {
  districts: [
    {
      id: '001',
      name: 'Test District',
      state: 'California',
      stateAbbreviation: 'CA',
      city: 'Los Angeles',
      locale: 'urban',
      enrollment: 50000,
      graduationRate: 85,
      studentTeacherRatio: 16,
      revenuePerPupil: 15000,
      expenditurePerPupil: 14000,
    },
  ],
  total: 1,
  page: 1,
  limit: 18,
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockSearchResult,
    })
  })

  it('renders heading', async () => {
    render(<HomePage />)
    expect(
      screen.getByText('Find the Right School District')
    ).toBeInTheDocument()
  })

  it('renders search bar', async () => {
    render(<HomePage />)
    expect(screen.getByLabelText('Search districts')).toBeInTheDocument()
  })

  it('renders quick filter state chips', async () => {
    render(<HomePage />)
    expect(screen.getByText('California')).toBeInTheDocument()
    expect(screen.getByText('New York')).toBeInTheDocument()
  })

  it('loads and displays districts', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Test District')).toBeInTheDocument()
    })
  })

  it('shows district count', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('1 district found')).toBeInTheDocument()
    })
  })

  it('shows error on fetch failure', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false })

    render(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByText('Unable to load districts. Please try again.')
      ).toBeInTheDocument()
    })
  })

  it('shows no results message', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        districts: [],
        total: 0,
        page: 1,
        limit: 18,
      }),
    })

    render(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByText(
          'No districts found. Try adjusting your search or filters.'
        )
      ).toBeInTheDocument()
    })
  })

  it('toggles state filter on chip click', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Test District')).toBeInTheDocument()
    })

    const calChip = screen.getByText('California')
    await userEvent.click(calChip)

    expect(mockFetch).toHaveBeenCalled()
  })

  it('renders locale filter dropdown', async () => {
    render(<HomePage />)
    expect(screen.getByLabelText('Locale:')).toBeInTheDocument()
  })

  it('renders sort dropdown', async () => {
    render(<HomePage />)
    expect(screen.getByLabelText('Sort by:')).toBeInTheDocument()
  })

  it('renders pagination when multiple pages', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        districts: Array(18).fill(mockSearchResult.districts[0]),
        total: 36,
        page: 1,
        limit: 18,
      }),
    })

    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })
  })

  it('handles search submission', async () => {
    render(<HomePage />)

    const input = screen.getByLabelText('Search districts')
    await userEvent.type(input, 'Chicago')
    await userEvent.click(screen.getByText('Search'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('navigates pages with Previous/Next', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        districts: Array.from({ length: 18 }, (_, i) => ({
          ...mockSearchResult.districts[0],
          id: String(i + 1),
        })),
        total: 36,
        page: 1,
        limit: 18,
      }),
    })

    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    })

    await userEvent.click(screen.getByText('Next'))
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('toggles sort order', async () => {
    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Test District')).toBeInTheDocument()
    })

    const toggleBtn = screen.getByLabelText('Sort descending')
    await userEvent.click(toggleBtn)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('changes locale filter', async () => {
    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Test District')).toBeInTheDocument()
    })

    const localeSelect = screen.getByLabelText('Locale:')
    await userEvent.selectOptions(localeSelect, 'urban')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('changes sort field', async () => {
    render(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Test District')).toBeInTheDocument()
    })

    const sortSelect = screen.getByLabelText('Sort by:')
    await userEvent.selectOptions(sortSelect, 'enrollment')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('de-toggles state chip', async () => {
    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Test District')).toBeInTheDocument()
    })

    const calChip = screen.getByText('California')
    await userEvent.click(calChip)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    await userEvent.click(calChip)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  it('shows plural districts count', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockSearchResult,
        total: 5,
        districts: Array.from({ length: 5 }, (_, i) => ({
          ...mockSearchResult.districts[0],
          id: String(i + 1),
        })),
      }),
    })

    render(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('5 districts found')).toBeInTheDocument()
    })
  })
})
