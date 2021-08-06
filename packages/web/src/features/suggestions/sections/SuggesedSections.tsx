import React from 'react';

import { Loading } from '../../../components';
import { useSuggestedSectionsQuery } from './suggestedSections.generated';
import SuggestedSectionsInfinite from './SuggestedSectionsInfinite';

export const SuggesedSections: React.FC = () => {
  const { data, loading, fetchMore } = useSuggestedSectionsQuery({
    fetchPolicy: 'network-only',
    variables: {
      filter: { editable: true, verified: false },
    },
  });

  if (loading && !data?.sections) {
    return <Loading />;
  }

  return (
    <SuggestedSectionsInfinite
      suggestedSections={data?.sections}
      fetchMore={fetchMore}
    />
  );
};

SuggesedSections.displayName = 'SuggesedSections';
