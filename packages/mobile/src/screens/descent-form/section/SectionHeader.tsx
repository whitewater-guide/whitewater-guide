import React from 'react';
import { SectionType } from './types';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import theme from '~/theme';

const styles = StyleSheet.create({
  header: {
    fontSize: 12,
    color: theme.colors.textNote,
    marginVertical: theme.margin.single,
  },
});

interface Props {
  id: SectionType;
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
