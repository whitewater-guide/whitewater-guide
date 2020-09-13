import { useFocusEffect } from '@react-navigation/native';
import markdown from '@whitewater-guide/translations/markdown';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';

import { WEB_URL } from '../../utils/urls';
import { WebViewNavProps } from './types';

const renderLoading = () => <Loading />;

const WebViewScreen: React.FC<WebViewNavProps> = ({ navigation, route }) => {
  const { i18n, t } = useTranslation();
  const { fixture, title } = route.params;
  const resource = fixture && markdown[fixture];
  const lang = resource && resource[i18n.language] ? i18n.language : 'en';
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation.setOptions, title]);

  // This prevents android crash
  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => {
        setVisible(false);
      };
    }, [setVisible]),
  );

  if (!lang || !visible) {
    return <Screen />;
  }
  return (
    <Screen>
      <WebView
        source={{ uri: `${WEB_URL}/${lang}/${fixture}.html` }}
        style={StyleSheet.absoluteFill}
        startInLoadingState={true}
        renderLoading={renderLoading}
        testID={`webview-${fixture}`}
      />
    </Screen>
  );
};

export default WebViewScreen;
