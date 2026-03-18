import React from 'react'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import type { ProjectEntry } from '@/types/resume'

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
  entries: ProjectEntry[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof ProjectEntry, value: string) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}

export function ProjectsSection({ entries, onAdd, onUpdate, onRemove, onReorder }: Props) {
  return (
    <section aria-label="Projects">
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Projects</h3>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-teal-600 hover:text-teal-800 font-medium focus:outline-none focus:underline"
        >
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic py-2">No projects added yet.</p>
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
                <IconButton aria-label={`Remove project ${idx + 1}`} onClick={() => onRemove(entry.id)} variant="danger"><XIcon /></IconButton>
              </div>

              <FormField
                id={`proj-name-${entry.id}`}
                label="Project Name"
                value={entry.name}
                onChange={(v) => onUpdate(entry.id, 'name', v)}
                placeholder="Portfolio Site"
              />
              <FormField
                id={`proj-desc-${entry.id}`}
                label="Description"
                value={entry.description}
                onChange={(v) => onUpdate(entry.id, 'description', v)}
                placeholder="Personal design + dev showcase."
                multiline
                rows={2}
              />
              <FormField
                id={`proj-url-${entry.id}`}
                label="URL (optional)"
                value={entry.url}
                onChange={(v) => onUpdate(entry.id, 'url', v)}
                type="url"
                placeholder="https://janesmith.design"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
