import Knex from 'knex';

/**
 * This loads Pyrenees by Quim Fontane
 * Also adds fields to rivers and sections tables to indicate such import
 */
export const up = async (db: Knex) => {
  // Data migrations are no longer available is source code
};

export const down = async (db: Knex) => {
  // Data migrations are no longer available is source code
};

export const configuration = { transaction: true };
