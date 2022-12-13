import 'dotenv/config';

import { stringify } from 'csv-stringify';
import { createWriteStream, ensureDir } from 'fs-extra';
import { deburr, snakeCase } from 'lodash';
import { Client } from 'pg';
import QueryStream from 'pg-query-stream';
import { PassThrough, pipeline, Transform } from 'stream';

interface Item {
  id: string;
  region_name: string;
  river_name: string;
  name: string;
  put_in_long: number;
  put_in_lat: number;
  take_out_long: number;
  take_out_lat: number;
  import_id: string;
}

async function streamResults(client: Client) {
  return new Promise((resolve) => {
    const query = new QueryStream(`
    SELECT
      sections_view.id,
      region_name,
      river_name,
      name,
      ST_X(ST_STARTPOINT(sections.shape :: geometry)) as put_in_long,
      ST_Y(ST_STARTPOINT(sections.shape :: geometry)) as put_in_lat,
      ST_X(ST_ENDPOINT(sections.shape :: geometry)) as take_out_long,
      ST_Y(ST_ENDPOINT(sections.shape :: geometry)) as take_out_lat,
      sections.import_id
    FROM sections_view INNER JOIN sections on sections_view.id = sections.id
    WHERE language = 'en'
  `);

    const streams = new Map<string, PassThrough>();

    const splitStream = new Transform({
      objectMode: true,
      transform({ region_name, ...section }: Item, _encoding, callback) {
        let regionStream = streams.get(region_name);
        if (!regionStream) {
          regionStream = new PassThrough({ objectMode: true });
          streams.set(region_name, regionStream);

          pipeline(
            regionStream,
            stringify({ header: true }),
            createWriteStream(
              'dist/' + snakeCase(deburr(region_name)) + '.csv',
            ),
            (err) => {
              if (err) {
                console.error(`Pipeline for ${region_name} failed`, err);
              } else {
                console.info(`Pipeline for ${region_name} succeeded`);
              }
            },
          );
        }

        regionStream.push(section);
        callback(null);
      },
      flush(next) {
        // Once the stream has finished processing we need to notify all active
        // streams that they are finished by sending null
        for (const stream of streams.values()) {
          stream.push(null);
        }
        next(null);
      },
    });

    const stream = client.query(query);
    stream.on('end', () => {
      resolve(undefined);
    });
    stream.pipe(splitStream);
  });
}

async function exportSections() {
  await ensureDir('dist');
  const client = new Client();
  await client.connect();
  await streamResults(client);
  // console.log(JSON.stringify(res, null, 2));
  await client.end();
}

exportSections().catch((e) => {
  console.error(e);
  process.exit(1);
});
