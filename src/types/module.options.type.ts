import { Class } from 'utility-types';
import { AbstractDatabaseDriver } from '../drivers';

export interface DatabaseModuleOptions<T extends {}> {
  entities: Class<any>[];
  name?: string;
  driverOptions: T;
  driver: Class<AbstractDatabaseDriver<T>>;
}
