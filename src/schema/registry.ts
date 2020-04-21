import { Class } from 'utility-types';
import { EntitySchema } from './schema';

type EntitySchemaMap<T extends {}> = Map<Class<T>, EntitySchema<T>>;

export class EntitySchemaRegistry {
  private static instance: EntitySchemaRegistry | undefined;

  private entitySchemaMap: EntitySchemaMap<any> = new Map();
  private namedEntitySchemaMap: Map<string, EntitySchema<any>> = new Map();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): EntitySchemaRegistry {
    if (!this.instance) {
      this.instance = new EntitySchemaRegistry();
    }

    return this.instance;
  }

  hasEntitySchema<T extends {}>(nameOrEntity: string | Class<T>): boolean {
    if ('string' === typeof nameOrEntity) {
      return this.namedEntitySchemaMap.has(nameOrEntity);
    }

    return this.entitySchemaMap.has(nameOrEntity);
  }

  getEntitySchema<T extends {}>(
    nameOrEntity: string | Class<T>,
  ): EntitySchema<T> {
    let schema: EntitySchema<T> | undefined;

    if ('string' === typeof nameOrEntity) {
      schema = this.namedEntitySchemaMap.get(nameOrEntity);

      if (!schema) {
        throw new Error(
          `Cannot find the Entity Schema by the received name '${nameOrEntity}'`,
        );
      }

      return schema;
    }

    if (!schema) {
      schema = new EntitySchema(nameOrEntity);

      this.entitySchemaMap.set(nameOrEntity, schema);
      this.namedEntitySchemaMap.set(nameOrEntity.name, schema);
    }

    return schema;
  }
}
