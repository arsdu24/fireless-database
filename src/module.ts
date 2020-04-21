import { AbstractModule, AbstractStream } from '@fireless/core';
import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
  DatabaseModuleOptions,
} from './types';
import { Subject } from 'rxjs';
import { DatabaseStream } from './stream';
import { Class } from 'utility-types';
import { EntitySchema, EntitySchemaRegistry } from './schema';

export class DatabaseModule<O extends {}> extends AbstractModule<
  DatabaseModuleOptions<O>,
  DatabaseEvents<any>,
  DataBaseControllerOptions<any>,
  DatabaseControllerHandlerOptions<any>
> {
  async createStream(
    options: DatabaseModuleOptions<O>,
  ): Promise<
    AbstractStream<
      DatabaseEvents<any>,
      DataBaseControllerOptions<any>,
      DatabaseControllerHandlerOptions<any>
    >
  > {
    const subject: Subject<DatabaseEvents<any>> = new Subject();
    const databaseDriver = new options.driver(options.driverOptions, subject);

    await databaseDriver.connect();

    options.entities
      .map(
        <T extends {}>(entity: Class<T>): EntitySchema<T> => {
          if (!EntitySchemaRegistry.getInstance().hasEntitySchema(entity)) {
            throw new Error(
              `Entity '${entity.name}' should be decorated with @Entity decorator imported from @fireless/database package`,
            );
          }

          return EntitySchemaRegistry.getInstance().getEntitySchema(entity);
        },
      )
      .forEach((schema: EntitySchema<any>) => {
        schema.useDatabaseDriver(databaseDriver);
      });

    return new DatabaseStream(subject.asObservable());
  }
}
