import * as Mongo from 'mongodb';
import { Optional } from 'utility-types';

export type BaseEntity = { _id: Mongo.ObjectID | string };

// Queries
export type FilterQuery<T extends BaseEntity> =
  | {
      [P in keyof T]?: Mongo.Condition<T[P]>;
    }
  | Mongo.RootQuerySelector<T>;
export type InsertQuery<T extends BaseEntity> = Optional<T, '_id'>;
export type UpdateQuery<T extends BaseEntity> =
  | Mongo.UpdateQuery<Omit<T, '_id'>>
  | Partial<T>;

// Options
export type FindOneOptions = Mongo.FindOneOptions;
export type MongoCountPreferences = Mongo.MongoCountPreferences;
export type CollectionInsertOneOptions = Mongo.CollectionInsertOneOptions;
export type CollectionInsertManyOptions = Mongo.CollectionInsertManyOptions;
export type UpdateOneOptions = Mongo.UpdateOneOptions;
export type UpdateManyOptions = Mongo.UpdateManyOptions;
export type DeleteOneOptions = Mongo.CommonOptions;
export type DeleteManyOptions = Mongo.UpdateManyOptions;

// Results
type CleanResult<T extends { connection: any; result: any }> = Omit<
  T,
  'connection' | 'result'
>;

export type InsertOneWriteOpResult<T extends BaseEntity> = CleanResult<
  Mongo.InsertOneWriteOpResult<T>
>;
export type InsertManyWriteOpResult<T extends BaseEntity> = CleanResult<
  Mongo.InsertWriteOpResult<T>
>;
export type UpdateWriteOpResult = CleanResult<Mongo.UpdateWriteOpResult>;
export type DeleteWriteOpResultObject = { deletedCount: number };
