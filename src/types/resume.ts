export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  summary: string
  photo: string  // base64 data URL or empty string
}

export interface WorkEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  bullets: string[]
}

export interface EducationEntry {
  id: string
  institution: string
  degree: string
  startYear: string
  endYear: string
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  url: string
}

export interface SkillGroup {
  id: string
  category: string
  items: string[]
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string     // empty string if no expiry
  credentialUrl: string  // empty string if none
}

export interface ReferenceEntry {
  id: string
  name: string
  jobTitle: string
  company: string
  email: string
  phone: string
}

export interface ResumeData {
  personal: PersonalInfo
  work: WorkEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  skills: SkillGroup[]
  certifications: CertificationEntry[]
  references: ReferenceEntry[]
  referencesOnRequest: boolean
}

export type ThemeId = 'classic' | 'modern'
export type AccentColor = 'teal' | 'indigo' | 'coral' | 'amber'
export type EditorMode = 'form' | 'raw'
export type TemplateStyle = 'traditional' | 'creative' | 'contemporary'
export type TemplateColumns = 1 | 2

export type PhotoPosition = 'left' | 'right' | 'hidden'
export type SectionKey = 'summary' | 'work' | 'education' | 'skills' | 'projects' | 'certifications' | 'references'

export interface ColorPalette {
  accentColor: string      // hex, e.g. '#0d9488'
  headingColor: string     // h1 and h2 color
  bodyColor: string        // body text
  subtitleColor: string    // dates, roles, secondary text
  contactColor: string     // contact lines
  headerTextColor: string  // name + contact in colored header band
}

export interface LayoutSettings {
  sectionOrder: SectionKey[]
  photoPosition: PhotoPosition
  colorPalette: ColorPalette
}

export interface TemplateConfig {
  id: string
  name: string
  style: TemplateStyle
  columns: TemplateColumns
  hasHeadshot: boolean
  theme: ThemeId
  accentColor?: AccentColor
  thumbnail: string
}

export interface StorageEnvelope {
  version: number
  savedAt: string
  data: ResumeData
  themeId: ThemeId
  accentColor: AccentColor
  layoutSettings?: LayoutSettings
  templateColumns?: TemplateColumns
  templateStyle?: TemplateStyle
}
