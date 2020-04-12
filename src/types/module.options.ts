import { MongoClientOptions } from 'mongodb';

export interface DatabaseModuleOptions extends MongoClientOptions {
  uri?: string;
  database?: string;
}
