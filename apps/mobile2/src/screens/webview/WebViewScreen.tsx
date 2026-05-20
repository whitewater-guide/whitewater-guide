import { useFocusEffect } from '@react-navigation/native';
import markdown from '@whitewater-guide/translations/markdown';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import Loading from '../../components/Loading';
import Screen from '../../components/Screen';
import { WEB_URL } from '../../core/urls';
import type { WebViewScreenProps } from './navigation-types';

const renderLoading = () => <Loading />;

function WebViewScreen({ navigation, route }: WebViewScreenProps) {
  const { i18n } = useTranslation();
  const { fixture, title } = route.params;
  const resource = fixture && markdown[fixture as keyof typeof markdown];
  const lang =
    resource && resource[i18n.language as keyof typeof resource]
      ? i18n.language
      : 'en';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation, title]);

  // Prevents Android crash when WebView is mounted on blurred screen
  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => {
        setVisible(false);
      };
    }, []),
  );

  if (!lang || !visible) {
    return <Screen />;
  }

  return (
    <Screen>
      <WebView
        source={{ uri: `${WEB_URL}/${lang}/${fixture}.html` }}
        style={StyleSheet.absoluteFill}
        startInLoadingState
        renderLoading={renderLoading}
      />
    </Screen>
  );
}

export default WebViewScreen;
