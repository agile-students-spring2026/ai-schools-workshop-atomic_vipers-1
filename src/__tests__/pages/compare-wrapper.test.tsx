import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ComparePage from '@/app/compare/page'

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

describe('ComparePage (wrapper)', () => {
  it('renders CompareContent inside Suspense', () => {
    render(<ComparePage />)
    expect(
      screen.getByText('Compare School Districts')
    ).toBeInTheDocument()
  })
})
