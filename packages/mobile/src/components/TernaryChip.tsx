import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import theme from '../theme';
import { SelectableTag, TagSelection } from '../ww-commons/features/tags';

const styles = StyleSheet.create({
  chip: {
    paddingTop: 2,
    paddingLeft: 2,
  },
});

const Colors = {
  [TagSelection.SELECTED]: { colors: { text: theme.colors.enabled } },
  [TagSelection.DESELECTED]: { colors: { text: theme.colors.error } },
  [TagSelection.NONE]: { colors: { text: theme.colors.textMain } },
};

const Icons = {
  [TagSelection.SELECTED]: 'check-circle-outline',
  [TagSelection.DESELECTED]: 'close-circle-outline',
  [TagSelection.NONE]: 'checkbox-blank-circle-outline',
};

interface Props {
  tag: SelectableTag;
  onPress: (id: string) => void;
}

export class TernaryChip extends React.PureComponent<Props> {
  onPress = () => this.props.onPress(this.props.tag.id);

  render() {
    const { selection = TagSelection.NONE, name } = this.props.tag;
    return (
      <Chip
        theme={Colors[selection]}
        icon={Icons[selection]}
        onPress={this.onPress}
        style={styles.chip}
      >
        {name}
      </Chip>
    );
  }
}
