import React from 'react';
import { useQuery } from 'react-apollo';

import { Loading } from '../../../components';
import {
  QResult,
  QVars,
  SUGGESTED_SECTIONS_QUERY,
} from './suggestedSections.query';
import SuggestedSectionsInfinite from './SuggestedSectionsInfinite';

export const SuggesedSections: React.FC = () => {
  const { data, loading, fetchMore } = useQuery<QResult, QVars>(
    SUGGESTED_SECTIONS_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: {
        filter: { editable: true, verified: false },
      },
    },
  );

  if (loading && !(data && data.sections)) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <SuggestedSectionsInfinite
        suggestedSections={data!.sections}
        fetchMore={fetchMore}
      />
    </React.Fragment>
  );
};

SuggesedSections.displayName = 'SuggesedSections';
