'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import type { CommunityType } from '@/types/community'
import { cn } from '@/lib/cn'

interface FilterBarProps {
  provinces: string[]
  cities: string[]
  onSearch: (term: string) => void
  onFilterType: (types: CommunityType[]) => void
  onFilterProvince: (province: string | null) => void
  activeTypes: CommunityType[]
  activeProvince: string | null
}

const typeOptions: { value: CommunityType; label: string }[] = [
  { value: 'coliving', label: '共居' },
  { value: 'coworking', label: '共享办公' },
  { value: 'opc', label: '创作社区' },
  { value: 'hybrid', label: '综合' },
]

export default function FilterBar({
  provinces,
  onSearch,
  onFilterType,
  onFilterProvince,
  activeTypes,
  activeProvince,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const hasActiveFilters = activeTypes.length > 0 || activeProvince !== null

  return (
    <div className="space-y-2">
      {/* 搜索行 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="搜索社区名称、城市..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md',
            showFilters || hasActiveFilters
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* 展开的筛选面板 */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3 animate-in slide-in-from-top-1">
          {/* 类型 */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">类型</p>
            <div className="flex flex-wrap gap-1.5">
              {typeOptions.map((opt) => {
                const isActive = activeTypes.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (isActive) {
                        onFilterType(activeTypes.filter((t) => t !== opt.value))
                      } else {
                        onFilterType([...activeTypes, opt.value])
                      }
                    }}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 省份 */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">省份</p>
            <div className="flex flex-wrap gap-1.5">
              {provinces.map((prov) => {
                const isActive = activeProvince === prov
                return (
                  <button
                    key={prov}
                    onClick={() =>
                      onFilterProvince(isActive ? null : prov)
                    }
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {prov}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 清除全部 */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                onFilterType([])
                onFilterProvince(null)
              }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <X className="h-3 w-3" />
              清除全部筛选
            </button>
          )}
        </div>
      )}
    </div>
  )
}