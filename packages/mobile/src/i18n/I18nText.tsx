import React from 'react';
import { translate } from 'react-i18next';
import { Text, TextProps } from '../components';
import { WithT } from './types';

interface Props extends TextProps {
  children: string;
}

const I18nTextInternal: React.StatelessComponent<Props & WithT> = ({ children, t, ...props }) => (
  <Text {...props}>
    {t(children)}
  </Text>
);

export const I18nText: React.ComponentType<Props> = translate()(I18nTextInternal);
