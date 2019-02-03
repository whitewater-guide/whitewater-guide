import { rawUpsert } from '@db';
import pointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon, Polygon } from '@turf/helpers';
import { Coordinate3d } from '@whitewater-guide/commons';
import { readFileSync } from 'fs';
import Knex from 'knex';

// tslint:disable:no-console

interface RivermapSection {
  id: number;
  river: string;
  section: string;
  type: string;
  latstart: number;
  lngstart: number;
  latend: number;
  lngend: number;
  generalGrade: string;
  spotGrades: string;
  country: string;
  url: string;
}

interface RivermapData {
  data: {
    sections: RivermapSection[];
  };
}

interface RegionRow {
  id: string;
  name: string;
  bounds: Polygon;
}

const UNKNOWN: RegionRow = {
  id: 'UNKNOWN',
  name: 'UNKNOWN',
  bounds: { type: 'Polygon', coordinates: [] },
};

const DIFFICULTIES = new Map<string, number>([
  ['IV-V', 4.5],
  ['III-IV', 3.5],
  ['II', 2],
  ['III', 3],
  ['II-III', 2.5],
  ['IV-', 4],
  ['III+', 3],
  ['V-', 5],
  ['IV', 4],
  ['I', 1],
  ['I-II', 1.5],
  ['IV+', 4],
  ['V-VI', 5.5],
  ['VI', 6],
  ['V', 5],
  ['V+', 5],
  ['III-', 3],
  ['I/2', 1.5],
  ['II/2-3', 2.5],
  ['II/3', 2.5],
  ['II+', 2],
  ['II-', 2],
]);

function groupByRiver(sections: RivermapSection[]) {
  const byRiver = new Map<string, RivermapSection[]>();
  sections.forEach((s) => {
    const riverSections = byRiver.get(s.river) || [];
    byRiver.set(s.river, [...riverSections, s]);
  });
  return byRiver;
}

function groupByRegion(regions: RegionRow[], sections: RivermapSection[]) {
  const byRegion = new Map<RegionRow, RivermapSection[]>();
  for (const s of sections) {
    let region = UNKNOWN;
    for (const r of regions) {
      const tPoint = point([s.lngstart, s.latstart]);
      const tPoly = polygon(r.bounds.coordinates);
      const inside = pointInPolygon(tPoint, tPoly);
      if (inside) {
        region = r;
        break;
      }
    }
    const regionSections = byRegion.get(region) || [];
    byRegion.set(region, [...regionSections, s]);
  }
  return byRegion;
}

/**
 * This loads rivermap.ch database dump (https://www.rivermap.ch/public/ODBL/extract.json)
 * Current dump stats:
 *   Types: 1547 sections, 26 playspots, 27 slaloms, 11 drops
 *   Countries:
 *     CH - 271
 *     DE - 115
 *     FR - 528
 *     AT - 236
 *     IT - 262
 *     SI - 31
 *     GR - 31
 *     NO - 66
 *     ME - 16
 *     AL - 10
 *     XK - 2
 *     BA - 1
 *     CZ - 19
 *     PL - 12
 *     ES - 8
 *     HR - 3
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const txt = readFileSync('./dist/migrations/012/rivermap_extract.json', {
    encoding: 'utf8',
  });
  const json: RivermapData = JSON.parse(txt);

  const regionsRows: RegionRow[] = await db
    .table('regions_view')
    .select('id', 'name', 'bounds')
    .where({ language: 'en' });

  const byRegions = groupByRegion(regionsRows, json.data.sections);
  console.log('[META] Rivermap.CH region stats:');
  for (const [k, v] of byRegions) {
    console.log(`[META]\t${k.name}: ${v.length}`);
    if (k === UNKNOWN) {
      continue;
    }
    if (k.name === 'Norway') {
      console.log(`[META]\t${k.name}: skipping`);
      continue;
    }
    const byRiver = groupByRiver(v);
    const riverNames = Array.from(byRiver.keys());
    const riverIds = await upsertRivers(db, riverNames, { id: k.id });
    for (const section of v) {
      const riverId = riverIds.get(section.river);
      if (!riverId) {
        console.log('Not FOUND', section);
      }
      await upsertSection(db, section, riverId!);
    }
  }
};

const upsertRivers = async (
  db: Knex,
  riverNames: string[],
  region: { id: string },
): Promise<Map<string, string>> => {
  const riverIds: Map<string, string> = new Map<string, string>();
  for (const riverName of riverNames) {
    const exists = await db
      .select('id')
      .from('rivers_view')
      .where('name', 'ilike', riverName)
      .andWhere({ language: 'en' })
      .andWhere({ region_id: region.id })
      .first();
    if (exists) {
      riverIds.set(riverName, exists.id);
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
        .update({ import_id: 'rivermap1' })
        .where({ id: inserted.id });
    }
  }
  return riverIds;
};

const upsertSection = async (
  db: Knex,
  section: RivermapSection,
  riverId: string,
) => {
  const rawSection = {
    river: { id: riverId },
    difficulty: DIFFICULTIES.get(section.generalGrade) || 1,
    difficultyXtra: section.generalGrade,
    description: section.url,
    name: `[Rivermap.ch] ${section.section}`,
    shape: [
      [section.lngstart, section.latstart, 0],
      [
        section.lngend || section.lngstart,
        section.latend || section.latstart,
        0,
      ],
    ],
    hidden: true,
  };
  try {
    const result: any = await rawUpsert(db, 'SELECT upsert_section(?, ?)', [
      rawSection,
      'en',
    ]);
    if (result) {
      await db
        .table('sections')
        .update({ import_id: `rivermap1_${section.id}` })
        .where({ id: result.id });
    }
  } catch (e) {
    console.log('ERROR', e);
    console.log(section, rawSection);
    throw e;
  }
};

export const down = async (db: Knex) => {};

export const configuration = { transaction: true };
