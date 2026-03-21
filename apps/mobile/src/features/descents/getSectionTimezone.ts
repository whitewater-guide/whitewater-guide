import type { Gauge, Section } from '@whitewater-guide/schema';

export default function getSectionTimezone(
  section?:
    | (Pick<Section, 'timezone'> & { gauge?: Pick<Gauge, 'timezone'> | null })
    | null,
): string {
  return section?.gauge?.timezone ?? section?.timezone ?? 'UTC';
}
