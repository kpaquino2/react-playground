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
    .update({
      name: args.name,
      slug: args.slug,
      description: args.description,
      visibility: args.visibility,
    })
    .eq("id", args.id)
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};

export function useUpdateComponent(
  config?: SWRMutationConfiguration<Component, AppError>,
) {
  return useSWRMutation(
    "my-components",
    fetcher,
    config,
  );
}
