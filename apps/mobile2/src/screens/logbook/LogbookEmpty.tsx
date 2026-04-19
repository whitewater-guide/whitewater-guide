import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});

function LogbookEmpty() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">{t('screens:logbook.empty')}</Text>
    </View>
  );
}

export default LogbookEmpty;
