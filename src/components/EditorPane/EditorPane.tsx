import React from "react";
import { PersonalSection } from "./sections/PersonalSection";
import { WorkSection } from "./sections/WorkSection";
import { EducationSection } from "./sections/EducationSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { ReferencesSection } from "./sections/ReferencesSection";
import { MarkdownEditor } from "./MarkdownEditor";
import { SectionOrderPanel } from "./SectionOrderPanel";
import type { useResumeStore } from "@/hooks/useResumeStore";

type Store = ReturnType<typeof useResumeStore>;

interface Props {
  store: Store;
}

export function EditorPane({ store }: Props) {
  const {
    resume,
    editorMode,
    setEditorMode,
    setResume,
    updatePersonal,
    layoutSettings,
    templateColumns,
    setSectionOrder,
    setPhotoPosition,
    addWork,
    updateWork,
    removeWork,
    reorderWork,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    addProject,
    updateProject,
    removeProject,
    reorderProject,
    addSkill,
    updateSkill,
    removeSkill,
    reorderSkill,
    addCertification,
    updateCertification,
    removeCertification,
    reorderCertification,
    addReference,
    updateReference,
    removeReference,
    reorderReference,
    setReferencesOnRequest,
  } = store;

  return (
    <aside
      className="editor-pane flex flex-col h-full overflow-y-auto bg-white scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      aria-label="Resume editor"
    >
      {/* Edit / Markdown segmented toggle — top right, matches screenshot style */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-3 pb-2 flex justify-start">
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setEditorMode("form")}
            className="px-5 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: editorMode === "form" ? "#ffffff" : "#f9fafb",
              color: editorMode === "form" ? "#111827" : "#6b7280",
              fontWeight: editorMode === "form" ? 600 : 400,
            }}
          >
            Edit
          </button>
          <div className="w-px bg-gray-200" />
          <button
            type="button"
            onClick={() => setEditorMode("raw")}
            className="px-5 py-1.5 text-sm font-medium transition-colors"
            style={{
              background: editorMode === "raw" ? "#ffffff" : "#f9fafb",
              color: editorMode === "raw" ? "#111827" : "#6b7280",
              fontWeight: editorMode === "raw" ? 600 : 400,
            }}
          >
            Markdown
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-6">
        {editorMode === "form" ? (
          <>
            <PersonalSection
              data={resume.personal}
              onChange={updatePersonal}
              photoPosition={layoutSettings.photoPosition}
              onPhotoPositionChange={setPhotoPosition}
              templateColumns={templateColumns}
            />
            <WorkSection
              entries={resume.work}
              onAdd={addWork}
              onUpdate={updateWork}
              onRemove={removeWork}
              onReorder={reorderWork}
            />
            <EducationSection
              entries={resume.education}
              onAdd={addEducation}
              onUpdate={updateEducation}
              onRemove={removeEducation}
              onReorder={reorderEducation}
            />
            <SkillsSection
              entries={resume.skills}
              onAdd={addSkill}
              onUpdate={updateSkill}
              onRemove={removeSkill}
              onReorder={reorderSkill}
            />
            <ProjectsSection
              entries={resume.projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onRemove={removeProject}
              onReorder={reorderProject}
            />
            <CertificationsSection
              entries={resume.certifications}
              onAdd={addCertification}
              onUpdate={updateCertification}
              onRemove={removeCertification}
              onReorder={reorderCertification}
            />
            <ReferencesSection
              entries={resume.references}
              referencesOnRequest={resume.referencesOnRequest}
              onAdd={addReference}
              onUpdate={updateReference}
              onRemove={removeReference}
              onReorder={reorderReference}
              onToggleOnRequest={setReferencesOnRequest}
            />
            <SectionOrderPanel
              order={layoutSettings.sectionOrder}
              onChange={setSectionOrder}
            />
          </>
        ) : (
          <MarkdownEditor resume={resume} onUpdate={setResume} />
        )}
      </div>
    </aside>
  );
}
