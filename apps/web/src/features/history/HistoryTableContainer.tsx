import type { NamedNode } from '@whitewater-guide/schema';
import React, { useState } from 'react';

import HistoryTableInfinite from './HistoryTableInfinite';
import { useSectionsEditLogQuery } from './sectionsEditLog.generated';
import type { Diff } from './types';

const EMPTY_HISTORY = { nodes: [], count: 0 };

interface Props {
  onDiffOpen: (diff: Diff | null) => void;
}

const HistoryTableContainer: React.FC<Props> = ({ onDiffOpen }) => {
  const [user, setUser] = useState<NamedNode | null>(null);
  const [region, setRegion] = useState<NamedNode | null>(null);
  const { data, fetchMore } = useSectionsEditLogQuery({
    variables: {
      filter: {
        editorId: user?.id,
        regionId: region?.id,
      },
    },
    fetchPolicy: 'network-only',
  });
  return (
    <HistoryTableInfinite
      history={data?.history || EMPTY_HISTORY}
      fetchMore={fetchMore}
      user={user}
      region={region}
      onUserChange={setUser}
      onRegionChange={setRegion}
      onDiffOpen={onDiffOpen}
    />
  );
};

export default HistoryTableContainer;
