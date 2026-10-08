export type Nullable<T> = T | null;

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
