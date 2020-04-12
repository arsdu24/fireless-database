export interface EntityOptions {
  indexes: [];
}

export interface EntityColumnOptions {
  column: string;
  parser: (raw: any) => any;
  serializer: (data: any) => any;
}
