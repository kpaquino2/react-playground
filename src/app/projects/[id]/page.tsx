import { ProjectPageClient } from "@/components/projects/ProjectPageClient";

export default async function Project({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectPageClient projectId={id} />;
}
