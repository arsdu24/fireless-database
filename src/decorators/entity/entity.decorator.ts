import { Class } from 'utility-types';
import { EntityOptions } from '../../types';
import { ConstructorDecorator } from '@fireless/common';
import { EntitySchemaRegistry } from '../../schema';

export function Entity(): ConstructorDecorator;
export function Entity(collection: string): ConstructorDecorator;
export function Entity<X extends {}>(
  options: EntityOptions<X>,
): ConstructorDecorator;
export function Entity<X extends {}>(
  collectionOrOptions?: string | EntityOptions<X>,
) {
  return <T extends X>(klass: Class<T>): Class<T> => {
    const entitySchema = EntitySchemaRegistry.getInstance().getEntitySchema<T>(
      klass,
    );
    const options: EntityOptions<T> =
      collectionOrOptions && 'object' === typeof collectionOrOptions
        ? collectionOrOptions
        : {};

    if ('string' === typeof collectionOrOptions) {
      options.resource = collectionOrOptions;
    }

    entitySchema.processOptions(options);

    return klass;
  };
}
