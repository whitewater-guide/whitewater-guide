import { createStream } from 'byline';
import { createReadStream } from 'fs';
import { Transform, Writable } from 'stream';
import Knex from 'knex';

const ALTER_TABLE = 'ALTER TABLE ';
const INSERT_INTO = 'INSERT INTO ';
const END = ');';

class SqlSplitter extends Transform {
  // tslint:disable:no-inferrable-types
  private statementsBegun: boolean = false;
  private stmt: string = '';
  private ready: boolean = false;

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

// tslint:disable:max-classes-per-file
class WritableSqlStream extends Writable {
  constructor(readonly db: Knex) {
    super();
  }

  _write(buff: Buffer, encoding: string, callback: (err?: Error) => void): void {
    const stmpt = buff.toString('utf8');
    this.db.raw(stmpt).finally(callback);
  }
}

export const sqlStreamer = (filename: string, db: Knex) => {
  const reader = createReadStream(filename, 'utf8');
  const lineSplitter = createStream(reader, { keepEmptyLines: true });
  const sqlSplitter = new SqlSplitter();
  const writer = new WritableSqlStream(db);
  return lineSplitter.pipe(sqlSplitter).pipe(writer);
};
