import { useFormikContext } from 'formik';
import { useRef } from 'react';
import { useApolloClient } from 'react-apollo';
import useAsync from 'react-use/lib/useAsync';

import {
  DescentFormFragment,
  GetDescentDocument,
  GetDescentQuery,
  GetDescentQueryVariables,
} from './getDescent.generated';
import { DescentFormData, DescentFormNavProps } from './types';

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
    let descent: DescentFormFragment | undefined | null;
    try {
      const result = await apollo.query<
        GetDescentQuery,
        GetDescentQueryVariables
      >({
        query: GetDescentDocument,
        fetchPolicy: 'network-only',
        variables: { descentId, shareToken },
      });
      descent = result.data?.descent;
    } catch {
      /* Ignore */
    }
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
