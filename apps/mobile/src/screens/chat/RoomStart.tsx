import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Caption } from 'react-native-paper';

import theme from '~/theme';

const styles = StyleSheet.create({
  message: {
    alignSelf: 'stretch',
    textAlign: 'center',
    marginVertical: theme.margin.double,
  },
});

interface RoomStartProps {
  isEmpty: boolean;
}

const RoomStart: FC<RoomStartProps> = ({ isEmpty }) => {
  const suffix = isEmpty ? 'empty' : 'nonEmpty';
  const { t } = useTranslation();
  return (
    <Caption style={styles.message}>
      {t(`screens:chat.roomStart.${suffix}`)}
    </Caption>
  );
};

export default RoomStart;
