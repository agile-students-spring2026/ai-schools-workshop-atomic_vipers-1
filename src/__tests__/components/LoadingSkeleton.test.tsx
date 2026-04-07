import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders default 6 skeleton items', () => {
    render(<LoadingSkeleton />)
    const container = screen.getByRole('status')
    expect(container.children.length).toBe(6)
  })

  it('renders custom count of skeleton items', () => {
    render(<LoadingSkeleton count={3} />)
    const container = screen.getByRole('status')
    expect(container.children.length).toBe(3)
  })

  it('has loading aria-label', () => {
    render(<LoadingSkeleton />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })
})
