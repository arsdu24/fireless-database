import {
  asyncResolverFromTransformPipes,
  ControllerHandlerParamDecorator,
  createTransformPipe,
  setControllerHandlerContextParamResolver,
  TransformPipe,
} from '@fireless/common';
import { AsyncResolver } from '@fireless/core';
import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
} from '../types';
import { Class } from 'utility-types';

export function Doc(): ControllerHandlerParamDecorator;
export function Doc<E extends {}, R>(
  p: Class<TransformPipe<E, R>>,
): ControllerHandlerParamDecorator;
export function Doc<E extends {}, R1, R2>(
  p1: Class<TransformPipe<E, R1>>,
  p2: Class<TransformPipe<R1, R2>>,
): ControllerHandlerParamDecorator;
export function Doc<E extends {}, R1, R2, R3>(
  p1: Class<TransformPipe<E, R1>>,
  p2: Class<TransformPipe<R1, R2>>,
  p3: Class<TransformPipe<R2, R3>>,
): ControllerHandlerParamDecorator;
export function Doc<E extends {}, R1, R2, R3, R4>(
  p1: Class<TransformPipe<E, R1>>,
  p2: Class<TransformPipe<R1, R2>>,
  p3: Class<TransformPipe<R2, R3>>,
  p4: Class<TransformPipe<R3, R4>>,
): ControllerHandlerParamDecorator;
export function Doc<E extends {}, R1, R2, R3, R4, R5>(
  p1: Class<TransformPipe<E, R1>>,
  p2: Class<TransformPipe<R1, R2>>,
  p3: Class<TransformPipe<R2, R3>>,
  p4: Class<TransformPipe<R3, R4>>,
  p5: Class<TransformPipe<R4, R5>>,
): ControllerHandlerParamDecorator;
export function Doc<E extends {} = any>(
  ...pipes: Class<TransformPipe<any, any>>[]
): ControllerHandlerParamDecorator {
  return <T extends {}>(
    target: T,
    methodName: keyof T,
    index: number,
  ): void => {
    const resolver: AsyncResolver<
      DatabaseEvents<E>,
      any
    > = asyncResolverFromTransformPipes(
      createTransformPipe<DatabaseEvents<E>, E>(
        async ({ entity }: DatabaseEvents<E>) => entity,
      ),
      ...pipes,
    );

    setControllerHandlerContextParamResolver<
      T,
      DataBaseControllerOptions<E>,
      DatabaseEvents<E>,
      DatabaseControllerHandlerOptions<E>
    >(target.constructor as Class<T>, methodName, index, resolver);
  };
}

export function DocProp<E extends {}, K extends keyof E>(
  o: E,
  key: K,
): ControllerHandlerParamDecorator;
export function DocProp<E extends {}, K extends keyof E, R>(
  o: E,
  key: K,
  p: Class<TransformPipe<E[K], R>>,
): ControllerHandlerParamDecorator;
export function DocProp<E extends {}, K extends keyof E, R1, R2>(
  o: E,
  key: K,
  p1: Class<TransformPipe<E[K], R1>>,
  p2: Class<TransformPipe<R1, R2>>,
): ControllerHandlerParamDecorator;
export function DocProp<E extends {}, K extends keyof E, R1, R2, R3>(
  o: E,
  key: K,
  p1: Class<TransformPipe<E[K], R1>>,
  p2: Class<TransformPipe<R1, R2>>,
  p3: Class<TransformPipe<R2, R3>>,
): ControllerHandlerParamDecorator;
export function DocProp<E extends {}, K extends keyof E, R1, R2, R3, R4>(
  o: E,
  key: K,
  p1: Class<TransformPipe<E[K], R1>>,
  p2: Class<TransformPipe<R1, R2>>,
  p3: Class<TransformPipe<R2, R3>>,
  p4: Class<TransformPipe<R3, R4>>,
): ControllerHandlerParamDecorator;
export function DocProp<E extends {}, K extends keyof E, R1, R2, R3, R4, R5>(
  o: E,
  key: K,
  p1: Class<TransformPipe<E[K], R1>>,
  p2: Class<TransformPipe<R1, R2>>,
  p3: Class<TransformPipe<R2, R3>>,
  p4: Class<TransformPipe<R3, R4>>,
  p5: Class<TransformPipe<R4, R5>>,
): ControllerHandlerParamDecorator;
export function DocProp<E extends {}, K extends keyof E = any>(
  o: E,
  key: K,
  ...pipes: Class<TransformPipe<any, any>>[]
): ControllerHandlerParamDecorator {
  return <T extends {}>(
    target: T,
    methodName: keyof T,
    index: number,
  ): void => {
    const resolver: AsyncResolver<
      DatabaseEvents<E>,
      any
    > = asyncResolverFromTransformPipes(
      createTransformPipe<DatabaseEvents<E>, E[K]>(
        async ({ entity }: DatabaseEvents<E>) => entity[key],
      ),
      ...pipes,
    );

    setControllerHandlerContextParamResolver<
      T,
      DataBaseControllerOptions<E>,
      DatabaseEvents<E>,
      DatabaseControllerHandlerOptions<E>
    >(target.constructor as Class<T>, methodName, index, resolver);
  };
}
