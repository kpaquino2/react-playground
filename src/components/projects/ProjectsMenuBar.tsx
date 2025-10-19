"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import MenuBar from "../shared/MenuBar";

const ProjectsMenuBar = ({ id }: { id: string }) => {
  const project = usePlaygroundStore((state) =>
    state.projects.find((p) => p.id === id),
  );
  if (!project) return null;
  return <MenuBar name={project.name} />;
};

export default ProjectsMenuBar;
