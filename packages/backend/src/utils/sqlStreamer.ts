/* eslint-disable node/no-process-env */
import { createStream } from 'byline';
import { createReadStream } from 'fs';
import { Client } from 'pg';
import { Transform, Writable } from 'stream';

const ALTER_TABLE = 'ALTER TABLE ';
const INSERT_INTO = 'INSERT INTO ';
const END = ');';

class SqlSplitter extends Transform {
  private statementsBegun = false;
  private stmt = '';
  private ready = false;

  constructor() {
    super({ encoding: 'utf8' });
  }

  _transform(buff: Buffer, encoding: string, callback: () => void): void {
    const line = buff.toString('utf8');
    if (!this.statementsBegun) {
      if (!line.startsWith(ALTER_TABLE)) {
        callback();
        return;
      }
      this.statementsBegun = true;
    }
    if (line.startsWith(ALTER_TABLE)) {
      this.stmt = line;
      this.ready = true;
    } else if (line.startsWith(INSERT_INTO)) {
      this.stmt = line;
      if (line.endsWith(END)) {
        this.ready = true;
      }
    } else if (this.stmt) {
      this.stmt = `${this.stmt}\n${line}`;
      if (line.endsWith(END)) {
        this.ready = true;
      }
    }
    if (this.stmt && this.ready) {
      this.push(this.stmt, 'utf8');
      this.stmt = '';
      this.ready = false;
    }
    callback();
  }
}

class WritableSqlStream extends Writable {
  client: Client;

  constructor() {
    super();
    // Do not use knex, it will turn ? into bindings and break youtube links, for example
    this.client = new Client({
      user: 'postgres',
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    });
    this.client.connect();
  }

  _write(
    buff: Buffer,
    encoding: string,
    callback: (err?: Error) => void,
  ): void {
    const statement = buff.toString('utf8');
    this.client.query(statement, () => callback());
  }

  _final(callback: () => void): void {
    this.client.end(() => callback());
  }
}

export const sqlStreamer = (filename: string) => {
  const reader = createReadStream(filename, 'utf8');
  const lineSplitter = createStream(reader, { keepEmptyLines: true });
  const sqlSplitter = new SqlSplitter();
  const writer = new WritableSqlStream();
  return lineSplitter.pipe(sqlSplitter).pipe(writer);
};
