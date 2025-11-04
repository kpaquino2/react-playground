import { type Component } from "@/lib/types";
import { useSWRMutation } from "../config/use-swr-mutation";
import { AppError, handleSupabaseError } from "@/lib/errors/handler";
import { type SWRMutationConfiguration } from "swr/mutation";
import { type createClient } from "@/lib/supabase/client";

const fetcher = async (
  supabase: ReturnType<typeof createClient>,
  args: Partial<Component>,
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new AppError(
      "User not authenticated",
      "Please sign in to create components",
      "AUTH_REQUIRED",
    );
  }
  const initialCode = `export default function ${
    args.name?.replaceAll(" ", "")
  }() {
  return (
    <div className="w-48 rounded border border-dashed border-zinc-900/30 bg-zinc-100 px-4 py-3">
      <h3 className="font-semibold text-zinc-800">New Component</h3>
      <p className="text-sm text-zinc-500">
        Edit then click &rdquo;RUN&rdquo; to see your changes.
      </p>
    </div>
  );
}`;

  const { data, error } = await supabase
    .from("components")
    .insert({
      name: args.name?.trim() || "",
      code: initialCode.trim(),
      slug: args.slug?.trim() || "",
      description: args.description,
      visibility: args.visibility || "public",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};

export function useCreateComponent(
  config?: SWRMutationConfiguration<Component, AppError>,
) {
  return useSWRMutation(
    "my-components",
    fetcher,
    config,
  );
}
