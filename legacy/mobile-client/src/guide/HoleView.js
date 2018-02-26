import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

const iface = {
  name: 'HoleView',
  propTypes: {
    ...View.propTypes,
    hole: PropTypes.object,
  },
};

export default requireNativeComponent('HoleView', iface, {
  nativeOnly: {
    nativeBackgroundAndroid: true,
    nativeForegroundAndroid: true,
  }
});
