import format from 'date-fns/format';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Left, Right, Row } from '../../components/Row';
import descentLevelToString from '../../features/descents/descentLevelToString';
import theme from '../../theme';
import type { DescentDetailsFragment } from './descentDetails.generated';

const styles = StyleSheet.create({
  content: {
    padding: theme.margin.single,
  },
  title: {
    paddingLeft: theme.margin.single,
    paddingBottom: theme.margin.single,
  },
  commentBlock: {
    marginTop: theme.margin.double,
    paddingLeft: theme.margin.single,
  },
  commentHeader: {
    marginBottom: theme.margin.single,
  },
});

interface Props {
  descent: DescentDetailsFragment;
}

function DescentInfo({ descent }: Props) {
  const { t } = useTranslation();
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.title}>
        <Text variant="titleLarge">
          {`${descent.section.river.name} - ${descent.section.name}`}
        </Text>
        <Text variant="bodySmall">{descent.section.region.name}</Text>
      </View>

      <Row>
        <Left>
          <Text variant="titleSmall">{t('screens:descent.info.startedAt')}</Text>
        </Left>
        <Right>
          <Text variant="bodyMedium">
            {format(new Date(descent.startedAt), 'PP p')}
          </Text>
        </Right>
      </Row>

      <Row>
        <Left>
          <Text variant="titleSmall">{t('screens:descent.info.level')}</Text>
        </Left>
        <Right>
          <Text variant="bodyMedium">{descentLevelToString(descent.level)}</Text>
        </Right>
      </Row>

      <View style={styles.commentBlock}>
        <Text variant="titleSmall" style={styles.commentHeader}>
          {t('screens:descent.info.commentHeader')}
        </Text>
        <Text variant="bodyMedium">{descent.comment}</Text>
      </View>
    </ScrollView>
  );
}

export default DescentInfo;
