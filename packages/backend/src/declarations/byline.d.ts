declare module 'byline' {
  import { Readable, Transform } from 'stream';

  export interface Options {
    keepEmptyLines?: boolean;
  }

  export function createStream(readable: Readable, options: Options): LineStream;

  export class LineStream extends Transform {}
}
