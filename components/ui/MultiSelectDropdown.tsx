'use client'

import { useState, useRef, useEffect } from 'react'

interface MultiSelectItem {
  value: string
  label: string
  group?: string
}

interface MultiSelectDropdownProps {
  items: MultiSelectItem[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
}

export default function MultiSelectDropdown({
  items,
  selectedValues,
  onChange,
  placeholder = 'Tanlang...',
  label,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  const removeValue = (value: string) => {
    onChange(selectedValues.filter(v => v !== value))
  }

  const filtered = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase())
  )

  // Group items if they have group property
  const grouped = filtered.reduce<Record<string, MultiSelectItem[]>>((acc, item) => {
    const key = item.group || ''
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 cursor-pointer flex items-center flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-[#00a6a6]"
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500 text-sm">{placeholder}</span>
        ) : (
          selectedValues.map(val => {
            const item = items.find(i => i.value === val)
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00a6a6]/10 text-[#00a6a6] dark:bg-[#00a6a6]/20 dark:text-[#33cccc] text-xs rounded-lg font-medium"
              >
                {item?.label || val}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeValue(val) }}
                  className="hover:text-red-500 transition-colors ml-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )
          })
        )}
        <svg
          className={`w-4 h-4 text-gray-400 ml-auto shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qidirish..."
              className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-1 focus:ring-[#00a6a6] text-gray-900 dark:text-white"
              autoFocus
            />
          </div>

          {/* Items */}
          <div className="overflow-y-auto max-h-48 p-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400 text-center">Topilmadi</div>
            ) : (
              Object.entries(grouped).map(([group, groupItems]) => (
                <div key={group}>
                  {group && (
                    <div className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {group}
                    </div>
                  )}
                  {groupItems.map(item => {
                    const isSelected = selectedValues.includes(item.value)
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => toggleValue(item.value)}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-[#00a6a6]/10 text-[#00a6a6] dark:text-[#33cccc]'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#00a6a6] border-[#00a6a6]'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate text-left">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {selectedValues.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-1.5 flex items-center justify-between">
              <span className="text-xs text-gray-400">{selectedValues.length} ta tanlangan</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Tozalash
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
