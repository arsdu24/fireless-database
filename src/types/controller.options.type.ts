import { Class } from 'utility-types';

export interface DataBaseControllerOptions<T> {
  entityType: Class<T>;
}
