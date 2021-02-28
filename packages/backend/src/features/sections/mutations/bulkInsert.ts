import {
  NEW_ID,
  NULL_SECTION_INPUT,
  SectionInput,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import { createSafeValidator, yupTypes } from '@whitewater-guide/validation';
import { UserInputError } from 'apollo-server-koa';
import deepmerge from 'deepmerge';
import { EventIterator } from 'event-iterator';
import JSONStream from 'jsonstream2';
import { PassThrough } from 'stream';
import { Extract, extract, Headers } from 'tar-stream';
import * as yup from 'yup';
import { createGunzip } from 'zlib';

import { isInputValidResolver, TopLevelResolver } from '~/apollo';
import db, { rawUpsert } from '~/db';
import { s3Client, TEMP } from '~/s3';

import { RawSectionUpsertResult } from '../types';
import { checkForNewRiver, insertNewRiver } from './upsertUtils';

interface Vars {
  regionId: string;
  hidden?: boolean;
  archiveURL: string;
}

const VarsSchema = yup.object({
  regionId: yupTypes.uuid().required(),
  hidden: yup.boolean(),
  archiveURL: yup
    .string()
    .matches(/^.*\.gz$/)
    .required(),
});

const sectionValidator = createSafeValidator(SectionInputSchema);

interface IterableFile {
  headers: Headers;
  stream: PassThrough;
  next: () => void;
}

function iterableFiles(filesStream: Extract) {
  return new EventIterator<IterableFile>(({ push, stop, fail }) => {
    const onEntry = (headers: Headers, stream: PassThrough, next: () => void) =>
      push({ headers, stream, next });
    filesStream.addListener('entry', onEntry);
    filesStream.addListener('finish', stop);
    filesStream.addListener('error', fail);
    return () => {
      filesStream.removeListener('entry', push);
      filesStream.removeListener('finish', stop);
      filesStream.removeListener('error', fail);
      filesStream.destroy();
    };
  });
}

const fetchGauges = async (regionId: string) => {
  const gauges = await db()
    .select('gauges.id', 'script', 'code')
    .from('gauges')
    .innerJoin('sources', 'gauges.source_id', 'sources.id')
    .innerJoin('sources_regions', 'sources.id', 'sources_regions.source_id')
    .where({ region_id: regionId });
  const result = new Map<string, string>();
  gauges.forEach(({ id, script, code }: any) => {
    result.set(`${script}:${code}`, id);
  });
  return result;
};

const maybeInsert = async (
  section: any,
  hidden: boolean | undefined,
  regionId: string,
  riverIds: Map<string, string>,
  gauges: Map<string, string>,
): Promise<[number, string]> => {
  const input: SectionInput = deepmerge(NULL_SECTION_INPUT, section);
  if (input.gauge?.id && gauges.has(input.gauge.id)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    input.gauge.id = gauges.get(input.gauge.id)!;
  }
  const validationError = sectionValidator(input);
  if (validationError) {
    return [
      0,
      `Validation error: ${JSON.stringify(validationError, null, 2)}\n`,
    ];
  }
  input.river.id = riverIds.get(input.river.name || '') || NEW_ID;
  input.region = { id: regionId };
  input.hidden = !!hidden;
  try {
    const shouldInsertRiver = checkForNewRiver(input);
    if (shouldInsertRiver) {
      input.river.id = await insertNewRiver(input, 'en');
    }
    const inserted: RawSectionUpsertResult = await rawUpsert(
      db(),
      'SELECT upsert_section(?, ?)',
      [input, 'en'],
    );
    if (!inserted) {
      return [
        0,
        `Failed to insert section ${JSON.stringify(section, null, 2)}`,
      ];
    }
    riverIds.set(inserted[0].river_name, inserted[0].river_id);
    return [1, `Inserted ${inserted[0].river_name} - ${inserted[0].name}`];
  } catch (e) {
    return [0, `Insert error: ${e.message}`];
  }
};

const resolver: TopLevelResolver<Vars> = async (
  _,
  { regionId, archiveURL, hidden },
) => {
  let log = '';
  let count = 0;
  const filename = s3Client.getLocalFileName(archiveURL);
  if (!filename) {
    throw new UserInputError('invalid archive url');
  }
  // JSON can contain gauge ids in `scipt:code' format. Fetch region's gauges to remap
  const gauges = await fetchGauges(regionId);
  try {
    // with streamObject it's hard to handle file not found errors
    await s3Client.statObject(TEMP, filename);
    const tarStream: any = s3Client.streamObject(TEMP, filename);
    const filesStream = tarStream.pipe(createGunzip()).pipe(extract());
    const jsonFiles: string[] = [];
    const riverIds = new Map<string, string>();
    // stream archive files
    for await (const { headers, stream, next } of iterableFiles(filesStream)) {
      const { name, type } = headers;
      if (type !== 'file') {
        log += `Non-file entry ${name} with type ${type} found in archive\n`;
      } else if (name.endsWith('.json')) {
        jsonFiles.push(name);
        const sections = stream.pipe(JSONStream.parse('*'));
        for await (const section of sections) {
          const [cnt, logstr] = await maybeInsert(
            section,
            hidden,
            regionId,
            riverIds,
            gauges,
          );
          count += cnt;
          log += logstr + '\n';
        }
      } else {
        // TODO: upload photos
        // Non-json file. Probably picture, but should be checked
        // pipe this to minio (straight to media?)
      }
      next();
    }
  } finally {
    await s3Client.removeFile(TEMP, filename).catch(() => {
      // ignore errors
    });
  }
  return { log, count };
};

const bulkInsert = isInputValidResolver(VarsSchema, resolver);

export default bulkInsert;
