import React from 'react';
import { Drawer } from 'react-native-paper';

interface Props {
  focused: boolean;
  label: string;
  routeName: string;
  icon?: string;
  params?: Record<string, any>;
  onPress: (routeName: string, params?: Record<string, any>) => void;
}

class DrawerItem extends React.PureComponent<Props> {
  onPress = () => {
    const { routeName, params, onPress } = this.props;
    onPress(routeName, params);
  };

  render() {
    const { focused, label, icon, } = this.props;
    return (
      <Drawer.Item label={label} icon={icon} active={focused} onPress={this.onPress} />
    );
  }
}

export default DrawerItem;
