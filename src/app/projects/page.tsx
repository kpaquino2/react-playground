"use client";
import { usePlaygroundStore } from "@/store/playgroundStore";
import Link from "next/link";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function Projects() {
  const projects = usePlaygroundStore((state) => state.projects);
  const addProject = usePlaygroundStore((state) => state.addProject);
  const deleteProject = usePlaygroundStore((state) => state.deleteProject);
  const [newProjectName, setNewProjectName] = useState("");

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    addProject({
      id: Date.now().toString(),
      name: newProjectName,
      components: [],
    });
    setNewProjectName("");
  };

  return (
    <div className="flex h-full w-full flex-col items-center py-10">
      <h2 className="mb-6 text-2xl font-bold">Projects</h2>
      <div className="mb-8 flex gap-2">
        <input
          className="rounded border px-2 py-1"
          placeholder="New project name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button
          className="rounded bg-teal-600 px-4 py-1 text-white transition hover:bg-teal-700"
          onClick={handleAddProject}
        >
          Add Project
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="mt-10 text-neutral-500">
          No projects yet. Create your first project!
        </div>
      ) : (
        <div className="flex w-full max-w-md flex-col space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              className="group flex cursor-pointer items-center justify-between rounded bg-neutral-700 px-4 py-2 shadow"
              href={`projects/${project.id}`}
            >
              <span className="font-medium">{project.name}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
                className="cursor-pointer rounded-full bg-red-500 p-1.5 opacity-0 transition group-hover:opacity-50 hover:opacity-100"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
