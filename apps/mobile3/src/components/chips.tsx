import type { NamedNode } from '@whitewater-guide/schema';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { SelectableTag } from '@/features/tags';
import { TagSelection, TagSelections } from '@/features/tags';
import { useTheme } from '@/hooks/use-theme';

const ENABLED = '#4CAF50';
const ERROR = '#f44336';

export interface ChipsProps {
  items: NamedNode[];
  label?: string;
}

function Chips({ items, label }: ChipsProps) {
  const theme = useTheme();
  return (
    <View style={chipStyles.container}>
      {!!label && (
        <View style={chipStyles.label}>
          <ThemedText type="smallBold">{label}</ThemedText>
        </View>
      )}
      {items?.map(({ id, name }) => (
        <View
          key={id}
          style={[chipStyles.chip, { backgroundColor: theme.backgroundElement }]}
        >
          <ThemedText type="small">{name}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const chipStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    height: 32,
    paddingRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    marginRight: Spacing.two,
    marginBottom: Spacing.two,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

const selectionColors = {
  [TagSelection.SELECTED]: ENABLED,
  [TagSelection.DESELECTED]: ERROR,
  [TagSelection.NONE]: '#343434',
};

export interface TernaryChipProps {
  tag: SelectableTag;
  onPress: (id: string) => void;
}

function TernaryChip({ tag, onPress }: TernaryChipProps) {
  const theme = useTheme();
  const selection = tag.selection ?? TagSelection.NONE;
  const color = selection === TagSelection.NONE ? theme.text : selectionColors[selection];

  const iconName =
    selection === TagSelection.SELECTED
      ? 'check-circle-outline'
      : selection === TagSelection.DESELECTED
        ? 'close-circle-outline'
        : 'checkbox-blank-circle-outline';

  const handlePress = useCallback(() => {
    onPress(tag.id);
  }, [onPress, tag.id]);

  return (
    <Pressable onPress={handlePress} style={ternaryChipStyles.chip}>
      <Icon narrow icon={iconName} size={18} color={color} />
      <ThemedText type="small" style={{ color }}>
        {tag.name}
      </ThemedText>
    </Pressable>
  );
}

const ternaryChipStyles = StyleSheet.create({
  chip: {
    marginTop: 4,
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9E9E9E',
  },
});

export interface TernaryChipsProps {
  tags: SelectableTag[];
  onChange?: (value: SelectableTag[]) => void;
}

function TernaryChips({ tags, onChange }: TernaryChipsProps) {
  const onToggle = useCallback(
    (id: string) => {
      const index = tags.findIndex((t) => t.id === id);
      if (index === -1) {
        return;
      }
      const tag = tags[index];
      const selection = tag.selection ?? TagSelection.NONE;
      const newSelection =
        TagSelections[(TagSelections.indexOf(selection) + 1) % TagSelections.length];
      onChange?.(
        tags.map((item, i) =>
          i === index ? { ...item, selection: newSelection } : item,
        ),
      );
    },
    [tags, onChange],
  );

  return (
    <View style={ternaryChipsStyles.chips}>
      {tags.map((tag) => (
        <TernaryChip key={tag.id} tag={tag} onPress={onToggle} />
      ))}
    </View>
  );
}

const ternaryChipsStyles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
});

export default memo(Chips);
export const MemoTernaryChips = memo(TernaryChips);
export { MemoTernaryChips as TernaryChips };
