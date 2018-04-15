import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../../theme';
import { Icon } from '../Icon';
import { Touchable } from '../Touchable';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: theme.margin.single,
    marginVertical: theme.margin.double,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 0,
  },
});

const ACTIVE_TINT_COLOR = theme.colors.primary;
const ACTIVE_BACKGROUND_COLOR = 'rgba(0, 0, 0, .04)';
const INACTIVE_TINT_COLOR = 'rgba(0, 0, 0, .87)';
const INACTIVE_BACKGROUND_COLOR = 'transparent';

interface Props {
  focused: boolean;
  label: string;
  routeName: string;
  icon?: string;
  params?: Record<string, any>;
  onPress: (routeName: string, params: Record<string, any>) => void;
}

class DrawerItem extends React.PureComponent<Props> {
  onPress = () => {
    const { routeName, params, onPress } = this.props;
    onPress(routeName, params);
  };

  render() {
    const { focused, label, icon, } = this.props;
    const color = focused ? ACTIVE_TINT_COLOR : INACTIVE_TINT_COLOR;
    const backgroundColor = focused ? ACTIVE_BACKGROUND_COLOR : INACTIVE_BACKGROUND_COLOR;
    return (
      <Touchable onPress={this.onPress} delayPressIn={0}>
        <View style={[styles.item, { backgroundColor }]}>
          {!!icon && <Icon icon={icon} color={color} style={styles.icon} />}
          <Text style={[styles.label, { color }]}>
            {label}
          </Text>
        </View>
      </Touchable>
    );
  }
}

export default DrawerItem;
