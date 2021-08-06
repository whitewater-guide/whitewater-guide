import Knex from 'knex';

interface InsertLogParams {
  sectionId: string;
  editorId: string;
  action: string;
  language: string;
  diff: any;
}

export const insertLog = async (db: Knex, params: InsertLogParams) => {
  const { sectionId, editorId, action, language, diff } = params;
  await db.raw(
    `INSERT into sections_edit_log(section_id, section_name, river_id, river_name, region_id, region_name, editor_id, action, diff)
SELECT
       id as section_id,
       name as section_name,
       river_id,
       river_name,
       region_id,
       region_name,
       ? as editor_id,
       ? as action,
       ? as diff
FROM sections_view
WHERE sections_view.id = ? AND sections_view.language = ?`,
    [editorId, action, diff, sectionId, language],
  );
};
