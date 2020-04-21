import { Class } from 'utility-types';

export enum EntityEventTypesEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface BaseEntityEvent<T> {
  entityType: Class<T>;
  entity: T;
}

export interface CreateEntityEvent<T> extends BaseEntityEvent<T> {
  type: EntityEventTypesEnum.CREATE;
}

export interface UpdateEntityEvent<T> extends BaseEntityEvent<T> {
  type: EntityEventTypesEnum.UPDATE;
}

export interface DeleteEntityEvent<T> extends BaseEntityEvent<T> {
  type: EntityEventTypesEnum.DELETE;
}

export type DatabaseEvents<T> =
  | CreateEntityEvent<T>
  | UpdateEntityEvent<T>
  | DeleteEntityEvent<T>;
