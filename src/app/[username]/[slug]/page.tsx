import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function VanityComponentPage({
  params,
}: {
  params: Promise<{
    username: string;
    slug: string;
  }>;
}) {
  const { username, slug } = await params;
  const supabase = await createClient();

  const { data: component, error } = await supabase
    .from("components")
    .select("id, profiles!components_created_by_fkey(username)")
    .eq("profiles.username", username)
    .eq("slug", slug)
    .single();

  if (error || !component) {
    notFound();
  }

  redirect(`/c/${component.id}`);
}
