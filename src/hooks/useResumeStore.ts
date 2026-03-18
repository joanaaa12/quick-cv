import { useState, useEffect, useCallback } from 'react'
import type {
  ResumeData, ThemeId, AccentColor, EditorMode,
  WorkEntry, EducationEntry, ProjectEntry, SkillGroup,
  CertificationEntry, ReferenceEntry,
  LayoutSettings, PhotoPosition, SectionKey, ColorPalette,
  TemplateColumns, TemplateStyle,
} from '@/types/resume'
import { DEFAULT_RESUME, EMPTY_RESUME } from '@/constants/defaultResume'
import { saveToStorage, loadFromStorage, clearStorage, DEFAULT_LAYOUT } from '@/utils/storage'
import { useDebounce } from './useDebounce'

interface ResumeStore {
  resume: ResumeData
  themeId: ThemeId
  accentColor: AccentColor
  editorMode: EditorMode
  layoutSettings: LayoutSettings

  setResume: (data: ResumeData) => void
  updatePersonal: (field: keyof ResumeData['personal'], value: string) => void

  addWork: () => void
  updateWork: (id: string, field: keyof WorkEntry, value: string | string[]) => void
  removeWork: (id: string) => void
  reorderWork: (id: string, dir: 'up' | 'down') => void

  addEducation: () => void
  updateEducation: (id: string, field: keyof EducationEntry, value: string) => void
  removeEducation: (id: string) => void
  reorderEducation: (id: string, dir: 'up' | 'down') => void

  addProject: () => void
  updateProject: (id: string, field: keyof ProjectEntry, value: string) => void
  removeProject: (id: string) => void
  reorderProject: (id: string, dir: 'up' | 'down') => void

  addSkill: () => void
  updateSkill: (id: string, field: keyof SkillGroup, value: string | string[]) => void
  removeSkill: (id: string) => void
  reorderSkill: (id: string, dir: 'up' | 'down') => void

  addCertification: () => void
  updateCertification: (id: string, field: keyof CertificationEntry, value: string) => void
  removeCertification: (id: string) => void
  reorderCertification: (id: string, dir: 'up' | 'down') => void

  addReference: () => void
  updateReference: (id: string, field: keyof ReferenceEntry, value: string) => void
  removeReference: (id: string) => void
  reorderReference: (id: string, dir: 'up' | 'down') => void
  setReferencesOnRequest: (value: boolean) => void

  templateColumns: TemplateColumns
  templateStyle: TemplateStyle
  setTheme: (t: ThemeId) => void
  setAccentColor: (a: AccentColor) => void
  setEditorMode: (m: EditorMode) => void
  setLayoutSettings: (settings: LayoutSettings) => void
  setSectionOrder: (order: SectionKey[]) => void
  setPhotoPosition: (pos: PhotoPosition) => void
  setColorPalette: (palette: ColorPalette) => void
  setTemplateConfig: (columns: TemplateColumns, style: TemplateStyle) => void
  startOver: () => void
}

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function reorder<T>(arr: T[], id: string, dir: 'up' | 'down'): T[] {
  const idx = arr.findIndex((item: unknown) => (item as { id: string }).id === id)
  if (idx === -1) return arr
  const target = dir === 'up' ? idx - 1 : idx + 1
  if (target < 0 || target >= arr.length) return arr
  const result = [...arr]
  ;[result[idx], result[target]] = [result[target], result[idx]]
  return result
}

export function useResumeStore(): ResumeStore {
  const [resume, setResumeState] = useState<ResumeData>(() => {
    const saved = loadFromStorage()
    return saved?.data ?? DEFAULT_RESUME
  })
  const [themeId, setThemeId] = useState<ThemeId>(() => loadFromStorage()?.themeId ?? 'classic')
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => loadFromStorage()?.accentColor ?? 'teal')
  const [editorMode, setEditorModeState] = useState<EditorMode>('form')
  const [layoutSettings, setLayoutSettingsState] = useState<LayoutSettings>(() => {
    const saved = loadFromStorage()
    return saved?.layoutSettings ?? { ...DEFAULT_LAYOUT, colorPalette: { ...DEFAULT_LAYOUT.colorPalette } }
  })
  const [templateColumns, setTemplateColumnsState] = useState<TemplateColumns>(() => loadFromStorage()?.templateColumns ?? 1)
  const [templateStyle, setTemplateStyleState] = useState<TemplateStyle>(() => loadFromStorage()?.templateStyle ?? 'traditional')

  const debouncedResume = useDebounce(resume, 500)
  const debouncedTheme = useDebounce(themeId, 500)
  const debouncedAccent = useDebounce(accentColor, 500)
  const debouncedLayout = useDebounce(layoutSettings, 500)
  const debouncedColumns = useDebounce(templateColumns, 500)
  const debouncedStyle = useDebounce(templateStyle, 500)

  useEffect(() => {
    saveToStorage(debouncedResume, debouncedTheme, debouncedAccent, debouncedLayout, debouncedColumns, debouncedStyle)
  }, [debouncedResume, debouncedTheme, debouncedAccent, debouncedLayout, debouncedColumns, debouncedStyle])

  const setResume = useCallback((data: ResumeData) => setResumeState(data), [])
  const updatePersonal = useCallback((field: keyof ResumeData['personal'], value: string) => {
    setResumeState((prev) => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  }, [])

  // Work
  const addWork = useCallback(() => {
    const entry: WorkEntry = { id: newId(), company: '', role: '', startDate: '', endDate: '', bullets: [''] }
    setResumeState((prev) => ({ ...prev, work: [...prev.work, entry] }))
  }, [])
  const updateWork = useCallback((id: string, field: keyof WorkEntry, value: string | string[]) => {
    setResumeState((prev) => ({ ...prev, work: prev.work.map((e) => e.id === id ? { ...e, [field]: value } : e) }))
  }, [])
  const removeWork = useCallback((id: string) => {
    setResumeState((prev) => ({ ...prev, work: prev.work.filter((e) => e.id !== id) }))
  }, [])
  const reorderWork = useCallback((id: string, dir: 'up' | 'down') => {
    setResumeState((prev) => ({ ...prev, work: reorder(prev.work, id, dir) }))
  }, [])

  // Education
  const addEducation = useCallback(() => {
    const entry: EducationEntry = { id: newId(), institution: '', degree: '', startYear: '', endYear: '' }
    setResumeState((prev) => ({ ...prev, education: [...prev.education, entry] }))
  }, [])
  const updateEducation = useCallback((id: string, field: keyof EducationEntry, value: string) => {
    setResumeState((prev) => ({ ...prev, education: prev.education.map((e) => e.id === id ? { ...e, [field]: value } : e) }))
  }, [])
  const removeEducation = useCallback((id: string) => {
    setResumeState((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }))
  }, [])
  const reorderEducation = useCallback((id: string, dir: 'up' | 'down') => {
    setResumeState((prev) => ({ ...prev, education: reorder(prev.education, id, dir) }))
  }, [])

  // Projects
  const addProject = useCallback(() => {
    const entry: ProjectEntry = { id: newId(), name: '', description: '', url: '' }
    setResumeState((prev) => ({ ...prev, projects: [...prev.projects, entry] }))
  }, [])
  const updateProject = useCallback((id: string, field: keyof ProjectEntry, value: string) => {
    setResumeState((prev) => ({ ...prev, projects: prev.projects.map((e) => e.id === id ? { ...e, [field]: value } : e) }))
  }, [])
  const removeProject = useCallback((id: string) => {
    setResumeState((prev) => ({ ...prev, projects: prev.projects.filter((e) => e.id !== id) }))
  }, [])
  const reorderProject = useCallback((id: string, dir: 'up' | 'down') => {
    setResumeState((prev) => ({ ...prev, projects: reorder(prev.projects, id, dir) }))
  }, [])

  // Skills
  const addSkill = useCallback(() => {
    const entry: SkillGroup = { id: newId(), category: '', items: [] }
    setResumeState((prev) => ({ ...prev, skills: [...prev.skills, entry] }))
  }, [])
  const updateSkill = useCallback((id: string, field: keyof SkillGroup, value: string | string[]) => {
    setResumeState((prev) => ({ ...prev, skills: prev.skills.map((e) => e.id === id ? { ...e, [field]: value } : e) }))
  }, [])
  const removeSkill = useCallback((id: string) => {
    setResumeState((prev) => ({ ...prev, skills: prev.skills.filter((e) => e.id !== id) }))
  }, [])
  const reorderSkill = useCallback((id: string, dir: 'up' | 'down') => {
    setResumeState((prev) => ({ ...prev, skills: reorder(prev.skills, id, dir) }))
  }, [])

  // Certifications
  const addCertification = useCallback(() => {
    const entry: CertificationEntry = { id: newId(), name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' }
    setResumeState((prev) => ({ ...prev, certifications: [...prev.certifications, entry] }))
  }, [])
  const updateCertification = useCallback((id: string, field: keyof CertificationEntry, value: string) => {
    setResumeState((prev) => ({ ...prev, certifications: prev.certifications.map((e) => e.id === id ? { ...e, [field]: value } : e) }))
  }, [])
  const removeCertification = useCallback((id: string) => {
    setResumeState((prev) => ({ ...prev, certifications: prev.certifications.filter((e) => e.id !== id) }))
  }, [])
  const reorderCertification = useCallback((id: string, dir: 'up' | 'down') => {
    setResumeState((prev) => ({ ...prev, certifications: reorder(prev.certifications, id, dir) }))
  }, [])

  // References
  const addReference = useCallback(() => {
    const entry: ReferenceEntry = { id: newId(), name: '', jobTitle: '', company: '', email: '', phone: '' }
    setResumeState((prev) => ({ ...prev, references: [...prev.references, entry] }))
  }, [])
  const updateReference = useCallback((id: string, field: keyof ReferenceEntry, value: string) => {
    setResumeState((prev) => ({ ...prev, references: prev.references.map((e) => e.id === id ? { ...e, [field]: value } : e) }))
  }, [])
  const removeReference = useCallback((id: string) => {
    setResumeState((prev) => ({ ...prev, references: prev.references.filter((e) => e.id !== id) }))
  }, [])
  const reorderReference = useCallback((id: string, dir: 'up' | 'down') => {
    setResumeState((prev) => ({ ...prev, references: reorder(prev.references, id, dir) }))
  }, [])
  const setReferencesOnRequest = useCallback((value: boolean) => {
    setResumeState((prev) => ({ ...prev, referencesOnRequest: value }))
  }, [])

  const setTheme = useCallback((t: ThemeId) => setThemeId(t), [])
  const setAccentColor = useCallback((a: AccentColor) => setAccentColorState(a), [])
  const setEditorMode = useCallback((m: EditorMode) => setEditorModeState(m), [])
  const setTemplateConfig = useCallback((columns: TemplateColumns, style: TemplateStyle) => {
    setTemplateColumnsState(columns)
    setTemplateStyleState(style)
  }, [])

  const setLayoutSettings = useCallback((settings: LayoutSettings) => setLayoutSettingsState(settings), [])
  const setSectionOrder = useCallback((order: SectionKey[]) => {
    setLayoutSettingsState((prev) => ({ ...prev, sectionOrder: order }))
  }, [])
  const setPhotoPosition = useCallback((pos: PhotoPosition) => {
    setLayoutSettingsState((prev) => ({ ...prev, photoPosition: pos }))
  }, [])
  const setColorPalette = useCallback((palette: ColorPalette) => {
    setLayoutSettingsState((prev) => ({ ...prev, colorPalette: palette }))
  }, [])

  const startOver = useCallback(() => {
    clearStorage()
    setResumeState(DEFAULT_RESUME)
    setThemeId('classic')
    setAccentColorState('teal')
    setEditorModeState('form')
    setLayoutSettingsState({ ...DEFAULT_LAYOUT, colorPalette: { ...DEFAULT_LAYOUT.colorPalette } })
    setTemplateColumnsState(1)
    setTemplateStyleState('traditional')
  }, [])

  return {
    resume, themeId, accentColor, editorMode, layoutSettings, templateColumns, templateStyle,
    setResume, updatePersonal,
    addWork, updateWork, removeWork, reorderWork,
    addEducation, updateEducation, removeEducation, reorderEducation,
    addProject, updateProject, removeProject, reorderProject,
    addSkill, updateSkill, removeSkill, reorderSkill,
    addCertification, updateCertification, removeCertification, reorderCertification,
    addReference, updateReference, removeReference, reorderReference, setReferencesOnRequest,
    setTheme, setAccentColor, setEditorMode,
    setLayoutSettings, setSectionOrder, setPhotoPosition, setColorPalette,
    setTemplateConfig,
    startOver,
  }
}
