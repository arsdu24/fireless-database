import {
  DatabaseControllerHandlerOptions,
  DataBaseControllerOptions,
  DatabaseEvents,
} from './types';
import { Observable } from 'rxjs';
import { AbstractStream, AsyncResolver } from '@fireless/core';
import { filter } from 'rxjs/operators';
import { overEvery, isMatchWith, matches } from 'lodash/fp';

export class DatabaseStream extends AbstractStream<
  DatabaseEvents<any>,
  DataBaseControllerOptions<any>,
  DatabaseControllerHandlerOptions<any>
> {
  constructor(observable: Observable<DatabaseEvents<any>>) {
    super(observable);
  }

  eventTypeFilter<T extends {}>(options: DatabaseControllerHandlerOptions<T>) {
    return filter(
      (event: DatabaseEvents<T>) =>
        !(options.type && event.type !== options.type),
    );
  }

  entityTypeFilter<T extends {}>(options: DataBaseControllerOptions<T>) {
    return filter(
      (event: DatabaseEvents<T>) =>
        !(options.entityType && event.entityType !== options.entityType),
    );
  }

  entityOverFilter<T extends {}>(options: DatabaseControllerHandlerOptions<T>) {
    return filter(
      (event: DatabaseEvents<T>) =>
        !(options.filters && !overEvery(options.filters)(event)),
    );
  }

  entityMatchFilter<T extends {}>(
    options: DatabaseControllerHandlerOptions<T>,
  ) {
    return filter((event: DatabaseEvents<T>) => {
      if (options.match) {
        const entityMatch: boolean = isMatchWith(
          (entityValue, value) => {
            if ('function' === typeof value && !value(entityValue)) {
              return false;
            }

            if (value instanceof RegExp && value.test(entityValue)) {
              return false;
            }

            return !('object' === typeof value && !matches(entityValue, value));
          },
          event.entity,
          options.match,
        );

        if (!entityMatch) return false;
      }
      return true;
    });
  }

  async pipe<T extends {}>(
    options: DataBaseControllerOptions<T>,
  ): Promise<
    AbstractStream<
      DatabaseEvents<T>,
      DataBaseControllerOptions<T>,
      DatabaseControllerHandlerOptions<T>
    >
  > {
    return new DatabaseStream(
      this.observable.pipe(this.entityTypeFilter(options)),
    );
  }

  async subscribe<T extends {}, R = void>(
    options: DatabaseControllerHandlerOptions<T>,
    handler: AsyncResolver<DatabaseEvents<T>, R>,
  ): Promise<void> {
    this.observable
      .pipe(
        this.eventTypeFilter(options),
        this.entityMatchFilter(options),
        this.entityOverFilter(options),
      )
      .subscribe({
        next: async (event: DatabaseEvents<T>) => {
          try {
            await handler(event);
          } catch (e) {
            console.error(e);
          }
        },
      });
  }
}
