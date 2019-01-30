const pg = require('pg');
const pgURL = `postgres://postgres:${process.env.POSTGRES_PASSWORD}@db:5432/${
  process.env.POSTGRES_DB
}`;
const client = new pg.Client(pgURL);
console.log(`Checking pg connection to ${pgURL}`);

client.connect((err) => {
  if (err) {
    // console.log('[WATCHER] postgres is NOT ready');
    process.exit(1);
  } else {
    client.query('SELECT NOW() AS "right_now"', (err, res) => {
      if (err) {
        // console.log('[WATCHER] postgres is NOT ready');
        process.exit(1);
      } else {
        // console.log('[WATCHER] postgres is ready', res);
        process.exit(0);
      }
    });
  }
});
