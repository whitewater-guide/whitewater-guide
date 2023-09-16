import { useFocusEffect } from '@react-navigation/native';
import markdown from '@whitewater-guide/translations/markdown';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import Loading from '~/components/Loading';
import { Screen } from '~/components/Screen';

import { WEB_URL } from '../../utils/urls';
import type { WebViewNavProps } from './types';

const renderLoading = () => <Loading />;

const WebViewScreen: React.FC<WebViewNavProps> = ({ navigation, route }) => {
  const { i18n } = useTranslation();
  const { setOptions } = navigation;
  const { fixture, title } = route.params;
  const resource = fixture && markdown[fixture];
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  const lang = resource && resource[i18n.language] ? i18n.language : 'en';
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    setOptions({ headerTitle: title });
  }, [setOptions, title]);

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
        startInLoadingState
        renderLoading={renderLoading}
        testID={`webview-${fixture}` as string}
      />
    </Screen>
  );
};

export default WebViewScreen;
