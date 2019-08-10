import { useAuth } from '@whitewater-guide/clients';
import get from 'lodash/get';
import React from 'react';
import { EditorOnly } from '../EditorOnly';
import { LanguagePicker } from './LanguagePicker';
import useEditorLanguage from './useEditorLanguage';

export const EditorLanguagePicker: React.FC = React.memo(() => {
  const { me } = useAuth();
  const language = get(me, 'editorSettings.language', 'en');
  const setLanguage = useEditorLanguage();
  return (
    <EditorOnly>
      <LanguagePicker language={language} onLanguageChange={setLanguage} />
    </EditorOnly>
  );
});

EditorLanguagePicker.displayName = 'EditorLanguagePicker';
