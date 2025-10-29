import { AppError, handleSupabaseError } from "@/lib/errors/handler";
import { createClient } from "@/lib/supabase/client";
import { SWRConfiguration, SWRResponse } from "swr";
import useSWRDefault from "swr/immutable";

type SupabaseClient = ReturnType<typeof createClient>;

// Overload 1: No arguments
export function useSWR<T>(
  key: [string] | null,
  fetcher: (supabase: SupabaseClient) => Promise<T>,
  config?: SWRConfiguration<T, AppError>,
): SWRResponse<T, AppError>;

// Overload 2: With arguments
export function useSWR<T, Args extends any[]>(
  key: [string, ...Args] | null,
  fetcher: (supabase: SupabaseClient, ...args: Args) => Promise<T>,
  config?: SWRConfiguration<T, AppError>,
): SWRResponse<T, AppError>;

// Implementation
export function useSWR<T, Args extends any[] = []>(
  key: [string, ...Args] | null,
  fetcher: (supabase: SupabaseClient, ...args: Args) => Promise<T>,
  config: SWRConfiguration<T, AppError> = {},
): SWRResponse<T, AppError> {
  const supabase = createClient();

  return useSWRDefault<T, AppError>(
    key,
    async (keyArray: [string, ...Args]) => {
      try {
        const [, ...args] = keyArray;
        return await fetcher(supabase, ...(args as Args));
      } catch (error) {
        throw handleSupabaseError(error);
      }
    },
    config,
  );
}
