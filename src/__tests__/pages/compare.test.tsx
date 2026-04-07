import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CompareContent from '@/app/compare/CompareContent'

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
  useSearchParams: () => new URLSearchParams(''),
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

describe('CompareContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders heading', () => {
    render(<CompareContent />)
    expect(
      screen.getByText('Compare School Districts')
    ).toBeInTheDocument()
  })

  it('renders district selector', () => {
    render(<CompareContent />)
    expect(screen.getByLabelText('Add a district')).toBeInTheDocument()
  })

  it('shows empty state message', () => {
    render(<CompareContent />)
    expect(
      screen.getByText('Select districts above to start comparing.')
    ).toBeInTheDocument()
  })

  it('has browse districts link', () => {
    render(<CompareContent />)
    expect(screen.getByText('Browse districts')).toBeInTheDocument()
  })

  it('adds a district when Add is clicked', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        districts: [
          {
            id: '0600001',
            name: 'Los Angeles Unified',
            state: 'California',
            stateAbbreviation: 'CA',
            city: 'LA',
            locale: 'urban',
            enrollment: 574570,
            graduationRate: 81.2,
            studentTeacherRatio: 23.1,
            revenuePerPupil: 16842,
            expenditurePerPupil: 15903,
          },
        ],
      }),
    } as Response)

    render(<CompareContent />)

    const select = screen.getByLabelText('Add a district')
    await userEvent.selectOptions(select, '0600001')
    await userEvent.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(screen.getAllByText('Los Angeles Unified').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows error on fetch failure', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
    } as Response)

    render(<CompareContent />)

    const select = screen.getByLabelText('Add a district')
    await userEvent.selectOptions(select, '0600001')
    await userEvent.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(
        screen.getByText('Unable to load comparison. Please try again.')
      ).toBeInTheDocument()
    })
  })

  it('does not add when no value selected', async () => {
    render(<CompareContent />)
    const addBtn = screen.getByText('Add')
    await userEvent.click(addBtn)
    expect(
      screen.getByText('Select districts above to start comparing.')
    ).toBeInTheDocument()
  })

  it('does not add when already at 5 districts', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ districts: [] }),
    } as Response)

    render(<CompareContent />)

    const addBtn = screen.getByText('Add')
    expect(addBtn).toBeDisabled()
  })

  it('removes a district when X is clicked', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        districts: [
          {
            id: '0600001',
            name: 'Los Angeles Unified',
            state: 'California',
            stateAbbreviation: 'CA',
            city: 'LA',
            locale: 'urban',
            enrollment: 574570,
            graduationRate: 81.2,
            studentTeacherRatio: 23.1,
            revenuePerPupil: 16842,
            expenditurePerPupil: 15903,
          },
        ],
      }),
    } as Response)

    render(<CompareContent />)

    const select = screen.getByLabelText('Add a district')
    await userEvent.selectOptions(select, '0600001')
    await userEvent.click(screen.getByText('Add'))

    await waitFor(() => {
      expect(screen.getAllByText('Los Angeles Unified').length).toBeGreaterThanOrEqual(1)
    })

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ districts: [] }),
    } as Response)

    const removeBtn = screen.getByLabelText('Remove Los Angeles Unified')
    await userEvent.click(removeBtn)

    await waitFor(() => {
      expect(
        screen.getByText('Select districts above to start comparing.')
      ).toBeInTheDocument()
    })
  })
})
