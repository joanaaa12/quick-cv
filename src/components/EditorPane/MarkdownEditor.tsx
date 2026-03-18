import React, { useState, useEffect } from 'react'
import type { ResumeData } from '@/types/resume'
import { serialize, parse } from '@/utils/markdown'

interface Props {
  resume: ResumeData
  onUpdate: (data: ResumeData) => void
}

export function MarkdownEditor({ resume, onUpdate }: Props) {
  const [raw, setRaw] = useState(() => serialize(resume))
  const [parseError, setParseError] = useState(false)

  // Sync from external resume changes (e.g., first load) to raw
  // Only update if the serialized form differs — avoids overwriting in-progress edits
  useEffect(() => {
    const serialized = serialize(resume)
    if (raw !== serialized) {
      setRaw(serialized)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(value: string) {
    setRaw(value)
    try {
      const parsed = parse(value)
      onUpdate(parsed)
      setParseError(false)
    } catch {
      setParseError(true)
    }
  }

  return (
    <div className="flex flex-col h-full gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Edit raw Markdown — changes sync back to the form</span>
        {parseError && (
          <span className="text-xs text-red-500">Parse error — check your Markdown syntax</span>
        )}
      </div>
      <textarea
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Markdown editor"
        spellCheck={false}
        className="flex-1 w-full font-mono text-sm p-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none min-h-[400px]"
      />
    </div>
  )
}
