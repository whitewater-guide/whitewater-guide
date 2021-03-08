import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryBackground,
  },
  header: {
    fontSize: 12,
    color: theme.colors.textNote,
    marginVertical: theme.margin.single,
  },
});

interface Props {
  id: string;
}

const SectionHeader: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {t(`screens:descentForm.section.listSection${id}`)}
      </Text>
    </View>
  );
};

export default SectionHeader;
