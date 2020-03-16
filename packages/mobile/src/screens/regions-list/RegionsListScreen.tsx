import {
  RegionsSearchStringContext,
  RegionsSearchStringSetterContext,
} from '@whitewater-guide/clients';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import { getHeaderRenderer } from '~/components/header';
import { Screen } from '~/components/Screen';
import RegionsListView from './RegionsListView';
import { RegionsListNavProps } from './types';

export const RegionsListScreen: React.FC<RegionsListNavProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  useEffectOnce(() => {
    navigation.setOptions({
      headerTitle: t('regionsList:title'),
      header: getHeaderRenderer(
        true,
        [RegionsSearchStringContext, RegionsSearchStringSetterContext],
        'regionsList:regionSearchPlaceholder',
      ),
    });
  });
  return (
    <Screen>
      <RegionsListView />
    </Screen>
  );
};
