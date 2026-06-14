'use client'
import type { FilterConfig } from '@/types'

interface FilterBarProps {
  filters: FilterConfig[]
  selectedFilters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  onReset: () => void
}

export default function FilterBar({ filters, selectedFilters, onFilterChange, onReset }: FilterBarProps) {
  if (!filters.length) return null
  const hasActive = Object.values(selectedFilters).some(Boolean)

  return (
    <div className="overflow-x-auto scrollbar-none">
      <div className="flex gap-2 px-4 pb-2" style={{ minWidth: 'max-content' }}>
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={selectedFilters[filter.key] || ''}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="flex-shrink-0 bg-[#111111] border border-[#C9A84C]/20 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:border-[#C9A84C]/50 cursor-pointer"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}
        {hasActive && (
          <button
            onClick={onReset}
            className="flex-shrink-0 text-[#C9A84C] text-sm border border-[#C9A84C]/30 rounded-full px-4 py-2"
          >
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  )
}
