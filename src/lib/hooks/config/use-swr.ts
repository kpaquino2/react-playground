import type { AppError } from "@/lib/errors/handler";
import { createClient } from "@/lib/supabase/client";
import { type SWRConfiguration, type SWRResponse } from "swr";
import useSWRDefault from "swr/immutable";

type SupabaseClient = ReturnType<typeof createClient>;

// Overload 1: No arguments
export function useSWR<T>(
  key: [string] | null,
  fetcher: (supabase: SupabaseClient) => Promise<T>,
  config?: SWRConfiguration<T, AppError>,
): SWRResponse<T, AppError>;

// Overload 2: With arguments
export function useSWR<T, Args extends unknown[]>(
  key: [string, ...Args] | null,
  fetcher: (supabase: SupabaseClient, ...args: Args) => Promise<T>,
  config?: SWRConfiguration<T, AppError>,
): SWRResponse<T, AppError>;

// Implementation
export function useSWR<T, Args extends unknown[] = []>(
  key: [string, ...Args] | null,
  fetcher: (supabase: SupabaseClient, ...args: Args) => Promise<T>,
  config: SWRConfiguration<T, AppError> = {},
): SWRResponse<T, AppError> {
  const supabase = createClient();

  return useSWRDefault<T, AppError>(
    key,
    async (keyArray: [string, ...Args]) => {
      const [, ...args] = keyArray;
      return await fetcher(supabase, ...(args as Args));
    },
    config,
  );
}
