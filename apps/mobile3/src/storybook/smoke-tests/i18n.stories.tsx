import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  i18n as i18nInstance,
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/i18n';
import { formatNullable, InfoRow, StoryButton } from './story-ui';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

const TRANSLATION_KEYS = [
  'commons:ok',
  'commons:cancel',
  'commons:done',
  'commons:difficulty',
  'commons:allYear',
  'commons:create',
  'commons:copy',
] as const;

function LanguageSwitchDemo() {
  const { t, i18n, ready } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const switchLanguage = useCallback(async (lang: SupportedLanguage) => {
    await i18nInstance.changeLanguage(lang);
    setCurrentLang(lang);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">Language Switch</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Detected locale: {formatNullable(currentLang)}
      </ThemedText>

      <View style={styles.chipRow}>
        {SUPPORTED_LANGUAGES.map((lang) => {
          const selected = currentLang.startsWith(lang);
          return (
            <Pressable
              key={lang}
              onPress={() => switchLanguage(lang)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <ThemedText
                type="smallBold"
                style={selected ? styles.chipLabelSelected : undefined}
              >
                {LANGUAGE_NAMES[lang]}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {TRANSLATION_KEYS.map((key) => (
        <InfoRow key={key} label={key} value={t(key)} />
      ))}

      <StoryButton
        label="Switch to English"
        onPress={() => switchLanguage('en')}
      />
      <StoryButton
        label="Switch to Russian"
        variant="outlined"
        onPress={() => switchLanguage('ru')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#0078B4',
    borderRadius: 16,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  chipSelected: {
    backgroundColor: '#0078B4',
  },
  chipLabelSelected: {
    color: '#ffffff',
  },
});

const meta = {
  title: 'Dependencies Smoke Tests/I18n/LanguageSwitch',
  component: LanguageSwitchDemo,
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18nInstance}>
        <Story />
      </I18nextProvider>
    ),
  ],
} satisfies Meta<typeof LanguageSwitchDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
