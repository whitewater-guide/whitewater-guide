import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  children: string;
}

export const I18nText: React.FC<Props> = ({ children }) => {
  const [t] = useTranslation();
  return t(children) as any;
};
