import { useAuth } from '@whitewater-guide/clients';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo';
import { Loading } from '../../../components';
import {
  QResult,
  QVars,
  SUGGESTED_SECTIONS_QUERY,
} from './suggestedSections.query';
import SuggestedSectionsInfinite from './SuggestedSectionsInfinite';

const ADMIN_STATUSES = [
  SuggestionStatus.PENDING,
  SuggestionStatus.ACCEPTED,
  SuggestionStatus.REJECTED,
];

const EDITOR_STATUSES = [SuggestionStatus.PENDING];

export const SuggesedSections: React.FC = () => {
  const { me } = useAuth();
  const [statusFilter, setStatusFilter] = useState(
    me && me.admin ? ADMIN_STATUSES : EDITOR_STATUSES,
  );
  useEffect(() => {
    setStatusFilter(me && me.admin ? ADMIN_STATUSES : EDITOR_STATUSES);
  }, [me && me.admin]);

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
