import Knex from 'knex';

// tslint:disable:ban-types
declare module 'knex' {
  interface QueryInterface {
    removeListener: (
      eventName: string,
      callback: Function,
    ) => Knex.QueryBuilder;
  }
}
