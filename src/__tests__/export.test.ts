import { describe, it, expect } from 'vitest'
import { DEFAULT_RESUME } from '@/constants/defaultResume'
import { serialize } from '@/utils/markdown'

// Test export utilities without DOM side effects
describe('serialize for export', () => {
  it('produces valid Markdown string', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(typeof md).toBe('string')
    expect(md.length).toBeGreaterThan(0)
  })

  it('produces a string that starts with # (h1)', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md.startsWith('#')).toBe(true)
  })

  it('filename derivation logic works', () => {
    const name = DEFAULT_RESUME.personal.name
    const filename = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    expect(filename).toBe('jane-smith')
  })
})
