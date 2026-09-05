import type { RefInput, Tag } from '@whitewater-guide/schema';
import { useField } from 'formik';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { TernaryChips } from '@/components/chips';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { SelectableTag } from '@/features/tags';
import { TagSelection } from '@/features/tags';

export interface TagsFieldProps {
  name: string;
  options: Tag[];
  label: string;
}

export function TagsField({ name, label, options }: TagsFieldProps) {
  const [field, , helpers] = useField<RefInput[]>(name);
  const selected = field.value ?? [];

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
      <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
        {label}
      </ThemedText>
      <TernaryChips tags={chips} onChange={onChange} />
    </View>
  );
}

TagsField.displayName = 'TagsField';

const styles = StyleSheet.create({
  caption: {
    marginLeft: Spacing.half,
    marginBottom: Spacing.one,
  },
});
