import { EditorSettings } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import { useCallback } from 'react';
import { useApolloClient, useMutation } from 'react-apollo';

const EDITOR_SETTINGS_MUTATION = gql`
  mutation updateEditorSettings($settings: EditorSettingsInput!) {
    updateEditorSettings(editorSettings: $settings) {
      id
      editorSettings {
        language
      }
    }
  }
`;

interface MVars {
  settings: Pick<EditorSettings, 'language'>;
}

export default () => {
  const [mutate] = useMutation<unknown, MVars>(EDITOR_SETTINGS_MUTATION);
  const client = useApolloClient();
  return useCallback(
    (language: string) =>
      mutate({ variables: { settings: { language } } }).then(() =>
        client.resetStore(),
      ),
    [mutate, client],
  );
};
