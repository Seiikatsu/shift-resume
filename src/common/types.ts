/**
 * Excludes all keys from T that can be null or undefined.
 */
export type GetRequiredKeys<T> = {
  [K in keyof T]: null extends T[K]
    ? never
    : // does it extend undefined?
      undefined extends T[K]
      ? never
      : K;
}[keyof T];

/**
 * Mark provided keys as required for the specified object type.
 */
export type RequiredByKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;
