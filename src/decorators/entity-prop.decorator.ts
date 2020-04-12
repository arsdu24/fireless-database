import { Class } from 'utility-types';
import { getEntitySchema } from '../helpers';
import { EntityColumnOptions } from '../types';

export function Column(): PropertyDecorator;
export function Column(column: string): PropertyDecorator;
export function Column(options: EntityColumnOptions): PropertyDecorator;
export function Column(columnOrOptions?: string | EntityColumnOptions) {
  return <T extends {}>(target: T, propName: string): void => {
    const entitySchema = getEntitySchema<T>(target.constructor as Class<T>);
    const keyOptions = entitySchema.getPropSchema(propName);

    if ('object' === typeof columnOrOptions) {
      entitySchema.setPropSchema(propName, columnOrOptions);
    }

    if ('string' === typeof columnOrOptions) {
      entitySchema.setPropSchema(propName, {
        ...keyOptions,
        column: columnOrOptions,
      });
    }

    if ('undefined' === typeof columnOrOptions) {
      entitySchema.setPropSchema(propName, {
        ...keyOptions,
        column: propName,
      });
    }
  };
}
