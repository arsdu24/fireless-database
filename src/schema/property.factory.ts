import { EntityPropertySchema } from './property';
import { EntityPropertyParser, EntityPropertySerializer } from '../types';
import { EntitySchemaRegistry } from './registry';
import { Class } from 'utility-types';
import { EntitySchema } from './schema';

type EntitySchemaPropertyTypeConfiguration<T extends {}, K extends keyof T> = {
  parser: EntityPropertyParser<T, K>;
  serializer: EntityPropertySerializer<T, K>;
};

export class EntityPropertySchemaFactory {
  createEntityPropertySchema<T extends {}, K extends keyof T>(
    type: Function,
    key: K,
  ): EntityPropertySchema<T, K> {
    const {
      serializer,
      parser,
    } = this.getEntitySchemaPropertyTypeConfiguration<T, K>(type, key);

    return new EntityPropertySchema<T, K>(key, serializer, parser);
  }

  getEntitySchemaPropertyTypeConfiguration<T extends {}, K extends keyof T>(
    type: Function,
    key: K,
  ): EntitySchemaPropertyTypeConfiguration<T, K> {
    switch (type) {
      case Object:
        return this.getObjectEntitySchemaPropertyConfiguration(key);
    }

    return this.getCustomEntitySchemaPropertyConfiguration(type);
  }

  getObjectEntitySchemaPropertyConfiguration<T extends {}, K extends keyof T>(
    key: K,
  ): EntitySchemaPropertyTypeConfiguration<T, K> {
    return {
      parser: (data: any): T[K] => {
        try {
          if ('string' === typeof data) {
            return JSON.parse(data);
          }

          return data;
        } catch (e) {
          throw new Error(
            `Cannot parse Object marked Entity property '${key}'`,
          );
        }
      },
      serializer: (data: T[K]): any => data,
    };
  }

  getCustomEntitySchemaPropertyConfiguration<T extends {}, K extends keyof T>(
    type: Function,
  ): EntitySchemaPropertyTypeConfiguration<T, K> {
    if (
      EntitySchemaRegistry.getInstance().hasEntitySchema(type as Class<any>)
    ) {
      const schema: EntitySchema<any> = EntitySchemaRegistry.getInstance().getEntitySchema(
        type as Class<any>,
      );

      return {
        parser: (data: any): T[K] => schema.parse(data),
        serializer: (entity: T[K]): any => schema.serialize(entity),
      };
    }

    return {
      parser: (data: any): T[K] => data,
      serializer: (data: T[K]) => data,
    };
  }
}
