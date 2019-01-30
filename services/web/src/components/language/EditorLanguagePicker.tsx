import gql from 'graphql-tag';
import get from 'lodash/get';
import React from 'react';
import { graphql, withApollo, WithApolloClient } from 'react-apollo';
import { compose, mapProps } from 'recompose';
import { Styles } from '../../styles';
import { withMe, WithMe } from '@whitewater-guide/clients';
import { EditorSettings } from '@whitewater-guide/commons';
import { EditorOnly } from '../EditorOnly';
import { LanguagePicker, LanguagePickerProps } from './LanguagePicker';

const styles: Styles = {
  style: {
    marginTop: -16,
  },
  labelStyle: {
    color: 'white',
  },
};

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
  graphql<WithApolloClient<WithMe>, {}, Vars, MutateProps>(
    EDITOR_SETTINGS_MUTATION,
    {
      props: ({ mutate, ownProps: { client } }) => ({
        onLanguageChange: (language: string) =>
          mutate!({ variables: { settings: { language } } }).then(() =>
            client.resetStore(),
          ),
      }),
    },
  ),
  mapProps<LanguagePickerProps, WithMe & MutateProps>(
    ({ me, onLanguageChange }) => ({
      language: get(me, 'editorSettings.language', 'en'),
      onLanguageChange,
      ...styles,
    }),
  ),
);

const LanguagePickerWithData: React.ComponentType = container(LanguagePicker);

export const EditorLanguagePicker: React.StatelessComponent = () => (
  <EditorOnly>
    <LanguagePickerWithData />
  </EditorOnly>
);
