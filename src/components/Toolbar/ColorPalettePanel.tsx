import React, { useId } from 'react'
import type { ColorPalette } from '@/types/resume'
import { ACCENT_COLORS } from '@/constants/themes'

interface Props {
  palette: ColorPalette
  onChange: (palette: ColorPalette) => void
}

interface ColorRowProps {
  label: string
  value: string
  fieldKey: keyof ColorPalette
  onChange: (key: keyof ColorPalette, value: string) => void
  showPresets?: boolean
  onPresetClick?: (hex: string) => void
}

function ColorRow({ label, value, fieldKey, onChange, showPresets, onPresetClick }: ColorRowProps) {
  const inputId = useId()

  // Normalise: color input requires a valid hex (exactly 7 chars starting with #)
  // If value is empty we show a placeholder color (#000000) but keep the stored value empty
  const displayValue = value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={inputId} className="text-xs text-gray-500 w-20 shrink-0">{label}</label>
      <input
        id={inputId}
        type="color"
        value={displayValue}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border border-gray-300 p-0.5 bg-white"
        title={`Pick ${label.toLowerCase()} color`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          const v = e.target.value.trim()
          onChange(fieldKey, v)
        }}
        placeholder="theme default"
        maxLength={7}
        className="w-24 text-xs border border-gray-200 rounded px-1.5 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-teal-400"
        spellCheck={false}
      />
      {showPresets && onPresetClick && (
        <div className="flex items-center gap-1 ml-1">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => onPresetClick(color.hex)}
              title={color.label}
              aria-label={`Preset: ${color.label}`}
              className="w-4 h-4 rounded-full border border-white ring-1 ring-gray-300 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-teal-400"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ColorPalettePanel({ palette, onChange }: Props) {
  function update(key: keyof ColorPalette, value: string) {
    onChange({ ...palette, [key]: value })
  }

  function handleReset() {
    onChange({ accentColor: '#0d9488', headingColor: '', bodyColor: '', subtitleColor: '', contactColor: '', headerTextColor: '' })
  }

  return (
    <div className="flex flex-col gap-1.5" role="group" aria-label="Color palette">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-medium text-gray-600">Colors</span>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-teal-600 hover:underline transition-colors"
        >
          Reset
        </button>
      </div>
      <ColorRow
        label="Accent"
        value={palette.accentColor}
        fieldKey="accentColor"
        onChange={update}
        showPresets
        onPresetClick={(hex) => update('accentColor', hex)}
      />
      <ColorRow
        label="Headings"
        value={palette.headingColor}
        fieldKey="headingColor"
        onChange={update}
      />
      <ColorRow
        label="Body text"
        value={palette.bodyColor}
        fieldKey="bodyColor"
        onChange={update}
      />
      <ColorRow
        label="Dates / roles"
        value={palette.subtitleColor}
        fieldKey="subtitleColor"
        onChange={update}
      />
      <ColorRow
        label="Contact"
        value={palette.contactColor}
        fieldKey="contactColor"
        onChange={update}
      />
      <ColorRow
        label="Header text"
        value={palette.headerTextColor}
        fieldKey="headerTextColor"
        onChange={update}
      />
    </div>
  )
}
