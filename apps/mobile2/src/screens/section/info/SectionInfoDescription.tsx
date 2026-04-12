import type { SafeSectionDetails } from '@whitewater-guide/clients';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import Markdown from '../../../components/Markdown';
import theme from '../../../theme';

const styles = StyleSheet.create({
  noData: {
    padding: theme.margin.single,
    color: theme.colors.textNote,
  },
});

interface Props {
  section: SafeSectionDetails;
}

function SectionInfoDescription({ section }: Props) {
  const { t } = useTranslation();

  if (section.description) {
    return <Markdown>{section.description}</Markdown>;
  }

  return (
    <View>
      <Text variant="bodyMedium" style={styles.noData}>
        {t('screens:section.info.description.noData')}
      </Text>
    </View>
  );
}

export default SectionInfoDescription;
