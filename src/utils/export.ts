import type { ResumeData, ThemeId, AccentColor, LayoutSettings, TemplateColumns, TemplateStyle, SectionKey } from '@/types/resume'
import { serialize } from './markdown'

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ---- Section builders (mirrors ResumeDocument.tsx) ----

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

function buildHeader(resume: ResumeData, photoPosition: LayoutSettings['photoPosition']): string {
  const { personal } = resume
  const contactParts = buildContactParts(personal)
  const linkParts = buildLinkParts(personal)
  const showPhoto = personal.photo && photoPosition !== 'hidden'
  const photoOnRight = photoPosition === 'right'
  const html: string[] = []

  if (showPhoto) {
    const flexDir = photoOnRight ? 'row-reverse' : 'row'
    html.push(`<div class="header-with-photo" style="flex-direction:${flexDir}">`)
    html.push(`<img class="headshot" src="${personal.photo}" alt="Headshot" />`)
    html.push('<div class="header-text">')
  }

  html.push(`<h1>${esc(personal.name || 'Your Name')}</h1>`)
  if (contactParts.length) html.push(`<p class="contact-line">${contactParts.join(' &nbsp;|&nbsp; ')}</p>`)
  if (linkParts.length) html.push(`<p class="contact-line">${linkParts.join(' &nbsp;|&nbsp; ')}</p>`)

  if (showPhoto) html.push('</div></div>')
  return html.join('\n')
}

function buildSummarySection(resume: ResumeData): string {
  if (!resume.personal.summary) return ''
  return `<h2>Summary</h2>\n<p>${esc(resume.personal.summary)}</p>`
}

function buildWorkSection(resume: ResumeData): string {
  if (resume.work.length === 0) return ''
  const html: string[] = ['<h2>Experience</h2>']
  for (const entry of resume.work) {
    html.push('<div class="entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(entry.company)}</span><span class="entry-dates">${esc(entry.startDate)} – ${esc(entry.endDate)}</span></div>`)
    html.push(`<div class="entry-subtitle">${esc(entry.role)}</div>`)
    const bullets = entry.bullets.filter(b => b.trim())
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
  if (resume.education.length === 0) return ''
  const html: string[] = ['<h2>Education</h2>']
  for (const entry of resume.education) {
    html.push('<div class="entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(entry.institution)}</span><span class="entry-dates">${esc(entry.startYear)} – ${esc(entry.endYear)}</span></div>`)
    html.push(`<div class="entry-subtitle">${esc(entry.degree)}</div>`)
    html.push('</div>')
  }
  return html.join('\n')
}

function buildSkillsSection(resume: ResumeData): string {
  if (resume.skills.length === 0) return ''
  const html: string[] = ['<h2>Skills</h2><div class="skills-block">']
  for (const group of resume.skills) {
    if (group.category && group.items.length > 0) {
      html.push(`<p class="skills-line"><strong>${esc(group.category)}:</strong> ${group.items.map(esc).join(', ')}</p>`)
    }
  }
  html.push('</div>')
  return html.join('\n')
}

function buildProjectsSection(resume: ResumeData): string {
  if (resume.projects.length === 0) return ''
  const html: string[] = ['<h2>Projects</h2>']
  for (const entry of resume.projects) {
    html.push('<div class="entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(entry.name)}</span></div>`)
    if (entry.description || entry.url) {
      const urlPart = entry.url ? ` <a href="${esc(entry.url)}" target="_blank" rel="noopener">${esc(entry.url)}</a>` : ''
      html.push(`<p>${esc(entry.description)}${urlPart}</p>`)
    }
    html.push('</div>')
  }
  return html.join('\n')
}

function buildCertificationsSection(resume: ResumeData): string {
  if (resume.certifications.length === 0) return ''
  const html: string[] = ['<h2>Certifications</h2>']
  for (const cert of resume.certifications) {
    html.push('<div class="entry cert-entry">')
    html.push(`<div class="entry-header"><span class="entry-title">${esc(cert.name)}</span><span class="entry-dates">${esc(cert.issueDate)}${cert.expiryDate ? ` – ${esc(cert.expiryDate)}` : ''}</span></div>`)
    html.push(`<div class="entry-subtitle">${esc(cert.issuer)}</div>`)
    if (cert.credentialUrl) html.push(`<a class="credential-link" href="${esc(cert.credentialUrl)}" target="_blank" rel="noopener">View credential →</a>`)
    html.push('</div>')
  }
  return html.join('\n')
}

function buildReferencesSection(resume: ResumeData): string {
  const { references, referencesOnRequest } = resume
  if (!referencesOnRequest && references.length === 0) return ''
  const html: string[] = ['<h2>References</h2>']
  if (referencesOnRequest) {
    html.push('<p class="ref-on-request"><em>References available upon request</em></p>')
  } else {
    html.push('<div class="ref-section">')
    for (const ref of references) {
      html.push('<div class="entry ref-entry">')
      html.push(`<div class="ref-name">${esc(ref.name)}</div>`)
      html.push(`<div class="ref-meta">${esc(ref.jobTitle)}${ref.company ? `, ${esc(ref.company)}` : ''}</div>`)
      if (ref.email || ref.phone) html.push(`<div class="ref-contact">${[ref.email, ref.phone].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ')}</div>`)
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

function buildResumeBody(
  resume: ResumeData,
  layoutSettings: LayoutSettings,
  templateColumns: TemplateColumns,
  templateStyle: TemplateStyle,
): string {
  if (templateColumns === 2) {
    return buildTwoColumnBody(resume, layoutSettings, templateStyle)
  }

  const { personal } = resume
  const contactParts = buildContactParts(personal)
  const linkParts = buildLinkParts(personal)
  const bodySections: string[] = []

  for (const key of layoutSettings.sectionOrder) {
    const section = SECTION_BUILDERS[key]?.(resume)
    if (section) bodySections.push(section)
  }

  if (templateStyle === 'creative' || templateStyle === 'contemporary') {
    return `
<div class="creative-header">
  <h1>${esc(personal.name || 'Your Name')}</h1>
  ${contactParts.length ? `<p class="contact-line">${contactParts.join(' &nbsp;|&nbsp; ')}</p>` : ''}
  ${linkParts.length ? `<p class="contact-line">${linkParts.join(' &nbsp;|&nbsp; ')}</p>` : ''}
</div>
<div class="resume-body">${bodySections.join('\n')}</div>`
  }

  return buildHeader(resume, layoutSettings.photoPosition) + '\n' + bodySections.join('\n')
}

function buildTwoColumnBody(
  resume: ResumeData,
  layoutSettings: LayoutSettings,
  templateStyle: TemplateStyle,
): string {
  const { personal } = resume
  const contactParts = [...buildContactParts(personal), ...buildLinkParts(personal)]
  const photoHtml = personal.photo && layoutSettings.photoPosition !== 'hidden'
    ? `<img class="headshot sidebar-headshot" src="${personal.photo}" alt="Headshot" />`
    : ''

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
  <aside class="twocol-sidebar">${sidebarParts.join('\n')}</aside>
  <main class="twocol-main">${mainParts.join('\n')}</main>
</div>`
}

// ---- CSS generation ----

function getAccentBg(accent: AccentColor): string {
  const map: Record<AccentColor, string> = {
    teal: '#f0fdfa',
    indigo: '#eef2ff',
    coral: '#fff1f1',
    amber: '#fffbeb',
  }
  return map[accent]
}

function getAccentHex(accent: AccentColor): string {
  const map: Record<AccentColor, string> = {
    teal: '#0d9488',
    indigo: '#4f46e5',
    coral: '#e05252',
    amber: '#d97706',
  }
  return map[accent]
}

function buildCSS(
  themeId: ThemeId,
  accentColor: AccentColor,
  layoutSettings: LayoutSettings,
  templateColumns: TemplateColumns,
  templateStyle: TemplateStyle,
): string {
  // Use the AccentColor enum as the source of truth for the accent hex.
  // Only override with the palette value if the user has explicitly customised it
  // (i.e. it doesn't match any of the four preset hex values).
  const presetHexes = new Set(['#0d9488', '#4f46e5', '#e05252', '#d97706'])
  const paletteAccent = layoutSettings.colorPalette.accentColor?.toLowerCase() ?? ''
  const accent = !presetHexes.has(paletteAccent) && paletteAccent
    ? layoutSettings.colorPalette.accentColor
    : getAccentHex(accentColor)
  const accentBg = getAccentBg(accentColor)
  const colorHeading = layoutSettings.colorPalette.headingColor || accent
  const colorBody = layoutSettings.colorPalette.bodyColor || (themeId === 'classic' ? '#222' : '#2a2a2a')
  const colorSubtitle = layoutSettings.colorPalette.subtitleColor || (themeId === 'classic' ? '#444' : '#555')
  const colorContact = layoutSettings.colorPalette.contactColor || '#555'
  const colorHeaderText = layoutSettings.colorPalette.headerTextColor || '#fff'
  const isCreative = templateStyle === 'creative' || templateStyle === 'contemporary'
  const is2col = templateColumns === 2

  const base = themeId === 'classic' ? `
    .resume-document { font-family: Georgia, "Times New Roman", Times, serif; font-size: 13px; color: #111; line-height: 1.6; background: #fff; max-width: 680px; margin: 0 auto; padding: 48px; }
    .resume-document .header-with-photo { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 4px; }
    .resume-document .headshot { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid #ccc; }
    .resume-document .header-text { flex: 1; }
    .resume-document h1 { font-size: 26px; font-weight: 700; color: ${colorHeading}; margin: 0 0 6px; letter-spacing: -0.01em; }
    .resume-document .contact-line { font-size: 12px; color: ${colorContact}; margin: 2px 0; line-height: 1.5; }
    .resume-document h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: ${colorHeading}; border-bottom: 1px solid ${colorHeading}; padding-bottom: 3px; margin: 24px 0 8px; }
    .resume-document .entry { margin-bottom: 12px; page-break-inside: avoid; }
    .resume-document .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; }
    .resume-document .entry-title { font-size: 13px; font-weight: bold; color: #111; }
    .resume-document .entry-dates { font-size: 12px; color: ${colorSubtitle}; margin-left: auto; white-space: nowrap; }
    .resume-document .entry-subtitle { font-size: 12.5px; font-style: italic; color: ${colorSubtitle}; margin: 1px 0 4px; }
    .resume-document ul { margin: 4px 0; padding-left: 20px; }
    .resume-document li { font-size: 13px; line-height: 1.6; margin-bottom: 2px; color: ${colorBody}; }
    .resume-document p { font-size: 13px; color: ${colorBody}; margin: 3px 0; line-height: 1.6; }
    .resume-document .skills-block { margin: 0; }
    .resume-document .skills-line { font-size: 13px; margin: 2px 0; }
    .resume-document .skills-line strong { font-weight: bold; color: #111; }
    .resume-document .credential-link { font-size: 11px; color: #555; text-decoration: underline; display: inline-block; margin-top: 2px; }
    .resume-document .ref-on-request { font-size: 12px; font-style: italic; color: #555; }
    .resume-document .ref-name { font-size: 12.5px; font-weight: bold; color: #333; }
    .resume-document .ref-meta { font-size: 11.5px; color: #666; margin: 1px 0; }
    .resume-document .ref-contact { font-size: 11px; color: #777; }
    .resume-document a { color: #111; text-decoration: underline; }
    .resume-document hr { display: none; }
  ` : `
    .resume-document { font-family: Inter, "Helvetica Neue", Arial, sans-serif; font-size: 10.5pt; color: #1a1a1a; line-height: 1.58; background: #fff; max-width: 680px; margin: 0 auto; padding: 36px 48px; }
    .resume-document .header-with-photo { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 4px; }
    .resume-document .headshot { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .resume-document .header-text { flex: 1; }
    .resume-document h1 { font-size: 26pt; font-weight: 700; color: ${colorHeading}; margin: 0 0 6px; letter-spacing: -0.03em; }
    .resume-document .contact-line { font-size: 9pt; color: ${colorContact}; margin: 2px 0; }
    .resume-document h2 { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: ${colorHeading}; border-left: 3px solid ${colorHeading}; padding-left: 8px; margin: 22px 0 10px; }
    .resume-document .entry { margin-bottom: 12px; page-break-inside: avoid; }
    .resume-document .entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; flex-wrap: wrap; }
    .resume-document .entry-title { font-size: 11pt; font-weight: 600; color: #111; }
    .resume-document .entry-dates { font-size: 9.5pt; color: ${colorSubtitle}; margin-left: auto; white-space: nowrap; }
    .resume-document .entry-subtitle { font-size: 9.5pt; color: ${colorSubtitle}; margin: 1px 0 4px; }
    .resume-document ul { margin: 4px 0; padding-left: 18px; }
    .resume-document li { font-size: 10.5pt; line-height: 1.58; margin-bottom: 3px; color: ${colorBody}; }
    .resume-document p { font-size: 10pt; color: ${colorBody}; margin: 3px 0; }
    .resume-document .skills-block { margin: 0; }
    .resume-document .skills-line { font-size: 10.5pt; margin: 3px 0; }
    .resume-document .skills-line strong { font-weight: 600; color: #111; }
    .resume-document .credential-link { font-size: 9pt; color: ${accent}; text-decoration: none; display: inline-block; margin-top: 2px; }
    .resume-document .ref-on-request { font-size: 10pt; font-style: italic; color: #666; }
    .resume-document .ref-name { font-size: 10.5pt; font-weight: 600; color: #222; }
    .resume-document .ref-meta { font-size: 9.5pt; color: #666; margin: 1px 0; }
    .resume-document .ref-contact { font-size: 9pt; color: #888; }
    .resume-document a { color: ${accent}; text-decoration: none; }
    .resume-document hr { display: none; }
  `

  const twoColCSS = is2col ? `
    .resume-document { padding: 0; max-width: 100%; margin: 0; display: flex; flex-direction: column; min-height: 100vh; }
    .resume-document .twocol-header { width: 100%; box-sizing: border-box; padding: ${themeId === 'classic' ? '32px 36px 24px' : '28px 36px 20px'}; ${isCreative ? `background: ${accent}; border-bottom: none;` : `border-bottom: ${themeId === 'classic' ? `2px solid ${accent}` : `3px solid ${accent}`};`} }
    .resume-document .twocol-header h1 { margin: 0 0 4px; ${isCreative ? `color: ${colorHeaderText};` : ''} }
    .resume-document .twocol-header .contact-line { ${isCreative ? `color: ${colorHeaderText}; opacity: 0.85;` : ''} }
    .resume-document .twocol-header .sidebar-headshot { width: 72px; height: 72px; border-radius: 50%; object-fit: cover; float: left; margin-right: 16px; ${themeId === 'classic' ? 'border: 2px solid #ccc;' : ''} }
    .resume-document .twocol-header-text { overflow: hidden; }
    .resume-document .twocol-body { display: flex; flex: 1; background: linear-gradient(to right, ${accentBg} 220px, #fff 220px); }
    .resume-document .twocol-sidebar { width: 220px; flex-shrink: 0; background: transparent; padding: 24px 20px; ${themeId === 'classic' ? `border-right: 1px solid #e0e0e0;` : ''} }
    .resume-document .twocol-main { flex: 1; padding: 24px 28px; }
  ` : ''

  const creativeCSS = !is2col && isCreative ? `
    .resume-document { padding: 0; max-width: 100%; margin: 0; }
    .resume-document .creative-header { width: 100%; box-sizing: border-box; background: ${accent}; padding: ${themeId === 'classic' ? '32px 48px' : '28px 48px'}; }
    .resume-document .creative-header h1 { color: ${colorHeaderText}; margin-bottom: 4px; }
    .resume-document .creative-header .contact-line { color: ${colorHeaderText}; opacity: 0.85; }
    .resume-document .resume-body { padding: 24px 48px; }
  ` : ''

  return base + twoColCSS + creativeCSS
}

// ---- Public exports ----

export function exportAsHTML(
  data: ResumeData,
  themeId: ThemeId,
  accentColor: AccentColor,
  layoutSettings: LayoutSettings,
  templateColumns: TemplateColumns = 1,
  templateStyle: TemplateStyle = 'traditional',
  customTemplateImage?: string | null,
): void {
  const css = buildCSS(themeId, accentColor, layoutSettings, templateColumns, templateStyle)
  const body = buildResumeBody(data, layoutSettings, templateColumns, templateStyle)
  const name = data.personal.name || 'resume'
  const title = `${name} — Resume`

  const pageStyle = customTemplateImage
    ? `width: 794px; min-height: 1123px; box-shadow: 0 4px 24px rgba(0,0,0,0.12); position: relative; overflow: hidden;`
    : `width: 794px; min-height: 1123px; background: #fff; box-shadow: 0 4px 24px rgba(0,0,0,0.12);`

  const bgImageCSS = customTemplateImage
    ? `.resume-page::before { content: ''; display: block; position: absolute; inset: 0; background-image: url("${customTemplateImage}"); background-size: cover; background-position: center; z-index: 0; }`
    : ''

  const noHeaderBgCSS = customTemplateImage ? `
    .resume-document .creative-header,
    .resume-document .twocol-header,
    .resume-document .twocol-header.creative-header { background: transparent !important; }
    .resume-document .creative-header h1,
    .resume-document .twocol-header h1 { color: ${layoutSettings.colorPalette.headingColor || (layoutSettings.colorPalette.accentColor || '#0d9488')}; }
    .resume-document .creative-header .contact-line,
    .resume-document .twocol-header .contact-line { color: ${layoutSettings.colorPalette.accentColor || '#0d9488'}; opacity: 0.9; }
    .resume-document { background: transparent !important; }
  ` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f5f5f5; display: flex; justify-content: center; padding: 32px 16px; min-height: 100vh; }
    .resume-page { ${pageStyle} }
    ${bgImageCSS}
    ${css}
    ${noHeaderBgCSS}
  </style>
</head>
<body>
  <div class="resume-page">
    <div style="position:relative;z-index:1;">
      <div class="resume-document">
        ${body}
      </div>
    </div>
  </div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const filename = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  a.href = url
  a.download = `${filename}-resume.html`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportAsPDF(): void {
  window.print()
}

export async function copyMarkdown(data: ResumeData): Promise<void> {
  const md = serialize(data)
  await navigator.clipboard.writeText(md)
}
