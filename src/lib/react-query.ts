import {
  QueryClient,
  type DefaultOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

export const queryConfig = {
  queries: {
    // throwOnError: true
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  },
} satisfies DefaultOptions;
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export type ApiFnReturnType<
  FnType extends (...args: unknown[]) => Promise<unknown>,
> = Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: unknown[]) => unknown> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: unknown[]) => Promise<unknown>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;

export function maxRetry(failureCount: number, error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 401
  ) {
    return false;
  }

  return failureCount < 2;
}
