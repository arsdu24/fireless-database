import { EntitySchemaRegistry } from '../../schema';
import { Class } from 'utility-types';

export function ForeignKey<F extends {}>(ForeignEntity: Class<F>) {
  return <T extends {}, K extends keyof T>(target: T, propName: K): void => {
    const entitySchema = EntitySchemaRegistry.getInstance().getEntitySchema<T>(
      target.constructor as Class<T>,
    );
    const foreignSchema = EntitySchemaRegistry.getInstance().getEntitySchema<F>(
      ForeignEntity,
    );

    entitySchema.setForeignKey(propName, foreignSchema);
  };
}
