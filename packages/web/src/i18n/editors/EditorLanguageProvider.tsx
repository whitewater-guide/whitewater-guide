import React from 'react';
import { context } from './context';
import { EditorLanguageLink } from './EditorLanguageLink';

interface Props {
  link: EditorLanguageLink;
}

const Provider = context.Provider;

export const EditorLanguageProvider: React.SFC<Props> = ({ children, link }) => (
  <Provider value={link}>
    {children}
  </Provider>
);
