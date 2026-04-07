import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '@/components/SearchBar'

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(
      screen.getByPlaceholderText(
        'Search by district name, city, or state...'
      )
    ).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Find a school" />)
    expect(screen.getByPlaceholderText('Find a school')).toBeInTheDocument()
  })

  it('renders with initial query', () => {
    render(<SearchBar onSearch={vi.fn()} initialQuery="Boston" />)
    expect(screen.getByDisplayValue('Boston')).toBeInTheDocument()
  })

  it('calls onSearch with trimmed query on submit', async () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByLabelText('Search districts')
    await userEvent.type(input, '  Chicago  ')
    fireEvent.submit(screen.getByRole('search'))

    expect(onSearch).toHaveBeenCalledWith('Chicago')
  })

  it('calls onSearch on button click', async () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByLabelText('Search districts')
    await userEvent.type(input, 'Denver')
    await userEvent.click(screen.getByText('Search'))

    expect(onSearch).toHaveBeenCalledWith('Denver')
  })

  it('has a search role for accessibility', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByRole('search')).toBeInTheDocument()
  })
})
