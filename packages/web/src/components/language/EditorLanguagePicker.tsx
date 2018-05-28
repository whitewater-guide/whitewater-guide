import React from 'react';
import { withApollo, WithApolloClient } from 'react-apollo';
import { compose, mapProps } from 'recompose';
import { withEditorLanguage } from '../../i18n/editors';
import { Styles } from '../../styles';
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

const container = compose(
  withApollo,
  withEditorLanguage,
  mapProps<LanguagePickerProps, LanguagePickerProps & WithApolloClient<any>>(({ language, onLanguageChange, client }) => ({
    language,
    onLanguageChange: (value: string) => {
      onLanguageChange(value);
      client.resetStore();
    },
    ...styles,
  })),
);

const LanguagePickerWithData: React.ComponentType = container(LanguagePicker);

export const EditorLanguagePicker: React.StatelessComponent = () => (
  <EditorOnly>
    <LanguagePickerWithData />
  </EditorOnly>
);
