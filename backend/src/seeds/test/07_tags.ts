import Knex = require('knex');

const tags = [
  { id: 'waterfalls', category: 'kayaking' },
  { id: 'creeking', category: 'kayaking' },
  { id: 'undercuts', category: 'hazards' },
  { id: 'snowmelt', category: 'supply' },
  { id: 'changing_rapids', category: 'misc' },
];

const tagsEn = [
  { tag_id: 'waterfalls', name: 'Waterfalls', language: 'en' },
  { tag_id: 'creeking', name: 'Creeking', language: 'en' },
  { tag_id: 'undercuts', name: 'Undercuts', language: 'en' },
  { tag_id: 'snowmelt', name: 'Snowmelt', language: 'en' },
  { tag_id: 'changing_rapids', name: 'Changing rapids', language: 'en' },
];

const tagsRu = [
  { tag_id: 'waterfalls', name: 'Водопады', language: 'ru' },
  { tag_id: 'undercuts', name: 'Карманы', language: 'ru' },
  { tag_id: 'snowmelt', name: 'Снеговое', language: 'ru' },
  { tag_id: 'changing_rapids', name: 'Пороги перемывает', language: 'ru' },
];

export async function seed(db: Knex) {
  await db.table('tags').del();
  await db.table('tags_translations').del();
  await db.table('tags').insert(tags);
  await db.table('tags_translations').insert(tagsEn);
  await db.table('tags_translations').insert(tagsRu);
}
