import { memo } from 'react';

import SimpleTextFlowRow from './simple-text-flow-row';

import type { MapSection } from '../types';

export const FLOWS_ROW_HEIGHT = 64;

export interface SectionFlowsRowProps {
  section: MapSection | null;
}

function propsAreEqual(
  a: SectionFlowsRowProps,
  b: SectionFlowsRowProps,
): boolean {
  return a.section?.id === b.section?.id;
}

const SectionFlowsRow = memo(({ section }: SectionFlowsRowProps) => {
  return (
    <SimpleTextFlowRow
      flowsText={section?.flowsText}
      style={{ height: FLOWS_ROW_HEIGHT }}
    />
  );
}, propsAreEqual);

SectionFlowsRow.displayName = 'SectionFlowsRow';

export default SectionFlowsRow;
