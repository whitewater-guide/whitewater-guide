import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';

import { useUpdateEditorSettingsMutation } from './updateEditorSettings.generated';

export default function useEditorLanguage() {
  const [mutate] = useUpdateEditorSettingsMutation();
  const client = useApolloClient();
  return useCallback(
    (language: string) =>
      mutate({ variables: { settings: { language } } }).then(() =>
        client.resetStore(),
      ),
    [mutate, client],
  );
}
