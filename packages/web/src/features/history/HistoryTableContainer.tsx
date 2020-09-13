import { NamedNode } from '@whitewater-guide/commons';
import React, { useMemo, useState } from 'react';
import { Query } from 'react-apollo';

import HistoryTableInfinite from './HistoryTableInfinite';
import { QResult, QVars, SECTONS_EDIT_HISTORY_QUERY } from './query';

const EMPTY_HISTORY = { nodes: [], count: 0 };

interface Props {
  onDiffOpen: (diff: object | null) => void;
}

const HistoryTableContainer: React.FC<Props> = ({ onDiffOpen }) => {
  const [user, setUser] = useState<NamedNode | null>(null);
  const [region, setRegion] = useState<NamedNode | null>(null);
  const variables: QVars = useMemo(
    () => ({
      filter: {
        editorId: user ? user.id : undefined,
        regionId: region ? region.id : undefined,
      },
    }),
    [user, region],
  );
  return (
    <Query<QResult, QVars>
      fetchPolicy="network-only"
      query={SECTONS_EDIT_HISTORY_QUERY}
      variables={variables}
    >
      {({ data, loading, fetchMore }) => {
        return (
          <HistoryTableInfinite
            history={(data && data.history) || EMPTY_HISTORY}
            fetchMore={fetchMore}
            user={user}
            region={region}
            onUserChange={setUser}
            onRegionChange={setRegion}
            onDiffOpen={onDiffOpen}
          />
        );
      }}
    </Query>
  );
};

export default HistoryTableContainer;
