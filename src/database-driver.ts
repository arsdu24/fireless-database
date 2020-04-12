import { Collection, Db, ObjectID } from 'mongodb';
import { Subject } from 'rxjs';
import {
  BaseEntity,
  CollectionInsertManyOptions,
  CollectionInsertOneOptions,
  DatabaseEvents,
  DeleteOneOptions,
  DeleteWriteOpResultObject,
  EntityEventTypesEnum,
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
import { EntitySchema } from './entity-schema';

export class DatabaseDriver {
  constructor(
    private db: Db,
    private changeStream: Subject<DatabaseEvents<any>>,
  ) {}

  getSchemaCollection<T extends BaseEntity, X>(
    schema: EntitySchema<T>,
  ): Collection {
    return this.db.collection(schema.getCollectionName());
  }

  wrapFilterId<T extends BaseEntity, F extends FilterQuery<T>>(filter: F): F {
    Object.entries(filter).forEach(([key, value]) => {
      if ('_id' === key && 'object' !== typeof value) {
        filter[key] = new ObjectID(filter[key] as string);
      } else if ('object' === typeof value) {
        filter[key as keyof FilterQuery<T>] = this.wrapFilterId(value);
      }
    });

    return filter;
  }

  async findOne<T extends BaseEntity, O, X>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    options?: FindOneOptions,
  ): Promise<T | undefined> {
    const result: X | null = await this.getSchemaCollection(schema).findOne(
      this.wrapFilterId(filter),
      options,
    );

    if (!result) {
      return void 0;
    }

    return schema.plainToClass(result);
  }

  async find<T extends BaseEntity, O, X>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    options?: FindOneOptions,
  ): Promise<T[]> {
    const result: X[] = await this.getSchemaCollection(schema)
      .find(this.wrapFilterId(filter), options)
      .toArray();

    return result.map((plain) => schema.plainToClass(plain));
  }

  async count<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    options?: MongoCountPreferences,
  ): Promise<number> {
    return this.getSchemaCollection(schema).countDocuments(
      this.wrapFilterId(filter),
      options,
    );
  }

  async insertOne<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    data: InsertQuery<T>,
    options?: CollectionInsertOneOptions,
  ): Promise<InsertOneWriteOpResult<T>> {
    const result = await this.getSchemaCollection(schema).insertOne(
      data,
      options,
    );

    this.notify(schema, [result.insertedId], EntityEventTypesEnum.CREATE);

    return result;
  }

  async insertMany<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    data: InsertQuery<T>[],
    options?: CollectionInsertManyOptions,
  ): Promise<InsertManyWriteOpResult<T>> {
    const result = await this.getSchemaCollection(schema).insertMany(
      data,
      options,
    );

    this.notify(
      schema,
      Object.entries(result.insertedIds).map(([, id]) => new ObjectID(id)),
      EntityEventTypesEnum.CREATE,
    );

    return result;
  }

  async updateOne<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: UpdateOneOptions,
  ): Promise<UpdateWriteOpResult> {
    const collection: Collection = this.getSchemaCollection(schema);
    let [firstDoc] = await collection
      .aggregate<{ _id: ObjectID }>([
        { $match: this.wrapFilterId(filter) },
        { $project: { _id: 1 } },
      ])
      .toArray();

    if (!firstDoc) {
      if (options && options.upsert) {
        const { insertedId: _id } = await collection.insertOne({});

        firstDoc = { _id };
      } else {
        return {
          upsertedCount: 0,
          modifiedCount: 0,
          matchedCount: 0,
          upsertedId: {
            _id: new ObjectID(),
          },
        };
      }
    }

    const updateResult: UpdateWriteOpResult = await collection.updateOne(
      firstDoc,
      update,
      {
        ...options,
        upsert: false,
      },
    );

    this.notify(schema, [firstDoc._id], EntityEventTypesEnum.UPDATE);

    return updateResult;
  }

  async updateMany<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: UpdateManyOptions,
  ): Promise<UpdateWriteOpResult> {
    const collection: Collection = this.getSchemaCollection(schema);
    const docs = await collection
      .aggregate<{ _id: ObjectID }>([
        { $match: this.wrapFilterId(filter) },
        { $project: { _id: 1 } },
      ])
      .toArray();

    if (0 === docs.length) {
      const { insertedId: _id } = await collection.insertOne({});

      docs.push({ _id });
    }

    const ids: ObjectID[] = docs.map(({ _id }) => _id);
    const updateResult: UpdateWriteOpResult = await collection.updateMany(
      { _id: { $in: ids } },
      update,
      {
        ...options,
        upsert: false,
      },
    );

    this.notify(schema, ids, EntityEventTypesEnum.UPDATE);

    return updateResult;
  }

  async deleteOne<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    options?: DeleteOneOptions,
  ): Promise<DeleteWriteOpResultObject> {
    const collection: Collection = this.getSchemaCollection(schema);
    const [firstDoc] = await collection
      .aggregate<{ _id: ObjectID }>([
        { $match: this.wrapFilterId(filter) },
        { $project: { _id: 1 } },
      ])
      .toArray();

    if (!firstDoc) {
      return {
        deletedCount: 0,
      };
    }

    const { deletedCount = 0 } = await collection.deleteOne(firstDoc, options);

    this.notify(schema, [firstDoc._id], EntityEventTypesEnum.DELETE);

    return { deletedCount };
  }

  async deleteMany<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    filter: FilterQuery<T>,
    options?: DeleteOneOptions,
  ): Promise<DeleteWriteOpResultObject> {
    const collection: Collection = this.getSchemaCollection(schema);
    const docs = await collection
      .aggregate<{ _id: ObjectID }>([
        { $match: this.wrapFilterId(filter) },
        { $project: { _id: 1 } },
      ])
      .toArray();
    const docIds: ObjectID[] = docs.map(({ _id }) => new ObjectID(_id));

    const { deletedCount = 0 } = await collection.deleteMany(
      { _id: { $in: docIds } },
      options,
    );

    this.notify(schema, docIds, EntityEventTypesEnum.DELETE);

    return { deletedCount };
  }

  notify<T extends BaseEntity, O>(
    schema: EntitySchema<T>,
    ids: ObjectID[],
    type: EntityEventTypesEnum,
  ) {
    process.nextTick(async () => {
      const entities: T[] = await this.find(schema, { _id: { $in: ids } });

      entities.forEach((entity) =>
        this.changeStream.next({
          type,
          entity,
          entityType: schema.getEntityType(),
        }),
      );
    });
  }
}
