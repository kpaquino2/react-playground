import type { Component } from "@/lib/types";
import { useSWR } from "../config/use-swr";
import { createClient } from "@/lib/supabase/client";

const fetcher = async (
  supabase: ReturnType<typeof createClient>,
  args_0: number,
) => {
  const targetUserId = (await supabase.auth.getUser()).data.user?.id;
  if (!targetUserId) return [];

  const { data, error } = await supabase
    .from("components")
    .select("*")
    .eq("created_by", targetUserId)
    .order("updated_at", { ascending: false })
    .limit(args_0);

  if (error) throw error;
  return data || [];
};

export function useUserComponents(limit: number = 24) {
  return useSWR<Component[], [number]>(
    ["my-components", limit],
    fetcher,
  );
}
