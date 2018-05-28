import React from 'react';
import { context, EditorLanguageContext } from './context';

const Consumer = context.Consumer;

export function withEditorLanguage<Props>(
  Component: React.ComponentType<Props & EditorLanguageContext>): React.ComponentType<Props> {

  const ComponentWithEditorLanguage: React.SFC<Props> = (props) => (
    <Consumer>
      {({ language, onLanguageChange }) => (
        <Component {...props} language={language} onLanguageChange={onLanguageChange} />
      )}
    </Consumer>
  );

  ComponentWithEditorLanguage.displayName = `withEditorLanguage(${Component.displayName})`;

  return ComponentWithEditorLanguage;
}
