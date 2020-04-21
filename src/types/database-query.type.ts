import { DeepPartial } from 'utility-types';

export type PlainEntity<T extends {}> = T | Partial<T> | DeepPartial<T>;

export type EntityPropertyFilter<K> =
  | K
  | RegExp
  | {
      $notEqual?: K;
      $greaterThen?: K;
      $lessThen?: K;
      $greaterThenOrEqual?: K;
      $lessThenOrEqual?: K;
    };

export type EntityMatchFilter<T extends {}> = {
  [K in keyof T]?: EntityPropertyFilter<T[K]>;
};

export type EntityWhereQuery<T extends {}> =
  | EntityMatchFilter<T>
  | {
      $and?: EntityMatchFilter<T>[];
      $or?: EntityMatchFilter<T>[];
    };

export type EntityUpdateQuery<T extends {}> = PlainEntity<T>;

export interface EntitySelectOptions<T extends {}> {
  populate?: { [key in '']?: 1 | 0 };
  limit?: number;
  offset?: number;
  sort?: {
    [K in keyof T]?: 1 | -1;
  };
}

export interface EntityUpdateOptions {
  upsert?: boolean;
}

export interface EntityCreateResult<T extends {}> {
  created: T[];
}

export interface EntityUpdateResult<T extends {}> {
  updated: T[];
}

export interface EntityDeleteResult<T extends {}> {
  deleted: T[];
}

export type EntityFindOperation<T extends {}> = {
  where: EntityWhereQuery<T>;
} & EntitySelectOptions<T>;
export type EntityUpdateOperation<T extends {}> = {
  where: EntityWhereQuery<T>;
  update: EntityUpdateQuery<T>;
} & EntityUpdateOptions;
