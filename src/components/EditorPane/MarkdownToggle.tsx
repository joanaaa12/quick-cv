import React from 'react'
import type { EditorMode } from '@/types/resume'

interface Props {
  mode: EditorMode
  onChange: (mode: EditorMode) => void
}

export function MarkdownToggle({ mode, onChange }: Props) {
  const isRaw = mode === 'raw'

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Form</span>
      <button
        type="button"
        role="switch"
        aria-checked={isRaw}
        aria-label="Toggle Markdown editor"
        onClick={() => onChange(isRaw ? 'form' : 'raw')}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 ${
          isRaw ? 'bg-teal-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
            isRaw ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      <span className="text-xs text-gray-500">Markdown</span>
    </div>
  )
}
