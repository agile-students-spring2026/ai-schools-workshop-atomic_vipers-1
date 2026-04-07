import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from '@/components/ui/ErrorMessage'

describe('ErrorMessage', () => {
  it('renders default title and message', () => {
    render(<ErrorMessage message="Something failed" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })

  it('renders custom title', () => {
    render(
      <ErrorMessage title="Error" message="Bad request" />
    )
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders retry button when onRetry provided', () => {
    render(
      <ErrorMessage message="Failed" onRetry={vi.fn()} />
    )
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('does not render retry button without onRetry', () => {
    render(<ErrorMessage message="Failed" />)
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
  })

  it('calls onRetry when button is clicked', async () => {
    const onRetry = vi.fn()
    render(<ErrorMessage message="Failed" onRetry={onRetry} />)
    await userEvent.click(screen.getByText('Try Again'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('has alert role for accessibility', () => {
    render(<ErrorMessage message="Error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
