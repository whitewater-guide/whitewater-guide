import React from 'react';

export interface EditorLanguageContext {
  language: string;
  onLanguageChange: (value: string) => void;
}

const defaultValue: EditorLanguageContext = {
  language: 'en',
  onLanguageChange: () => {},
};

export const context = React.createContext<EditorLanguageContext>(defaultValue);
