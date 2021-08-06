import { ListedSectionFragment } from '@whitewater-guide/clients';
import React from 'react';

import { useMergeSource } from './MergeSectionsProvider';
import SectionMenuItem from './SectionMenuItem';

interface Props {
  section: ListedSectionFragment;
  onClick: (e: React.MouseEvent) => void;
}

const MergeSectionsButton = React.forwardRef<HTMLLIElement, Props>(
  ({ onClick, section }, ref) => {
    const [_, setSource] = useMergeSource();

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
