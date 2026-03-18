import type {
  ResumeData,
  WorkEntry,
  EducationEntry,
  ProjectEntry,
  SkillGroup,
  CertificationEntry,
  ReferenceEntry,
} from '@/types/resume'

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

// ─── Serializer ──────────────────────────────────────────────────────────────

export function serialize(data: ResumeData): string {
  const lines: string[] = []
  const { personal, work, education, projects, skills, certifications, references, referencesOnRequest } = data

  // Header
  lines.push(`# ${personal.name || 'Your Name'}`)
  lines.push('')

  const contactParts: string[] = []
  if (personal.title) contactParts.push(`**${personal.title}**`)
  if (personal.email) contactParts.push(personal.email)
  if (personal.phone) contactParts.push(personal.phone)
  if (personal.location) contactParts.push(personal.location)
  if (contactParts.length) lines.push(contactParts.join(' | '))

  const linkParts: string[] = []
  if (personal.linkedin) linkParts.push(personal.linkedin)
  if (personal.github) linkParts.push(personal.github)
  if (linkParts.length) lines.push(linkParts.join(' | '))

  if (personal.summary) {
    lines.push('')
    lines.push('## Summary')
    lines.push(personal.summary)
  }

  // Work
  if (work.length > 0) {
    lines.push('')
    lines.push('## Experience')
    for (const entry of work) {
      lines.push('')
      lines.push(`### ${entry.company} — ${entry.role}`)
      lines.push(`*${entry.startDate} – ${entry.endDate}*`)
      for (const bullet of entry.bullets) {
        if (bullet.trim()) lines.push(`- ${bullet}`)
      }
    }
  }

  // Education
  if (education.length > 0) {
    lines.push('')
    lines.push('## Education')
    for (const entry of education) {
      lines.push('')
      lines.push(`### ${entry.institution} — ${entry.degree}`)
      lines.push(`*${entry.startYear} – ${entry.endYear}*`)
    }
  }

  // Skills
  if (skills.length > 0) {
    lines.push('')
    lines.push('## Skills')
    for (const group of skills) {
      if (group.category && group.items.length > 0) {
        lines.push(`**${group.category}:** ${group.items.join(', ')}`)
      }
    }
  }

  // Projects
  if (projects.length > 0) {
    lines.push('')
    lines.push('## Projects')
    for (const entry of projects) {
      lines.push('')
      lines.push(`### ${entry.name}`)
      const desc = entry.url
        ? `${entry.description} [${entry.url}](${entry.url})`
        : entry.description
      if (desc.trim()) lines.push(desc)
    }
  }

  // Certifications
  if (certifications.length > 0) {
    lines.push('')
    lines.push('## Certifications')
    for (const cert of certifications) {
      lines.push('')
      lines.push(`### ${cert.name}`)
      const datePart = cert.expiryDate
        ? `*${cert.issueDate} – ${cert.expiryDate}*`
        : `*${cert.issueDate}*`
      lines.push(`${cert.issuer} | ${datePart}`)
      if (cert.credentialUrl) lines.push(`[View credential](${cert.credentialUrl})`)
    }
  }

  // References
  if (referencesOnRequest) {
    lines.push('')
    lines.push('## References')
    lines.push('*References available upon request*')
  } else if (references.length > 0) {
    lines.push('')
    lines.push('## References')
    for (const ref of references) {
      lines.push('')
      lines.push(`### ${ref.name}`)
      lines.push(`${ref.jobTitle}, ${ref.company}`)
      if (ref.email) lines.push(`${ref.email} | ${ref.phone}`)
    }
  }

  return lines.join('\n')
}

// ─── Parser ──────────────────────────────────────────────────────────────────

export function parse(markdown: string): ResumeData {
  const lines = markdown.split('\n')

  const personal = {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    photo: '',
  }
  const work: WorkEntry[] = []
  const education: EducationEntry[] = []
  const projects: ProjectEntry[] = []
  const skills: SkillGroup[] = []
  const certifications: CertificationEntry[] = []
  const references: ReferenceEntry[] = []
  let referencesOnRequest = false

  // Extract name from # heading
  const nameLine = lines.find((l) => l.startsWith('# '))
  if (nameLine) personal.name = nameLine.slice(2).trim()

  // Split into sections by ## headings
  const sections: { heading: string; content: string[] }[] = []
  let currentHeading = '__header__'
  let currentContent: string[] = []

  for (const line of lines) {
    if (line.startsWith('## ')) {
      sections.push({ heading: currentHeading, content: currentContent })
      currentHeading = line.slice(3).trim().toLowerCase()
      currentContent = []
    } else {
      currentContent.push(line)
    }
  }
  sections.push({ heading: currentHeading, content: currentContent })

  // Parse header section (personal info)
  const headerSection = sections.find((s) => s.heading === '__header__')
  if (headerSection) {
    parseHeader(headerSection.content, personal)
  }

  // Parse named sections
  for (const section of sections) {
    const h = section.heading
    if (h === 'summary') {
      personal.summary = section.content.filter((l) => l.trim()).join('\n').trim()
    } else if (h === 'experience' || h === 'work experience') {
      parseWorkSection(section.content, work)
    } else if (h === 'education') {
      parseEducationSection(section.content, education)
    } else if (h === 'skills') {
      parseSkillsSection(section.content, skills)
    } else if (h === 'projects') {
      parseProjectsSection(section.content, projects)
    } else if (h === 'certifications') {
      parseCertificationsSection(section.content, certifications)
    } else if (h === 'references') {
      const result = parseReferencesSection(section.content)
      if (result.onRequest) {
        referencesOnRequest = true
      } else {
        references.push(...result.entries)
      }
    }
  }

  return { personal, work, education, projects, skills, certifications, references, referencesOnRequest }
}

function parseHeader(
  lines: string[],
  personal: ReturnType<typeof parse>['personal'],
): void {
  for (const line of lines) {
    if (line.includes('**') || line.includes('|')) {
      const parts = line.split('|').map((p) => p.trim())
      for (const part of parts) {
        const titleMatch = part.match(/^\*\*(.+?)\*\*$/)
        if (titleMatch) {
          personal.title = titleMatch[1]
          continue
        }
        if (part.includes('@')) {
          personal.email = part
          continue
        }
        if (part.match(/^\+?[\d\s\-().]+$/) && part.length > 5) {
          personal.phone = part
          continue
        }
        if (part.includes('linkedin') || part.includes('github') || part.startsWith('http')) {
          continue
        }
        if (part && !personal.location) {
          personal.location = part
        }
      }
    }
    if (line.includes('linkedin') || line.includes('github')) {
      const parts = line.split('|').map((p) => p.trim())
      for (const part of parts) {
        if (part.includes('linkedin')) personal.linkedin = part
        else if (part.includes('github')) personal.github = part
      }
    }
  }
}

function splitEntries(lines: string[]): string[][] {
  const entries: string[][] = []
  let current: string[] = []
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current.length > 0) entries.push(current)
      current = [line]
    } else {
      current.push(line)
    }
  }
  if (current.length > 0) entries.push(current)
  return entries
}

function parseWorkSection(lines: string[], work: WorkEntry[]): void {
  for (const entry of splitEntries(lines)) {
    const headerLine = entry[0]
    if (!headerLine?.startsWith('### ')) continue
    const header = headerLine.slice(4).trim()
    const dashIdx = header.indexOf(' — ')
    const company = dashIdx >= 0 ? header.slice(0, dashIdx).trim() : header
    const role = dashIdx >= 0 ? header.slice(dashIdx + 3).trim() : ''

    let startDate = ''
    let endDate = ''
    const bullets: string[] = []

    for (const line of entry.slice(1)) {
      const dateMatch = line.match(/^\*(.+?) – (.+?)\*$/)
      if (dateMatch) {
        startDate = dateMatch[1].trim()
        endDate = dateMatch[2].trim()
        continue
      }
      const bulletMatch = line.match(/^- (.+)/)
      if (bulletMatch) bullets.push(bulletMatch[1])
    }

    work.push({ id: newId(), company, role, startDate, endDate, bullets })
  }
}

function parseEducationSection(lines: string[], education: EducationEntry[]): void {
  for (const entry of splitEntries(lines)) {
    const headerLine = entry[0]
    if (!headerLine?.startsWith('### ')) continue
    const header = headerLine.slice(4).trim()
    const dashIdx = header.indexOf(' — ')
    const institution = dashIdx >= 0 ? header.slice(0, dashIdx).trim() : header
    const degree = dashIdx >= 0 ? header.slice(dashIdx + 3).trim() : ''

    let startYear = ''
    let endYear = ''

    for (const line of entry.slice(1)) {
      const dateMatch = line.match(/^\*(.+?) – (.+?)\*$/)
      if (dateMatch) {
        startYear = dateMatch[1].trim()
        endYear = dateMatch[2].trim()
      }
    }

    education.push({ id: newId(), institution, degree, startYear, endYear })
  }
}

function parseSkillsSection(lines: string[], skills: SkillGroup[]): void {
  for (const line of lines) {
    const match = line.match(/^\*\*(.+?):\*\*\s*(.+)/)
    if (match) {
      skills.push({
        id: newId(),
        category: match[1].trim(),
        items: match[2].split(',').map((s) => s.trim()).filter(Boolean),
      })
    }
  }
}

function parseProjectsSection(lines: string[], projects: ProjectEntry[]): void {
  for (const entry of splitEntries(lines)) {
    const headerLine = entry[0]
    if (!headerLine?.startsWith('### ')) continue
    const name = headerLine.slice(4).trim()

    let description = ''
    let url = ''

    for (const line of entry.slice(1)) {
      if (!line.trim()) continue
      const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (linkMatch) {
        url = linkMatch[2]
        description = line.replace(/\s*\[([^\]]+)\]\(([^)]+)\)/, '').trim()
      } else {
        description = line.trim()
      }
    }

    projects.push({ id: newId(), name, description, url })
  }
}

function parseCertificationsSection(lines: string[], certs: CertificationEntry[]): void {
  for (const entry of splitEntries(lines)) {
    const headerLine = entry[0]
    if (!headerLine?.startsWith('### ')) continue
    const name = headerLine.slice(4).trim()

    let issuer = ''
    let issueDate = ''
    let expiryDate = ''
    let credentialUrl = ''

    for (const line of entry.slice(1)) {
      if (!line.trim()) continue
      // "Issuer | *date*" or "Issuer | *date – expiry*"
      const issuerMatch = line.match(/^(.+?)\s*\|\s*\*(.+?)\*$/)
      if (issuerMatch) {
        issuer = issuerMatch[1].trim()
        const dates = issuerMatch[2].split(' – ')
        issueDate = dates[0]?.trim() ?? ''
        expiryDate = dates[1]?.trim() ?? ''
        continue
      }
      // [View credential](url)
      const credMatch = line.match(/\[View credential\]\(([^)]+)\)/)
      if (credMatch) {
        credentialUrl = credMatch[1]
      }
    }

    certs.push({ id: newId(), name, issuer, issueDate, expiryDate, credentialUrl })
  }
}

function parseReferencesSection(
  lines: string[],
): { onRequest: boolean; entries: ReferenceEntry[] } {
  const onRequestLine = lines.find((l) => l.includes('References available upon request'))
  if (onRequestLine) return { onRequest: true, entries: [] }

  const entries: ReferenceEntry[] = []
  for (const entry of splitEntries(lines)) {
    const headerLine = entry[0]
    if (!headerLine?.startsWith('### ')) continue
    const name = headerLine.slice(4).trim()

    let jobTitle = ''
    let company = ''
    let email = ''
    let phone = ''

    for (const line of entry.slice(1)) {
      if (!line.trim()) continue
      if (line.includes('|')) {
        const parts = line.split('|').map((p) => p.trim())
        email = parts[0] ?? ''
        phone = parts[1] ?? ''
      } else if (line.includes(',')) {
        const parts = line.split(',').map((p) => p.trim())
        jobTitle = parts[0] ?? ''
        company = parts[1] ?? ''
      }
    }

    entries.push({ id: newId(), name, jobTitle, company, email, phone })
  }

  return { onRequest: false, entries }
}
