import { SectionsStatus } from '@whitewater-guide/clients';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

import theme from '~/theme';

const BAR_HEIGHT = 32;

const styles = StyleSheet.create({
  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  visible: {
    top: 0,
  },
  hidden: {
    top: -BAR_HEIGHT,
  },
  text: {
    color: theme.colors.textLight,
  },
});

interface Props {
  status: SectionsStatus;
  loaded: number;
  count: number;
}

const SectionsProgress: FC<Props> = (props) => {
  const { loaded, count } = props;
  const { t } = useTranslation();
  const [status] = useDebounce(props.status, 200);
  const visible = status !== SectionsStatus.READY && loaded < count;

  const caption = t(
    status === SectionsStatus.LOADING
      ? 'region:sections.loading'
      : 'region:sections.loadingUpdates',
    { loaded, count },
  );

  return (
    <View style={[styles.body, visible ? styles.visible : styles.hidden]}>
      <Caption style={styles.text}>{caption}</Caption>
    </View>
  );
};

export default SectionsProgress;
