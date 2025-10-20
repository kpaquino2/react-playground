// app/projects/[id]/ProjectPageClient.tsx
"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import ProjectsMenuBar from "./ProjectsMenuBar";
import Workspace from "./Workspace";
import { Preview } from "./Preview";

export function ProjectPageClient({ projectId }: { projectId: string }) {
  const project = usePlaygroundStore((state) =>
    state.projects.find((p) => p.id === projectId),
  );

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <ProjectsMenuBar project={project} />
      <div className="flex flex-1">
        <Workspace project={project} />
        <Preview project={project} className="flex-1" />
      </div>
    </div>
  );
}
