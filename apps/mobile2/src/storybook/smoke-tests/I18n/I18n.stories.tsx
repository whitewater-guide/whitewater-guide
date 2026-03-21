import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, DataTable, Divider, Text } from 'react-native-paper';

import { LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '../../../i18n';

function LanguageSwitchDemo() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const switchLanguage = useCallback(
    async (lang: string) => {
      await i18n.changeLanguage(lang);
      setCurrentLang(lang);
    },
    [i18n],
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>
        Language Switch
      </Text>

      <View style={styles.chipRow}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <Chip
            key={lang}
            selected={currentLang === lang}
            onPress={() => switchLanguage(lang)}
            style={styles.chip}
          >
            {LANGUAGE_NAMES[lang] ?? lang}
          </Chip>
        ))}
      </View>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.heading}>
        Current: {LANGUAGE_NAMES[currentLang] ?? currentLang} ({currentLang})
      </Text>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Key</DataTable.Title>
          <DataTable.Title>Translation</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>commons:ok</DataTable.Cell>
          <DataTable.Cell>{t('commons:ok')}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>commons:cancel</DataTable.Cell>
          <DataTable.Cell>{t('commons:cancel')}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>commons:done</DataTable.Cell>
          <DataTable.Cell>{t('commons:done')}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>commons:difficulty</DataTable.Cell>
          <DataTable.Cell>{t('commons:difficulty')}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>commons:allYear</DataTable.Cell>
          <DataTable.Cell>{t('commons:allYear')}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>commons:create</DataTable.Cell>
          <DataTable.Cell>{t('commons:create')}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>commons:copy</DataTable.Cell>
          <DataTable.Cell>{t('commons:copy')}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>

      <Divider style={styles.divider} />

      <Button mode="contained" onPress={() => switchLanguage('en')}>
        Switch to English
      </Button>
      <Button
        mode="contained"
        onPress={() => switchLanguage('ru')}
        style={styles.button}
      >
        Switch to Russian
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  button: {
    marginTop: 8,
  },
});

const meta: Meta<typeof LanguageSwitchDemo> = {
  title: 'Dependencies Smoke Tests/I18n/LanguageSwitch',
  component: LanguageSwitchDemo,
};

export default meta;

type Story = StoryObj<typeof LanguageSwitchDemo>;

export const Default: Story = {};
