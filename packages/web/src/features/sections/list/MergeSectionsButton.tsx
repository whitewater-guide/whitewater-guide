import { Section } from '@whitewater-guide/commons';
import React from 'react';

import { useMergeSource } from './MergeSectionsProvider';
import SectionMenuItem from './SectionMenuItem';

interface Props {
  section: Section;
  onClick: (e: React.MouseEvent) => void;
}

const MergeSectionsButton = React.forwardRef<HTMLLIElement, Props>(
  ({ onClick, section }, ref) => {
    const { setSource } = useMergeSource();

    const handleClick = (e: React.MouseEvent) => {
      setSource(section);
      onClick(e);
    };
    return (
      <SectionMenuItem
        ref={ref}
        icon="merge_type"
        label="Merge into..."
        onClick={handleClick}
      />
    );
  },
);

MergeSectionsButton.displayName = 'MergeSectionsButton';

export default MergeSectionsButton;
