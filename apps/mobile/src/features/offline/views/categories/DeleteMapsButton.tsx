import prettyBytes from 'pretty-bytes';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Caption } from 'react-native-paper';

import Icon from '~/components/Icon';
import theme from '~/theme';

import type { OfflineCategoryType } from '../../types';

const styles = StyleSheet.create({
  deleteWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    padding: 0,
    margin: 0,
    marginBottom: -4,
  },
  deleteText: {
    color: theme.colors.textMain,
    fontSize: 10,
    lineHeight: 12,
    padding: 0,
    margin: 0,
  },
});

interface Props {
  onDelete?: (type: OfflineCategoryType) => void;
  size?: number;
}

const DeleteMapsButton: React.FC<Props> = ({ size, onDelete }) => {
  const onPress = useCallback(() => {
    if (onDelete) {
      onDelete('maps');
    }
  }, [onDelete]);
  if (!size) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.deleteWrapper}>
        <Icon icon="delete" narrow style={styles.deleteIcon} />
        <Caption style={styles.deleteText}>{prettyBytes(size)}</Caption>
      </View>
    </TouchableOpacity>
  );
};

export default DeleteMapsButton;
