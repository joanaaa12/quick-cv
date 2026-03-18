import React from 'react'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import type { SkillGroup } from '@/types/resume'

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
  entries: SkillGroup[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof SkillGroup, value: string | string[]) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}

export function SkillsSection({ entries, onAdd, onUpdate, onRemove, onReorder }: Props) {
  return (
    <section aria-label="Skills">
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-teal-600 hover:text-teal-800 font-medium focus:outline-none focus:underline"
        >
          + Add Group
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic py-2">No skills added yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="relative pl-3 border-l-2 border-gray-200">
            <div className="absolute -left-[1px] top-0 flex flex-col gap-0.5">
              <IconButton aria-label="Move up" onClick={() => onReorder(entry.id, 'up')} disabled={idx === 0}><ChevronUp /></IconButton>
              <IconButton aria-label="Move down" onClick={() => onReorder(entry.id, 'down')} disabled={idx === entries.length - 1}><ChevronDown /></IconButton>
            </div>

            <div className="flex gap-2 items-start pl-6">
              <div className="w-1/3">
                <FormField
                  id={`skill-cat-${entry.id}`}
                  label="Category"
                  value={entry.category}
                  onChange={(v) => onUpdate(entry.id, 'category', v)}
                  placeholder="Design"
                />
              </div>
              <div className="flex-1">
                <FormField
                  id={`skill-items-${entry.id}`}
                  label="Skills (comma-separated)"
                  value={entry.items.join(', ')}
                  onChange={(v) =>
                    onUpdate(
                      entry.id,
                      'items',
                      v.split(',').map((s) => s.trim()).filter(Boolean),
                    )
                  }
                  placeholder="Figma, Sketch, Prototyping"
                />
              </div>
              <div className="mt-5">
                <IconButton aria-label={`Remove skill group ${idx + 1}`} onClick={() => onRemove(entry.id)} variant="danger"><XIcon /></IconButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
