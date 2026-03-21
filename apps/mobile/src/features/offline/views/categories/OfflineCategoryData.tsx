import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import Icon from '~/components/Icon';
import theme from '~/theme';

import { useOfflineDate } from '../../hooks';
import type { OfflineCategoryProps } from './OfflineCategory';
import OfflineCategory from './OfflineCategory';
import useDeleteOfflineData from './useDeleteOfflineData';

const styles = StyleSheet.create({
  deleteIcon: {
    padding: 0,
    margin: 0,
    marginBottom: -4,
  },
});

interface Props extends OfflineCategoryProps {
  regionId: string;
}

const OfflineCategoryData: FC<PropsWithChildren<Props>> = (props) => {
  const { type, label, selected, onToggle, regionId } = props;
  const offlineDate = useOfflineDate(regionId);
  const [{ loading }, onDelete] = useDeleteOfflineData(regionId);
  return (
    <OfflineCategory
      disabled={true}
      type={type}
      label={label}
      selected={selected}
      onToggle={onToggle}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : offlineDate ? (
        <Icon
          icon="delete"
          narrow
          style={styles.deleteIcon}
          onPress={onDelete}
        />
      ) : null}
    </OfflineCategory>
  );
};

export default OfflineCategoryData;
