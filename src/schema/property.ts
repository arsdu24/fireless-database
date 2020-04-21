import {
  EntityPropertyOptions,
  EntityPropertyParser,
  EntityPropertySerializer,
} from '../types';
import { EntityPropertySchemaFactory } from './property.factory';

export class EntityPropertySchema<T extends {}, K extends keyof T> {
  private origin: string;

  constructor(
    private name: K,
    private serializer: EntityPropertySerializer<T, K>,
    private parser: EntityPropertyParser<T, K>,
  ) {
    this.origin = name as string;
  }

  get key(): K {
    return this.name;
  }

  processOptions(options: Partial<EntityPropertyOptions<T, K>>): this {
    if (options.origin) {
      this.origin = options.origin;
    }

    if (options.type) {
      const factory = new EntityPropertySchemaFactory();
      const {
        serializer,
        parser,
      } = factory.getEntitySchemaPropertyTypeConfiguration<T, K>(
        options.type,
        this.name,
      );

      this.serializer = serializer;
      this.parser = parser;
    }

    if (options.serializer) {
      this.serializer = options.serializer;
    }
    if (options.parser) {
      this.parser = options.parser;
    }

    return this;
  }

  serialize<X extends {}>(entity: T, plain: X): X {
    plain[(this.origin as string) as keyof X] = this.serializer(
      entity[this.name],
      entity,
    );

    return plain;
  }

  parse<X extends {}>(plain: X, entity: T): T {
    entity[this.name] = this.parser(
      plain[(this.origin as string) as keyof X],
      entity,
    );

    return entity;
  }
}
