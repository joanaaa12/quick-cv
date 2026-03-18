import React, { useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ColorPalettePanel } from "./ColorPalettePanel";
import { ExportBar } from "./ExportBar";
import type {
  ResumeData,
  ThemeId,
  AccentColor,
  LayoutSettings,
  ColorPalette,
  TemplateColumns,
  TemplateStyle,
} from "@/types/resume";

interface Props {
  resume: ResumeData;
  themeId: ThemeId;
  accentColor: AccentColor;
  layoutSettings: LayoutSettings;
  templateColumns: TemplateColumns;
  templateStyle: TemplateStyle;
  customTemplateImage?: string | null;
  onThemeChange: (t: ThemeId) => void;
  onAccentChange: (a: AccentColor) => void;
  onColorPaletteChange: (palette: ColorPalette) => void;
  onStartOver: () => void;
}

export function Toolbar({
  resume,
  themeId,
  accentColor,
  layoutSettings,
  templateColumns,
  templateStyle,
  customTemplateImage,
  onThemeChange,
  onAccentChange,
  onColorPaletteChange,
  onStartOver,
}: Props) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Keep legacy accentColor in sync when the preset hex matches a known accent
  function handleColorPaletteChange(palette: ColorPalette) {
    onColorPaletteChange(palette);
    // Sync AccentColor preset if accent hex matches one of the 4 presets
    const presets: Record<string, AccentColor> = {
      "#0d9488": "teal",
      "#4f46e5": "indigo",
      "#e05252": "coral",
      "#d97706": "amber",
    };
    const matched = presets[palette.accentColor.toLowerCase()];
    if (matched) onAccentChange(matched);
  }

  return (
    <header
      className="toolbar sticky top-0 z-20 flex items-center justify-between gap-4 px-4 py-2 bg-white border-b border-gray-200 shadow-sm"
      role="banner"
    >
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-teal-600 flex items-center justify-center shrink-0">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span className="font-semibold text-sm text-gray-800 tracking-tight">
            QuickCV
          </span>
        </div>
        <ThemeSwitcher themeId={themeId} onChange={onThemeChange} />

        {/* Color palette toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setPaletteOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-teal-700 px-2 py-1 rounded border border-gray-200 hover:border-teal-400 transition-colors"
            aria-expanded={paletteOpen}
            aria-haspopup="true"
          >
            <span
              className="w-3 h-3 rounded-full border border-gray-300 inline-block"
              style={{
                backgroundColor:
                  layoutSettings.colorPalette.accentColor || "#0d9488",
              }}
            />
            Colors
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="currentColor"
              className={`transition-transform ${paletteOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M1 3l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {paletteOpen && (
            <div
              className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[260px]"
              role="dialog"
              aria-label="Color palette picker"
            >
              <ColorPalettePanel
                palette={layoutSettings.colorPalette}
                onChange={handleColorPaletteChange}
              />
            </div>
          )}
        </div>
      </div>

      <ExportBar
        resume={resume}
        themeId={themeId}
        accentColor={accentColor}
        layoutSettings={layoutSettings}
        templateColumns={templateColumns}
        templateStyle={templateStyle}
        customTemplateImage={customTemplateImage}
        onStartOver={onStartOver}
      />
    </header>
  );
}
