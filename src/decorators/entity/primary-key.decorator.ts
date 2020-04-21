import { HandlerDecorator } from '@fireless/common';
import { EntityPropertyOptions } from '../../types';
import { EntitySchemaRegistry } from '../../schema';
import { Class } from 'utility-types';

export function PrimaryKey(): HandlerDecorator;
export function PrimaryKey(column: string): HandlerDecorator;
export function PrimaryKey(
  options: EntityPropertyOptions<any, any>,
): HandlerDecorator;
export function PrimaryKey(
  columnOrOptions?: string | EntityPropertyOptions<any, any>,
) {
  return <T extends {}, K extends keyof T>(target: T, propName: K): void => {
    const entitySchema = EntitySchemaRegistry.getInstance().getEntitySchema<T>(
      target.constructor as Class<T>,
    );
    const propSchema = entitySchema
      .setPrimaryKey(propName)
      .getPropSchema(propName);

    if ('object' === typeof columnOrOptions) {
      propSchema.processOptions(columnOrOptions);
    }

    if ('string' === typeof columnOrOptions) {
      propSchema.processOptions({
        origin: columnOrOptions,
      });
    }
  };
}
