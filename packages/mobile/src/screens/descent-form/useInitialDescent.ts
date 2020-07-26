import { Descent } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import gql from 'graphql-tag';
import { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import useAsync from 'react-use/lib/useAsync';
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
  descent?: Descent;
}

export default function useInitialDescent(
  props: DescentFormNavProps['route']['params'],
) {
  const propsRef = useRef(props);
  const { setValues } = useFormikContext<Partial<DescentFormData>>();
  const apollo = useApolloClient();

  const { loading } = useAsync(async () => {
    const { descentId, formData, shareToken } = propsRef.current;
    // Rehydrated with some state:
    if (formData) {
      setValues(formData);
      return;
    }
    let descent: Descent | undefined;
    try {
      const result = await apollo.query<QResult, QVars>({
        query: DESCENT_FORM_QUERY,
        fetchPolicy: 'network-only',
        variables: { descentId, shareToken },
      });
      descent = result.data?.descent;
    } catch {}
    if (!descent) {
      // New descent form
      setValues({
        startedAt: new Date().toISOString(),
        public: true,
      });
    } else {
      // Existing descent form
      const { level, ...rest } = descent;
      setValues({
        ...rest,
        level: level?.value
          ? {
              value: level.value,
              unit: level.unit,
            }
          : undefined,
      });
    }
  }, [apollo, propsRef, setValues]);

  return loading;
}
