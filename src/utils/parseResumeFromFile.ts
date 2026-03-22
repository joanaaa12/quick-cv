/**
 * Client-side resume parser.
 * Accepts a PDF or image File, extracts raw text via PDF.js or Groq vision,
 * then sends the text to Groq to get structured JSON matching ResumeData.
 */

import type {
  ResumeData,
  WorkEntry,
  EducationEntry,
  SkillGroup,
  ProjectEntry,
  CertificationEntry,
} from '@/types/resume'

function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

// ─── PDF text extraction ──────────────────────────────────────────────────────

async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url,
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(pageText)
  }
  return pages.join('\n')
}

// ─── Image extraction via Groq vision ────────────────────────────────────────

async function extractTextFromImage(file: File): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set in .env')

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  const dataUrl = `data:${file.type};base64,${base64}`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: dataUrl } },
            {
              type: 'text',
              text: 'This is a resume image. Extract ALL text from it exactly as it appears, preserving section headings, bullet points, names, dates, contact info, and layout structure. Output only the extracted text, nothing else.',
            },
          ],
        },
      ],
      max_tokens: 2048,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Groq API error ${response.status}`)
  }

  const json = await response.json()
  return json.choices?.[0]?.message?.content ?? ''
}

// ─── Structured parsing via Groq text model ───────────────────────────────────

async function parseTextWithGroq(text: string): Promise<ResumeData> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is not set in .env')

  const systemPrompt = `You are a resume parser. Given resume text, extract all information and return ONLY valid JSON matching this exact schema (no markdown, no explanation, just the JSON object):

{
  "personal": {
    "name": "string",
    "title": "string (job title/headline)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (full URL or empty)",
    "github": "string (full URL or empty)",
    "summary": "string (professional summary/about me text or empty)",
    "photo": ""
  },
  "work": [
    {
      "id": "unique string",
      "company": "string",
      "role": "string",
      "startDate": "string (e.g. Jan 2020)",
      "endDate": "string (e.g. Dec 2022 or Present)",
      "bullets": ["string", "string"]
    }
  ],
  "education": [
    {
      "id": "unique string",
      "institution": "string",
      "degree": "string",
      "startYear": "string",
      "endYear": "string"
    }
  ],
  "projects": [
    {
      "id": "unique string",
      "name": "string",
      "description": "string",
      "url": "string"
    }
  ],
  "skills": [
    {
      "id": "unique string",
      "category": "string (e.g. Skills, Technical Skills, Languages)",
      "items": ["string", "string"]
    }
  ],
  "certifications": [
    {
      "id": "unique string",
      "name": "string",
      "issuer": "string",
      "issueDate": "string",
      "expiryDate": "",
      "credentialUrl": ""
    }
  ],
  "references": [],
  "referencesOnRequest": false
}

Rules:
- Generate short unique IDs (e.g. "a1b2c3d4") for every id field
- If a field has no value, use empty string ""
- bullets must be an array of strings (never empty array for work entries — use [""] if no bullets found)
- skills items must be an array of individual skill strings
- Return ONLY the JSON object, no markdown code blocks, no explanation`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      max_tokens: 4096,
      temperature: 0,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Groq API error ${response.status}`)
  }

  const json = await response.json()
  const content: string = json.choices?.[0]?.message?.content ?? ''

  // Strip any accidental markdown code fences
  const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

  const parsed = JSON.parse(cleaned) as ResumeData

  // Ensure every entry has an id (fallback)
  parsed.work = (parsed.work ?? []).map((e: WorkEntry) => ({ ...e, id: e.id || newId(), bullets: e.bullets?.length ? e.bullets : [''] }))
  parsed.education = (parsed.education ?? []).map((e: EducationEntry) => ({ ...e, id: e.id || newId() }))
  parsed.skills = (parsed.skills ?? []).map((e: SkillGroup) => ({ ...e, id: e.id || newId() }))
  parsed.projects = (parsed.projects ?? []).map((e: ProjectEntry) => ({ ...e, id: e.id || newId() }))
  parsed.certifications = (parsed.certifications ?? []).map((e: CertificationEntry) => ({ ...e, id: e.id || newId() }))
  parsed.references = parsed.references ?? []
  parsed.referencesOnRequest = parsed.referencesOnRequest ?? false
  parsed.personal = { ...parsed.personal, photo: '' }

  return parsed
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export type ParseResult =
  | { ok: true; data: ResumeData }
  | { ok: false; error: string }

export async function parseResumeFromFile(file: File): Promise<ParseResult> {
  try {
    let text = ''

    if (file.type === 'application/pdf') {
      text = await extractTextFromPdf(file)
    } else if (file.type.startsWith('image/')) {
      text = await extractTextFromImage(file)
    } else {
      return { ok: false, error: 'Unsupported file type. Please upload a PDF or image.' }
    }

    if (!text.trim()) {
      return { ok: false, error: 'Could not extract text from the file.' }
    }

    const data = await parseTextWithGroq(text)
    return { ok: true, data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `Failed to parse resume: ${msg}` }
  }
}
