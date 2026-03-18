import React from 'react'
import { ACCENT_COLORS } from '@/constants/themes'
import type { AccentColor } from '@/types/resume'

interface Props {
  accentColor: AccentColor
  onChange: (a: AccentColor) => void
}

export function AccentColorPicker({ accentColor, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Accent color selection">
      <span className="text-xs text-gray-500 mr-1">Accent:</span>
      {ACCENT_COLORS.map((color) => (
        <button
          key={color.id}
          type="button"
          onClick={() => onChange(color.id)}
          aria-label={`${color.label} accent color`}
          aria-pressed={accentColor === color.id}
          title={color.label}
          className="w-5 h-5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 transition-transform hover:scale-110"
          style={{
            backgroundColor: color.hex,
            outline: accentColor === color.id ? `2px solid ${color.hex}` : 'none',
            outlineOffset: '2px',
          }}
        />
      ))}
    </div>
  )
}
