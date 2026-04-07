'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialQuery?: string
  placeholder?: string
}

export default function SearchBar({
  onSearch,
  initialQuery = '',
  placeholder = 'Search by district name, city, or state...',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-24 text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          aria-label="Search districts"
        />
        <button
          type="submit"
          className="absolute right-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Search
        </button>
      </div>
    </form>
  )
}
