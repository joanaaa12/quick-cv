import React from 'react'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import type { EducationEntry } from '@/types/resume'

const ChevronUp = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)
const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

interface Props {
  entries: EducationEntry[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof EducationEntry, value: string) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}

export function EducationSection({ entries, onAdd, onUpdate, onRemove, onReorder }: Props) {
  return (
    <section aria-label="Education">
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Education</h3>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-teal-600 hover:text-teal-800 font-medium focus:outline-none focus:underline"
        >
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic py-2">No education added yet.</p>
      )}

      <div className="flex flex-col gap-5">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="relative pl-3 border-l-2 border-gray-200">
            <div className="absolute -left-[1px] top-0 flex flex-col gap-0.5">
              <IconButton aria-label="Move up" onClick={() => onReorder(entry.id, 'up')} disabled={idx === 0}><ChevronUp /></IconButton>
              <IconButton aria-label="Move down" onClick={() => onReorder(entry.id, 'down')} disabled={idx === entries.length - 1}><ChevronDown /></IconButton>
            </div>

            <div className="flex flex-col gap-2 pl-6">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-medium">Entry {idx + 1}</span>
                <IconButton aria-label={`Remove education entry ${idx + 1}`} onClick={() => onRemove(entry.id)} variant="danger"><XIcon /></IconButton>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <FormField
                    id={`edu-institution-${entry.id}`}
                    label="Institution"
                    value={entry.institution}
                    onChange={(v) => onUpdate(entry.id, 'institution', v)}
                    placeholder="University of California, Berkeley"
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    id={`edu-degree-${entry.id}`}
                    label="Degree / Field"
                    value={entry.degree}
                    onChange={(v) => onUpdate(entry.id, 'degree', v)}
                    placeholder="B.S. Computer Science"
                  />
                </div>
                <FormField
                  id={`edu-start-${entry.id}`}
                  label="Start Year"
                  value={entry.startYear}
                  onChange={(v) => onUpdate(entry.id, 'startYear', v)}
                  placeholder="2015"
                />
                <FormField
                  id={`edu-end-${entry.id}`}
                  label="End Year"
                  value={entry.endYear}
                  onChange={(v) => onUpdate(entry.id, 'endYear', v)}
                  placeholder="2019"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
