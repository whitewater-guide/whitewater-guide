import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Config from 'react-native-config';
import MapView from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

export default class App extends React.PureComponent {
  componentDidMount() {
    setTimeout(() => SplashScreen.hide(), 4000);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert('login has error: ' + result.error);
                } else if (result.isCancelled) {
                  alert('login is cancelled.');
                } else {
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      alert(data!.accessToken.toString());
                    },
                  );
                }
              }
            }
            onLogoutFinished={() => alert('logout')}
          />
        </View>
        <View style={styles.mapBox}>
          <MapView
            provider="google"
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
    backgroundColor: '#ffffff',
  },
  mapBox: {
    flex: 1,
    backgroundColor: 'lime',
  },
  loginBox: {
    paddingTop: 40,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
