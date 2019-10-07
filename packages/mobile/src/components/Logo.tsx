import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 72,
  },
});

const Logo: React.FC = React.memo(() => (
  <FastImage source={require('../assets/logo.png')} style={styles.logo} />
));

Logo.displayName = 'Logo';

export default Logo;
