import {
  LogbookDescent,
  LogbookDescentAll,
} from '@whitewater-guide/logbook-schema';
import gql from 'graphql-tag';
import { useMemo } from 'react';
import { useQuery } from 'react-apollo';
import { DescentFormData, DescentFormNavProps } from './types';

const DESCENT_FORM_QUERY = gql`
  query getLogbookDescent($descentId: ID, $shareToken: String) {
    logbookDescent(id: $descentId, shareToken: $shareToken) {
      ...logbookDescentAll
    }
  }
  ${LogbookDescentAll}
`;

interface QVars {
  descentId?: string | null;
  shareToken?: string | null;
}

interface QResult {
  logbookDescent?: LogbookDescent;
}

export default (props: DescentFormNavProps['route']['params']) => {
  const { descentId, shareToken, section } = props;
  const { data, error, loading } = useQuery<QResult, QVars>(
    DESCENT_FORM_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: { descentId, shareToken },
      skip: !!section,
    },
  );

  const initialData: DescentFormData = useMemo(() => {
    if (section) {
      return {
        section: {
          region: section.region.name,
          difficulty: section.difficulty,
          river: section.river.name,
          section: section.name,
          putIn: {
            lat: section.putIn.coordinates[1],
            lng: section.putIn.coordinates[0],
          },
          takeOut: {
            lat: section.takeOut.coordinates[1],
            lng: section.takeOut.coordinates[0],
          },
          upstreamId: section.id,
        },
        startedAt: new Date(),
        public: true,
      };
    }
    if (!data?.logbookDescent) {
      return {
        section: {
          region: 'Foo',
          difficulty: 3,
          river: 'Bar',
          section: 'Baz',
        },
        startedAt: new Date(),
        public: true,
      };
    }
    return {
      ...data.logbookDescent,
      startedAt: new Date(data?.logbookDescent?.startedAt),
      level: data.logbookDescent.level?.value
        ? {
            value: data.logbookDescent.level.value,
            unit: data.logbookDescent.level.unit,
          }
        : undefined,
      public: true,
    };
  }, [section, data]);

  return { initialData, loading, error };
};
