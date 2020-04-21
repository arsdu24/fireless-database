import { Class } from 'utility-types';
import { EntityPropertySchema } from './property';
import 'reflect-metadata';
import { EntityPropertySchemaFactory } from './property.factory';
import { EntityIndex, EntityOptions } from '../types';
import { snakeCase, flow } from 'lodash/fp';
import { AbstractDatabaseDriver } from '../drivers';

type EntityPropertySchemaMap<T extends {}, K extends keyof T> = Map<
  K,
  EntityPropertySchema<T, K>
>;

export class EntitySchema<T extends {}> {
  private propsSchemasMap: EntityPropertySchemaMap<T, any> = new Map();
  private primaryKey: keyof T | undefined;
  private foreignKeysMap: Map<EntitySchema<any>, keyof T> = new Map();
  private indexes: EntityIndex<T>[] = [];
  private resource: string;
  private databaseDriver: AbstractDatabaseDriver<T> | undefined;

  constructor(private entityConstructor: Class<T>) {
    this.resource = this.prepareResourceNameByConstructor(entityConstructor);
  }

  getEntityConstructor(): Class<T> {
    return this.entityConstructor;
  }

  prepareResourceNameByConstructor(entityConstructor: Class<T>): string {
    return snakeCase(entityConstructor.name);
  }

  getDefaultPropSchema<K extends keyof T>(key: K): EntityPropertySchema<T, K> {
    const entityPropertySchemaFactory: EntityPropertySchemaFactory = new EntityPropertySchemaFactory();
    const propType: Function =
      Reflect.getMetadata(
        'design:type',
        this.entityConstructor.prototype,
        key as string,
      ) || Object;

    return entityPropertySchemaFactory.createEntityPropertySchema(
      propType,
      key,
    );
  }

  getPropSchema<K extends keyof T>(key: K): EntityPropertySchema<T, K> {
    let propSchema:
      | EntityPropertySchema<T, K>
      | undefined = this.propsSchemasMap.get(key);

    if (!propSchema) {
      propSchema = this.getDefaultPropSchema(key);

      this.propsSchemasMap.set(key, propSchema);
    }

    return propSchema;
  }

  processOptions(options: EntityOptions<T>): this {
    if (options.resource) {
      this.resource = options.resource;
    }

    if (options.indexes) {
      this.indexes = options.indexes;
    }

    return this;
  }

  setPrimaryKey(primaryKey: keyof T): this {
    this.primaryKey = primaryKey;

    return this;
  }

  getPrimaryKey(): keyof T | undefined {
    return this.primaryKey;
  }

  setForeignKey<F extends {}>(
    foreignKey: keyof T,
    ForeignSchema: EntitySchema<F>,
  ): this {
    this.foreignKeysMap.set(ForeignSchema, foreignKey);

    return this;
  }

  getForeignKeyFor<F extends {}>(
    ForeignSchema: EntitySchema<F>,
  ): keyof T | undefined {
    return this.foreignKeysMap.get(ForeignSchema);
  }

  serialize<X extends {}>(entity: T): X {
    return flow(
      [...this.propsSchemasMap.values()].map(
        (propSchema: EntityPropertySchema<T, keyof T>) => (plain: X) => {
          return propSchema.serialize(entity, plain);
        },
      ),
    )({} as X);
  }

  parse<X extends {}>(plain: X): T {
    return flow(
      [...this.propsSchemasMap.values()].map(
        (propSchema: EntityPropertySchema<T, keyof T>) => (entity: T) => {
          return propSchema.parse(plain, entity);
        },
      ),
    )(new this.entityConstructor());
  }

  useDatabaseDriver(driver: AbstractDatabaseDriver<T>) {
    this.databaseDriver = driver;
  }

  getDatabaseDriver(): AbstractDatabaseDriver<T> {
    if (!this.databaseDriver) {
      throw new Error(
        `Cannot process database query on unregistered Entity '${this.entityConstructor.name}'`,
      );
    }

    return this.databaseDriver;
  }
}
