import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import theme from '~/theme';

const styles = StyleSheet.create({
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
    <Text style={styles.header}>
      {t(`screens:descentForm.section.listSection${id}`)}
    </Text>
  );
};

export default SectionHeader;
