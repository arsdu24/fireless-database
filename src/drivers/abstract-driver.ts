import { Subject } from 'rxjs';
import { DatabaseEvents } from '../types';
import {
  EntityCreateResult,
  EntityDeleteResult,
  EntityFindOperation,
  EntityUpdateOperation,
  EntityUpdateResult,
  PlainEntity,
} from '../types';
import { EntitySchema } from '../schema';

export abstract class AbstractDatabaseDriver<O extends {}> {
  protected constructor(
    private options: O,
    private changeStream: Subject<DatabaseEvents<any>>,
  ) {}

  abstract connect(): Promise<void>;

  abstract createOne<T extends {}>(
    schema: EntitySchema<T>,
    plain: PlainEntity<T>,
  ): Promise<EntityCreateResult<T>>;
  abstract createMany<T extends {}>(
    schema: EntitySchema<T>,
    plains: PlainEntity<T>[],
  ): Promise<EntityCreateResult<T>>;

  abstract find<T extends {}>(
    schema: EntitySchema<T>,
    options: EntityFindOperation<T>,
  ): Promise<T[]>;

  abstract findOne<T extends {}>(
    schema: EntitySchema<T>,
    filter: EntityFindOperation<T>['where'],
  ): Promise<T | undefined>;
  abstract findOne<T extends {}>(
    schema: EntitySchema<T>,
    options: Pick<EntityFindOperation<T>, 'where' | 'sort'>,
  ): Promise<T | undefined>;

  abstract updateOne<T extends {}>(
    schema: EntitySchema<T>,
    options: EntityUpdateOperation<T>,
  ): Promise<EntityUpdateResult<T>>;
  abstract updateMany<T extends {}>(
    schema: EntitySchema<T>,
    options: EntityUpdateOperation<T>,
  ): Promise<EntityUpdateResult<T>>;

  abstract deleteOne<T extends {}>(
    schema: EntitySchema<T>,
    filter: EntityFindOperation<T>['where'],
  ): Promise<EntityDeleteResult<T>>;
  abstract deleteMany<T extends {}>(
    schema: EntitySchema<T>,
    filter: EntityFindOperation<T>['where'],
  ): Promise<EntityDeleteResult<T>>;
}
