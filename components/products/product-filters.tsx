import { useState, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchBar } from '@/components/ui/search-bar'
import { useProductStore } from '@/stores/product.store'
import { Category } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface ProductFiltersProps {
  categories: Category[]
  isLoading?: boolean
  onFilterChange?: () => void
}

export function ProductFilters({ categories, isLoading, onFilterChange }: ProductFiltersProps) {
  const {
    filters,
    searchQuery,
    selectedCategory,
    priceRange,
    setSearchQuery,
    setSelectedCategory,
    setPriceRange,
    clearFilters
  } = useProductStore()

  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tempPriceRange[0] !== priceRange[0] || tempPriceRange[1] !== priceRange[1]) {
        setPriceRange(tempPriceRange)
        onFilterChange?.()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [tempPriceRange, priceRange, setPriceRange, onFilterChange])

  const handleCategoryChange = (categoryId: string) => {
    const id = categoryId === 'all' ? null : parseInt(categoryId)
    setSelectedCategory(id)
    onFilterChange?.()
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onFilterChange?.()
  }

  const handleClearFilters = () => {
    clearFilters()
    setTempPriceRange([0, 10000000])
    onFilterChange?.()
  }

  const hasActiveFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 10000000

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearchChange}
            defaultValue={searchQuery}
            placeholder="Search products..."
          />
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={selectedCategory?.toString() || 'all'}
            onValueChange={handleCategoryChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={tempPriceRange}
              onValueChange={(value) => setTempPriceRange(value as [number, number])}
              max={10000000}
              min={0}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(tempPriceRange[0])}</span>
              <span>{formatPrice(tempPriceRange[1])}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchQuery}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleCategoryChange('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => {
                  setTempPriceRange([0, 10000000])
                  setPriceRange([0, 10000000])
                  onFilterChange?.()
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}