import React, { useMemo } from 'react'
import type { ResumeData, ThemeId, AccentColor, LayoutSettings, SectionKey, TemplateColumns, TemplateStyle } from '@/types/resume'

interface Props {
  resume: ResumeData
  themeId: ThemeId
  accentColor: AccentColor
  transparentBg?: boolean
  layoutSettings: LayoutSettings
  templateColumns?: TemplateColumns
  templateStyle?: TemplateStyle
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---- Shared helpers ----

function buildContactParts(personal: ResumeData['personal']): string[] {
  const parts: string[] = []
  if (personal.title) parts.push(`<strong>${esc(personal.title)}</strong>`)
  if (personal.email) parts.push(esc(personal.email))
  if (personal.phone) parts.push(esc(personal.phone))
  if (personal.location) parts.push(esc(personal.location))
  return parts
}

function buildLinkParts(personal: ResumeData['personal']): string[] {
  const parts: string[] = []
  if (personal.linkedin) parts.push(esc(personal.linkedin))
  if (personal.github) parts.push(esc(personal.github))
  return parts
}

// ---- Individual section builders ----

function buildHeader(resume: ResumeData, photoPosition: LayoutSettings['photoPosition']): string {
  const { personal } = resume
  const html: string[] = []

  const contactParts = buildContactParts(personal)
  const linkParts = buildLinkParts(personal)

  const showPhoto = personal.photo && photoPosition !== 'hidden'
  const photoOnRight = photoPosition === 'right'

  if (showPhoto) {
    const flexDir = photoOnRight ? 'row-reverse' : 'row'
    html.push(`<div class="header-with-photo" style="flex-direction:${flexDir}">`)
    html.push(`<img class="headshot" src="${personal.photo}" alt="Headshot" />`)
    html.push('<div class="header-text">')
  }

  html.push(`<h1>${esc(personal.name || 'Your Name')}</h1>`)
  if (contactParts.length) html.push(`<p class="contact-line">${contactParts.join(' &nbsp;|&nbsp; ')}</p>`)
  if (linkParts.length) html.push(`<p class="contact-line">${linkParts.join(' &nbsp;|&nbsp; ')}</p>`)

  if (showPhoto) {
    html.push('</div></div>')
  }

  return html.join('\n')
}

function buildSummarySection(resume: ResumeData): string {
  const { personal } = resume
  if (!personal.summary) return ''
  const html: string[] = []
  html.push('<h2>Summary</h2>')
  html.push(`<p>${esc(personal.summary)}</p>`)
  return html.join('\n')
}

function buildWorkSection(resume: ResumeData): string {
  const { work } = resume
  if (work.length === 0) return ''
  const html: string[] = []
  html.push('<h2>Experience</h2>')
  for (const entry of work) {
    html.push('<div class="entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(entry.company)}</span><span class="entry-dates">${esc(entry.startDate)} – ${esc(entry.endDate)}</span></div>`)
    html.push(`<div class="entry-subtitle">${esc(entry.role)}</div>`)
    const bullets = entry.bullets.filter((b) => b.trim())
    if (bullets.length > 0) {
      html.push('<ul>')
      for (const b of bullets) html.push(`<li>${esc(b)}</li>`)
      html.push('</ul>')
    }
    html.push('</div>')
  }
  return html.join('\n')
}

function buildEducationSection(resume: ResumeData): string {
  const { education } = resume
  if (education.length === 0) return ''
  const html: string[] = []
  html.push('<h2>Education</h2>')
  for (const entry of education) {
    html.push('<div class="entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(entry.institution)}</span><span class="entry-dates">${esc(entry.startYear)} – ${esc(entry.endYear)}</span></div>`)
    html.push(`<div class="entry-subtitle">${esc(entry.degree)}</div>`)
    html.push('</div>')
  }
  return html.join('\n')
}

function buildSkillsSection(resume: ResumeData): string {
  const { skills } = resume
  if (skills.length === 0) return ''
  const html: string[] = []
  html.push('<h2>Skills</h2>')
  html.push('<div class="skills-block">')
  for (const group of skills) {
    if (group.category && group.items.length > 0) {
      html.push(`<p class="skills-line"><strong>${esc(group.category)}:</strong> ${group.items.map(esc).join(', ')}</p>`)
    }
  }
  html.push('</div>')
  return html.join('\n')
}

function buildProjectsSection(resume: ResumeData): string {
  const { projects } = resume
  if (projects.length === 0) return ''
  const html: string[] = []
  html.push('<h2>Projects</h2>')
  for (const entry of projects) {
    html.push('<div class="entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(entry.name)}</span></div>`)
    const desc = entry.description
    const url = entry.url
    if (desc || url) {
      const urlPart = url ? ` <a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a>` : ''
      html.push(`<p>${esc(desc)}${urlPart}</p>`)
    }
    html.push('</div>')
  }
  return html.join('\n')
}

function buildCertificationsSection(resume: ResumeData): string {
  const { certifications } = resume
  if (certifications.length === 0) return ''
  const html: string[] = []
  html.push('<h2>Certifications</h2>')
  for (const cert of certifications) {
    html.push('<div class="entry cert-entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(cert.name)}</span><span class="entry-dates">${esc(cert.issueDate)}${cert.expiryDate ? ` – ${esc(cert.expiryDate)}` : ''}</span></div>`)
    html.push(`<div class="entry-subtitle">${esc(cert.issuer)}</div>`)
    if (cert.credentialUrl) {
      html.push(`<a class="credential-link" href="${esc(cert.credentialUrl)}" target="_blank" rel="noopener">View credential →</a>`)
    }
    html.push('</div>')
  }
  return html.join('\n')
}

function buildReferencesSection(resume: ResumeData): string {
  const { references, referencesOnRequest } = resume
  const showReferences = referencesOnRequest || references.length > 0
  if (!showReferences) return ''
  const html: string[] = []
  html.push('<h2>References</h2>')
  if (referencesOnRequest) {
    html.push('<p class="ref-on-request"><em>References available upon request</em></p>')
  } else {
    html.push('<div class="ref-section">')
    for (const ref of references) {
      html.push('<div class="entry ref-entry">')
      html.push(`<div class="ref-name">${esc(ref.name)}</div>`)
      html.push(`<div class="ref-meta">${esc(ref.jobTitle)}${ref.company ? `, ${esc(ref.company)}` : ''}</div>`)
      if (ref.email || ref.phone) {
        html.push(`<div class="ref-contact">${[ref.email, ref.phone].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ')}</div>`)
      }
      html.push('</div>')
    }
    html.push('</div>')
  }
  return html.join('\n')
}

const SECTION_BUILDERS: Record<SectionKey, (resume: ResumeData) => string> = {
  summary: buildSummarySection,
  work: buildWorkSection,
  education: buildEducationSection,
  skills: buildSkillsSection,
  projects: buildProjectsSection,
  certifications: buildCertificationsSection,
  references: buildReferencesSection,
}

function buildResumeHTML(
  resume: ResumeData,
  layoutSettings: LayoutSettings,
  templateColumns: TemplateColumns = 1,
  templateStyle: TemplateStyle = 'traditional',
): string {
  if (templateColumns === 2) {
    return buildTwoColumnHTML(resume, layoutSettings, templateStyle)
  }

  const parts: string[] = []

  const bodySections: string[] = []
  for (const key of layoutSettings.sectionOrder) {
    const builder = SECTION_BUILDERS[key]
    if (builder) {
      const section = builder(resume)
      if (section) bodySections.push(section)
    }
  }

  if (templateStyle === 'creative' || templateStyle === 'contemporary') {
    const { personal } = resume
    const contactParts = buildContactParts(personal)
    const linkParts = buildLinkParts(personal)
    parts.push(`<div class="creative-header">`)
    parts.push(`<h1>${esc(personal.name || 'Your Name')}</h1>`)
    if (contactParts.length) parts.push(`<p class="contact-line">${contactParts.join(' &nbsp;|&nbsp; ')}</p>`)
    if (linkParts.length) parts.push(`<p class="contact-line">${linkParts.join(' &nbsp;|&nbsp; ')}</p>`)
    parts.push(`</div>`)
    parts.push(`<div class="resume-body">${bodySections.join('\n')}</div>`)
  } else {
    parts.push(buildHeader(resume, layoutSettings.photoPosition))
    parts.push(...bodySections)
  }

  return parts.join('\n')
}

function buildTwoColumnHTML(
  resume: ResumeData,
  layoutSettings: LayoutSettings,
  templateStyle: TemplateStyle,
): string {
  const { personal } = resume
  const contactParts = [...buildContactParts(personal), ...buildLinkParts(personal)]

  const photoHtml = personal.photo && layoutSettings.photoPosition !== 'hidden'
    ? `<img class="headshot sidebar-headshot" src="${personal.photo}" alt="Headshot" />`
    : ''

  // Sidebar: skills + certifications. Main: everything else.
  // Both respect sectionOrder for ordering within their column.
  const sidebarKeys = new Set<SectionKey>(['skills', 'certifications'])

  const sidebarParts: string[] = []
  const mainParts: string[] = []
  for (const key of layoutSettings.sectionOrder) {
    const section = SECTION_BUILDERS[key]?.(resume)
    if (!section) continue
    if (sidebarKeys.has(key)) {
      sidebarParts.push(section)
    } else {
      mainParts.push(section)
    }
  }

  const isCreative = templateStyle === 'creative' || templateStyle === 'contemporary'
  const headerClass = isCreative ? 'twocol-header creative-header' : 'twocol-header'

  return `
<div class="${headerClass}">
  ${photoHtml}
  <div class="twocol-header-text">
    <h1>${esc(personal.name || 'Your Name')}</h1>
    ${contactParts.length ? `<p class="contact-line">${contactParts.join(' &nbsp;|&nbsp; ')}</p>` : ''}
  </div>
</div>
<div class="twocol-body">
  <aside class="twocol-sidebar">
    ${sidebarParts.join('\n')}
  </aside>
  <main class="twocol-main">
    ${mainParts.join('\n')}
  </main>
</div>`
}

function buildColorVars(palette: LayoutSettings['colorPalette']): React.CSSProperties {
  const vars: Record<string, string> = {}
  if (palette.headingColor) vars['--color-heading'] = palette.headingColor
  if (palette.bodyColor) vars['--color-body'] = palette.bodyColor
  if (palette.subtitleColor) vars['--color-subtitle'] = palette.subtitleColor
  if (palette.contactColor) vars['--color-contact'] = palette.contactColor
  if (palette.headerTextColor) vars['--color-header-text'] = palette.headerTextColor
  return vars as React.CSSProperties
}

export const ResumeDocument = React.memo(function ResumeDocument({ resume, themeId, accentColor, transparentBg, layoutSettings, templateColumns, templateStyle }: Props) {
  const html = useMemo(
    () => buildResumeHTML(resume, layoutSettings, templateColumns, templateStyle),
    [resume, layoutSettings, templateColumns, templateStyle],
  )

  const themeClass = [
    themeId === 'modern' ? `theme-modern accent-${accentColor}` : `theme-classic accent-${accentColor}`,
    templateColumns === 2 ? 'layout-2col' : '',
    (templateStyle === 'creative' || templateStyle === 'contemporary') ? 'style-creative' : '',
    transparentBg ? 'no-header-bg' : '',
  ].filter(Boolean).join(' ')

  const colorVars = buildColorVars(layoutSettings.colorPalette)

  // When showing over a custom background image, force header text to accent
  // colour unless the user has explicitly picked a header text colour.
  if (transparentBg && !layoutSettings.colorPalette.headerTextColor) {
    const accentMap: Record<string, string> = {
      teal: '#0d9488', indigo: '#4f46e5', coral: '#e05252', amber: '#d97706',
    }
    ;(colorVars as Record<string, string>)['--color-header-text'] = accentMap[accentColor] ?? '#0d9488'
  }

  const hasColorVars = Object.keys(colorVars).length > 0

  return (
    <div className={themeClass} style={{ width: '100%', ...(hasColorVars ? colorVars : {}) }}>
      <div
        className="resume-document"
        style={transparentBg ? { background: 'transparent' } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
})
