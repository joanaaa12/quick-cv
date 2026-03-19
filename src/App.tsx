import { useState } from 'react'
import { Toolbar } from './components/Toolbar/Toolbar'
import { EditorPane } from './components/EditorPane/EditorPane'
import { PreviewPane } from './components/PreviewPane/PreviewPane'
import { TemplatePicker, LandingPage } from './components/TemplatePicker/TemplatePicker'
import type { TemplateOption } from './components/TemplatePicker/TemplatePicker' // used in handleTemplateSelect
import { useResumeStore } from './hooks/useResumeStore'
import { ACCENT_COLORS } from './constants/themes'
import type { AccentColor } from './types/resume'

type Screen = 'landing' | 'templates' | 'editor'

function getBgTint(accentColor: AccentColor): string {
  const entry = ACCENT_COLORS.find(c => c.id === accentColor)
  if (!entry) return '#e2e8f0'
  return entry.hex + '1a'
}

export default function App() {
  const store = useResumeStore()
  const [screen, setScreen] = useState<Screen>(() =>
    typeof window !== 'undefined' && localStorage.getItem('resume-builder-v1') ? 'editor' : 'landing'
  )
  const [customTemplateImage, setCustomTemplateImage] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  const handleTemplateSelect = (template: TemplateOption) => {
    store.setTheme(template.themeId)
    store.setAccentColor(template.accentColor)
    store.setTemplateConfig(template.columns, template.style)
    store.setPhotoPosition(template.hasHeadshot ? 'left' : 'hidden')
    setCustomTemplateImage(template.customImageUrl ?? null)
    setScreen('editor')
  }

  if (screen === 'landing') {
    return <LandingPage onCreateResume={() => setScreen('templates')} />
  }

  if (screen === 'templates') {
    return <TemplatePicker onSelect={handleTemplateSelect} />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
      <div className="print:hidden">
        <Toolbar
          resume={store.resume}
          themeId={store.themeId}
          accentColor={store.accentColor}
          layoutSettings={store.layoutSettings}
          templateColumns={store.templateColumns}
          templateStyle={store.templateStyle}
          customTemplateImage={customTemplateImage}
          onThemeChange={store.setTheme}
          onAccentChange={store.setAccentColor}
          onColorPaletteChange={store.setColorPalette}
          onStartOver={() => { store.startOver(); setScreen('landing') }}
        />
      </div>
      {/* Mobile tab bar */}
      <div className="flex xl:hidden border-b border-gray-200 bg-white shrink-0 print:hidden">
        <button
          className={`flex-1 py-2 text-sm font-medium ${mobileTab === 'edit' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setMobileTab('edit')}
        >Edit</button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${mobileTab === 'preview' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500'}`}
          onClick={() => setMobileTab('preview')}
        >Preview</button>
      </div>

      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible" style={{ background: getBgTint(store.accentColor) }}>
        {/* Editor — hidden when printing */}
        <div className={`${mobileTab === 'edit' ? 'flex' : 'hidden'} xl:flex w-full xl:w-[420px] shrink-0 flex-col py-3 px-3 print:hidden`}>
          <div className="flex-1 overflow-hidden rounded-xl shadow-sm flex flex-col">
            <EditorPane store={store} />
          </div>
        </div>
        {/* Preview — always visible when printing */}
        <div className={`${mobileTab === 'preview' ? 'flex' : 'hidden'} xl:flex flex-1 overflow-hidden print:block print:overflow-visible`}>
          <PreviewPane
            resume={store.resume}
            themeId={store.themeId}
            accentColor={store.accentColor}
            layoutSettings={store.layoutSettings}
            customTemplateImage={customTemplateImage}
            templateColumns={store.templateColumns}
            templateStyle={store.templateStyle}
          />
        </div>
      </div>
    </div>
  )
}
