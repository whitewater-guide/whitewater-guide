import { SelectableTag, TagSelection } from '@whitewater-guide/commons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import theme from '../theme';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  chip: {
    marginTop: 4,
    marginRight: 4,
  },
});

const Colors = {
  [TagSelection.SELECTED]: { colors: { text: theme.colors.enabled } },
  [TagSelection.DESELECTED]: { colors: { text: theme.colors.error } },
  [TagSelection.NONE]: { colors: { text: theme.colors.textMain } },
};

interface PartialIconProps {
  color: string;
  size: number;
}

const Icons = {
  [TagSelection.SELECTED]: ({ size }: PartialIconProps) => (
    <Icon
      narrow={true}
      icon="check-circle-outline"
      size={size}
      color={theme.colors.enabled}
    />
  ),
  [TagSelection.DESELECTED]: ({ size }: PartialIconProps) => (
    <Icon
      narrow={true}
      icon="close-circle-outline"
      size={size}
      color={theme.colors.error}
    />
  ),
  [TagSelection.NONE]: ({ size }: PartialIconProps) => (
    <Icon
      narrow={true}
      icon="checkbox-blank-circle-outline"
      size={size}
      color={theme.colors.textMain}
    />
  ),
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
        mode="outlined"
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
