import React from 'react'
import { FormField } from '@/components/shared/FormField'
import { IconButton } from '@/components/shared/IconButton'
import type { CertificationEntry } from '@/types/resume'

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
  entries: CertificationEntry[]
  onAdd: () => void
  onUpdate: (id: string, field: keyof CertificationEntry, value: string) => void
  onRemove: (id: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
}

export function CertificationsSection({ entries, onAdd, onUpdate, onRemove, onReorder }: Props) {
  return (
    <section aria-label="Certifications">
      <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Certifications
          {entries.length > 0 && (
            <span className="ml-1.5 text-xs font-normal text-gray-400">({entries.length})</span>
          )}
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs text-teal-600 hover:text-teal-800 font-medium focus:outline-none focus:underline"
        >
          + Add
        </button>
      </div>

      {entries.length === 0 && (
        <p className="text-xs text-gray-400 italic py-2">No certifications added yet.</p>
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
                <IconButton aria-label={`Remove certification ${idx + 1}`} onClick={() => onRemove(entry.id)} variant="danger"><XIcon /></IconButton>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <FormField
                    id={`cert-name-${entry.id}`}
                    label="Certificate Name"
                    value={entry.name}
                    onChange={(v) => onUpdate(entry.id, 'name', v)}
                    placeholder="Google UX Design Certificate"
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    id={`cert-issuer-${entry.id}`}
                    label="Issuer"
                    value={entry.issuer}
                    onChange={(v) => onUpdate(entry.id, 'issuer', v)}
                    placeholder="Google / Coursera"
                  />
                </div>
                <FormField
                  id={`cert-issue-${entry.id}`}
                  label="Issue Date"
                  value={entry.issueDate}
                  onChange={(v) => onUpdate(entry.id, 'issueDate', v)}
                  placeholder="Mar 2022"
                />
                <FormField
                  id={`cert-expiry-${entry.id}`}
                  label="Expiry Date (optional)"
                  value={entry.expiryDate}
                  onChange={(v) => onUpdate(entry.id, 'expiryDate', v)}
                  placeholder="Leave blank if none"
                />
                <div className="col-span-2">
                  <FormField
                    id={`cert-url-${entry.id}`}
                    label="Credential URL (optional)"
                    value={entry.credentialUrl}
                    onChange={(v) => onUpdate(entry.id, 'credentialUrl', v)}
                    type="url"
                    placeholder="coursera.org/verify/abc123"
                  />
                </div>
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
          + Add Another Certification
        </button>
      )}
    </section>
  )
}
