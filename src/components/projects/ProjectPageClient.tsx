// app/projects/[id]/ProjectPageClient.tsx
"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import ProjectsMenuBar from "./ProjectsMenuBar";
import Workspace from "./Workspace";
import { Preview } from "./Preview";
import { useState } from "react";

export function ProjectPageClient({ projectId }: { projectId: string }) {
  const project = usePlaygroundStore((state) =>
    state.projects.find((p) => p.id === projectId),
  );

  const [selectedComponent, setSelectedComponent] = useState(
    project?.components[0],
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <ProjectsMenuBar
        projectId={project.id}
        projectName={project.name}
        selectedComponentId={selectedComponent?.id || project.components[0].id}
        hasUnsavedChanges={hasUnsavedChanges}
        setHasUnsavedChanges={setHasUnsavedChanges}
      />
      <div className="flex flex-1">
        <Workspace
          projectId={project.id}
          projectComponents={project.components}
          selectedComponent={selectedComponent || project.components[0]}
          setSelectedComponent={setSelectedComponent}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
        <Preview project={project} className="flex-1" />
      </div>
    </div>
  );
}
