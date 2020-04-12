import { Class, DeepPartial } from 'utility-types';
import { merge, snakeCase } from 'lodash/fp';
import { EntityColumnOptions, EntityOptions } from './types';

export class EntitySchema<T extends {}> {
  private collection: string | undefined;
  private options: EntityOptions | undefined;
  private propsSchemasMap: Map<string, EntityColumnOptions> = new Map();

  constructor(private entityType: Class<T>) {}

  isYou(nameOrKlass: string | Class<T>): boolean {
    return (
      nameOrKlass === this.entityType ||
      nameOrKlass === this.entityType.name ||
      nameOrKlass === this.collection
    );
  }

  getEntityType(): Class<T> {
    return this.entityType;
  }

  setCollectionName(collection: string): this {
    this.collection = collection;

    return this;
  }

  getCollectionName(): string {
    return this.collection || snakeCase(this.entityType.name);
  }

  setOptions(
    options:
      | EntityOptions
      | Partial<EntityOptions>
      | DeepPartial<EntityOptions>,
  ): this {
    this.options = merge<EntityOptions, EntityOptions>(
      (this.options || {}) as EntityOptions,
      options as EntityOptions,
    );

    return this;
  }

  getPropSchema(key: string): EntityColumnOptions {
    let propSchema: EntityColumnOptions | undefined = this.propsSchemasMap.get(
      key,
    );

    if (!propSchema) {
      //TODO implement default schema creation from metadata 'design:type'
      propSchema = {
        column: key,
        parser: (x) => x,
        serializer: (x) => x,
      };

      this.propsSchemasMap.set(key, propSchema);
    }

    return propSchema;
  }

  setPropSchema(key: string, propSchema: EntityColumnOptions): this {
    this.propsSchemasMap.set(key, propSchema);

    return this;
  }

  plainToClass<X extends {}>(plain: X): T {
    const entity: T = new this.entityType();

    [...this.propsSchemasMap.entries()].forEach(([key, options]) => {
      entity[key as keyof T] = options.parser(plain[options.column as keyof X]);
    });

    return entity;
  }

  classToPlain<X extends {}>(entity: T): X {
    const plain: X = {} as X;

    [...this.propsSchemasMap.entries()].forEach(([key, options]) => {
      plain[options.column as keyof X] = options.serializer(
        entity[key as keyof T],
      );
    });

    return plain;
  }
}
