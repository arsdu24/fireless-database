import { DatabaseEvents, EntityEventTypesEnum } from './event';

export interface DatabaseControllerHandlerOptions<T extends {}> {
  type?: EntityEventTypesEnum;
  match?: { [key in keyof T]: T[key] | RegExp | ((data: T[key]) => boolean) };
  filters?: ((event: DatabaseEvents<T>) => boolean)[];
}
