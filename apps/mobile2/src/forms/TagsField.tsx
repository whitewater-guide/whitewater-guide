import type { RefInput, Tag } from '@whitewater-guide/schema';
import { useField } from 'formik';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { TernaryChips } from '../components/Chips';
import type { SelectableTag } from '../features/tags';
import { TagSelection } from '../features/tags';
import theme from '../theme';

const styles = StyleSheet.create({
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

function TagsField({ name, label, options }: Props) {
  const [field, , helpers] = useField<RefInput[]>(name);
  const selected = field.value;

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

  const onChange = useCallback(
    (updated: SelectableTag[]) => {
      helpers.setTouched(true);
      helpers.setValue(
        updated
          .filter((t) => t.selection === TagSelection.SELECTED)
          .map((t) => ({ id: t.id })),
      );
    },
    [helpers],
  );

  return (
    <View>
      <Text variant="bodyMedium" style={styles.caption}>
        {label}
      </Text>
      <TernaryChips tags={chips} onChange={onChange} />
    </View>
  );
}

TagsField.displayName = 'TagsField';

export default TagsField;
