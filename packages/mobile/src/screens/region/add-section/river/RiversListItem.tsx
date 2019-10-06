import { NamedNode, NEW_ID } from '@whitewater-guide/commons';
import Icon from 'components/Icon';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading, TouchableRipple } from 'react-native-paper';
import theme from '../../../../theme';

const styles = StyleSheet.create({
  row: {
    height: theme.rowHeight,
    padding: theme.margin.single,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusRow: {
    marginLeft: -theme.margin.half,
  },
  plus: {
    marginTop: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  subheading: {
    fontSize: 18, // matches text input
  },
});

interface Props {
  id?: string;
  name: string;
  onPress: (node: NamedNode) => void;
}

const RiversListItem: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { id, name, onPress } = props;
  const onSelect = useCallback(
    () =>
      onPress({
        id: id || NEW_ID,
        name,
      }),
    [id, name, onPress],
  );
  const disabled = !id && name.length < 2;
  const showPlus = !id && name.length > 0;
  return (
    <TouchableRipple onPress={onSelect} disabled={disabled}>
      <View
        style={[
          styles.row,
          disabled && styles.disabled,
          showPlus && styles.plusRow,
        ]}
      >
        {showPlus && <Icon icon="plus" style={styles.plus} narrow={true} />}
        <Subheading style={styles.subheading}>
          {name || t('screens:addSection.river.addItemPlaceholder')}
        </Subheading>
      </View>
    </TouchableRipple>
  );
};

RiversListItem.displayName = 'RiversListItem';

export default RiversListItem;
