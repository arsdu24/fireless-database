import {
  EntityDeleteResult,
  EntityFindOperation,
  PlainEntity,
} from './database-query.type';

export type HasOneResolver<T extends {}> = (() => Promise<T | undefined>) & {
  create: (data: PlainEntity<T>) => Promise<T>;
  findOrDefault: (defaultPlain: PlainEntity<T>) => Promise<T>;
  remove: () => Promise<EntityDeleteResult<T>>;
  update: (data: PlainEntity<T>) => Promise<T | undefined>;
};

export type HasManyResolver<T extends {}> = ((
  where?: EntityFindOperation<T>['where'],
) => Promise<T[]>) & {
  create: (data: PlainEntity<T>[]) => Promise<T[]>;
  remove: (
    where?: EntityFindOperation<T>['where'],
  ) => Promise<EntityDeleteResult<T>>;
  update: (options: {
    where?: EntityFindOperation<T>['where'];
    data: PlainEntity<T>;
  }) => Promise<T | undefined>;
};
