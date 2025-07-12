import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  defaultValue?: string
  debounceMs?: number
}

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search products...', 
  defaultValue = '',
  debounceMs = 300 
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}