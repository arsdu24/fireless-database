import { Class } from 'utility-types';
import { EntityPropertyOptions } from '../../types';
import { EntitySchemaRegistry } from '../../schema';
import { HandlerDecorator } from '@fireless/common';

export function Property(): HandlerDecorator;
export function Property(column: string): HandlerDecorator;
export function Property(
  options: EntityPropertyOptions<any, any>,
): HandlerDecorator;
export function Property(
  columnOrOptions?: string | EntityPropertyOptions<any, any>,
) {
  return <T extends {}, K extends keyof T>(target: T, propName: K): void => {
    const entitySchema = EntitySchemaRegistry.getInstance().getEntitySchema<T>(
      target.constructor as Class<T>,
    );
    const propSchema = entitySchema.getPropSchema(propName);

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
