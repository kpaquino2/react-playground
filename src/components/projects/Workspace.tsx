"use client";

import { Project, usePlaygroundStore } from "@/store/playgroundStore";
import Editor from "../shared/Editor";
import {
  CheckIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { MouseEvent, useEffect, useRef, useState } from "react";

const Workspace = ({ project }: { project: Project }) => {
  const [selectedComponent, setSelectedComponent] = useState(
    project.components[0],
  );
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [newComponentName, setNewComponentName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const addComponent = usePlaygroundStore((state) => state.addComponent);
  const deleteComponent = usePlaygroundStore((state) => state.deleteComponent);
  const updateComponent = usePlaygroundStore(
    (state) => state.updateComponentCode,
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingComponent]);

  const handleCancel = () => {
    setIsAddingComponent(false);
    setNewComponentName("");
  };

  const handleAdd = () => {
    const compName = newComponentName.trim();
    const newComponent = {
      id: compName.toLocaleLowerCase(),
      name: compName,
      code: `
export default function ${compName}() {
  return <div>This is a new component</div>;
}
      `.trim(),
    };
    addComponent(project.id, newComponent);

    setIsAddingComponent(false);
    setNewComponentName("");
    setSelectedComponent(newComponent);
  };

  return (
    <div className="flex">
      <div className="group flex w-64 flex-col gap-1 border-r border-neutral-400 p-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Components</p>
          <button
            onClick={() => setIsAddingComponent(true)}
            className="cursor-pointer rounded-full bg-white/0 p-1 transition hover:bg-neutral-600"
          >
            <PlusIcon className="stroke-1.5 size-5 stroke-white" />
          </button>
        </div>
        {project.components.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedComponent(c)}
            className={
              (selectedComponent.id === c.id
                ? "bg-teal-700 "
                : "bg-white/0 hover:bg-neutral-600") +
              " flex w-full cursor-pointer items-center justify-between rounded px-2 py-1 text-start transition"
            }
          >
            {c.name}
            {c.name !== "App" && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteComponent(project.id, c.id);
                  if (selectedComponent.id === c.id)
                    setSelectedComponent(project.components[0]);
                }}
                className="cursor-pointer rounded-full bg-red-500 p-1.5 opacity-50 transition hover:opacity-100"
              >
                <TrashIcon className="size-3.5" />
              </button>
            )}
          </div>
        ))}
        {isAddingComponent ? (
          <div className="flex w-full items-center gap-0.5 rounded bg-neutral-600">
            <input
              type="text"
              ref={inputRef}
              onChange={(e) => setNewComponentName(e.target.value)}
              className="w-3/4 px-2 py-1 focus:ring-0 focus:outline-none"
            />
            <button
              onClick={handleAdd}
              className="cursor-pointer rounded-full bg-white/0 p-1 transition hover:bg-neutral-500 disabled:pointer-events-none disabled:opacity-50"
              disabled={!newComponentName.trim()}
            >
              <CheckIcon className="size-4 stroke-white stroke-2" />
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer rounded-full bg-white/0 p-1 transition hover:bg-neutral-500"
            >
              <XMarkIcon className="size-4 stroke-white stroke-2" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingComponent(true)}
            className="flex w-full cursor-pointer items-center gap-1 rounded bg-neutral-700 px-2 py-1 text-start opacity-0 transition group-hover:opacity-100 hover:bg-neutral-600"
          >
            <PlusIcon className="stroke-1.5 size-5 stroke-white" />
            <span>New Component</span>
          </button>
        )}
      </div>
      <div className="w-128">
        <Editor
          update={(id, code) => updateComponent(project.id, id, code)}
          component={selectedComponent}
        />
      </div>
    </div>
  );
};

export default Workspace;
