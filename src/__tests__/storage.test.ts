import { describe, it, expect, beforeEach } from 'vitest'
import { saveToStorage, loadFromStorage, clearStorage, DEFAULT_LAYOUT } from '@/utils/storage'
import { DEFAULT_RESUME } from '@/constants/defaultResume'

beforeEach(() => {
  localStorage.clear()
})

describe('saveToStorage / loadFromStorage', () => {
  it('saves and loads resume data', () => {
    saveToStorage(DEFAULT_RESUME, 'classic', 'teal', DEFAULT_LAYOUT)
    const loaded = loadFromStorage()
    expect(loaded).not.toBeNull()
    expect(loaded!.data.personal.name).toBe('Jane Smith')
  })

  it('saves theme and accent', () => {
    saveToStorage(DEFAULT_RESUME, 'modern', 'indigo', DEFAULT_LAYOUT)
    const loaded = loadFromStorage()
    expect(loaded!.themeId).toBe('modern')
    expect(loaded!.accentColor).toBe('indigo')
  })

  it('returns null if nothing is stored', () => {
    expect(loadFromStorage()).toBeNull()
  })

  it('returns null for invalid JSON', () => {
    localStorage.setItem('resume-builder-v1', 'not-json')
    expect(loadFromStorage()).toBeNull()
  })
})

describe('clearStorage', () => {
  it('removes stored data', () => {
    saveToStorage(DEFAULT_RESUME, 'classic', 'teal', DEFAULT_LAYOUT)
    clearStorage()
    expect(loadFromStorage()).toBeNull()
  })
})
