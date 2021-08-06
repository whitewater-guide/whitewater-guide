import { Gauge, Section } from '@whitewater-guide/schema';

type SectionChanges = Pick<Section, 'id' | 'updatedAt'> & {
  gauge?: Pick<Gauge, 'latestMeasurement'> | null;
};

export const sectionHasChanged = (s1: SectionChanges, s2: SectionChanges) =>
  s1.id !== s2.id ||
  s1.updatedAt !== s2.updatedAt ||
  s1.gauge?.latestMeasurement?.timestamp !==
    s2.gauge?.latestMeasurement?.timestamp;
