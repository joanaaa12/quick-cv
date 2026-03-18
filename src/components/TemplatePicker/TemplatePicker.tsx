import { useState, useMemo, useRef, useCallback } from "react";
import type { ThemeId, AccentColor } from "@/types/resume";
import { ACCENT_COLORS } from "@/constants/themes";

// ─── Landing Page ────────────────────────────────────────────────────────────

interface LandingPageProps {
  onCreateResume: () => void;
}

export function LandingPage({ onCreateResume }: LandingPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#f5f7ff",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Navbar */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
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
            <span className="font-bold text-base text-gray-900 tracking-tight">
              QuickCV
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onCreateResume}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#0d9488" }}
            >
              Create my resume
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — headline + CTAs + social proof */}
          <div className="flex flex-col gap-7">
            <div>
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                This resume builder
                <br />
                gets you <span style={{ color: "#0d9488" }}>hired.</span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 max-w-md leading-relaxed">
                Create a professional resume in minutes. Choose from
                expert-designed templates and land your dream job.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onCreateResume}
                className="px-7 py-3.5 text-base font-bold text-white rounded-xl shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
                style={{ background: "#0d9488" }}
              >
                Create my resume
              </button>
              {/* <button
                type="button"
                disabled
                title="Coming soon"
                className="px-7 py-3.5 text-base font-bold text-gray-400 rounded-xl border-2 border-gray-200 bg-white cursor-not-allowed select-none"
              >
                Upload my resume
              </button> */}
            </div>
          </div>

          {/* RIGHT — floating resume mockup card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Main resume card */}
              <div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ border: "1px solid #e5e7eb" }}
              >
                {/* Mock resume header */}
                <div className="px-7 pt-7 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #0d9488, #4f46e5)",
                      }}
                    >
                      A
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-base">
                        Alice Hart
                      </div>
                      <div className="text-sm text-gray-500">Math Teacher</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        alice@email.com · (770) 489-3364
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock resume body — line placeholders */}
                <div className="px-7 py-5 space-y-4">
                  {/* Employment History section */}
                  <div>
                    <div
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: "#0d9488" }}
                    >
                      Employment History
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2.5 rounded-full bg-gray-200 w-3/4" />
                      <div className="h-2 rounded-full bg-gray-100 w-full" />
                      <div className="h-2 rounded-full bg-gray-100 w-5/6" />
                      <div className="h-2 rounded-full bg-gray-100 w-4/5" />
                    </div>
                  </div>
                  <div>
                    <div className="space-y-1.5">
                      <div className="h-2.5 rounded-full bg-gray-200 w-2/3" />
                      <div className="h-2 rounded-full bg-gray-100 w-full" />
                      <div className="h-2 rounded-full bg-gray-100 w-3/4" />
                    </div>
                  </div>
                  {/* Skills section */}
                  <div>
                    <div
                      className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: "#0d9488" }}
                    >
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Management Skills",
                        "Analytical Thinking",
                        "Leadership",
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-100"
                        >
                          {skill}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full border border-dashed border-gray-300 text-gray-400">
                        + Add skill
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating score badge */}
              <div className="absolute -left-6 top-8 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2.5 border border-gray-100">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "#0d9488" }}
                >
                  81%
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    Resume Score
                  </div>
                  <div className="text-[10px] text-gray-400">Good match</div>
                </div>
              </div>

              {/* Floating ATS badge */}
              <div className="absolute -right-4 bottom-10 bg-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-2 border border-gray-100">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-xs font-bold text-gray-800">
                  ATS Perfect
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer strip */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white">
        © {new Date().getFullYear()} QuickCV — Free, no account required.
      </footer>
    </div>
  );
}

export type TemplateStyle = "traditional" | "creative" | "contemporary";
export type TemplateColumns = 1 | 2;
export type OccupationCategory =
  | "management"
  | "office"
  | "business"
  | "retail"
  | "healthcare"
  | "tech"
  | "education"
  | "creative";

export interface TemplateOption {
  id: string;
  name: string;
  style: TemplateStyle;
  columns: TemplateColumns;
  hasHeadshot: boolean;
  themeId: ThemeId;
  accentColor: AccentColor;
  occupations: OccupationCategory[];
  recommended?: boolean;
  customImageUrl?: string; // set when user uploads their own template image
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "trad-1col",
    name: "Traditional",
    style: "traditional",
    columns: 1,
    hasHeadshot: false,
    themeId: "classic",
    accentColor: "teal",
    occupations: ["management", "office", "business"],
    recommended: true,
  },
  {
    id: "trad-2col",
    name: "Classic Two-Column",
    style: "creative",
    columns: 2,
    hasHeadshot: false,
    themeId: "classic",
    accentColor: "indigo",
    occupations: ["management", "business", "retail"],
    recommended: true,
  },
  {
    id: "trad-photo",
    name: "Professional",
    style: "creative",
    columns: 2,
    hasHeadshot: true,
    themeId: "classic",
    accentColor: "coral",
    occupations: ["office", "healthcare", "retail"],
    recommended: true,
  },
  {
    id: "creative-1col",
    name: "Creative Bold",
    style: "creative",
    columns: 1,
    hasHeadshot: false,
    themeId: "modern",
    accentColor: "coral",
    occupations: ["creative", "tech", "education"],
  },
  {
    id: "creative-photo",
    name: "Creative with Photo",
    style: "creative",
    columns: 2,
    hasHeadshot: true,
    themeId: "modern",
    accentColor: "amber",
    occupations: ["creative", "education"],
  },
  {
    id: "contemp-1col",
    name: "Contemporary Clean",
    style: "contemporary",
    columns: 1,
    hasHeadshot: false,
    themeId: "modern",
    accentColor: "teal",
    occupations: ["tech", "business", "management"],
  },
  {
    id: "contemp-2col",
    name: "Contemporary Split",
    style: "contemporary",
    columns: 2,
    hasHeadshot: false,
    themeId: "modern",
    accentColor: "indigo",
    occupations: ["tech", "creative", "education"],
  },
  {
    id: "contemp-photo",
    name: "Contemporary Photo",
    style: "contemporary",
    columns: 2,
    hasHeadshot: true,
    themeId: "modern",
    accentColor: "teal",
    occupations: ["management", "office", "healthcare"],
  },
  {
    id: "trad-business",
    name: "Business Classic",
    style: "traditional",
    columns: 1,
    hasHeadshot: false,
    themeId: "classic",
    accentColor: "amber",
    occupations: ["business", "office", "retail"],
  },
];

// SVG-based mini resume preview — fixed A4 viewport (210×297 units) renders crisply at any size
function MiniPreview({ template }: { template: TemplateOption }) {
  const accent = ACCENT_COLORS.find((c) => c.id === template.accentColor)!;
  const a = accent.hex; // accent color
  const txt = "#222222"; // dark text
  const sub = "#888888"; // subtitle / secondary text
  const line = "#dddddd"; // body text lines
  const sidebarBg =
    template.themeId === "modern" ? accent.hex + "22" : "#f0f0f0";

  // Shared "text line" helper — rx/ry for slightly rounded ends
  const Line = ({
    x,
    y,
    w,
    h = 3,
    fill = line,
  }: {
    x: number;
    y: number;
    w: number;
    h?: number;
    fill?: string;
  }) => <rect x={x} y={y} width={w} height={h} rx={1.5} ry={1.5} fill={fill} />;

  // Section heading — a colored bar + label area
  const SectionHead = ({
    x,
    y,
    w,
    fill,
  }: {
    x: number;
    y: number;
    w: number;
    fill: string;
  }) => (
    <>
      <rect x={x} y={y} width={w} height={2.5} rx={1} ry={1} fill={fill} />
    </>
  );

  const W = 210; // SVG viewport width
  const H = 190; // SVG viewport height (cropped — shows top ~2/3 of an A4 page)
  const pad = 14; // page padding

  const renderSingleColumn = () => {
    const cw = W - pad * 2;
    const headerTxt = template.themeId === "modern" ? "#ffffff" : txt;

    return (
      <>
        {/* Header band */}
        {template.themeId === "modern" && (
          <rect x={0} y={0} width={W} height={52} fill={a} />
        )}

        {template.hasHeadshot ? (
          <>
            {/* Avatar circle */}
            <circle
              cx={pad + 16}
              cy={26}
              r={16}
              fill={template.themeId === "modern" ? "#ffffff44" : "#cccccc"}
            />
            {/* Name + title next to avatar */}
            <Line x={pad + 38} y={18} w={90} h={6} fill={headerTxt} />
            <Line
              x={pad + 38}
              y={28}
              w={60}
              h={3.5}
              fill={template.themeId === "modern" ? "#ffffffaa" : sub}
            />
            <Line
              x={pad + 38}
              y={35}
              w={80}
              h={2.5}
              fill={template.themeId === "modern" ? "#ffffff88" : line}
            />
          </>
        ) : (
          <>
            {/* Name */}
            <Line
              x={pad}
              y={template.themeId === "modern" ? 16 : 14}
              w={110}
              h={7}
              fill={headerTxt}
            />
            {/* Title */}
            <Line
              x={pad}
              y={template.themeId === "modern" ? 27 : 25}
              w={75}
              h={4}
              fill={template.themeId === "modern" ? "#ffffffcc" : sub}
            />
            {/* Contact line */}
            <Line
              x={pad}
              y={template.themeId === "modern" ? 35 : 33}
              w={120}
              h={2.5}
              fill={template.themeId === "modern" ? "#ffffff88" : line}
            />
          </>
        )}

        {/* Divider */}
        {template.themeId === "classic" && (
          <line
            x1={pad}
            y1={46}
            x2={W - pad}
            y2={46}
            stroke={line}
            strokeWidth={0.8}
          />
        )}

        {/* Section 1 — Experience */}
        <SectionHead x={pad} y={54} w={cw} fill={a} />
        <Line x={pad} y={60} w={100} h={3.5} fill={txt} />
        <Line x={pad} y={66} w={60} h={2.5} fill={sub} />
        <Line x={pad + 6} y={71} w={cw - 6} h={2} />
        <Line x={pad + 6} y={75} w={cw - 20} h={2} />
        <Line x={pad + 6} y={79} w={cw - 10} h={2} />

        <Line x={pad} y={86} w={95} h={3.5} fill={txt} />
        <Line x={pad} y={92} w={55} h={2.5} fill={sub} />
        <Line x={pad + 6} y={97} w={cw - 6} h={2} />
        <Line x={pad + 6} y={101} w={cw - 30} h={2} />

        {/* Section 2 — Education */}
        <SectionHead x={pad} y={110} w={cw} fill={a} />
        <Line x={pad} y={116} w={130} h={3.5} fill={txt} />
        <Line x={pad} y={122} w={80} h={2.5} fill={sub} />

        {/* Section 3 — Skills */}
        <SectionHead x={pad} y={132} w={cw} fill={a} />
        <Line x={pad} y={138} w={50} h={2.5} />
        <Line x={pad} y={143} w={70} h={2.5} />
        <Line x={pad} y={148} w={40} h={2.5} />

        {/* Section 4 — Certifications */}
        <SectionHead x={pad} y={158} w={cw} fill={a} />
        <Line x={pad} y={164} w={110} h={3} fill={txt} />
        <Line x={pad} y={170} w={70} h={2.5} fill={sub} />

        {/* Section 5 — References */}
        <SectionHead x={pad} y={180} w={cw} fill={a} />
        <Line x={pad} y={186} w={80} h={3} fill={txt} />
        <Line x={pad} y={192} w={60} h={2.5} fill={sub} />
        <Line x={pad} y={198} w={90} h={2} />
      </>
    );
  };

  const renderTwoColumn = () => {
    const headerH = 42; // full-width header band height
    const sideW = 64;
    const mainX = pad + sideW + 10;
    const mainW = W - mainX - pad;
    const bodyY = headerH; // where sidebar + main start

    return (
      <>
        {/* Full-width accent header */}
        <rect x={0} y={0} width={W} height={headerH} fill={a} />

        {/* Name + contact in header */}
        {template.hasHeadshot && (
          <circle cx={pad + 14} cy={headerH / 2} r={13} fill="#ffffff44" />
        )}
        <Line
          x={template.hasHeadshot ? pad + 32 : pad}
          y={12}
          w={template.hasHeadshot ? 90 : 110}
          h={7}
          fill="#ffffff"
        />
        <Line
          x={template.hasHeadshot ? pad + 32 : pad}
          y={23}
          w={template.hasHeadshot ? 70 : 85}
          h={3}
          fill="#ffffff99"
        />
        <Line
          x={template.hasHeadshot ? pad + 32 : pad}
          y={30}
          w={template.hasHeadshot ? 100 : 120}
          h={2.5}
          fill="#ffffff66"
        />

        {/* Sidebar background (below header) */}
        <rect
          x={0}
          y={bodyY}
          width={pad + sideW + 5}
          height={H - bodyY}
          fill={sidebarBg}
        />

        {/* Sidebar sections */}
        <Line x={pad + 2} y={bodyY + 8} w={sideW - 4} h={3} fill={a} />
        <Line x={pad + 4} y={bodyY + 14} w={sideW - 14} h={2} />
        <Line x={pad + 4} y={bodyY + 18} w={sideW - 20} h={2} />
        <Line x={pad + 4} y={bodyY + 22} w={sideW - 18} h={2} />

        <Line x={pad + 2} y={bodyY + 32} w={sideW - 4} h={3} fill={a} />
        <Line x={pad + 4} y={bodyY + 38} w={sideW - 12} h={2} />
        <Line x={pad + 4} y={bodyY + 42} w={sideW - 16} h={2} />

        <Line x={pad + 2} y={bodyY + 52} w={sideW - 4} h={3} fill={a} />
        <Line x={pad + 4} y={bodyY + 58} w={sideW - 10} h={2} />
        <Line x={pad + 4} y={bodyY + 62} w={sideW - 18} h={2} />
        <Line x={pad + 4} y={bodyY + 66} w={sideW - 14} h={2} />

        {/* Main area — experience */}
        <SectionHead x={mainX} y={bodyY + 8} w={mainW} fill={a} />
        <Line x={mainX} y={bodyY + 14} w={mainW * 0.65} h={3.5} fill={txt} />
        <Line x={mainX} y={bodyY + 20} w={mainW * 0.45} h={2.5} fill={sub} />
        <Line x={mainX + 4} y={bodyY + 25} w={mainW - 4} h={2} />
        <Line x={mainX + 4} y={bodyY + 29} w={mainW - 14} h={2} />
        <Line x={mainX + 4} y={bodyY + 33} w={mainW - 8} h={2} />

        <Line x={mainX} y={bodyY + 40} w={mainW * 0.6} h={3.5} fill={txt} />
        <Line x={mainX} y={bodyY + 46} w={mainW * 0.4} h={2.5} fill={sub} />
        <Line x={mainX + 4} y={bodyY + 51} w={mainW - 4} h={2} />
        <Line x={mainX + 4} y={bodyY + 55} w={mainW - 20} h={2} />

        {/* Education */}
        <SectionHead x={mainX} y={bodyY + 64} w={mainW} fill={a} />
        <Line x={mainX} y={bodyY + 70} w={mainW * 0.8} h={3.5} fill={txt} />
        <Line x={mainX} y={bodyY + 76} w={mainW * 0.55} h={2.5} fill={sub} />

        {/* Projects */}
        <SectionHead x={mainX} y={bodyY + 86} w={mainW} fill={a} />
        <Line x={mainX} y={bodyY + 92} w={mainW * 0.5} h={3} fill={txt} />
        <Line x={mainX} y={bodyY + 98} w={mainW - 4} h={2} />
        <Line x={mainX} y={bodyY + 102} w={mainW - 20} h={2} />
      </>
    );
  };

  return (
    <div
      className="relative w-full"
      style={{ paddingBottom: `${(H / W) * 100}%` }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 w-full h-full rounded"
        style={{ background: "#ffffff" }}
        aria-hidden="true"
      >
        {template.columns === 2 ? renderTwoColumn() : renderSingleColumn()}

        {/* Recommended badge — pinned to bottom of cropped viewport */}
        {template.recommended && (
          <>
            <rect x={0} y={H - 13} width={W} height={13} fill={a} />
            <text
              x={W / 2}
              y={H - 4}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={6.5}
              fontWeight="bold"
              letterSpacing="0.8"
              style={{ fontFamily: "sans-serif" }}
            >
              RECOMMENDED
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

// Color swatch row for a template card
function ColorSwatches({
  selectedAccent,
  onSelect,
}: {
  selectedAccent: AccentColor;
  onSelect: (color: AccentColor) => void;
}) {
  return (
    <div className="flex gap-1 mt-1 justify-center">
      {ACCENT_COLORS.map((color) => (
        <button
          key={color.id}
          type="button"
          title={color.label}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(color.id);
          }}
          className="rounded-full border-2 transition-transform hover:scale-110"
          style={{
            width: 14,
            height: 14,
            background: color.hex,
            borderColor: selectedAccent === color.id ? "#222" : "transparent",
          }}
          aria-label={`${color.label} accent`}
          aria-pressed={selectedAccent === color.id}
        />
      ))}
    </div>
  );
}

interface Props {
  onSelect: (template: TemplateOption) => void;
}

export function TemplatePicker({ onSelect }: Props) {
  const [filterHeadshot, setFilterHeadshot] = useState<
    "any" | "with" | "without"
  >("any");
  const [filterColumns, setFilterColumns] = useState<0 | 1 | 2>(0);
  const [filterStyles, setFilterStyles] = useState<Set<TemplateStyle>>(
    new Set(),
  );
  const [selectedId, setSelectedId] = useState<string>(TEMPLATES[0].id);
  // Per-card accent overrides
  const [accentOverrides, setAccentOverrides] = useState<
    Record<string, AccentColor>
  >({});
  // Custom uploaded template
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      setSelectedId("custom-upload");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageFile(file);
  };

  const clearFilters = () => {
    setFilterHeadshot("any");
    setFilterColumns(0);
    setFilterStyles(new Set());
  };

  const hasFilters =
    filterHeadshot !== "any" || filterColumns !== 0 || filterStyles.size > 0;

  const filtered = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (filterHeadshot === "with" && !t.hasHeadshot) return false;
      if (filterHeadshot === "without" && t.hasHeadshot) return false;
      if (filterColumns !== 0 && t.columns !== filterColumns) return false;
      if (filterStyles.size > 0 && !filterStyles.has(t.style)) return false;
      return true;
    });
  }, [filterHeadshot, filterColumns, filterStyles]);

  const handleUseTemplate = () => {
    if (selectedId === "custom-upload" && uploadedImage) {
      onSelect({
        id: "custom-upload",
        name: "Custom Upload",
        style: "contemporary",
        columns: 1,
        hasHeadshot: false,
        themeId: "modern",
        accentColor: "teal",
        occupations: [],
        customImageUrl: uploadedImage,
      });
      return;
    }
    const template =
      filtered.find((t) => t.id === selectedId) ?? filtered[0] ?? TEMPLATES[0];
    const accentColor = accentOverrides[template.id] ?? template.accentColor;
    onSelect({ ...template, accentColor });
  };

  const handleChooseLater = () => {
    onSelect({
      ...TEMPLATES[0],
      accentColor: accentOverrides[TEMPLATES[0].id] ?? TEMPLATES[0].accentColor,
    });
  };

  const BG_TINTS: Record<string, string> = {
    teal: "#f0fdfa",
    indigo: "#eef2ff",
    coral: "#fff1f1",
    amber: "#fffbeb",
  };

  const selectedTemplate =
    selectedId === "custom-upload"
      ? null
      : (filtered.find((t) => t.id === selectedId) ??
        TEMPLATES.find((t) => t.id === selectedId) ??
        TEMPLATES[0]);

  const activeAccent = selectedTemplate
    ? (accentOverrides[selectedTemplate.id] ?? selectedTemplate.accentColor)
    : "teal";

  const bgTint = BG_TINTS[activeAccent] ?? "#f8fafc";

  const PillFilter = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border"
      style={{
        borderColor: active ? "#0d9488" : "#d1d5db",
        color: active ? "#0d9488" : "#374151",
        background: active ? "#f0fdfa" : "#ffffff",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="flex flex-col h-screen overflow-hidden transition-colors duration-500"
      style={{ background: bgTint }}
    >
      {/* Top filter bar */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Please choose a template
        </h1>

        {/* Pill filters row */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* "All templates" pill — active when no filters */}
          <PillFilter
            label="All templates"
            active={!hasFilters}
            onClick={clearFilters}
          />

          <PillFilter
            label="Simple"
            active={
              filterStyles.has("traditional") &&
              filterStyles.size === 1 &&
              filterHeadshot === "any" &&
              filterColumns === 0
            }
            onClick={() => {
              setFilterHeadshot("any");
              setFilterColumns(0);
              setFilterStyles(new Set(["traditional"]));
            }}
          />

          <PillFilter
            label="Creative"
            active={
              filterStyles.has("creative") &&
              filterStyles.size === 1 &&
              filterHeadshot === "any" &&
              filterColumns === 0
            }
            onClick={() => {
              setFilterHeadshot("any");
              setFilterColumns(0);
              setFilterStyles(new Set(["creative"]));
            }}
          />

          <PillFilter
            label="Picture"
            active={
              filterHeadshot === "with" &&
              filterStyles.size === 0 &&
              filterColumns === 0
            }
            onClick={() => {
              setFilterHeadshot(filterHeadshot === "with" ? "any" : "with");
              setFilterColumns(0);
              setFilterStyles(new Set());
            }}
          />

          <PillFilter
            label="Contemporary"
            active={
              filterStyles.has("contemporary") &&
              filterStyles.size === 1 &&
              filterHeadshot === "any" &&
              filterColumns === 0
            }
            onClick={() => {
              setFilterHeadshot("any");
              setFilterColumns(0);
              setFilterStyles(new Set(["contemporary"]));
            }}
          />

          <PillFilter
            label="Two-column"
            active={
              filterColumns === 2 &&
              filterStyles.size === 0 &&
              filterHeadshot === "any"
            }
            onClick={() => {
              setFilterColumns(filterColumns === 2 ? 0 : 2);
              setFilterHeadshot("any");
              setFilterStyles(new Set());
            }}
          />
        </div>
      </div>

      {/* Main content — template grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-gray-500 mb-5">
            Select a layout and color to get started. You can change this any
            time.
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-sm">No templates match these filters.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 text-sm text-teal-600 hover:text-teal-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {/* Upload card — always shown as first item */}
              {uploadedImage ? (
                /* Uploaded image card */
                <div
                  onClick={() => setSelectedId("custom-upload")}
                  className="cursor-pointer"
                >
                  <div
                    className="rounded-lg overflow-hidden transition-all relative"
                    style={{
                      border:
                        selectedId === "custom-upload"
                          ? "2.5px solid #6366f1"
                          : "2.5px solid #e5e7eb",
                      boxShadow:
                        selectedId === "custom-upload"
                          ? "0 0 0 3px #6366f128"
                          : "none",
                    }}
                  >
                    {/* Aspect ratio box matching SVG previews */}
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: `${(190 / 210) * 100}%` }}
                    >
                      <img
                        src={uploadedImage}
                        alt="Custom template"
                        className="absolute inset-0 w-full h-full object-cover rounded"
                      />
                    </div>
                    {/* Replace button overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded transition-colors"
                    >
                      Replace
                    </button>
                  </div>
                  <div className="mt-1.5 px-0.5">
                    <p className="text-xs font-medium text-gray-700">
                      My Template
                    </p>
                    <p className="text-xs text-gray-400">Custom upload</p>
                  </div>
                </div>
              ) : (
                /* Drop zone card */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  className="cursor-pointer"
                >
                  <div
                    className="rounded-lg transition-all flex flex-col items-center justify-center gap-2 text-center"
                    style={{
                      paddingBottom: `${(190 / 210) * 100}%`,
                      position: "relative",
                      border: isDraggingOver
                        ? "2.5px dashed #6366f1"
                        : "2.5px dashed #d1d5db",
                      background: isDraggingOver ? "#eef2ff" : "#f9fafb",
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                        style={{
                          background: isDraggingOver ? "#e0e7ff" : "#f3f4f6",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isDraggingOver ? "#6366f1" : "#9ca3af"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <p className="text-xs font-medium text-gray-600 leading-tight">
                        Upload Background
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        PNG, JPG, PDF image
                      </p>
                    </div>
                  </div>
                  <div className="mt-1.5 px-0.5">
                    <p className="text-xs font-medium text-gray-500">
                      Use your own
                    </p>
                    <p className="text-xs text-gray-400">Upload an image</p>
                  </div>
                </div>
              )}

              {/* Built-in template cards */}
              {filtered.map((template) => {
                const currentAccent =
                  accentOverrides[template.id] ?? template.accentColor;
                const accentHex = ACCENT_COLORS.find(
                  (c) => c.id === currentAccent,
                )!.hex;
                const isSelected = selectedId === template.id;

                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedId(template.id)}
                    className="cursor-pointer group"
                  >
                    <div
                      className="rounded-lg overflow-hidden transition-all"
                      style={{
                        border: isSelected
                          ? `2.5px solid ${accentHex}`
                          : "2.5px solid #e5e7eb",
                        boxShadow: isSelected
                          ? `0 0 0 3px ${accentHex}28`
                          : "none",
                      }}
                    >
                      <MiniPreview
                        template={{ ...template, accentColor: currentAccent }}
                      />
                    </div>

                    <div className="mt-1.5 px-0.5">
                      <p className="text-xs font-medium text-gray-700">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize mb-1">
                        {template.style} · {template.columns} col
                        {template.columns > 1 ? "s" : ""}
                        {template.hasHeadshot ? " · Photo" : ""}
                      </p>
                      <ColorSwatches
                        selectedAccent={currentAccent}
                        onSelect={(color) =>
                          setAccentOverrides((prev) => ({
                            ...prev,
                            [template.id]: color,
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer action bar */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleChooseLater}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Choose Later
          </button>
          <button
            type="button"
            onClick={handleUseTemplate}
            className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background:
                selectedId === "custom-upload"
                  ? "#0D9488"
                  : filtered.length === 0
                    ? "#9ca3af"
                    : (ACCENT_COLORS.find(
                        (c) =>
                          c.id ===
                          (accentOverrides[selectedId] ??
                            (
                              filtered.find((t) => t.id === selectedId) ??
                              filtered[0]
                            )?.accentColor),
                      )?.hex ?? "#0D9488"),
            }}
            disabled={filtered.length === 0 && selectedId !== "custom-upload"}
          >
            Use this template
          </button>
        </div>
      </div>
    </div>
  );
}
