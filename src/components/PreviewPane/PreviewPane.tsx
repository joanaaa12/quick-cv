import { useRef, useState, useEffect } from 'react'
import { ResumeDocument } from './ResumeDocument'
import type { ResumeData, ThemeId, AccentColor, LayoutSettings, TemplateColumns, TemplateStyle } from '@/types/resume'
import { ACCENT_COLORS } from '@/constants/themes'

const RESUME_WIDTH = 794
const RESUME_MIN_HEIGHT = 1123

interface Props {
  resume: ResumeData
  themeId: ThemeId
  accentColor: AccentColor
  layoutSettings: LayoutSettings
  customTemplateImage?: string | null
  templateColumns?: TemplateColumns
  templateStyle?: TemplateStyle
}

export function PreviewPane({ resume, themeId, accentColor, layoutSettings, customTemplateImage, templateColumns, templateStyle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const available = containerRef.current.clientWidth - 32 // 16px padding each side
      const next = available < RESUME_WIDTH ? available / RESUME_WIDTH : 1
      setScale(next)
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('print')
    function onChange(e: MediaQueryListEvent) { setIsPrinting(e.matches) }
    mq.addEventListener('change', onChange)
    const beforePrint = () => setIsPrinting(true)
    const afterPrint = () => setIsPrinting(false)
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', afterPrint)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', afterPrint)
    }
  }, [])

  const printScale = isPrinting ? 1 : scale

  return (
    <main
      ref={containerRef}
      className="flex-1 overflow-y-auto flex justify-center py-8 px-4 print:block print:overflow-visible print:py-0 print:px-0"
      aria-label="Resume preview"
    >
      {/* Outer wrapper collapses to scaled height so scroll works correctly */}
      <div
        style={isPrinting ? { width: '100%' } : {
          width: RESUME_WIDTH * scale,
          height: RESUME_MIN_HEIGHT * scale,
          flexShrink: 0,
        }}
      >
        <div
          id="resume-preview"
          role="region"
          aria-live="polite"
          aria-label="Live resume preview"
          style={isPrinting ? {
            width: '100%',
            position: 'relative',
            ...(customTemplateImage
              ? { backgroundImage: `url(${customTemplateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: (templateStyle === 'creative' || templateStyle === 'contemporary') ? (ACCENT_COLORS.find(c => c.id === accentColor)?.hex ?? '#fff') : '#fff' }
            ),
          } : {
            width: RESUME_WIDTH,
            minHeight: RESUME_MIN_HEIGHT,
            background: (templateStyle === 'creative' || templateStyle === 'contemporary') ? (ACCENT_COLORS.find(c => c.id === accentColor)?.hex ?? '#fff') : '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            position: 'relative',
            transformOrigin: 'top left',
            transform: `scale(${printScale})`,
          }}
        >
          {customTemplateImage && (
            <img
              src={customTemplateImage}
              alt="Custom template background"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          )}
          <div className="resume-content-layer" style={{ position: 'relative', zIndex: 1 }}>
            <ResumeDocument
              resume={resume}
              themeId={themeId}
              accentColor={accentColor}
              transparentBg={!!customTemplateImage}
              layoutSettings={layoutSettings}
              templateColumns={templateColumns}
              templateStyle={templateStyle}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
