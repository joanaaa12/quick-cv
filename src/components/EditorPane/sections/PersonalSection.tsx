import React, { useRef } from 'react'
import { FormField } from '@/components/shared/FormField'
import type { PersonalInfo, PhotoPosition } from '@/types/resume'

interface Props {
  data: PersonalInfo
  onChange: (field: keyof PersonalInfo, value: string) => void
  photoPosition: PhotoPosition
  onPhotoPositionChange: (pos: PhotoPosition) => void
  templateColumns?: number
}

const PHOTO_POSITIONS: { value: PhotoPosition; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'hidden', label: 'Hidden' },
]

export function PersonalSection({ data, onChange, photoPosition, onPhotoPositionChange, templateColumns }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onChange('photo', reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <section aria-label="Personal details">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b border-gray-200">
        Personal Details
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
            title="Upload photo"
          >
            {data.photo ? (
              <img src={data.photo} alt="Headshot" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400 text-center leading-tight px-1">Add<br/>Photo</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="text-xs text-teal-600 hover:underline text-left"
              onClick={() => fileInputRef.current?.click()}
            >
              {data.photo ? 'Change photo' : 'Upload photo'}
            </button>
            {data.photo && (
              <button
                type="button"
                className="text-xs text-red-500 hover:underline text-left"
                onClick={() => onChange('photo', '')}
              >
                Remove
              </button>
            )}
            <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        {/* Photo position toggle */}
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-xs text-gray-500 w-20 shrink-0">Photo pos.</span>
          <div className="flex gap-1" role="group" aria-label="Photo position">
            {PHOTO_POSITIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onPhotoPositionChange(value)}
                aria-pressed={photoPosition === value}
                disabled={(value !== 'hidden' && !data.photo) || (value === 'right' && templateColumns === 2)}
                className={[
                  'text-xs px-2 py-1 rounded border transition-colors',
                  photoPosition === value
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-teal-400',
                  (value !== 'hidden' && !data.photo) || (value === 'right' && templateColumns === 2) ? 'opacity-40 cursor-not-allowed' : '',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <FormField
            id="personal-name"
            label="Full Name"
            value={data.name}
            onChange={(v) => onChange('name', v)}
            placeholder="Jane Smith"
            required
          />
        </div>
        <FormField
          id="personal-title"
          label="Professional Title"
          value={data.title}
          onChange={(v) => onChange('title', v)}
          placeholder="Senior Product Designer"
        />
        <FormField
          id="personal-email"
          label="Email"
          value={data.email}
          onChange={(v) => onChange('email', v)}
          type="email"
          placeholder="jane@example.com"
        />
        <FormField
          id="personal-phone"
          label="Phone"
          value={data.phone}
          onChange={(v) => {
            // Format as PH mobile: +63 XXX XXX XXXX
            const digits = v.replace(/\D/g, '')
            let formatted = v
            if (digits.length <= 12) {
              if (digits.startsWith('63')) {
                const local = digits.slice(2)
                formatted = '+63' + (local.length ? ' ' + local.slice(0, 3) : '') + (local.length > 3 ? ' ' + local.slice(3, 6) : '') + (local.length > 6 ? ' ' + local.slice(6, 10) : '')
              } else if (digits.startsWith('0')) {
                const local = digits.slice(1)
                formatted = '0' + local.slice(0, 3) + (local.length > 3 ? ' ' + local.slice(3, 6) : '') + (local.length > 6 ? ' ' + local.slice(6, 10) : '')
              } else {
                formatted = v
              }
            }
            onChange('phone', formatted)
          }}
          type="tel"
          placeholder="+63 912 345 6789"
        />
        <FormField
          id="personal-location"
          label="Location"
          value={data.location}
          onChange={(v) => onChange('location', v)}
          placeholder="San Francisco, CA"
        />
        <FormField
          id="personal-linkedin"
          label="LinkedIn"
          value={data.linkedin}
          onChange={(v) => onChange('linkedin', v)}
          placeholder="linkedin.com/in/janesmith"
        />
        <FormField
          id="personal-github"
          label="GitHub"
          value={data.github}
          onChange={(v) => onChange('github', v)}
          placeholder="github.com/janesmith"
        />
        <div className="col-span-2">
          <FormField
            id="personal-summary"
            label="Summary / Bio"
            value={data.summary}
            onChange={(v) => onChange('summary', v)}
            placeholder="Two sentences about what you do and what you're looking for."
            multiline
            rows={3}
          />
        </div>
      </div>
    </section>
  )
}
