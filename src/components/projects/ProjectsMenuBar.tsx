"use client";

import { useMonaco } from "@monaco-editor/react";
import MenuBar from "../shared/MenuBar";
import { usePlaygroundStore } from "@/store/playgroundStore";

interface ProjectsMenuBarProps {
  projectId: string;
  projectName: string;
  selectedComponentId: string;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (b: boolean) => void;
}

const ProjectsMenuBar = ({
  projectId,
  projectName,
  selectedComponentId,
  hasUnsavedChanges,
  setHasUnsavedChanges,
}: ProjectsMenuBarProps) => {
  const monaco = useMonaco();
  const updateComponentCode = usePlaygroundStore(
    (state) => state.updateComponentCode,
  );

  const handleSave = () => {
    const newCode = monaco?.editor.getEditors()[0]?.getValue();
    if (!newCode) return;
    updateComponentCode(projectId, selectedComponentId, newCode);
    setHasUnsavedChanges(false);
  };

  return (
    <MenuBar name={projectName} backButtonLink="/projects">
      <button
        className="cursor-pointer rounded bg-teal-600 px-4 py-1 disabled:pointer-events-none disabled:opacity-50"
        onClick={handleSave}
        disabled={!hasUnsavedChanges}
      >
        Save + Run
      </button>
    </MenuBar>
  );
};

export default ProjectsMenuBar;
