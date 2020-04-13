import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
  EntityEventTypesEnum,
} from '../types';
import { Class } from 'utility-types';
import {
  HandlerDecorator,
  setControllerHandlerContextOptions,
} from '@fireless/common';

const createEventTypeDecorator = (
  type: DatabaseControllerHandlerOptions<any>['type'],
) => <E extends {}>(
  options?: DatabaseControllerHandlerOptions<E>,
): HandlerDecorator => {
  return <T extends {}>(target: T, methodName: keyof T): void => {
    setControllerHandlerContextOptions<
      T,
      DataBaseControllerOptions<E>,
      DatabaseEvents<E>,
      DatabaseControllerHandlerOptions<E>
    >(target.constructor as Class<T>, methodName, {
      ...options,
      type,
    });
  };
};

export const OnCreate = createEventTypeDecorator(EntityEventTypesEnum.CREATE);
export const OnUpdate = createEventTypeDecorator(EntityEventTypesEnum.UPDATE);
export const OnDelete = createEventTypeDecorator(EntityEventTypesEnum.DELETE);
