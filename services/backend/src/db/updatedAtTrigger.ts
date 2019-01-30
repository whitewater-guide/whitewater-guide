import Knex from 'knex';

export async function addUpdatedAtFunction(db: Knex) {
  // Trigger for updated_at columns
  // https://x-team.com/blog/automatic-timestamps-with-postgresql/
  await db.raw(`
    CREATE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
}

export async function addUpdatedAtTrigger(db: Knex, table: string) {
  await db.raw(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
}

export async function removeUpdatedAtFunction(db: Knex) {
  // Postgres manual says:
  // DROP TABLE always removes any indexes, rules, triggers,
  // So we do not need to a function for DROP TRIGGER
  await db.raw('DROP FUNCTION trigger_set_timestamp();');
}
