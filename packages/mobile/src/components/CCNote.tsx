import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, TextStyle } from 'react-native';
import { Caption } from 'react-native-paper';
import { useNavigation } from 'react-navigation-hooks';
import Screens from '../screens/screen-names';
import TextWithLinks from './TextWithLinks';

interface Props {
  style?: StyleProp<TextStyle>;
}

const CCNote: React.FC<Props> = React.memo(({ style }) => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const onPress = useCallback(() => {
    navigate(Screens.WebView, {
      fixture: 'terms_and_conditions',
      title: t('commons:termsOfService'),
    });
  }, [navigate]);

  return (
    <Caption style={style}>
      <TextWithLinks onLink={onPress}>
        {t('commons:creativeCommonsNote')}
      </TextWithLinks>
    </Caption>
  );
});

CCNote.displayName = 'CCNote';

export default CCNote;
