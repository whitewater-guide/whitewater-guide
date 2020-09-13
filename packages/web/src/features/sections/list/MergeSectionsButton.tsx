import { Section } from '@whitewater-guide/commons';
import React from 'react';

import { useMergeSource } from './MergeSectionsProvider';
import SectionMenuItem from './SectionMenuItem';

interface Props {
  section: Section;
  onClick: (e: React.MouseEvent<any>) => void;
}

const MergeSectionsButton = React.forwardRef(
  ({ onClick, section }: Props, ref: any) => {
    const { setSource } = useMergeSource();

    const handleClick = (e: React.MouseEvent<any>) => {
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
