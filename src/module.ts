import { AbstractModule, AbstractStream } from '@fireless/core';
import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
  DatabaseModuleOptions,
} from './types';
import { MongoClient } from 'mongodb';
import { Subject } from 'rxjs';
import { DatabaseDriver } from './database-driver';
import { EntityManager } from './entity-manager';
import { DatabaseStream } from './stream';
import { rewriteProvider } from '@fireless/core/src';

export class DatabaseModule extends AbstractModule<
  DatabaseModuleOptions,
  DatabaseEvents<any>,
  DataBaseControllerOptions<any>,
  DatabaseControllerHandlerOptions<any>
> {
  async createStream(
    options: DatabaseModuleOptions,
  ): Promise<
    AbstractStream<
      DatabaseEvents<any>,
      DataBaseControllerOptions<any>,
      DatabaseControllerHandlerOptions<any>
    >
  > {
    const { uri = '', ...rest } = options;
    const client = await MongoClient.connect(uri, {
      ...rest,
      useUnifiedTopology: true,
    });
    const db = await client.db(options.database);
    const subject: Subject<DatabaseEvents<any>> = new Subject();
    const databaseDriver = new DatabaseDriver(db, subject);
    const entityManager = new EntityManager(databaseDriver);

    rewriteProvider(DatabaseDriver, databaseDriver);
    rewriteProvider(EntityManager, entityManager);

    return new DatabaseStream(subject.asObservable());
  }
}
