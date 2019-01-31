import { rawUpsert } from '@db';
import { KMLSection } from '@utils';
import { Coordinate3d } from '@whitewater-guide/commons';
import { readdirSync, readFileSync } from 'fs';
import { Feature, FeatureCollection, LineString } from 'geojson';
import Knex from 'knex';
import groupBy from 'lodash/groupBy';
import path from 'path';
import { kml } from 'togeojson';
import { DOMParser } from 'xmldom';

/**
 * This loads Pyrenees by Quim Fontane
 * Also adds fields to rivers and sections tables to indicate such import
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const kmlFiles = readdirSync('./dist/migrations/011', { encoding: 'utf8' });

  const sections: KMLSection[] = kmlFiles
    .map((f) => parseSection(f))
    .filter((s) => !!s) as any;
  const byRiver: { [key: string]: KMLSection[] } = groupBy(sections, 'river');
  const rivers = Object.keys(byRiver);
  const selected = await db
    .table('regions_translations')
    .select('region_id')
    .where('name', 'ilike', 'Pyrenees')
    .first();
  if (!selected) {
    return;
  }
  const { region_id: pyrenees } = selected;
  const region = { id: pyrenees };
  const riverIds = await upsertRivers(db, rivers, region);
  for (const section of sections) {
    const riverId = riverIds.get(section.river);
    await upsertSection(db, section, riverId!);
  }
};

const parseSection = (filename: string): KMLSection | null => {
  const [riverName, ...rest] = filename.replace('.kml', '').split(' - ');
  let sectionName = riverName;
  if (rest.length > 0) {
    sectionName = rest.join(' - ');
  }
  const kmlDoc = new DOMParser().parseFromString(
    readFileSync(path.resolve('./dist/migrations/011', filename), 'utf8'),
  );
  const { features }: FeatureCollection<LineString> = kml(kmlDoc);
  const lines: Array<Feature<LineString>> = features.filter(
    (f) => f.geometry.type === 'LineString',
  ) as any;
  if (lines.length !== 1) {
    console.warn(`Failed to find polyline for ${filename}`);
    return null;
  }
  const line = lines[0];
  const coordinates = line.geometry.coordinates;
  return {
    river: riverName,
    name: sectionName,
    coordinates: coordinates.map(([lon, lat]) => [lon, lat, 0] as Coordinate3d),
    description: null,
    difficulty: 1,
    difficultyExtra: null,
    hasGauge: false,
  };
};

const upsertRivers = async (
  db: Knex,
  riverNames: string[],
  region: any,
): Promise<Map<string, string>> => {
  const riverIds: Map<string, string> = new Map<string, string>();
  for (const riverName of riverNames) {
    const exists = await db
      .select('river_id')
      .from('rivers_translations')
      .where('name', 'ilike', riverName)
      .first();
    if (exists) {
      riverIds.set(riverName, exists.river_id);
      continue;
    }
    const inserted = (await rawUpsert(db, 'SELECT upsert_river(?, ?)', [
      { region, name: riverName },
      'en',
    ])) as any;
    if (inserted) {
      riverIds.set(riverName, inserted.id);
      await db
        .table('rivers')
        .update({ import_id: 'pyrenees_fontane_1' })
        .where({ id: inserted.id });
    }
  }
  return riverIds;
};

const upsertSection = async (
  db: Knex,
  section: KMLSection,
  riverId: string,
) => {
  const rawSection = {
    river: { id: riverId },
    difficulty: section.difficulty,
    difficultyXtra: section.difficultyExtra,
    description: section.description,
    name: section.name,
    shape: section.coordinates,
    hidden: true,
  };
  const result: any = await rawUpsert(db, 'SELECT upsert_section(?, ?)', [
    rawSection,
    'en',
  ]);
  if (result) {
    await db
      .table('sections')
      .update({ import_id: 'pyrenees_fontane_1' })
      .where({ id: result.id });
  }
};

export const down = async (db: Knex) => {};

export const configuration = { transaction: true };
