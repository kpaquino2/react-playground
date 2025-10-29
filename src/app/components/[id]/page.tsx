import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: component, error } = await supabase
    .from("components")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!component) {
    notFound();
  }

  return <></>;
}
