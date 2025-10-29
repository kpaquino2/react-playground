import { Component } from "@/lib/types";
import { useSWRMutation } from "../config/use-swr-mutation";
import { AppError, handleSupabaseError } from "@/lib/errors/handler";
import { SWRMutationConfiguration } from "swr/mutation";
import { createClient } from "@/lib/supabase/client";

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

  const { data, error } = await supabase
    .from("components")
    .insert({
      name: args.name,
      code: `
export default function ${args.name?.replaceAll(" ", "")}() {
  return <div>This is a new component</div>;
}
          `,
      slug: args.slug,
      description: args.description,
      visibility: args.visibility,
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
