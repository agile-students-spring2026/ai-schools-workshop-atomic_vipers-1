import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import FinanceChart, { formatFinanceTooltip } from '@/components/Charts/FinanceChart'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  }
})

describe('FinanceChart', () => {
  it('renders chart container when data provided', () => {
    render(
      <FinanceChart
        data={[{ name: 'Test', revenue: 15000, expenditure: 14000 }]}
      />
    )
    expect(screen.getByTestId('finance-chart')).toBeInTheDocument()
  })

  it('renders empty message when no data', () => {
    render(<FinanceChart data={[]} />)
    expect(screen.getByText('No data available.')).toBeInTheDocument()
  })
})

describe('formatFinanceTooltip', () => {
  it('formats value as currency', () => {
    expect(formatFinanceTooltip(15000)).toEqual(['$15,000', ''])
    expect(formatFinanceTooltip(0)).toEqual(['$0', ''])
  })
})
