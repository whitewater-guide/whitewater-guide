import markdown from '@whitewater-guide/translations/markdown';
import Loading from 'components/Loading';
import { Screen } from 'components/Screen';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationScreenComponent } from 'react-navigation';
import { WEB_URL } from '../../utils/urls';

interface NavParams {
  fixture?: string;
  title?: string;
}

const renderLoading = () => <Loading />;

const WebViewScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => {
  const { i18n } = useTranslation();
  const fixture = navigation.getParam('fixture');
  const resource = fixture && markdown[fixture];
  const lang = resource && resource[i18n.language] ? i18n.language : 'en';

  if (!lang) {
    return <Screen />;
  }
  return (
    <Screen>
      <WebView
        source={{ uri: `${WEB_URL}/${lang}/${fixture}.html` }}
        style={StyleSheet.absoluteFill}
        startInLoadingState={true}
        renderLoading={renderLoading}
      />
    </Screen>
  );
};

export default WebViewScreen;
