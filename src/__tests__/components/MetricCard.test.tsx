import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MetricCard from '@/components/MetricCard'

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Enrollment" value="50,000" />)
    expect(screen.getByText('Enrollment')).toBeInTheDocument()
    expect(screen.getByText('50,000')).toBeInTheDocument()
  })

  it('applies default text color', () => {
    render(<MetricCard label="Test" value="100" />)
    const valueEl = screen.getByText('100')
    expect(valueEl.className).toContain('text-gray-900')
  })

  it('applies custom color class', () => {
    render(
      <MetricCard label="Rate" value="90%" colorClass="text-green-600" />
    )
    const valueEl = screen.getByText('90%')
    expect(valueEl.className).toContain('text-green-600')
  })
})
