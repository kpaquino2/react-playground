"use client";

import { Project } from "@/store/playgroundStore";
import MenuBar from "../shared/MenuBar";

const ProjectsMenuBar = ({ project }: { project: Project }) => {
  return <MenuBar name={project.name} />;
};

export default ProjectsMenuBar;
