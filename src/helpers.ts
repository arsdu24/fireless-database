import { EntitySchema } from './entity-schema';
import { Class } from 'utility-types';

type EntitySchemaMap<T> = Map<Class<T>, EntitySchema<T>>;

const entitySchemasMap: EntitySchemaMap<any> = new Map();

export function getEntitySchema<T>(
  klassOrString: Class<T> | string,
): EntitySchema<T> {
  let schema: EntitySchema<T> | undefined;

  if ('string' === typeof klassOrString) {
    schema = [...entitySchemasMap.values()].find((schema) =>
      schema.isYou(klassOrString),
    );

    if (!schema) {
      throw new Error(
        `Couldn't find the registered Entity by name '${klassOrString}'`,
      );
    }

    return schema;
  } else {
    schema = entitySchemasMap.get(klassOrString);

    if (!schema) {
      schema = new EntitySchema<T>(klassOrString);

      entitySchemasMap.set(klassOrString, schema);
    }
  }

  return schema;
}
