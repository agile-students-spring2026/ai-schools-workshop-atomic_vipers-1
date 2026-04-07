import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

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

describe('RootLayout', () => {
  it('renders navbar with brand', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    expect(screen.getByText('SchoolScope')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Compare')).toBeInTheDocument()
  })

  it('renders footer with NCES attribution', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    expect(
      screen.getByText(/National Center for Education Statistics/)
    ).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <RootLayout>
        <div>Page Content</div>
      </RootLayout>
    )
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })
})
