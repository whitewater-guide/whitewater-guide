import React from 'react';
import useRouter from 'use-react-router';

import { useDeleteMutation } from '../../../apollo';
import MergeSectionsDialog from './MergeSectionsDialog';
import { MergeSectionsProvider } from './MergeSectionsProvider';
import { RemoveSectionDocument } from './removeSection.generated';
import SectionsTable from './SectionsTable';
import { OuterProps } from './types';

export const SectionsList = React.memo<OuterProps>((props) => {
  const removeSection = useDeleteMutation(RemoveSectionDocument, [
    'listSections',
  ]);
  const { history } = useRouter();
  return (
    <MergeSectionsProvider>
      <SectionsTable onRemove={removeSection} history={history} {...props} />
      <MergeSectionsDialog regionId={props.regionId} />
    </MergeSectionsProvider>
  );
});

SectionsList.displayName = 'SectionsList';
