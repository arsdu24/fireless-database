import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
} from '../types';
import { Class } from 'utility-types';
import { setControllerContextOptions } from '@fireless/common';

export function Controller<E extends {}>(Entity: Class<E>) {
  return <T extends {}>(Constructor: Class<T>): Class<T> => {
    setControllerContextOptions<
      T,
      DataBaseControllerOptions<E>,
      DatabaseEvents<E>,
      DatabaseControllerHandlerOptions<E>
    >(Constructor, {
      entityType: Entity,
    });

    return Constructor;
  };
}
