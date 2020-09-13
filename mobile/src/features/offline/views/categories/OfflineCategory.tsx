import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Checkbox, Paragraph, TouchableRipple } from 'react-native-paper';

import theme from '../../../../theme';
import { OfflineCategoryType } from '../../types';

const styles = StyleSheet.create({
  label: {
    marginLeft: theme.margin.single,
    flex: 1,
  },
  row: {
    alignSelf: 'stretch',
    height: theme.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export interface OfflineCategoryProps {
  type: OfflineCategoryType;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  onToggle?: (type: OfflineCategoryType, value: boolean) => void;
}

const OfflineCategory: React.FC<OfflineCategoryProps> = React.memo((props) => {
  const { type, label, disabled, selected, onToggle, children } = props;
  const onPress = useCallback(() => {
    if (onToggle) {
      onToggle(type, !selected);
    }
  }, [onToggle, type, selected]);
  return (
    <TouchableRipple onPress={onPress} disabled={!!disabled}>
      <View style={styles.row}>
        <Checkbox
          status={selected ? 'checked' : 'unchecked'}
          color={theme.colors.primary}
        />
        <Paragraph style={styles.label}>{label}</Paragraph>
        {children}
      </View>
    </TouchableRipple>
  );
});

OfflineCategory.displayName = 'OfflineCategory';

export default OfflineCategory;
