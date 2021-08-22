import {
  MediaKind,
  MutationUpsertSectionArgs,
  SectionInput,
  SectionInputSchema,
} from '@whitewater-guide/schema';
import { ForbiddenError } from 'apollo-server-koa';
import uniq from 'lodash/uniq';
import * as yup from 'yup';

import {
  AuthenticatedMutation,
  Context,
  ContextUser,
  isAuthenticatedResolver,
  isInputValidResolver,
  UnknownError,
} from '~/apollo';
import { db, rawUpsert, Sql } from '~/db';
import { OTHERS_REGION_ID } from '~/features/regions';
import { MEDIA, s3Client } from '~/s3';

import { RawSectionUpsertResult } from '../types';
import { checkForNewRiver, insertNewRiver, isNewRiverId } from './upsertUtils';
import { differ } from './utils';

const transformSection = (section: SectionInput): SectionInput => ({
  ...section,
  media: section.media.map((item) => {
    if (item.kind === MediaKind.Photo) {
      const url = s3Client.getLocalFileName(item.url);
      if (!url) {
        throw new UnknownError('photo url invalid: ' + item.url);
      }
      return { ...item, url };
    }
    return item;
  }),
});

const checkIsEditor = async (
  section: SectionInput,
  dataSources: Context['dataSources'],
) => {
  const query = isNewRiverId(section.river.id)
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
  current: Sql.SectionsView,
  old?: Sql.SectionsView,
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
  await Promise.all(files.map(({ url }) => s3Client.moveTempImage(url, MEDIA)));
};

const deleteUnusedFiles = async (urls: string[] | null) => {
  if (!urls || urls.length === 0) {
    return;
  }
  await Promise.all(
    urls.map((url) =>
      s3Client.removeFile(MEDIA, url).catch(() => {
        // ignore files that we cannot remove
      }),
    ),
  );
};

const maybeUpdateJobs = async (
  dataSources: any,
  current: Sql.SectionsView,
  old?: Sql.SectionsView,
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

const Schema: yup.SchemaOf<MutationUpsertSectionArgs> = yup.object({
  section: SectionInputSchema.clone(),
});

const upsertSection: AuthenticatedMutation['upsertSection'] = async (
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

  const old: Sql.SectionsView | undefined = await dataSources.sections.getById(
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

export default isAuthenticatedResolver(
  isInputValidResolver(Schema, upsertSection),
);
