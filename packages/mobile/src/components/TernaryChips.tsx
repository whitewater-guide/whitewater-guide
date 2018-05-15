import set from 'lodash/fp/set';
import map from 'lodash/map';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SelectableTag, TagSelection, TagSelections } from '../ww-commons/features/tags';
import { TernaryChip } from './TernaryChip';

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
  },
});

interface Props {
  tags: SelectableTag[];
  onChange: (value: SelectableTag[]) => void;
}

export class TernaryChips extends React.PureComponent<Props> {

  onToggle = (id: string) => {
    const { tags, onChange } = this.props;
    const index = tags.findIndex((t) => t.id === id);
    if (index === -1) {
      return;
    }
    const tag = tags[index];
    const selection = tag.selection || TagSelection.NONE;
    const newSelection = TagSelections[(TagSelections.indexOf(selection) + 1) % TagSelections.length];
    onChange(set(index, { ...tag, selection: newSelection }, tags));
  };

  render() {
    const { tags } = this.props;
    return (
      <View style={styles.chips}>
        {
          map(tags, (tag) => (
            <TernaryChip
              key={tag.id}
              tag={tag}
              onPress={this.onToggle}
            />
          ))
        }
      </View>
    );
  }
}
