import React from 'react';
import { withI18n, WithI18n } from 'react-i18next';

interface Props {
  children: string;
}

const I18nTextInternal: React.FC<Props & WithI18n> = ({ children, t }) =>
  t(children) as any;

export const I18nText: React.ComponentType<Props> = withI18n()(
  I18nTextInternal,
);
