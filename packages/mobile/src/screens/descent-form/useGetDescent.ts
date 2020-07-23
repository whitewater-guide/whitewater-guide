import { Descent } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useMemo, useRef } from 'react';
import { useQuery } from 'react-apollo';
import { DescentFormData, DescentFormNavProps } from './types';

const DESCENT_FORM_QUERY = gql`
  query getDescent($descentId: ID, $shareToken: String) {
    descent(id: $descentId, shareToken: $shareToken) {
      id

      startedAt
      duration
      level {
        value
        unit
      }
      comment
      public

      createdAt
      updatedAt

      section {
        id
        name
        river {
          id
          name
        }
        region {
          id
          name
        }
      }
    }
  }
`;

interface QVars {
  descentId?: string | null;
  shareToken?: string | null;
}

interface QResult {
  Descent?: Descent;
}

export default (props: DescentFormNavProps['route']['params']) => {
  const { descentId, shareToken, formData } = props;
  const formDataRef = useRef(formData);

  const { data, error, loading } = useQuery<QResult, QVars>(
    DESCENT_FORM_QUERY,
    {
      fetchPolicy: 'network-only',
      variables: { descentId, shareToken },
      skip: !!formData,
    },
  );

  const initialData: Partial<DescentFormData> = useMemo(() => {
    if (formDataRef.current) {
      return formDataRef.current;
    }
    if (!data?.Descent) {
      return {
        startedAt: new Date(),
        public: true,
      };
    }
    const { startedAt, level, ...rest } = data.Descent;
    return {
      ...rest,
      startedAt: new Date(startedAt),
      level: level?.value
        ? {
            value: level.value,
            unit: level.unit,
          }
        : undefined,
    };
  }, [formDataRef, data]);

  return { initialData, loading, error };
};
