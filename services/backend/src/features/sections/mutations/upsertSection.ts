import {
  MediaKind,
  NEW_ID,
  SectionInput,
  SectionInputSchema,
  SuggestionStatus,
} from '@whitewater-guide/commons';
import { DiffPatcher } from 'jsondiffpatch';
import uniq from 'lodash/uniq';
import * as yup from 'yup';
import { Context, isInputValidResolver, TopLevelResolver } from '~/apollo';
import db, { rawUpsert } from '~/db';
import { SectionRaw } from '~/features/sections';
import { getLocalFileName, MEDIA, minioClient, moveTempImage } from '~/minio';
import { isAuthenticatedResolver } from '../../../apollo/enhancedResolvers';
import { RawSectionUpsertResult } from '../types';
import { checkForNewRiver, insertNewRiver } from './upsertUtils';

const differ = new DiffPatcher({
  propertyFilter: (name: keyof SectionRaw) => {
    return (
      name !== 'created_at' &&
      name !== 'created_by' &&
      name !== 'updated_at' &&
      name !== 'language' &&
      name !== 'region_name'
    );
  },
});

const transformSection = (section: SectionInput): SectionInput => {
  return {
    ...section,
    media: (section.media ?? []).map((item) => {
      return item.kind === MediaKind.photo
        ? { ...item, url: getLocalFileName(item.url)! }
        : item;
    }),
  };
};

const checkIsEditor = async (
  section: SectionInput,
  dataSources: Context['dataSources'],
) => {
  const query =
    section.river.id === NEW_ID
      ? { regionId: section.region!.id }
      : {
          sectionId: section.id,
          riverId: section.river.id,
        };
  const isEditor = await dataSources.users.checkEditorPermissions(query);
  return isEditor;
};

const insertAsSuggestion = async (section: SectionInput) => {
  await db()
    .insert({ section })
    .into('suggested_sections');
};

const saveLog = async (
  user: Context['user'],
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
      editor_id: user!.id,
      diff: old && differ.diff(old, current),
    })
    .into('sections_edit_log');
};

const approveSuggestion = async (
  { suggestionId }: SectionInput,
  user: Context['user'],
) => {
  if (suggestionId) {
    await db()
      .table('suggested_sections')
      .update({
        status: SuggestionStatus.ACCEPTED,
        resolved_at: db().fn.now(),
        resolved_by: user!.id,
      })
      .where({ id: suggestionId });
  }
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
  return Promise.all(files.map(({ url }) => moveTempImage(url, MEDIA)));
};

const deleteUnusedFiles = async (urls: string[] | null) => {
  if (!urls || urls.length === 0) {
    return;
  }
  return Promise.all(
    urls.map((url) =>
      minioClient.removeObject(MEDIA, url).catch(() => {
        /*ignore */
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
      await Promise.all(
        sids.map((sid) => dataSources.gorge.updateJobForSource(sid)),
      );
    }
  }
};

interface Vars {
  section: SectionInput;
}

const Struct = yup.object({
  section: SectionInputSchema,
});

const resolver: TopLevelResolver<Vars> = async (
  _,
  vars,
  { user, language, dataSources },
) => {
  const createdBy = vars.section.createdBy || (user ? user.id : null);
  const section = transformSection({ ...vars.section, createdBy });
  const shouldInsertRiver = checkForNewRiver(section);

  const isEditor = await checkIsEditor(section, dataSources);

  if (!isEditor) {
    await insertAsSuggestion(section);
    return null;
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
    [section, language],
  );
  if (!result) {
    return null;
  }
  const [newSection, upsertedMediaIds, deletedMediaUrls] = result;
  if (newSection) {
    await Promise.all([
      saveLog(user, newSection, old),
      approveSuggestion(section, user),
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
