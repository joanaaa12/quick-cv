import { describe, it, expect } from 'vitest'
import { serialize, parse } from '@/utils/markdown'
import { DEFAULT_RESUME } from '@/constants/defaultResume'
import type { ResumeData } from '@/types/resume'

describe('serialize', () => {
  it('includes the name as an h1', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('# Jane Smith')
  })

  it('includes the professional title in bold', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('**Senior Product Designer**')
  })

  it('renders work experience section', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('## Experience')
    expect(md).toContain('### Acme Corp — Senior Product Designer')
  })

  it('renders education section', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('## Education')
    expect(md).toContain('### University of California, Berkeley')
  })

  it('renders skills as comma-separated items', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('## Skills')
    expect(md).toContain('**Design:** Figma, Sketch, Prototyping, User Research')
  })

  it('renders projects section', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('## Projects')
    expect(md).toContain('### Portfolio Site')
  })

  it('renders certifications section', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('## Certifications')
    expect(md).toContain('### Google UX Design Certificate')
    expect(md).toContain('Google / Coursera')
  })

  it('renders credential URL as a link', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('[View credential](coursera.org/verify/abc123)')
  })

  it('renders references section with entries', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('## References')
    expect(md).toContain('### Michael Torres')
  })

  it('renders references on request when flag is true', () => {
    const data: ResumeData = { ...DEFAULT_RESUME, referencesOnRequest: true }
    const md = serialize(data)
    expect(md).toContain('*References available upon request*')
    expect(md).not.toContain('### Michael Torres')
  })

  it('omits empty sections', () => {
    const empty: ResumeData = {
      personal: { name: 'Test', title: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '', photo: '' },
      work: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      references: [],
      referencesOnRequest: false,
    }
    const md = serialize(empty)
    expect(md).not.toContain('## Experience')
    expect(md).not.toContain('## Education')
    expect(md).not.toContain('## Skills')
    expect(md).not.toContain('## Projects')
    expect(md).not.toContain('## Certifications')
    expect(md).not.toContain('## References')
  })

  it('formats bullet points with - prefix', () => {
    const md = serialize(DEFAULT_RESUME)
    expect(md).toContain('- Led redesign of core onboarding flow')
  })
})

describe('parse', () => {
  it('extracts name', () => {
    const md = '# Jane Smith\n'
    const data = parse(md)
    expect(data.personal.name).toBe('Jane Smith')
  })

  it('parses work entries', () => {
    const md = `# Test\n\n## Experience\n\n### Acme Corp — Engineer\n*Jan 2020 – Present*\n- Built things\n`
    const data = parse(md)
    expect(data.work).toHaveLength(1)
    expect(data.work[0].company).toBe('Acme Corp')
    expect(data.work[0].role).toBe('Engineer')
    expect(data.work[0].startDate).toBe('Jan 2020')
    expect(data.work[0].endDate).toBe('Present')
    expect(data.work[0].bullets).toContain('Built things')
  })

  it('parses education entries', () => {
    const md = `# Test\n\n## Education\n\n### MIT — B.S. CS\n*2015 – 2019*\n`
    const data = parse(md)
    expect(data.education).toHaveLength(1)
    expect(data.education[0].institution).toBe('MIT')
    expect(data.education[0].degree).toBe('B.S. CS')
    expect(data.education[0].startYear).toBe('2015')
    expect(data.education[0].endYear).toBe('2019')
  })

  it('parses skills as array', () => {
    const md = `# Test\n\n## Skills\n**Design:** Figma, Sketch\n`
    const data = parse(md)
    expect(data.skills).toHaveLength(1)
    expect(data.skills[0].category).toBe('Design')
    expect(data.skills[0].items).toEqual(['Figma', 'Sketch'])
  })

  it('parses projects with URL', () => {
    const md = `# Test\n\n## Projects\n\n### My Project\nCool app. [https://example.com](https://example.com)\n`
    const data = parse(md)
    expect(data.projects).toHaveLength(1)
    expect(data.projects[0].name).toBe('My Project')
    expect(data.projects[0].url).toBe('https://example.com')
  })

  it('parses certifications', () => {
    const md = `# Test\n\n## Certifications\n\n### AWS Solutions Architect\nAmazon | *Dec 2023*\n[View credential](https://aws.amazon.com/verify/abc)\n`
    const data = parse(md)
    expect(data.certifications).toHaveLength(1)
    expect(data.certifications[0].name).toBe('AWS Solutions Architect')
    expect(data.certifications[0].issuer).toBe('Amazon')
    expect(data.certifications[0].credentialUrl).toBe('https://aws.amazon.com/verify/abc')
  })

  it('parses references on request', () => {
    const md = `# Test\n\n## References\n*References available upon request*\n`
    const data = parse(md)
    expect(data.referencesOnRequest).toBe(true)
    expect(data.references).toHaveLength(0)
  })

  it('parses explicit references', () => {
    const md = `# Test\n\n## References\n\n### John Doe\nVP of Engineering, Acme Corp\njohn@acme.com | +1 555 1234\n`
    const data = parse(md)
    expect(data.references).toHaveLength(1)
    expect(data.references[0].name).toBe('John Doe')
    expect(data.references[0].jobTitle).toBe('VP of Engineering')
    expect(data.references[0].company).toBe('Acme Corp')
  })
})

describe('round-trip', () => {
  it('serialize then parse preserves name', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.personal.name).toBe(DEFAULT_RESUME.personal.name)
  })

  it('serialize then parse preserves work entry count', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.work.length).toBe(DEFAULT_RESUME.work.length)
  })

  it('serialize then parse preserves work company and role', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.work[0].company).toBe(DEFAULT_RESUME.work[0].company)
    expect(parsed.work[0].role).toBe(DEFAULT_RESUME.work[0].role)
  })

  it('serialize then parse preserves skills count', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.skills.length).toBe(DEFAULT_RESUME.skills.length)
  })

  it('serialize then parse preserves skills items', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.skills[0].items).toEqual(DEFAULT_RESUME.skills[0].items)
  })

  it('serialize then parse preserves certifications count', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.certifications.length).toBe(DEFAULT_RESUME.certifications.length)
  })

  it('serialize then parse preserves referencesOnRequest = false', () => {
    const md = serialize(DEFAULT_RESUME)
    const parsed = parse(md)
    expect(parsed.referencesOnRequest).toBe(false)
  })

  it('double round-trip is stable', () => {
    const md1 = serialize(DEFAULT_RESUME)
    const parsed1 = parse(md1)
    const md2 = serialize(parsed1)
    expect(md2).toBe(md1)
  })
})
