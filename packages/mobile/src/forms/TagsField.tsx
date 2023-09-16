import type { RefInput, Tag } from '@whitewater-guide/schema';
import { useFormikContext } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

import TernaryChip from '~/components/TernaryChip';
import type { SelectableTag } from '~/features/tags';
import { TagSelection } from '~/features/tags';

import theme from '../theme';

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
  caption: {
    color: theme.colors.componentBorder,
    marginLeft: 2,
    marginBottom: 0,
  },
});

interface Props {
  name: string;
  options: Tag[];
  label: string;
}

const TagsField: React.FC<Props> = React.memo((props) => {
  const { name, label, options } = props;
  const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
  const selected: RefInput[] = values[name];
  const chips: SelectableTag[] = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        selection: selected.find((s) => s.id === option.id)
          ? TagSelection.SELECTED
          : TagSelection.NONE,
      })),
    [selected, options],
  );
  const onChipPress = useCallback(
    (id: string) => {
      setFieldTouched(name, true);
      const oldCount = selected.length;
      const newSelected = selected.filter((s) => s.id !== id);
      const removed = oldCount !== newSelected.length;
      if (!removed) {
        newSelected.push({ id });
      }
      setFieldValue(name, newSelected);
    },
    [name, selected, setFieldValue, setFieldTouched],
  );
  return (
    <View>
      <Paragraph style={styles.caption}>{label}</Paragraph>
      <View style={styles.chips}>
        {chips.map((chip) => (
          <TernaryChip key={chip.id} tag={chip} onPress={onChipPress} />
        ))}
      </View>
    </View>
  );
});

TagsField.displayName = 'TagsField';

export default TagsField;
