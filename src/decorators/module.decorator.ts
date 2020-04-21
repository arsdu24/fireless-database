import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
  DatabaseModuleOptions,
} from '../types';
import { Class } from 'utility-types';
import {
  ConstructorDecorator,
  setModuleContextControllers,
  setModuleContextOptions,
} from '@fireless/common';
import { DatabaseModule } from '../module';

type DecoratorOptions<T extends {}> = DatabaseModuleOptions<T> & {
  entities: Class<any>[];
  controllers: Class<any>[];
};

export function Module<O extends {}>(
  options: DecoratorOptions<O>,
): ConstructorDecorator {
  return <T extends {}>(Target: Class<T>): Class<T> => {
    const { controllers, ...dbOptions } = options;

    setModuleContextOptions<
      DatabaseModuleOptions<O>,
      DatabaseEvents<any>,
      DataBaseControllerOptions<any>,
      DatabaseControllerHandlerOptions<any>
    >(Target, DatabaseModule, dbOptions);

    setModuleContextControllers<
      DatabaseModuleOptions<O>,
      DatabaseEvents<any>,
      DataBaseControllerOptions<any>,
      DatabaseControllerHandlerOptions<any>
    >(Target, DatabaseModule, controllers);

    return Target;
  };
}
