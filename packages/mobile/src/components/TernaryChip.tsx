import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

import type { SelectableTag } from '~/features/tags';
import { TagSelection } from '~/features/tags';

import theme from '../theme';
import Icon from './Icon';

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
  // eslint-disable-next-line react/display-name
  [TagSelection.SELECTED]: ({ size }: PartialIconProps) => (
    <Icon
      narrow
      icon="check-circle-outline"
      size={size}
      color={theme.colors.enabled}
    />
  ),
  // eslint-disable-next-line react/display-name
  [TagSelection.DESELECTED]: ({ size }: PartialIconProps) => (
    <Icon
      narrow
      icon="close-circle-outline"
      size={size}
      color={theme.colors.error}
    />
  ),
  // eslint-disable-next-line react/display-name
  [TagSelection.NONE]: ({ size }: PartialIconProps) => (
    <Icon
      narrow
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

class TernaryChip extends React.PureComponent<Props> {
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

export default TernaryChip;
