import Knex from 'knex';

declare module 'knex' {
  interface QueryInterface {
    // tslint:disable-next-line:ban-types
    removeListener: (eventName: string, callback: Function) => Knex.QueryBuilder;
  }

}
