import React from 'react'
import { THEMES } from '@/constants/themes'
import type { ThemeId } from '@/types/resume'

interface Props {
  themeId: ThemeId
  onChange: (t: ThemeId) => void
}

export function ThemeSwitcher({ themeId, onChange }: Props) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Theme selection">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => onChange(theme.id)}
          aria-pressed={themeId === theme.id}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            themeId === theme.id
              ? 'bg-teal-700 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300'
          }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  )
}
