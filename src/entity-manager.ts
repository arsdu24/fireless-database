import { Class } from 'utility-types';
import {
  BaseEntity,
  CollectionInsertManyOptions,
  CollectionInsertOneOptions,
  DeleteOneOptions,
  DeleteWriteOpResultObject,
  FilterQuery,
  FindOneOptions,
  InsertManyWriteOpResult,
  InsertOneWriteOpResult,
  InsertQuery,
  MongoCountPreferences,
  UpdateManyOptions,
  UpdateOneOptions,
  UpdateQuery,
  UpdateWriteOpResult,
} from './types';
import { DatabaseDriver } from './database-driver';
import { getEntitySchema } from './helpers';
import { omit } from 'lodash/fp';

export class EntityManager {
  constructor(private databaseDriver: DatabaseDriver) {}

  findOne<T extends BaseEntity, O>(
    klass: Class<T> | string,
    query: FilterQuery<T>,
    options?: FindOneOptions,
  ): Promise<T | undefined> {
    return this.databaseDriver.findOne(
      getEntitySchema<T>(klass),
      query,
      options,
    );
  }

  async findOneOrFail<T extends BaseEntity, O>(
    klass: Class<T> | string,
    query: FilterQuery<T>,
    options?: FindOneOptions,
  ) {
    const result: T | undefined = await this.databaseDriver.findOne(
      getEntitySchema<T>(klass),
      query,
      options,
    );

    if (!result) {
      throw new Error('Not Found error'); //TODO implement error class
    }

    return result;
  }

  find<T extends BaseEntity, O>(
    klass: Class<T> | string,
    query: FilterQuery<T>,
    options?: FindOneOptions,
  ) {
    return this.databaseDriver.find(getEntitySchema<T>(klass), query, options);
  }

  async count<T extends BaseEntity, O>(
    klass: Class<T> | string,
    filter: FilterQuery<T>,
    options?: MongoCountPreferences,
  ): Promise<number> {
    return this.databaseDriver.count(
      getEntitySchema<T>(klass),
      filter,
      options,
    );
  }

  async insertOne<T extends BaseEntity, O>(
    klass: Class<T> | string,
    data: InsertQuery<T>,
    options?: CollectionInsertOneOptions,
  ): Promise<InsertOneWriteOpResult<T>> {
    return this.databaseDriver.insertOne(
      getEntitySchema<T>(klass),
      data,
      options,
    );
  }

  async insertMany<T extends BaseEntity, O>(
    klass: Class<T> | string,
    data: InsertQuery<T>[],
    options?: CollectionInsertManyOptions,
  ): Promise<InsertManyWriteOpResult<T>> {
    return this.databaseDriver.insertMany(
      getEntitySchema<T>(klass),
      data,
      options,
    );
  }

  async updateOne<T extends BaseEntity, O>(
    klass: Class<T> | string,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: UpdateOneOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.databaseDriver.updateOne(
      getEntitySchema<T>(klass),
      filter,
      update,
      options,
    );
  }

  async updateMany<T extends BaseEntity, O>(
    klass: Class<T> | string,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: UpdateManyOptions,
  ): Promise<UpdateWriteOpResult> {
    return this.databaseDriver.updateMany(
      getEntitySchema<T>(klass),
      filter,
      update,
      options,
    );
  }

  async deleteOne<T extends BaseEntity, O>(
    klass: Class<T> | string,
    filter: FilterQuery<T>,
    options?: DeleteOneOptions,
  ): Promise<DeleteWriteOpResultObject> {
    return this.databaseDriver.deleteOne(
      getEntitySchema<T>(klass),
      filter,
      options,
    );
  }

  async deleteMany<T extends BaseEntity, O>(
    klass: Class<T> | string,
    filter: FilterQuery<T>,
    options?: DeleteOneOptions,
  ): Promise<DeleteWriteOpResultObject> {
    return this.databaseDriver.deleteMany(
      getEntitySchema<T>(klass),
      filter,
      options,
    );
  }

  async save<T extends BaseEntity>(entity: T): Promise<T> {
    const schema = getEntitySchema<T>(entity.constructor as Class<T>);

    if ('_id' in entity) {
      await this.databaseDriver.updateOne(
        schema,
        { _id: entity._id },
        { $set: omit('_id', schema.classToPlain(entity)) as T },
      );

      return entity;
    }

    const { insertedId } = await this.databaseDriver.insertOne(schema, entity);

    entity._id = insertedId;

    return entity;
  }
}
