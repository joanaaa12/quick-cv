import type { StorageEnvelope, ResumeData, ThemeId, AccentColor, LayoutSettings, TemplateColumns, TemplateStyle } from '@/types/resume'

const STORAGE_KEY = 'resume-builder-v1'
const CURRENT_VERSION = 1

export const DEFAULT_LAYOUT: LayoutSettings = {
  sectionOrder: ['summary', 'work', 'education', 'skills', 'projects', 'certifications', 'references'],
  photoPosition: 'left',
  colorPalette: {
    accentColor: '#0d9488',
    headingColor: '',
    bodyColor: '',
    subtitleColor: '',
    contactColor: '',
    headerTextColor: '',
  },
}

// Ensure data loaded from storage has all fields, even if saved before
// newer fields (certifications, references, referencesOnRequest, skill items) were added.
function migrateResumeData(data: ResumeData): ResumeData {
  return {
    ...data,
    personal: { ...data.personal, photo: data.personal.photo ?? '' },
    skills: (data.skills ?? []).map((s) => ({ ...s, items: s.items ?? [] })),
    certifications: data.certifications ?? [],
    references: data.references ?? [],
    referencesOnRequest: data.referencesOnRequest ?? false,
  }
}

function migrateLayoutSettings(settings: LayoutSettings | undefined): LayoutSettings {
  if (!settings) return { ...DEFAULT_LAYOUT, colorPalette: { ...DEFAULT_LAYOUT.colorPalette } }
  return {
    sectionOrder: settings.sectionOrder ?? DEFAULT_LAYOUT.sectionOrder,
    photoPosition: settings.photoPosition ?? DEFAULT_LAYOUT.photoPosition,
    colorPalette: {
      accentColor: settings.colorPalette?.accentColor ?? DEFAULT_LAYOUT.colorPalette.accentColor,
      headingColor: settings.colorPalette?.headingColor ?? '',
      bodyColor: settings.colorPalette?.bodyColor ?? '',
      subtitleColor: settings.colorPalette?.subtitleColor ?? '',
      contactColor: settings.colorPalette?.contactColor ?? '',
      headerTextColor: settings.colorPalette?.headerTextColor ?? '',
    },
  }
}

export function saveToStorage(
  data: ResumeData,
  themeId: ThemeId,
  accentColor: AccentColor,
  layoutSettings: LayoutSettings,
  templateColumns?: TemplateColumns,
  templateStyle?: TemplateStyle,
): void {
  const envelope: StorageEnvelope = {
    version: CURRENT_VERSION,
    savedAt: new Date().toISOString(),
    data,
    themeId,
    accentColor,
    layoutSettings,
    templateColumns,
    templateStyle,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope))
  } catch {
    // Storage quota exceeded — silently skip
  }
}

export function loadFromStorage(): StorageEnvelope | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const envelope = JSON.parse(raw) as StorageEnvelope
    if (envelope.version !== CURRENT_VERSION) return null
    return {
      ...envelope,
      data: migrateResumeData(envelope.data),
      layoutSettings: migrateLayoutSettings(envelope.layoutSettings),
    }
  } catch {
    return null
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
