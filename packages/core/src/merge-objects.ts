// A utility type for merging two object types
export type MergeObjects<A, B> = keyof A extends never ? B
  : keyof B extends never ? A
  : B & Omit<A, keyof B>;
