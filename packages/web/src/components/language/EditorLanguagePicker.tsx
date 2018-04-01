import gql from 'graphql-tag';
import get from 'lodash/get';
import React from 'react';
import { graphql, withApollo, WithApolloClient } from 'react-apollo';
import { compose, mapProps } from 'recompose';
import { Styles } from '../../styles';
import { WithMe } from '../../ww-clients/features/users';
import { EditorSettings } from '../../ww-commons';
import { adminOnly } from '../adminOnly';
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
  adminOnly,
  withApollo,
  graphql<WithApolloClient<WithMe>, {}, Vars, MutateProps>(
    EDITOR_SETTINGS_MUTATION,
    {
      props: ({ mutate, ownProps: { client } }) => ({
        onLanguageChange: (language: string) =>
          mutate!({ variables: { settings: { language } } })
            .then(() => client.resetStore()),
      }),
    },
  ),
  mapProps<LanguagePickerProps, WithMe & MutateProps>(
    ({ me, meLoading, onLanguageChange }) => ({
      language: get(me, 'editorSettings.language', 'en'),
      onLanguageChange,
      ...styles,
      disabled: meLoading,
    }),
  ),
);

export const EditorLanguagePicker: React.ComponentType = container(LanguagePicker);
