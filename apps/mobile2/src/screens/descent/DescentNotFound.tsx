import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function DescentNotFound() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">{t('screens:descent.notFound')}</Text>
    </View>
  );
}

export default DescentNotFound;
