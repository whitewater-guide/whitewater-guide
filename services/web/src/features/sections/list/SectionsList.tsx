import React from 'react';
import useRouter from 'use-react-router';
import { useDeleteMutation } from '../../../apollo';
import REMOVE_SECTION from './removeSection.mutation';
import SectionsTable from './SectionsTable';
import { OuterProps } from './types';

export const SectionsList: React.FC<OuterProps> = React.memo((props) => {
  const removeSection = useDeleteMutation(REMOVE_SECTION, ['listSections']);
  const { history } = useRouter();
  return (
    <SectionsTable onRemove={removeSection} history={history} {...props} />
  );
});

SectionsList.displayName = 'SectionsList';
