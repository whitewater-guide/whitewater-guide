import React from 'react';
import { useHistory } from 'react-router';

import { useDeleteMutation } from '../../../apollo';
import MergeSectionsDialog from './MergeSectionsDialog';
import { MergeSectionsProvider } from './MergeSectionsProvider';
import { RemoveSectionDocument } from './removeSection.generated';
import SectionsTable from './SectionsTable';
import type { OuterProps } from './types';

export const SectionsList = React.memo<OuterProps>((props) => {
  const removeSection = useDeleteMutation(RemoveSectionDocument, [
    'listSections',
  ]);
  const history = useHistory();
  return (
    <MergeSectionsProvider>
      <SectionsTable onRemove={removeSection} history={history} {...props} />
      <MergeSectionsDialog regionId={props.regionId} />
    </MergeSectionsProvider>
  );
});

SectionsList.displayName = 'SectionsList';
