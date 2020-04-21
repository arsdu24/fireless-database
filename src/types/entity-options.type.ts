export interface EntityIndex<T extends {}> {
  name?: string;
  keys: (keyof T)[];
}

export interface EntityOptions<T extends {}> {
  resource?: string;
  indexes?: EntityIndex<T>[];
}

export type EntityPropertySerializer<T extends {}, K extends keyof T> = (
  data: T[K],
  entity: T,
) => any;
export type EntityPropertyParser<T extends {}, K extends keyof T> = (
  data: any,
  entity: T,
) => T[K];

export interface EntityPropertyOptions<T extends {}, K extends keyof T> {
  origin: string;
  type?: Function;
  serializer?: EntityPropertySerializer<T, K>;
  parser?: EntityPropertyParser<T, K>;
}
