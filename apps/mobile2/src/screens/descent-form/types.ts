import type { DescentInput, DescentSectionFragment } from '@whitewater-guide/schema';

export type DescentFormData = Omit<DescentInput, 'sectionId'> & {
  section: DescentSectionFragment;
};
