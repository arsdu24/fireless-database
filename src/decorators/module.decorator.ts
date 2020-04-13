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

type DecoratorOptions = {
  options: DatabaseModuleOptions;
  controllers: Class<any>[];
};

export function Module(options: DecoratorOptions): ConstructorDecorator {
  return <T extends {}>(Target: Class<T>): Class<T> => {
    setModuleContextOptions<
      DatabaseModuleOptions,
      DatabaseEvents<any>,
      DataBaseControllerOptions<any>,
      DatabaseControllerHandlerOptions<any>
    >(Target, DatabaseModule, options.options);

    setModuleContextControllers<
      DatabaseModuleOptions,
      DatabaseEvents<any>,
      DataBaseControllerOptions<any>,
      DatabaseControllerHandlerOptions<any>
    >(Target, DatabaseModule, options.controllers);

    return Target;
  };
}
