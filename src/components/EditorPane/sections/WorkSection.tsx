import React from 'react'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import type { WorkEntry } from '@/types/resume'

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
  entries: WorkEntry[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof WorkEntry, value: string | string[]) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}

export function WorkSection({ entries, onAdd, onUpdate, onRemove, onReorder }: Props) {
  return (
    <section aria-label="Work experience">
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Work Experience</h3>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-teal-600 hover:text-teal-800 font-medium focus:outline-none focus:underline"
        >
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic py-2">No work experience added yet.</p>
      )}

      <div className="flex flex-col gap-5">
        {entries.map((entry, idx) => (
          <div key={entry.id} className="relative pl-3 border-l-2 border-gray-200">
            <div className="absolute -left-[1px] top-0 flex flex-col gap-0.5">
              <IconButton
                aria-label="Move up"
                onClick={() => onReorder(entry.id, 'up')}
                disabled={idx === 0}
              >
                <ChevronUp />
              </IconButton>
              <IconButton
                aria-label="Move down"
                onClick={() => onReorder(entry.id, 'down')}
                disabled={idx === entries.length - 1}
              >
                <ChevronDown />
              </IconButton>
            </div>

            <div className="flex flex-col gap-2 pl-6">
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-400 font-medium">Entry {idx + 1}</span>
                <IconButton
                  aria-label={`Remove work entry ${idx + 1}`}
                  onClick={() => onRemove(entry.id)}
                  variant="danger"
                >
                  <XIcon />
                </IconButton>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  id={`work-company-${entry.id}`}
                  label="Company"
                  value={entry.company}
                  onChange={(v) => onUpdate(entry.id, 'company', v)}
                  placeholder="Acme Corp"
                />
                <FormField
                  id={`work-role-${entry.id}`}
                  label="Job Title"
                  value={entry.role}
                  onChange={(v) => onUpdate(entry.id, 'role', v)}
                  placeholder="Senior Designer"
                />
                <FormField
                  id={`work-start-${entry.id}`}
                  label="Start Date"
                  value={entry.startDate}
                  onChange={(v) => onUpdate(entry.id, 'startDate', v)}
                  placeholder="Jan 2022"
                />
                <FormField
                  id={`work-end-${entry.id}`}
                  label="End Date"
                  value={entry.endDate}
                  onChange={(v) => onUpdate(entry.id, 'endDate', v)}
                  placeholder="Present"
                />
              </div>

              <div>
                <label
                  htmlFor={`work-bullets-${entry.id}`}
                  className="text-xs font-medium text-gray-600 block mb-1"
                >
                  Bullet Points <span className="text-gray-400">(one per line)</span>
                </label>
                <textarea
                  id={`work-bullets-${entry.id}`}
                  value={entry.bullets.join('\n')}
                  onChange={(e) => onUpdate(entry.id, 'bullets', e.target.value.split('\n'))}
                  placeholder="- Led redesign of core onboarding flow&#10;- Managed a team of 3 designers"
                  rows={3}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
