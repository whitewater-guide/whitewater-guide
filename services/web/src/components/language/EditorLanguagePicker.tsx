import { withMe, WithMe } from '@whitewater-guide/clients';
import { EditorSettings } from '@whitewater-guide/commons';
import gql from 'graphql-tag';
import get from 'lodash/get';
import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { compose, mapProps } from 'recompose';
import { EditorOnly } from '../EditorOnly';
import { LanguagePicker, LanguagePickerProps } from './LanguagePicker';

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

interface Vars {
  settings: EditorSettings;
}

interface MutateProps {
  onLanguageChange: (language: string) => void;
}

const container = compose<LanguagePickerProps, any>(
  withMe,
  withApollo,
  graphql<WithMe, {}, Vars, MutateProps>(EDITOR_SETTINGS_MUTATION, {
    props: ({ mutate, ownProps: { client } }: any) => ({
      onLanguageChange: (language: string) =>
        mutate!({ variables: { settings: { language } } }).then(() =>
          client.resetStore(),
        ),
    }),
  }),
  mapProps<LanguagePickerProps, WithMe & MutateProps>(
    ({ me, onLanguageChange }) => ({
      language: get(me, 'editorSettings.language', 'en'),
      onLanguageChange,
    }),
  ),
);

const LanguagePickerWithData: React.ComponentType = container(LanguagePicker);

export const EditorLanguagePicker: React.FC = React.memo(() => (
  <EditorOnly>
    <LanguagePickerWithData />
  </EditorOnly>
));

EditorLanguagePicker.displayName = 'EditorLanguagePicker';
