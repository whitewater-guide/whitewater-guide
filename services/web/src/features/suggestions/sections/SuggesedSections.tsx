import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Loading } from '../../../components';
import {
  QResult,
  QVars,
  SUGGESTED_SECTIONS_QUERY,
} from './suggestedSections.query';
import SuggestedSectionsInfinite from './SuggestedSectionsInfinite';

const DEFAULT_STATUSES = [SuggestionStatus.PENDING];

export const SuggesedSections: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUSES);

  const { data, loading, fetchMore } = useQuery<QResult, QVars>(
    SUGGESTED_SECTIONS_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: {
        filter: { status: statusFilter },
      },
    },
  );

  if (loading && !(data && data.suggestedSections)) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <SuggestedSectionsInfinite
        suggestedSections={data!.suggestedSections}
        fetchMore={fetchMore}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </React.Fragment>
  );
};

SuggesedSections.displayName = 'SuggesedSections';
