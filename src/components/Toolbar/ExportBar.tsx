import React, { useState, useRef, useEffect } from 'react'
import type { ResumeData, ThemeId, AccentColor, LayoutSettings, TemplateColumns, TemplateStyle } from '@/types/resume'
import { exportAsPDF, exportAsHTML, copyMarkdown } from '@/utils/export'

interface Props {
  resume: ResumeData
  themeId: ThemeId
  accentColor: AccentColor
  layoutSettings: LayoutSettings
  templateColumns: TemplateColumns
  templateStyle: TemplateStyle
  customTemplateImage?: string | null
  onStartOver: () => void
}

export function ExportBar({ resume, themeId, accentColor, layoutSettings, templateColumns, templateStyle, customTemplateImage, onStartOver }: Props) {
  const [toast, setToast] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  async function handleCopyMarkdown() {
    setMenuOpen(false)
    try {
      await copyMarkdown(resume)
      showToast('Copied to clipboard')
    } catch {
      showToast('Copy failed')
    }
  }

  function handleStartOver() {
    setMenuOpen(false)
    if (window.confirm('Start over? This will clear all your data.')) {
      onStartOver()
    }
  }

  const btnBase =
    'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1'

  return (
    <div className="flex items-center gap-2 relative">
      {/* Export PDF — always visible */}
      <button
        type="button"
        onClick={exportAsPDF}
        title="Export PDF"
        aria-label="Export PDF"
        className={`${btnBase} bg-teal-700 text-white hover:bg-teal-800 focus:ring-teal-500 md:gap-1.5`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span className="hidden md:inline">Export PDF</span>
      </button>

      {/* Download HTML + Copy Markdown + Start Over — visible on md+ */}
      <button
        type="button"
        onClick={() => exportAsHTML(resume, themeId, accentColor, layoutSettings, templateColumns, templateStyle, customTemplateImage)}
        className={`hidden md:inline-flex ${btnBase} bg-white text-gray-700 border border-gray-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 focus:ring-teal-400`}
      >
        Download HTML
      </button>
      <button
        type="button"
        onClick={handleCopyMarkdown}
        className={`hidden md:inline-flex ${btnBase} bg-white text-gray-700 border border-gray-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 focus:ring-teal-400`}
      >
        Copy Markdown
      </button>
      <button
        type="button"
        onClick={handleStartOver}
        className={`hidden md:inline-flex ${btnBase} text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-400`}
        aria-label="Start over — clears all data"
      >
        Start Over
      </button>

      {/* Hamburger menu — visible on small screens only */}
      <div ref={menuRef} className="relative md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={`${btnBase} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400`}
          aria-label="More options"
          aria-expanded={menuOpen}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); exportAsHTML(resume, themeId, accentColor, layoutSettings, templateColumns, templateStyle, customTemplateImage) }}
              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-700"
            >
              Download HTML
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-700"
            >
              Copy Markdown
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              type="button"
              onClick={handleStartOver}
              className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute right-0 -bottom-9 bg-gray-900 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-50"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
