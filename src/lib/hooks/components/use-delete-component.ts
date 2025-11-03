import { type Component } from "@/lib/types";
import { useSWRMutation } from "../config/use-swr-mutation";
import { AppError, handleSupabaseError } from "@/lib/errors/handler";
import { type SWRMutationConfiguration } from "swr/mutation";
import { type createClient } from "@/lib/supabase/client";

const fetcher = async (
  supabase: ReturnType<typeof createClient>,
  arg: string,
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
    .delete()
    .eq("id", arg)
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
};

export function useDeleteComponent(
  config?: SWRMutationConfiguration<Component, AppError>,
) {
  return useSWRMutation(
    "my-components",
    fetcher,
    config,
  );
}
