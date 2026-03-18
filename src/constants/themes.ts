import type { AccentColor, ThemeId } from '@/types/resume'

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
]

export const ACCENT_COLORS: { id: AccentColor; label: string; hex: string }[] = [
  { id: 'teal', label: 'Teal', hex: '#0d9488' },
  { id: 'indigo', label: 'Indigo', hex: '#4f46e5' },
  { id: 'coral', label: 'Coral', hex: '#e05252' },
  { id: 'amber', label: 'Amber', hex: '#d97706' },
]
