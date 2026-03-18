import React from 'react'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import type { ReferenceEntry } from '@/types/resume'

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
  entries: ReferenceEntry[]
  referencesOnRequest: boolean
  onAdd: () => void
  onUpdate: (id: string, field: keyof ReferenceEntry, value: string) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
  onToggleOnRequest: (value: boolean) => void
}

export function ReferencesSection({
  entries,
  referencesOnRequest,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
  onToggleOnRequest,
}: Props) {
  return (
    <section aria-label="References">
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          References
          {entries.length > 0 && !referencesOnRequest && (
            <span className="ml-1.5 text-xs font-normal text-gray-400">({entries.length})</span>
          )}
        </h3>
        {!referencesOnRequest && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs text-teal-600 hover:text-teal-800 font-medium focus:outline-none focus:underline"
          >
            + Add
          </button>
        )}
      </div>

      <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={referencesOnRequest}
          onChange={(e) => onToggleOnRequest(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
        />
        <span className="text-xs text-gray-600">Show "References available upon request"</span>
      </label>

      {referencesOnRequest ? (
        <p className="text-xs text-gray-500 italic py-1">
          The preview will show: <em>References available upon request</em>
        </p>
      ) : (
        <>
          {entries.length === 0 && (
            <p className="text-xs text-gray-400 italic py-2">No references added yet.</p>
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
                    <IconButton aria-label={`Remove reference ${idx + 1}`} onClick={() => onRemove(entry.id)} variant="danger"><XIcon /></IconButton>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <FormField
                        id={`ref-name-${entry.id}`}
                        label="Name"
                        value={entry.name}
                        onChange={(v) => onUpdate(entry.id, 'name', v)}
                        placeholder="Michael Torres"
                      />
                    </div>
                    <FormField
                      id={`ref-title-${entry.id}`}
                      label="Job Title"
                      value={entry.jobTitle}
                      onChange={(v) => onUpdate(entry.id, 'jobTitle', v)}
                      placeholder="VP of Product"
                    />
                    <FormField
                      id={`ref-company-${entry.id}`}
                      label="Company"
                      value={entry.company}
                      onChange={(v) => onUpdate(entry.id, 'company', v)}
                      placeholder="Acme Corp"
                    />
                    <FormField
                      id={`ref-email-${entry.id}`}
                      label="Email"
                      value={entry.email}
                      onChange={(v) => onUpdate(entry.id, 'email', v)}
                      type="email"
                      placeholder="m.torres@acme.com"
                    />
                    <FormField
                      id={`ref-phone-${entry.id}`}
                      label="Phone"
                      value={entry.phone}
                      onChange={(v) => onUpdate(entry.id, 'phone', v)}
                      type="tel"
                      placeholder="+1 555 0199"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {entries.length > 0 && (
            <button
              type="button"
              onClick={onAdd}
              className="mt-4 w-full py-2 text-xs font-medium text-teal-600 border border-dashed border-teal-300 rounded-md hover:bg-teal-50 hover:border-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300"
            >
              + Add Another Reference
            </button>
          )}
        </>
      )}
    </section>
  )
}
