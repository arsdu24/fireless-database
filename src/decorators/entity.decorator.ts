import { Class } from 'utility-types';
import { getEntitySchema } from '../helpers';
import { EntityOptions } from '../types';
import { snakeCase } from 'lodash/fp';
import { ConstructorDecorator } from '@fireless/common';

export function Entity(): ConstructorDecorator;
export function Entity(collection: string): ConstructorDecorator;
export function Entity(options: EntityOptions): ConstructorDecorator;
export function Entity(collectionOrOptions?: string | EntityOptions) {
  return <T extends {}>(klass: Class<T>): Class<T> => {
    const entitySchema = getEntitySchema<T>(klass);

    if ('object' === typeof collectionOrOptions) {
      entitySchema.setOptions(collectionOrOptions);
    }

    entitySchema.setCollectionName(
      'string' === typeof collectionOrOptions
        ? collectionOrOptions
        : snakeCase(klass.name),
    );

    return klass;
  };
}
