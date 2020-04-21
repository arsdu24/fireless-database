import { Class } from 'utility-types';
import { EntitySchema, EntitySchemaRegistry } from '../../schema';
import { HasOneRelation } from '../../relations';

export function HasOne<R extends {}>(Related: Class<R>) {
  return <T extends {}>(target: T, property: keyof T) => {
    const entitySchema: EntitySchema<T> = EntitySchemaRegistry.getInstance().getEntitySchema(
      target.constructor as Class<T>,
    );
    const childSchema: EntitySchema<R> = EntitySchemaRegistry.getInstance().getEntitySchema(
      Related,
    );
    const propSchema = entitySchema.getPropSchema(property);
    const hasOneResolver: HasOneRelation<T, R> = new HasOneRelation(
      entitySchema,
      childSchema,
    );

    propSchema.processOptions({
      parser: (_, entity: T) => hasOneResolver.create(entity) as any,
    });
  };
}
