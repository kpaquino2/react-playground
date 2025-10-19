"use client";

import { usePlaygroundStore } from "@/store/playgroundStore";
import Editor from "../shared/Editor";
import { PlusIcon } from "@heroicons/react/24/solid";

const Workspace = ({ id }: { id: string }) => {
  const project = usePlaygroundStore((state) =>
    state.projects.find((p) => p.id === id),
  );
  if (!project) return null;
  return (
    <div className="flex">
      <div className="group flex w-64 flex-col border-r border-neutral-400 p-2">
        <div className="mb-1 font-semibold">Components</div>
        {project.components.map((c) => (
          <button
            key={c.id}
            className="w-full cursor-pointer rounded bg-white/0 px-2 py-1 text-start transition hover:bg-neutral-600"
          >
            {c.name}
          </button>
        ))}
        <button className="mt-1 flex w-full cursor-pointer items-center gap-1 rounded bg-neutral-700 px-2 py-1 text-start opacity-0 transition group-hover:opacity-100 hover:bg-neutral-600">
          <PlusIcon className="stroke-1.5 size-5 stroke-white" />
          <span>New Component</span>
        </button>
      </div>
      <div className="w-128">
        <Editor code={project.components[0]?.code} />
      </div>
    </div>
  );
};

export default Workspace;
