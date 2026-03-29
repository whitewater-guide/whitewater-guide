import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 72,
  },
});

function Logo() {
  return <Image source={require('../assets/logo.png')} style={styles.logo} />;
}

export default Logo;
