import {
  asyncResolverFromTransformPipes,
  createPipedHandlerParamDecorator,
  createTransformPipe,
  PipedDecorator,
  PipedHandlerParamDecoratorCreatorOptions,
  setControllerHandlerContextParamResolver,
  TransformPipe,
} from '@fireless/common';
import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
  EntityEventTypesEnum,
} from '../types';
import { Class } from 'utility-types';

function registerParamResolver<E extends {}>(
  pipes: Class<TransformPipe<any, any>>[],
) {
  return <T extends {}>(
    target: T,
    methodName: keyof T,
    index: number,
  ): void => {
    setControllerHandlerContextParamResolver<
      T,
      DataBaseControllerOptions<E>,
      DatabaseEvents<E>,
      DatabaseControllerHandlerOptions<E>
    >(
      target.constructor as Class<T>,
      methodName,
      index,
      asyncResolverFromTransformPipes(...pipes),
    );
  };
}

export function Event<E extends {}>() {
  return {
    EntityType: (...pipes: Class<TransformPipe<any, any>>[]) =>
      registerParamResolver<Class<E>>([
        createTransformPipe(
          async (event: DatabaseEvents<E>) => event.entityType,
        ),
        ...pipes,
      ]) as PipedDecorator<Class<E>>,
    Type: (...pipes: Class<TransformPipe<any, any>>[]) =>
      registerParamResolver<EntityEventTypesEnum>([
        createTransformPipe(async (event: DatabaseEvents<E>) => event.type),
        ...pipes,
      ]) as PipedDecorator<EntityEventTypesEnum>,
    Entity: createPipedHandlerParamDecorator<E>(
      (options: PipedHandlerParamDecoratorCreatorOptions<E>) => {
        return registerParamResolver<E>([
          createTransformPipe(async (event: DatabaseEvents<E>) =>
            options.key ? event.entity[options.key] : event.entity,
          ),
          ...options.pipes,
        ]);
      },
    ),
  };
}
