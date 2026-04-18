import type { MediaKind } from '@whitewater-guide/schema';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface Props {
  kind: MediaKind;
}

function NoMedia({ kind }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="bodyLarge">
        {t(`screens:section.media.noMedia.${kind}`)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});

export default NoMedia;
