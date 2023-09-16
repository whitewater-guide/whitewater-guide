import type { SectionNameShortFragment } from '@whitewater-guide/schema';

/**
 * This function returns human-readable section name that is made of river name and section name and dash
 * @param section
 * @returns
 */
export function sectionName(
  section?: Partial<SectionNameShortFragment> | null,
): string {
  if (!section) {
    return '';
  }
  const riverName = section.river?.name ?? '';
  return [riverName, section.name].filter((s) => !!s).join(' - ');
}
