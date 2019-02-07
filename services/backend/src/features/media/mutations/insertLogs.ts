import { SectionEditAction } from '@whitewater-guide/commons';
import Knex from 'knex';

interface InsertLogParams {
  sectionId: string;
  editorId: string;
  action: SectionEditAction;
  language: string;
}

const insertLog = async (db: Knex, params: InsertLogParams) => {
  const { sectionId, editorId, action, language } = params;
  await db.raw(
    `INSERT into sections_edit_log(section_id, old_section_name, new_section_name, river_id, river_name, region_id, region_name, editor_id, action)
SELECT 
       id as section_id,
       name as old_section_name,
       name as new_section_name,
       river_id,
       river_name,
       region_id,
       region_name,
       ? as editor_id,
       ? as action
FROM sections_view
WHERE sections_view.id = ? AND sections_view.language = ?`,
    [editorId, action, sectionId, language],
  );
};

export default insertLog;
