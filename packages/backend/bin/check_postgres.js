#!/usr/bin/env node

const pg = require('pg');
const client = new pg.Client(`postgres://postgres:${process.env.PGPASSWORD}@db:5432/${process.env.POSTGRES_DB}`);
client.query('SELECT NOW() AS "right_now"')
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
