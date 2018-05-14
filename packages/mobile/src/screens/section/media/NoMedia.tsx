import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Subheading } from 'react-native-paper';
import { WithT } from '../../../i18n';
import { MediaKind } from '../../../ww-commons';
import { PHOTO_SIZE } from './MediaConstants';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: PHOTO_SIZE,
  },
});

interface Props {
  kind: MediaKind;
}

const NoMedia: React.SFC<Props & WithT> = ({ kind, t }) => {
  const text = t('section:media.noMedia', { kind: t('section:media.' + kind).toLowerCase()});
  return (
    <View style={styles.container}>
      <Subheading>{text}</Subheading>
    </View>
  );
};

export default translate()(NoMedia);
