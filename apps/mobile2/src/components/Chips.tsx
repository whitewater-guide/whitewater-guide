import type { NamedNode } from '@whitewater-guide/schema';
import set from 'lodash/fp/set';
import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import type { SelectableTag } from '../features/tags';
import { TagSelection, TagSelections } from '../features/tags';
import theme from '../theme';
import Icon from './Icon';

// ── Chips ────────────────────────────────────────────────────────────────────

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
    marginRight: theme.margin.half,
    marginBottom: theme.margin.half,
  },
});

interface ChipsProps {
  items: NamedNode[];
  label?: string;
}

function Chips({ items, label }: ChipsProps) {
  return (
    <View style={chipStyles.container}>
      {!!label && (
        <View style={chipStyles.label}>
          <Text variant="titleSmall">{label}</Text>
        </View>
      )}
      {items?.map(({ id, name }) => (
        <Chip key={id} style={chipStyles.chip}>
          {name}
        </Chip>
      ))}
    </View>
  );
}

// ── TernaryChip ───────────────────────────────────────────────────────────────

const ternaryChipStyles = StyleSheet.create({
  chip: {
    marginTop: 4,
    marginRight: 4,
  },
});

const selectionColors = {
  [TagSelection.SELECTED]: theme.colors.enabled,
  [TagSelection.DESELECTED]: theme.colors.error,
  [TagSelection.NONE]: theme.colors.textMain,
};

interface TernaryChipProps {
  tag: SelectableTag;
  onPress: (id: string) => void;
}

function TernaryChip({ tag, onPress }: TernaryChipProps) {
  const selection = tag.selection ?? TagSelection.NONE;
  const color = selectionColors[selection];

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
    <Chip
      mode="outlined"
      icon={({ size }) => <Icon narrow icon={iconName} size={size} color={color} />}
      onPress={handlePress}
      style={ternaryChipStyles.chip}
      textStyle={{ color }}
    >
      {tag.name}
    </Chip>
  );
}

// ── TernaryChips ──────────────────────────────────────────────────────────────

const ternaryChipsStyles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
});

interface TernaryChipsProps {
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
        TagSelections[
          (TagSelections.indexOf(selection) + 1) % TagSelections.length
        ];
      onChange?.(set(index, { ...tag, selection: newSelection }, tags));
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

export default memo(Chips);
export const MemoTernaryChips = memo(TernaryChips);
export { MemoTernaryChips as TernaryChips };
