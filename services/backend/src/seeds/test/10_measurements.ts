import Knex from 'knex';

const hoursAgo = (hours: number) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days: number) => hoursAgo(24 * days);

const measurements = [
  {
    script: 'galicia',
    code: 'gal1',
    timestamp: hoursAgo(1),
    flow: null,
    level: 1.2,
  },
  {
    script: 'galicia',
    code: 'gal1',
    timestamp: hoursAgo(2),
    flow: 10.1,
    level: 1.3,
  },
  {
    script: 'galicia',
    code: 'gal1',
    timestamp: hoursAgo(3),
    flow: 10.1,
    level: null,
  },
  {
    script: 'galicia',
    code: 'gal1',
    timestamp: daysAgo(1),
    flow: 30.1,
    level: 2.5,
  },
  {
    script: 'galicia',
    code: 'gal1',
    timestamp: daysAgo(2),
    flow: 33.1,
    level: 2.9,
  },
  {
    script: 'galicia',
    code: 'gal2',
    timestamp: hoursAgo(1),
    flow: 22,
    level: 33,
  },
  {
    script: 'galicia',
    code: 'gal2',
    timestamp: hoursAgo(2),
    flow: 22.1,
    level: 33.3,
  },
  {
    script: 'galicia',
    code: 'gal2',
    timestamp: hoursAgo(3),
    flow: 22.9,
    level: 35.6,
  },
  {
    script: 'galicia',
    code: 'gal2',
    timestamp: daysAgo(1),
    flow: 66.5,
    level: 45.8,
  },
  {
    script: 'galicia',
    code: 'gal2',
    timestamp: daysAgo(2),
    flow: 80.1,
    level: 49.3,
  },
];

export async function seed(db: Knex) {
  await db.table('measurements').del();
  await db.table('measurements').insert(measurements);
}
