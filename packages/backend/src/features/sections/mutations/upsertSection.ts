import {
  MediaInput,
  MediaKind,
  NEW_ID,
  OTHERS_REGION_ID,
  SectionInput,
  SectionInputSchema,
} from '@whitewater-guide/commons';
import { ForbiddenError } from 'apollo-server-koa';
import uniq from 'lodash/uniq';
import * as yup from 'yup';

import {
  AuthenticatedTopLevelResolver,
  Context,
  ContextUser,
  isAuthenticatedResolver,
  isInputValidResolver,
  UnknownError,
} from '~/apollo';
import db, { rawUpsert } from '~/db';
import { SectionRaw } from '~/features/sections';
import { MEDIA, s3Client } from '~/s3';

import { RawSectionUpsertResult } from '../types';
import { checkForNewRiver, insertNewRiver } from './upsertUtils';
import { differ } from './utils';

const transformSection = (section: SectionInput): SectionInput => {
  return {
    ...section,
    // For photos, URLS must be reduced to filenames
    media: section.media.map(
      (item): MediaInput => {
        if (item.kind === MediaKind.photo) {
          const url = s3Client.getLocalFileName(item.url);
          if (!url) {
            throw new UnknownError('photo url invalid');
          }
          return { ...item, url };
        }
        return item;
      },
    ),
  };
};

const checkIsEditor = async (
  section: SectionInput,
  dataSources: Context['dataSources'],
) => {
  const query =
    section.river.id === NEW_ID
      ? { regionId: section.region?.id ?? OTHERS_REGION_ID }
      : {
          sectionId: section.id,
          riverId: section.river.id,
        };
  const isEditor = await dataSources.users.checkEditorPermissions(query);
  return isEditor;
};

const saveLog = async (
  user: ContextUser,
  current: SectionRaw,
  old?: SectionRaw,
) => {
  await db()
    .insert({
      section_id: current.id,
      section_name: current.name,
      river_id: current.river_id,
      river_name: current.river_name,
      region_id: current.region_id,
      region_name: current.region_name,
      action: old ? 'update' : 'create',
      editor_id: user.id,
      diff: old && differ.diff(old, current),
    })
    .into('sections_edit_log');
};

const moveAllMedia = async (ids: string[] | null) => {
  if (!ids || ids.length === 0) {
    return;
  }
  const files: Array<{ url: string }> = await db()
    .select('url')
    .from('media')
    .where({ kind: 'photo' })
    .whereIn('id', ids);
  return Promise.all(
    files.map(({ url }) => s3Client.moveTempImage(url, MEDIA)),
  );
};

const deleteUnusedFiles = async (urls: string[] | null) => {
  if (!urls || urls.length === 0) {
    return;
  }
  return Promise.all(
    urls.map((url) =>
      s3Client.removeFile(MEDIA, url).catch(() => {
        // ignore files that we cannot remove
      }),
    ),
  );
};

const maybeUpdateJobs = async (
  dataSources: any,
  current: SectionRaw,
  old?: SectionRaw,
) => {
  const oldGid = old?.gauge_id;
  const newGid = current.gauge_id;
  if (newGid !== oldGid) {
    const gids: string[] = [oldGid, newGid].filter((g) => !!g) as any;
    let sids: string[] = await db()
      .select('source_id')
      .from('gauges')
      .whereIn('id', gids)
      .pluck('source_id');
    sids = uniq(sids);
    if (sids) {
      try {
        await Promise.all(
          sids.map((sid) => dataSources.gorge.updateJobForSource(sid)),
        );
      } catch {
        // ignore
      }
    }
  }
};

interface Vars {
  section: SectionInput;
}

const Struct = yup.object({
  section: SectionInputSchema,
});

const resolver: AuthenticatedTopLevelResolver<Vars> = async (
  _,
  vars,
  { user, language, dataSources },
) => {
  const createdBy = vars.section.createdBy || user.id;
  const section = transformSection({ ...vars.section, createdBy });
  const shouldInsertRiver = checkForNewRiver(section);

  const isEditor = await checkIsEditor(section, dataSources);
  if (section.id && !isEditor) {
    throw new ForbiddenError('only editors can edit existing sections');
  }

  if (shouldInsertRiver) {
    section.river.id = await insertNewRiver(section, language);
  }

  const old: SectionRaw | undefined = await dataSources.sections.getById(
    section.id,
  );
  const result: RawSectionUpsertResult = await rawUpsert(
    db(),
    'SELECT upsert_section(?, ?)',
    [{ ...section, verified: isEditor }, language],
  );
  if (!result) {
    return null;
  }
  const [newSection, upsertedMediaIds, deletedMediaUrls] = result;
  if (newSection) {
    await Promise.all([
      saveLog(user, newSection, old),
      moveAllMedia(upsertedMediaIds),
      deleteUnusedFiles(deletedMediaUrls),
      maybeUpdateJobs(dataSources, newSection, old),
    ]);
  }

  return newSection || null;
};

const upsertSection = isAuthenticatedResolver(
  isInputValidResolver(Struct, resolver),
);

export default upsertSection;
