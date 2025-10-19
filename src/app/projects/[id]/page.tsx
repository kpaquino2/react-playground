import ProjectsMenuBar from "@/components/projects/ProjectsMenuBar";
import Workspace from "@/components/projects/Workspace";

export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-full flex-col">
      <ProjectsMenuBar id={id} />
      <div className="flex flex-1">
        <Workspace id={id} />
      </div>
    </div>
  );
}
