import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Touchable } from '../../../components';
import theme from '../../../theme';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
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
  params?: Record<string, any>;
  onPress: (routeName: string, params: Record<string, any>) => void;
}

class DrawerItem extends React.PureComponent<Props> {
  onPress = () => {
    const { routeName, params, onPress } = this.props;
    onPress(routeName, params);
  };

  render() {
    const { focused, label } = this.props;
    const color = focused ? ACTIVE_TINT_COLOR : INACTIVE_TINT_COLOR;
    const backgroundColor = focused ? ACTIVE_BACKGROUND_COLOR : INACTIVE_BACKGROUND_COLOR;
    return (
      <Touchable onPress={this.onPress} delayPressIn={0}>
        <View style={[styles.item, { backgroundColor }]}>
          <Text style={[styles.label, { color }]}>
            {label}
          </Text>
        </View>
      </Touchable>
    );
  }
}

export default DrawerItem;
