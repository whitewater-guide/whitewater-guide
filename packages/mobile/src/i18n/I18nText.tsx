import React from 'react';
import { translate } from 'react-i18next';
import { WithT } from './types';

interface Props {
  children: string;
}

const I18nTextInternal: React.StatelessComponent<Props & WithT> = ({ children, t }) =>
  t(children);

export const I18nText: React.ComponentType<Props> = translate()(I18nTextInternal);
