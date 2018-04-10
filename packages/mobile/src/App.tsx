import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import MapView from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen';

export default class App extends React.PureComponent {
  componentDidMount() {
    setTimeout(() => SplashScreen.hide(), 4000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.instructions}>
            {JSON.stringify(Config)}
          </Text>
        </View>
        <View style={styles.mapBox}>
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff00ff',
  },
  mapBox: {
    flex: 1,
    backgroundColor: 'lime',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
