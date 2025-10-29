import { AppError } from "@/lib/errors/handler";
import { createClient } from "@/lib/supabase/client";
import { useSWRConfig } from "swr";
import useSWRMutationDefault, {
  type SWRMutationConfiguration,
  SWRMutationResponse,
} from "swr/mutation";

// Generic mutation wrapper for Supabase
export function useSWRMutation<T, Args = any>(
  key: string,
  mutator: (
    supabase: ReturnType<typeof createClient>,
    args: Args,
  ) => Promise<T>,
  config?: SWRMutationConfiguration<T, AppError, string, Args>,
): SWRMutationResponse<T, AppError, string, Args> {
  const supabase = createClient();
  const { mutate } = useSWRConfig();
  return useSWRMutationDefault<T, AppError, string, Args>(
    key,
    async (_, { arg }: { arg: Args }) => mutator(supabase, arg),
    {
      ...config,
      onSuccess: (data, key, c) => {
        // Revalidate all keys that start with this prefix
        mutate(
          (existingkey) => {
            // Check if key is an array and starts with 'components'
            return Array.isArray(existingkey) && existingkey[0] === key;
          },
          undefined,
          { revalidate: true },
        );
        // Call user's onSuccess if provided
        config?.onSuccess?.(data, key, c);
      },
    },
  );
}
