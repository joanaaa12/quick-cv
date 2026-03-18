import React, { useState } from 'react'
import type { SectionKey } from '@/types/resume'

const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Summary',
  work: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  references: 'References',
}

interface Props {
  order: SectionKey[]
  onChange: (order: SectionKey[]) => void
}

export function SectionOrderPanel({ order, onChange }: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, idx: number) {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
    // Store index as text so the drop handler can read it
    e.dataTransfer.setData('text/plain', String(idx))
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIdx(idx)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dropIdx: number) {
    e.preventDefault()
    const fromIdx = dragIdx ?? Number(e.dataTransfer.getData('text/plain'))
    if (fromIdx === dropIdx || isNaN(fromIdx)) return

    const newOrder = [...order]
    const [moved] = newOrder.splice(fromIdx, 1)
    newOrder.splice(dropIdx, 0, moved)
    onChange(newOrder)
    setDragIdx(null)
    setOverIdx(null)
  }

  function handleDragEnd() {
    setDragIdx(null)
    setOverIdx(null)
  }

  function handleDragLeave() {
    setOverIdx(null)
  }

  return (
    <section aria-label="Section order">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-200">
        Section Order
      </h3>
      <p className="text-xs text-gray-400 mb-2">Drag rows to reorder sections in the resume.</p>
      <div className="flex flex-col gap-1" role="list">
        {order.map((key, idx) => {
          const isDragging = dragIdx === idx
          const isOver = overIdx === idx && dragIdx !== idx
          return (
            <div
              key={key}
              role="listitem"
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              aria-label={`${SECTION_LABELS[key]}, position ${idx + 1} of ${order.length}`}
              className={[
                'flex items-center gap-2 px-3 py-2 rounded border text-sm select-none cursor-grab active:cursor-grabbing transition-colors',
                isDragging
                  ? 'opacity-40 border-teal-400 bg-teal-50'
                  : isOver
                  ? 'border-teal-500 bg-teal-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
              ].join(' ')}
            >
              {/* Drag handle icon */}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-gray-400 shrink-0"
                aria-hidden="true"
              >
                <circle cx="4" cy="2.5" r="1" fill="currentColor" />
                <circle cx="8" cy="2.5" r="1" fill="currentColor" />
                <circle cx="4" cy="6" r="1" fill="currentColor" />
                <circle cx="8" cy="6" r="1" fill="currentColor" />
                <circle cx="4" cy="9.5" r="1" fill="currentColor" />
                <circle cx="8" cy="9.5" r="1" fill="currentColor" />
              </svg>
              <span className="text-gray-700">{SECTION_LABELS[key]}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
